<template>
  <v-container>
    <v-toolbar class="mb-3 pl-4" color="blue-grey-darken-2" rounded="lg">
      <v-icon start>mdi-account-injury</v-icon> My Patients
    </v-toolbar>

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
        <v-alert
          v-if="!doctorPatients || doctorPatients.length === 0"
          density="compact"
          type="info"
          title="My Patients"
          text="No Patients here."
          rounded="lg"
        ></v-alert>
        <v-col
          cols="12"
          sm="6"
          md="4"
          lg="3"
          align-self="auto"
          v-for="dpatient in doctorPatients"
          :key="dpatient.ID"
        >
          <v-card>
            <v-toolbar
              color="indigo-darken-1"
              :title="dpatient.User.Name"
            ></v-toolbar>
            <v-card-text>
              <!-- Patient details -->
              <v-list-item-title>
                <strong>Email:</strong> {{ dpatient.User.Email }}
              </v-list-item-title>
              <v-list-item-title>
                <strong>Phone:</strong> {{ dpatient.User.Phone }}
              </v-list-item-title>
              <v-list-item-title>
                <strong>Mobile:</strong> {{ dpatient.User.Mobile }}
              </v-list-item-title>
              <v-list-item-title>
                <strong>Address:</strong> {{ dpatient.User.Address }}
              </v-list-item-title>
              <v-list-item-title>
                <strong>Date Of Birth:</strong> {{ dpatient.User.DateOfBirth }}
              </v-list-item-title>
              <v-list-item-title>
                <strong>Gender:</strong> {{ dpatient.User.Gender }}
              </v-list-item-title>
              <v-list-item-title>
                <strong>Weight:</strong> {{ dpatient.Weight }}
              </v-list-item-title>
              <v-list-item-title>
                <strong>Height:</strong> {{ dpatient.Height }}
              </v-list-item-title>
              <v-list-item-title>
                <strong>Additional Info:</strong> {{ dpatient.AdditionalInfo }}
              </v-list-item-title>
            </v-card-text>
            <v-card-actions>
              <!-- Button to view medical records -->
              <v-btn
                color="blue"
                variant="outlined"
                :loading="Medloading"
                @click="openMedicalRecordsDialog(dpatient)"
              >
                View Medical Records
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </template>
    </v-row>

    <!-- Medical Records Dialog -->
    <v-dialog v-model="medicalRecordsDialog" max-width="800px">
      <v-card>
        <v-toolbar color="info" title="Medical Records"></v-toolbar>
        <v-card-title
          v-if="
            !selectedPatientMedicalRecords ||
            selectedPatientMedicalRecords.length === 0
          "
        >
          No Medical Records Available for the Patient.
        </v-card-title>
        <v-card-text v-else>
          <v-data-iterator
            :items="selectedPatientMedicalRecords"
            item-value="ID"
          >
            <template v-slot:default="{ items, isExpanded, toggleExpand }">
              <v-row>
                <v-col
                  v-for="item in items"
                  :key="item.raw.ID"
                  cols="12"
                  sm="12"
                  md="6"
                >
                  <v-card>
                    <v-toolbar
                      color="cyan-darken-1"
                      class="d-flex align-center"
                    >
                      <div class="ml-6">
                        <v-icon start>mdi-file-document</v-icon>
                        Medical Record No# {{ item.raw.ID }}
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
                        {{ item.raw.Appointment.AppointmentDate }}
                        {{ item.raw.Appointment.AppointmentTime }}
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
                          item.raw.Appointment.DoctorSchedule.Doctor.User.Name
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
                          item.raw.Appointment.DoctorSchedule.Doctor
                            .Specialization.Name
                        }}
                      </v-chip>
                    </v-card-text>

                    <div class="px-4">
                      <v-switch
                        :model-value="isExpanded(item)"
                        :label="`${
                          isExpanded(item) ? 'Hide' : 'Show'
                        } record details`"
                        density="compact"
                        color="blue"
                        inset
                        @click="() => toggleExpand(item)"
                      ></v-switch>
                    </div>

                    <v-divider></v-divider>

                    <v-expand-transition>
                      <div v-if="isExpanded(item)">
                        <v-list density="compact" :lines="false">
                          <!-- You can add more detailed information here -->
                          <v-list-item title="Condition:">
                            <v-textarea
                              v-model="item.raw.MedicalCondition"
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
                              v-model="item.raw.Diagnosis"
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
                              v-model="item.raw.Prescription"
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
                              v-model="item.raw.AdditionalNotes"
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
                      </div>
                    </v-expand-transition>
                  </v-card>
                </v-col>
              </v-row>
            </template>
          </v-data-iterator>
        </v-card-text>
        <v-card-actions class="ml-3 mb-3">
          <!-- Close button for the dialog -->
          <v-btn
            color="error"
            variant="outlined"
            @click="closeMedicalRecordsDialog"
          >
            Close
          </v-btn>
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
const Medloading = ref(false);
const user = useUser();
const userID = ref("");
const userData = ref({});
const doctorPatients = ref([]);
const selectedPatientMedicalRecords = ref([]);
const medicalRecordsDialog = ref(false);
const selectedPatient = ref(null);

const fetchUserData = async () => {
  try {
    const response = await HTTP.get(`/user/${user.ID}`);
    userData.value = response.data.data;
    const userResponse = await HTTP.get(
      `users/${userData.value.ID}/additional-info`
    );
    userID.value = userResponse.data.ID;
    fetchDoctorPatients(userID.value);
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
};

const fetchDoctorPatients = async (doctorID) => {
  try {
    const response = await HTTP.get(`/doctorpatients/${doctorID}`);
    doctorPatients.value = response.data.data;
    loading.value = false;
  } catch (error) {
    console.error("Error fetching doctor's patients:", error);
  }
};

// Method to open medical records dialog
const openMedicalRecordsDialog = async (patient) => {
  Medloading.value = true;
  selectedPatient.value = patient.ID;
  try {
    const response = await HTTP.get(`/medicalrecords/${patient.ID}`);
    console.log("Medical Records:", response.data);
    selectedPatientMedicalRecords.value = response.data.data;
    Medloading.value = false;
    medicalRecordsDialog.value = true;
  } catch (error) {
    console.error("Error fetching medical records:", error);
  }
};

// Method to close medical records dialog
const closeMedicalRecordsDialog = () => {
  medicalRecordsDialog.value = false;
};

function initialize() {
  fetchUserData();
}

initialize();
</script>
