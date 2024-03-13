<template>
  <!-- Loader -->
  <div class="loading-container" v-if="loading">
    <!-- Your loading indicator -->
    <v-progress-circular
      color="blue-lighten-3"
      indeterminate
      :size="128"
      :width="9"
    ></v-progress-circular>
  </div>

  <div v-else>
    <!-- Display all clinics -->
    <v-row justify="center" align="center" class="mt-2">
      <v-col v-for="clinic in clinics" :key="clinic.ID" cols="12" md="6" lg="3">
        <v-card>
          <v-card-title justify="center" align="center">
            <v-img src="@/assets/images/clinic_icon.png" height="200" />
            {{ clinic.Name }}
            <v-divider></v-divider>
            <v-chip
              color="light-blue-darken-4"
              size="large"
              variant="outlined"
              prepend-icon="mdi-hospital-building"
              rounded="xl"
              class="mt-2"
              label
            >
              {{ clinic.Category.Name }}
            </v-chip>
          </v-card-title>
          <v-card-text>
            <!-- Display assigned patients for the clinic -->
            <v-list-item v-if="clinic.patients?.length === 0">
              No Patient Assigned to the Clinic
            </v-list-item>
            <v-list v-else>
              <v-list-item
                v-for="patient in clinic.patients"
                :key="patient.ID"
                variant="outlined"
                rounded="xl"
                max-width="100%"
                class="mb-3"
              >
                <div
                  class="d-flex align-center justify-between"
                  style="width: 100%"
                >
                  <v-list-item-title class="flex-grow-1 ml-2"
                    ><strong>Patient Name:</strong>
                    {{ patient.User.Name }}
                  </v-list-item-title>
                  <v-btn
                    icon="mdi-delete"
                    color="error"
                    small
                    variant="text"
                    class="align-self-center"
                    @click="unassignPatient(patient.ID, clinic.ID)"
                    :loading="unassigning"
                  />
                </div>
              </v-list-item>
            </v-list>
          </v-card-text>
          <!-- Button to assign new patient -->
          <v-card-actions>
            <v-btn color="primary" @click="openAssignDialog(clinic.ID)"
              >Assign New Patient</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Assign Patient Dialog -->
    <v-dialog v-model="assignDialog" max-width="500px">
      <v-card>
        <v-card-title>Assign Patient</v-card-title>
        <v-card-text>
          <v-select
            v-model="selectedPatient"
            :items="unassignedPatients"
            label="Select Patient"
            item-title="User.Name"
            item-value="ID"
            :loading="assigning"
          ></v-select>
        </v-card-text>
        <v-card-actions>
          <v-btn
            color="primary"
            @click="assignPatient(selectedPatient, selectedClinic)"
            >Assign</v-btn
          >
          <v-btn color="error" @click="assignDialog = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { HTTP } from "@/config"; // Assuming HTTP is exported from '@/config'
import { useAuth } from "@/store/useAuthentication";

const auth = useAuth();
const clinics = ref([]);
const unassignedPatients = ref([]);
const assignDialog = ref(false);
let selectedPatient = ref(null);
let selectedClinic = ref(null);
const loading = ref(true); // Initialize loading state
const assigning = ref(false);
const unassigning = ref(false);

onMounted(async () => {
  await fetchClinics();
});

const fetchClinics = async () => {
  try {
    const response = await HTTP.get("/clinic");
    clinics.value = response.data.data;
    // After fetching clinics, fetch patients for each clinic
    await Promise.all(
      clinics.value.map((clinic) => fetchClinicPatients(clinic.ID))
    );
    loading.value = false; // Set loading to false after data is fetched
    console.log("Clinics :", clinics.value);
  } catch (error) {
    console.error("Error fetching clinics:", error);
    loading.value = false; // Set loading to false in case of error
  }
};

const fetchClinicPatients = async (clinicId) => {
  try {
    const response = await HTTP.get(`/clinicpatients/${clinicId}`);
    const clinic = clinics.value.find((clinic) => clinic.ID === clinicId);
    if (clinic) {
      clinic.patients = response.data.Data;
    }
  } catch (error) {
    console.error(`Error fetching patients for clinic ${clinicId}:`, error);
  }
};

const fetchUnassignedPatients = async (clinicId) => {
  try {
    const response = await HTTP.get(`/unassignedpatients/${clinicId}`);
    unassignedPatients.value = response.data.Data;
    console.log("unassignedPatients :", unassignedPatients);
  } catch (error) {
    console.error("Error fetching unassigned patients:", error);
  }
};

const assignPatient = async (patientId, clinicId) => {
  try {
    assigning.value = true;
    const response = await HTTP.post(
      `/clinicpatients/assign/${patientId}/${clinicId}`
    );

    assigning.value = false;
    auth.$patch({
      showAlert: true,
      message: response.data.Message,
      isError: false,
    });
    // Refresh the clinics and unassigned patients
    await fetchClinics();
    selectedPatient.value = "";
    selectedClinic.value = "";
    // Close the dialog
    assignDialog.value = false;
  } catch (error) {
    console.error("Error assigning patient:", error);
  }
};

const unassignPatient = async (patientId, clinicId) => {
  try {
    unassigning.value = true;
    const response = await HTTP.delete(
      `/clinicpatients/unassign/${patientId}/${clinicId}`
    );

    unassigning.value = false;
    auth.$patch({
      showAlert: true,
      message: response.data.Message,
      isError: false,
    });
    // After unassigning, refresh the clinic patients list
    await fetchClinics();
    selectedPatient.value = "";
    selectedClinic.value = "";
  } catch (error) {
    console.error("Error unassigning patient:", error);
  }
};

const openAssignDialog = async (clinicId) => {
  selectedClinic.value = clinicId;
  // Fetch unassigned patients for the clinic
  await fetchUnassignedPatients(clinicId);
  // Open the dialog
  assignDialog.value = true;
};
</script>

<style scoped>
/* Add any custom styles here */
.loading-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 65vh; /* Adjust height as needed */
}

/* Center the loading spinner */
.v-progress-circular {
  margin: 0 auto;
}
</style>
