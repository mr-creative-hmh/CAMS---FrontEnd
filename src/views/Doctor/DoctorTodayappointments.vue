<template>
  <v-container>
    <v-row>
      <v-col>
        <v-toolbar class="mb-3 pl-4" color="blue-grey-darken-2" rounded="lg">
          <v-icon start>mdi-calendar-clock</v-icon> Today's Appointments
        </v-toolbar>
      </v-col>
      <v-col cols="12" sm="6" md="4" lg="3">
        <v-toolbar class="mb-3" color="blue-darken-4" rounded="lg">
          <v-select
            v-model="selectedClinic"
            :items="doctorClinics"
            label="Clinic"
            item-title="Name"
            variant="outlined"
            density="compact"
            class="ma-3 pt-6"
            return-object
          ></v-select>
        </v-toolbar>
      </v-col>
    </v-row>

    <!-- Appointment Cards -->
    <v-row>
      <template v-if="loading">
        <v-col cols="12" sm="6" md="4" lg="3">
          <v-skeleton-loader
            elevation="7"
            color="secondary"
            type="card"
          ></v-skeleton-loader>
        </v-col>
        <v-col cols="12" sm="6" md="4" lg="3">
          <v-skeleton-loader
            elevation="7"
            color="secondary"
            type="card"
          ></v-skeleton-loader>
        </v-col>
        <v-col cols="12" sm="6" md="4" lg="3">
          <v-skeleton-loader
            elevation="7"
            color="secondary"
            type="card"
          ></v-skeleton-loader>
        </v-col>
        <v-col cols="12" sm="6" md="4" lg="3">
          <v-skeleton-loader
            elevation="7"
            color="secondary"
            type="card"
          ></v-skeleton-loader>
        </v-col>
      </template>

      <template v-if="!loading">
        <template v-if="!todayAppointments || todayAppointments.length === 0">
          <v-alert
            density="compact"
            type="info"
            title="Today Appointemnts"
            text="No Appointments for today."
            rounded="lg"
            class="ml-3 mr-3"
          ></v-alert>
        </template>
        <v-col
          v-else
          cols="12"
          sm="6"
          md="4"
          lg="3"
          align-self="auto"
          v-for="appointment in todayAppointments"
          :key="appointment.ID"
        >
          <v-card>
            <v-toolbar color="indigo-darken-1">
              <div class="ml-6">
                <v-icon start>mdi-clipboard-text-clock</v-icon>
                {{ appointment.AppointmentDate }}
                {{ appointment.AppointmentTime }}
              </div>
            </v-toolbar>
            <!-- Appointment Details -->
            <v-card-text>
              <strong>Patient:</strong>
              {{ appointment.Patient.User.Name }}<br />
              <strong>Type:</strong> {{ appointment.AppointmentType }} -
              <strong>Status:</strong> {{ appointment.AppointmentStatus }}<br />
              <strong>Reason For Visit:</strong> {{ appointment.ReasonForVisit
              }}<br />
            </v-card-text>
            <!-- Action Buttons -->
            <v-card-actions>
              <!-- Add Medical Record Button -->
              <v-btn
                color="blue"
                variant="outlined"
                prepend-icon="mdi-plus-circle"
                @click="openMedicalRecordDialog(appointment)"
              >
                Add Medical Record
              </v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-col>
      </template>
    </v-row>

    <!-- Medical Record Dialog -->
    <v-dialog v-model="medicalRecordDialog" max-width="600px">
      <v-card>
        <v-toolbar color="info" title="Add Medical Record"></v-toolbar>
        <v-card-text>
          <!-- Medical Record Form Inputs -->
          <v-text-field
            v-model="createItem.MedicalCondition"
            label="Medical Condition"
          >
          </v-text-field>
          <v-text-field v-model="createItem.Diagnosis" label="Diagnosis">
          </v-text-field>
          <v-textarea
            clearable
            clear-icon="mdi-close-circle"
            v-model="createItem.Prescription"
            label="Prescription"
          >
          </v-textarea>
          <v-text-field
            type="date"
            v-model="createItem.FollowUpDate"
            label="FollowUp Date"
          ></v-text-field>
          <v-text-field
            v-model="createItem.AdditionalNotes"
            label="Additional Notes"
          >
          </v-text-field>
        </v-card-text>
        <v-card-actions class="ml-3 mb-3">
          <!-- Submit Button -->
          <v-btn
            color="primary"
            variant="outlined"
            prepend-icon="mdi-check-circle"
            @click="createMedicalRecord"
          >
            Create
          </v-btn>
          <!-- Cancel Button -->
          <v-btn
            color="error"
            variant="outlined"
            prepend-icon="mdi-close-circle"
            @click="closeMedicalRecordDialog"
          >
            Cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { HTTP } from "@/config";
import { useAuth } from "@/store/useAuthentication";
import { useUser } from "@/store/useUser";
import { ref, watch } from "vue";

const auth = useAuth();
const loading = ref(true);
const user = useUser();
const userID = ref("");
// User data properties
const userData = ref({});
const selectedClinic = ref(null);
const doctorClinics = ref([]);
const todayAppointments = ref([]);
const selectedAppointment = ref(null);
const medicalRecordDialog = ref(false);

const createItem = ref({
  MedicalCondition: "",
  Diagnosis: "",
  Prescription: "",
  FollowUpDate: "",
  AdditionalNotes: "",
  Active: true,
});
// Method to open the medical record dialog
const openMedicalRecordDialog = (appointment) => {
  selectedAppointment.value = appointment;
  medicalRecordDialog.value = true;
};

// Method to close the medical record dialog
const closeMedicalRecordDialog = () => {
  medicalRecordDialog.value = false;
};

// Method to create a medical record
const createMedicalRecord = async () => {
  try {
    // Prepare medical record data
    const medicalRecordData = {
      appointment_id: selectedAppointment.value.ID,
      medical_condition: createItem.value.MedicalCondition,
      diagnosis: createItem.value.Diagnosis,
      prescription: createItem.value.Prescription,
      follow_up_date: createItem.value.FollowUpDate,
      additional_notes: createItem.value.AdditionalNotes,
      active: createItem.value.Active,
    };

    // Make HTTP request to create medical record
    const response = await HTTP.post("/medicalrecord", medicalRecordData);

    // Show success message
    auth.$patch({
      showAlert: true,
      message: response.data.Message,
      isError: false,
    });
    completeAppointment(selectedAppointment.value);
    // Close the dialog
    closeMedicalRecordDialog();
  } catch (error) {
    // Handle errors
    console.error("Error creating medical record:", error);
    auth.$patch({
      showAlert: true,
      message:
        "An error occurred while creating the medical record. Please try again later.",
      isError: true,
    });
  }
};

// Method to fetch user data
const fetchUserData = async () => {
  try {
    console.log("Fetching user data...");
    const response = await HTTP.get(`/user/${user.ID}`);
    console.log("User data responce:", response.data.data);
    userData.value = response.data.data;
    console.log("Fetching user data...");
    const userResponse = await HTTP.get(
      `users/${userData.value.ID}/additional-info`
    );
    console.log("User data responce:", userResponse.data.data);
    userID.value = userResponse.data.ID;
    console.log("User data:", userID.value);
    // Once fetchUserData is completed, set loading to false
    fetchDoctorClinics(userID.value);
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
};
// Watch for changes in the selected clinic and fetch appointments accordingly
watch(selectedClinic, async (newValue) => {
  if (newValue !== null) {
    await fetchTodayAppointments(newValue.ID);
  }
});

// Fetch doctor's clinics
const fetchDoctorClinics = async (doctorID) => {
  try {
    const response = await HTTP.get(`/doctorclinics/${doctorID}`);
    doctorClinics.value = response.data.data;
    if (doctorClinics.value.length > 0) {
      selectedClinic.value = doctorClinics.value[0]; // Set the first clinic as selected by default
    }
    console.log("Doctor's Clinics:", doctorClinics.value);
    loading.value = false;
  } catch (error) {
    console.error("Error fetching doctor's clinics:", error);
  }
};

// Fetch today's appointments for a specific clinic
const fetchTodayAppointments = async (clinicId) => {
  try {
    const response = await HTTP.get(`/clinic/appointments/${clinicId}`);
    const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format
    todayAppointments.value = response.data.data.filter((appointment) => {
      return (
        appointment.AppointmentDate === today &&
        appointment.AppointmentStatus !== "Completed" &&
        appointment.AppointmentStatus !== "Cancelled"
      );
    });
    loading.value = false;
  } catch (error) {
    console.error("Error fetching today's appointments:", error);
  }
};
// const fetchClinic = async () => {
//   try {
//     const response = await HTTP.get(`users/${user.ID}/additional-info`);
//     clinic.value = response.data.Clinic;
//     fetchTodayAppointments();
//   } catch (error) {
//     console.error(`Error fetching clinic`, error);
//   }
// };

function initialize() {
  fetchUserData();
}

// async function fetchTodayAppointments() {
//   try {
//     const response = await HTTP.get(`/clinic/appointments/${1}`);
//     const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format
//     todayAppointments.value = response.data.data.filter((appointment) => {
//       return (
//         appointment.AppointmentDate === today &&
//         appointment.AppointmentStatus !== "Completed" &&
//         appointment.AppointmentStatus !== "Cancelled"
//       );
//     });
//     loading.value = false;
//   } catch (error) {
//     console.error("Error fetching today's appointments:", error);
//   }
// }

// Method to mark appointment as completed
const completeAppointment = async (appointment) => {
  try {
    await HTTP.put(`/appointment/${appointment.ID}`, {
      appointment_status: "Completed",
    });
    auth.$patch({
      showAlert: true,
      message: "Appointment completed successfully",
      isError: false,
    });
    initialize();
  } catch (error) {
    console.error("Error completing appointment", error);
  }
};

initialize();
</script>
