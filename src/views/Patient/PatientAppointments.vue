<template>
  <v-container>
    <v-row>
      <v-col>
        <v-toolbar class="pl-4" color="blue-grey-darken-2" rounded="lg">
          <v-icon start>mdi-calendar-clock</v-icon> My Appointments
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
        <template
          v-if="!patientAppointments || patientAppointments.length === 0"
        >
          <v-alert
            density="compact"
            type="info"
            title="My Appointemnts"
            text="No Appointments Booked Yet."
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
          v-for="appointment in patientAppointments"
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
              <v-chip
                color="purple"
                size="large"
                variant="outlined"
                prepend-icon="mdi-hospital-building"
                rounded="xl"
                class="mb-1"
                label
              >
                {{ appointment.DoctorSchedule.Clinic.Name }}
              </v-chip>
              <br />
              <v-chip
                color="blue"
                variant="outlined"
                prepend-icon="mdi-doctor"
                rounded="xl"
                class="mt-1 mb-2"
                label
              >
                {{ appointment.DoctorSchedule.Doctor.User.Name }}
              </v-chip>
              &nbsp;
              <v-chip
                color="green"
                variant="outlined"
                prepend-icon="mdi-hospital-box"
                rounded="xl"
                class="mt-1 mb-2"
                label
              >
                {{ appointment.DoctorSchedule.Doctor.Specialization.Name }}
              </v-chip>
              <br />

              <strong>Type:</strong> {{ appointment.AppointmentType }} <br />
              <strong>Status:</strong> {{ appointment.AppointmentStatus }}<br />
              <strong>Reason For Visit:</strong>
              {{ appointment.ReasonForVisit }}
              <br />
            </v-card-text>
            <!-- Action Buttons -->
            <v-card-actions>
              <!-- Add Medical Record Button -->
              <v-btn
                color="blue"
                variant="outlined"
                prepend-icon="mdi-file-document"
                class="pl-3 ml-2"
                :loading="loadingM"
                @click="openMedicalRecordDialog(appointment)"
              >
                view Medical Record
              </v-btn>
              <template
                v-if="
                  !(
                    appointment.AppointmentStatus === 'Completed' ||
                    appointment.AppointmentStatus === 'Cancelled'
                  )
                "
              >
                <v-btn
                  color="orange"
                  variant="outlined"
                  prepend-icon="mdi-delete"
                  class="pl-3 ml-2"
                  @click="openCancelDialog()"
                >
                  Cancel
                </v-btn>
              </template>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-col>
      </template>
    </v-row>

    <v-dialog v-model="cancelDialog" max-width="800px">
      <v-card>
        <v-toolbar color="blue-grey-darken-1" class="d-flex align-center">
          <h3 class="ml-6">
            <v-icon start>mdi-alert-circle</v-icon>
            Cancel Alert
          </h3>
        </v-toolbar>
        <v-card-text>
          Please contact Clinic Manager for cancel or re-schdule
          appointment.</v-card-text
        >
        <v-card-actions class="ml-3 mb-3">
          <v-btn color="error" variant="outlined" @click="closeCancelDialog"
            >Close</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Medical Records Dialog -->
    <v-dialog v-model="medicalRecordDialog" max-width="800px">
      <v-card v-if="!selectedMedicalRecord || selectedMedicalRecord === 0">
        <v-card-text
          >No Medical Record Available for the Selected
          Appointment.</v-card-text
        ><v-card-actions class="ml-3 mb-3">
          <v-btn
            color="error"
            variant="outlined"
            @click="closeMedicalRecordDialog"
            >Close</v-btn
          >
        </v-card-actions>
      </v-card>
      <v-card v-else>
        <v-toolbar color="cyan-darken-1" class="d-flex align-center">
          <div class="ml-6">
            <v-icon start>mdi-file-document</v-icon>
            Medical Record No# {{ selectedMedicalRecord.ID }}
          </div>
        </v-toolbar>
        <v-card-text>
          <v-chip
            color="purple"
            size="large"
            variant="outlined"
            prepend-icon="mdi-clipboard-text-clock"
            rounded="xl"
            class="mb-1"
            label
          >
            {{ selectedMedicalRecord.Appointment.AppointmentDate }}
            {{ selectedMedicalRecord.Appointment.AppointmentTime }}
          </v-chip>
          <br />
          <v-chip
            color="blue"
            size="large"
            variant="outlined"
            prepend-icon="mdi-doctor"
            rounded="xl"
            class="mt-1 mb-1"
            label
          >
            {{
              selectedMedicalRecord.Appointment.DoctorSchedule.Doctor.User.Name
            }}
          </v-chip>
          <br />
          <v-chip
            color="green"
            size="large"
            variant="outlined"
            prepend-icon="mdi-hospital-box"
            rounded="xl"
            class="mt-1"
            label
          >
            {{
              selectedMedicalRecord.Appointment.DoctorSchedule.Doctor
                .Specialization.Name
            }}
          </v-chip>
        </v-card-text>
        <v-list density="compact" :lines="false">
          <!-- You can add more detailed information here -->
          <v-list-item title="Condition:">
            <v-textarea
              v-model="selectedMedicalRecord.MedicalCondition"
              disabled
              bg-color="blue-grey-darken-4"
              rounded="lg"
              rows="1"
              variant="outlined"
              auto-grow
            >
            </v-textarea>
          </v-list-item>
          <v-list-item title="Diagnosis:">
            <v-textarea
              v-model="selectedMedicalRecord.Diagnosis"
              disabled
              bg-color="blue-grey-darken-4"
              rounded="lg"
              rows="1"
              variant="outlined"
              auto-grow
            >
            </v-textarea>
          </v-list-item>

          <v-list-item title="Prescription:">
            <v-textarea
              v-model="selectedMedicalRecord.Prescription"
              disabled
              bg-color="blue-grey-darken-4"
              rounded="lg"
              rows="1"
              variant="outlined"
              auto-grow
            >
            </v-textarea>
          </v-list-item>
          <v-list-item title="Additional Notes:">
            <v-textarea
              v-model="selectedMedicalRecord.AdditionalNotes"
              disabled
              bg-color="blue-grey-darken-4"
              rounded="lg"
              rows="1"
              variant="outlined"
              auto-grow
            >
            </v-textarea>
          </v-list-item>
        </v-list>
        <v-card-actions class="ml-3 mb-3">
          <!-- Close button for the dialog -->
          <v-btn
            color="error"
            variant="outlined"
            @click="closeMedicalRecordDialog"
            >Close</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { HTTP } from "@/config";
// import { useAuth } from "@/store/useAuthentication";
import { useUser } from "@/store/useUser";
import { ref } from "vue";

// const auth = useAuth();
const loading = ref(true);
const loadingM = ref(false);
const user = useUser();
const userID = ref("");
// User data properties
const userData = ref({});
const patientAppointments = ref([]);
const selectedAppointment = ref(null);
const selectedMedicalRecord = ref(null);
const medicalRecordDialog = ref(false);
const cancelDialog = ref(false);

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
    fetchpatientAppointments(userID.value);
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
};

// Fetch today's appointments for a specific clinic
const fetchpatientAppointments = async (patientId) => {
  try {
    const response = await HTTP.get(`/patient/appointments/${patientId}`);
    patientAppointments.value = response.data.data;
    loading.value = false;
  } catch (error) {
    console.error("Error fetching today's appointments:", error);
  }
};

// Open medical record dialog for the selected appointment
const openMedicalRecordDialog = async (appointment) => {
  loadingM.value = true;
  selectedAppointment.value = appointment;

  // Fetch the medical record associated with the selected appointment
  await fetchMedicalRecord(appointment.ID);

  loadingM.value = false;
  // After fetching the medical record, open the dialog
  medicalRecordDialog.value = true;
};

const openCancelDialog = async () => {
  cancelDialog.value = true;
};

const closeCancelDialog = () => {
  cancelDialog.value = false;
};

// Fetch medical record for the selected appointment
const fetchMedicalRecord = async (appointmentId) => {
  try {
    const response = await HTTP.get(
      `/medicalrecord/appointment/${appointmentId}`
    );

    // Check if data is available in the response
    if (response.data && response.data.data) {
      selectedMedicalRecord.value = response.data.data;
    } else {
      // Handle case when no medical record is found
      console.error("No medical record found for the selected appointment.");
      // You can set selectedMedicalRecord.value to null or display an appropriate message
    }
  } catch (error) {
    // Handle network errors or other issues
    console.error("Error fetching medical record:", error);
    // You can display an error message to the user or handle the error as needed
  }
};

// Close medical record dialog
const closeMedicalRecordDialog = () => {
  medicalRecordDialog.value = false;
  selectedAppointment.value = "";
  selectedMedicalRecord.value = "";
};

function initialize() {
  fetchUserData();
}

initialize();
</script>
