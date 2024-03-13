<template>
  <v-container>
    <v-row>
      <v-col>
        <v-toolbar class="pl-4" color="light-blue-darken-4" rounded="lg">
          <v-icon start>mdi-clipboard-pulse</v-icon> My Medical Records
        </v-toolbar>
      </v-col>
    </v-row>

    <!-- Appointment Cards -->

    <template v-if="loading">
      <v-row>
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
      </v-row>
    </template>

    <template v-if="!loading">
      <template
        v-if="!PatientMedicalRecords || PatientMedicalRecords.length === 0"
      >
        <v-row>
          <v-alert
            density="compact"
            type="info"
            title="My Medical Records"
            text="No Medical Records Available for the Patient."
            rounded="lg"
            class="ml-3 mr-3"
          ></v-alert>
        </v-row>
      </template>
      <v-data-iterator :items="PatientMedicalRecords" item-value="ID">
        <template v-slot:default="{ items, isExpanded, toggleExpand }">
          <v-row>
            <v-col
              v-for="item in items"
              :key="item.raw.ID"
              cols="12"
              sm="6"
              md="4"
              lg="3"
            >
              <v-card>
                <v-toolbar color="cyan-darken-1" class="d-flex align-center">
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
                    {{ item.raw.Appointment.DoctorSchedule.Doctor.User.Name }}
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
                      item.raw.Appointment.DoctorSchedule.Doctor.Specialization
                        .Name
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
    </template>
  </v-container>
</template>

<script setup>
import { HTTP } from "@/config";
// import { useAuth } from "@/store/useAuthentication";
import { useUser } from "@/store/useUser";
import { ref } from "vue";

// const auth = useAuth();
const loading = ref(true);
const user = useUser();
const userID = ref("");
const userData = ref({});
const PatientMedicalRecords = ref([]);

const fetchUserData = async () => {
  try {
    const response = await HTTP.get(`/user/${user.ID}`);
    userData.value = response.data.data;
    const userResponse = await HTTP.get(
      `users/${userData.value.ID}/additional-info`
    );
    userID.value = userResponse.data.ID;
    fetchMedicalRecords(userID.value);
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
};

const fetchMedicalRecords = async (patientID) => {
  try {
    const response = await HTTP.get(`/medicalrecords/${patientID}`);
    console.log("Medical Records:", response.data);
    PatientMedicalRecords.value = response.data.data;
    loading.value = false;
  } catch (error) {
    console.error("Error fetching medical records:", error);
  }
};
function initialize() {
  fetchUserData();
}

initialize();
</script>
