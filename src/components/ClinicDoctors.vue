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
            "{{ clinic.Category.Name }}"
          </v-card-title>
          <v-card-text>
            <!-- Display assigned doctors for the clinic -->
            <v-list-item v-if="clinic.patients?.length === 0">
              No Doctors Assigned to the Clinic
            </v-list-item>
            <v-list v-else>
              <v-list-item
                v-for="doctor in clinic.doctors"
                :key="doctor.ID"
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
                    ><strong>Doctor Name:</strong>
                    {{ doctor.User.Name }}
                  </v-list-item-title>
                  <v-btn
                    icon="mdi-delete"
                    color="error"
                    small
                    variant="text"
                    class="align-self-center"
                    @click="unassignDoctor(doctor.ID, clinic.ID)"
                    :loading="unassigning"
                  />
                </div>
              </v-list-item>
            </v-list>
          </v-card-text>
          <!-- Button to assign new doctor -->
          <v-card-actions>
            <v-btn color="primary" @click="openAssignDialog(clinic.ID)"
              >Assign New Doctor</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Assign Doctor Dialog -->
    <v-dialog v-model="assignDialog" max-width="500px">
      <v-card>
        <v-card-title>Assign Doctor</v-card-title>
        <v-card-text>
          <v-select
            v-model="selectedDoctor"
            :items="unassignedDoctors"
            label="Select Doctor"
            item-title="User.Name"
            item-value="ID"
            :loading="assigning"
          ></v-select>
        </v-card-text>
        <v-card-actions>
          <v-btn
            color="primary"
            @click="assignDoctor(selectedDoctor, selectedClinic)"
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
const unassignedDoctors = ref([]);
const assignDialog = ref(false);
let selectedDoctor = ref(null);
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
    // After fetching clinics, fetch doctors for each clinic
    await Promise.all(
      clinics.value.map((clinic) => fetchClinicDoctors(clinic.ID))
    );
    loading.value = false; // Set loading to false after data is fetched
    console.log("Clinics :", clinics.value);
  } catch (error) {
    console.error("Error fetching clinics:", error);
    loading.value = false; // Set loading to false in case of error
  }
};

const fetchClinicDoctors = async (clinicId) => {
  try {
    const response = await HTTP.get(`/clinicdoctors/${clinicId}`);
    const clinic = clinics.value.find((clinic) => clinic.ID === clinicId);
    if (clinic) {
      clinic.doctors = response.data.Data;
    }
  } catch (error) {
    console.error(`Error fetching doctors for clinic ${clinicId}:`, error);
  }
};

const fetchUnassignedDoctors = async (clinicId) => {
  try {
    const response = await HTTP.get(`/unassigneddoctors/${clinicId}`);
    unassignedDoctors.value = response.data.Data;
    console.log("unassignedDoctors :", unassignedDoctors);
  } catch (error) {
    console.error("Error fetching unassigned doctors:", error);
  }
};

const assignDoctor = async (doctorId, clinicId) => {
  try {
    assigning.value = true;
    const response = await HTTP.post(
      `/clinicdoctors/assign/${doctorId}/${clinicId}`
    );
    // Refresh the clinics and unassigned doctors
    await fetchClinics();
    await fetchUnassignedDoctors(clinicId);
    assigning.value = false;
    // Close the dialog
    assignDialog.value = false;
    auth.$patch({
      showAlert: true,
      message: response.data.Message,
      isError: false,
    });
    selectedDoctor.value = "";
    selectedClinic.value = "";
  } catch (error) {
    console.error("Error assigning doctor:", error);
  }
};

const unassignDoctor = async (doctorId, clinicId) => {
  try {
    unassigning.value = true;
    const response = await HTTP.delete(
      `/clinicdoctors/unassign/${doctorId}/${clinicId}`
    );
    // After unassigning, refresh the clinic doctors list
    await fetchClinicDoctors(clinicId);
    unassigning.value = false;
    auth.$patch({
      showAlert: true,
      message: response.data.Message,
      isError: false,
    });
    selectedDoctor.value = "";
    selectedClinic.value = "";
  } catch (error) {
    console.error("Error unassigning doctor:", error);
  }
};

const openAssignDialog = async (clinicId) => {
  selectedClinic.value = clinicId;
  // Fetch unassigned doctors for the clinic
  await fetchUnassignedDoctors(clinicId);
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
