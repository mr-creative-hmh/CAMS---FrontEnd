<template>
  <v-container>
    <v-row>
      <v-col>
        <v-toolbar class="mb-3 pl-4" color="blue-darken-2" rounded="lg">
          <v-icon start>mdi-view-dashboard</v-icon> Doctor Dashboard
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

    <v-row>
      <template v-if="loading">
        <v-col cols="12" sm="6" md="6">
          <v-skeleton-loader
            elevation="7"
            color="secondary"
            type="table-heading, list-item-two-line, image"
          ></v-skeleton-loader>
        </v-col>
        <v-col cols="12" sm="6" md="6">
          <v-skeleton-loader
            elevation="7"
            color="secondary"
            type="table-heading, list-item-two-line, image"
          ></v-skeleton-loader>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-skeleton-loader
            elevation="7"
            color="secondary"
            type="card"
          ></v-skeleton-loader>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-skeleton-loader
            elevation="7"
            color="secondary"
            type="card"
          ></v-skeleton-loader>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-skeleton-loader
            elevation="7"
            color="secondary"
            type="card"
          ></v-skeleton-loader>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-skeleton-loader
            elevation="7"
            color="secondary"
            type="card"
          ></v-skeleton-loader>
        </v-col>
      </template>

      <template v-if="!loading">
        <v-container>
          <v-row>
            <v-col cols="12" md="6">
              <v-card color="red-lighten-5" class="mx-auto">
                <v-row>
                  <v-col cols="12" md="6" align-self="center">
                    <v-sheet
                      color="transparent"
                      elevation="0"
                      rounded="lg"
                      align="center"
                      justify="center"
                    >
                      <v-avatar
                        color="grey"
                        size="200"
                        rounded="10"
                        class="mb-4 mt-4"
                      >
                        <v-img :src="getRolePhoto(userData.Role.RoleName)" />
                      </v-avatar>
                      <v-card-title>
                        {{ userData.Name }}
                      </v-card-title>
                      <template v-if="userData.additionalInfo">
                        <v-chip
                          color="red"
                          variant="outlined"
                          prepend-icon="mdi-hospital-box-outline"
                          rounded="xl"
                          class="ma-1 mb-4"
                          label
                        >
                          {{ userData.additionalInfo[0].Specialization }}
                        </v-chip>
                        <v-chip
                          color="blue"
                          variant="outlined"
                          prepend-icon="mdi-account-clock-outline"
                          rounded="xl"
                          class="ma-1 mb-4"
                          label
                        >
                          {{ userData.additionalInfo[1].Experience }} Years
                        </v-chip>
                      </template>
                    </v-sheet>
                  </v-col>
                  <v-col cols="12" md="6" align-self="center">
                    <v-card class="ma-3">
                      <v-card-title class="mb-n4">
                        Doctor information:
                      </v-card-title>

                      <v-list>
                        <v-list-item
                          v-for="(value, key) in formattedUserData"
                          :key="key"
                          align="left"
                          density="compact"
                        >
                          <v-list-item-title
                            ><strong>{{ key }}</strong>
                            {{ value }}</v-list-item-title
                          >
                        </v-list-item>
                      </v-list>
                    </v-card>
                  </v-col>
                </v-row>
              </v-card>
            </v-col>
            <v-col cols="12" md="6">
              <v-card color="blue-lighten-5" class="mx-auto">
                <v-row>
                  <v-col cols="12" md="6" align-self="center">
                    <v-sheet
                      color="transparent"
                      elevation="0"
                      rounded="lg"
                      align="center"
                      justify="center"
                    >
                      <v-avatar
                        color="grey"
                        size="200"
                        rounded="10"
                        class="mb-4 mt-4"
                      >
                        <v-img src="@/assets/images/health_clinic.png" />
                      </v-avatar>
                      <v-card-title>
                        {{ selectedClinic.Name }}
                      </v-card-title>

                      <v-chip
                        color="orange"
                        variant="outlined"
                        prepend-icon="mdi-hospital-building"
                        rounded="xl"
                        class="ma-1 mb-4"
                        label
                      >
                        {{ selectedClinic.Category.Name }}
                      </v-chip>
                    </v-sheet>
                  </v-col>
                  <v-col cols="12" md="6" align-self="center">
                    <v-card class="ma-4">
                      <v-card-title> Clinic information: </v-card-title>

                      <v-list>
                        <v-list-item align="left" density="compact">
                          <v-list-item-title
                            ><strong>Address: </strong>
                            {{ selectedClinic.Address }}</v-list-item-title
                          >
                        </v-list-item>
                        <v-list-item align="left" density="compact">
                          <v-list-item-title
                            ><strong>Phone: </strong>
                            {{ selectedClinic.Phone }}</v-list-item-title
                          >
                        </v-list-item>
                        <v-list-item align="left" density="compact">
                          <v-list-item-title
                            ><strong>Open Hours:</strong>
                            {{ selectedClinic.OpenHours }}</v-list-item-title
                          >
                        </v-list-item>
                      </v-list>
                    </v-card>
                  </v-col>
                </v-row>
              </v-card>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" sm="6" md="6" align-self="center">
              <v-card color="grey-lighten-5" class="mx-auto" hover rounded="lg">
                <v-row>
                  <v-col cols="12" md="6">
                    <v-sheet
                      color="transparent"
                      elevation="0"
                      rounded="lg"
                      align="center"
                      justify="center"
                      class="pa-4"
                    >
                      <v-icon
                        size="70"
                        color="blue"
                        icon="mdi-account-injury-outline"
                      ></v-icon>
                      <v-card-title class="text-blue"
                        >My Patients Count
                      </v-card-title>
                    </v-sheet>
                  </v-col>
                  <v-col cols="12" md="6" align-self="center">
                    <v-card-title class="text-h3 text-center text-blue"
                      >{{ dashboardData.patientsCount }}
                    </v-card-title>
                  </v-col>
                </v-row>
              </v-card>
            </v-col>

            <v-col cols="12" sm="6" md="6" align-self="center">
              <v-card color="grey-lighten-5" class="mx-auto" hover rounded="lg">
                <v-row>
                  <v-col cols="12" md="6">
                    <v-sheet
                      color="transparent"
                      elevation="0"
                      rounded="lg"
                      align="center"
                      justify="center"
                      class="pa-4"
                    >
                      <v-icon
                        size="70"
                        color="orange"
                        icon="mdi-calendar-today-outline"
                      ></v-icon>
                      <v-card-title class="text-orange"
                        >Today Appointments
                      </v-card-title>
                    </v-sheet>
                  </v-col>
                  <v-col cols="12" md="6" align-self="center">
                    <v-card-title class="text-h3 text-center text-orange"
                      >{{ dashboardData.todayAppointmentsCount }}
                    </v-card-title>
                  </v-col>
                </v-row>
              </v-card>
            </v-col>

            <v-col cols="12" sm="4" md="4" align-self="center">
              <v-card color="grey-lighten-5" class="mx-auto" hover rounded="lg">
                <v-row>
                  <v-col cols="12" md="6">
                    <v-sheet
                      color="transparent"
                      elevation="0"
                      rounded="lg"
                      align="center"
                      justify="center"
                      class="pa-4"
                    >
                      <v-icon
                        size="70"
                        color="blue"
                        icon="mdi-calendar-month-outline"
                      ></v-icon>
                      <v-card-title class="text-blue"
                        >Scheduled
                        <div>Appointments</div>
                      </v-card-title>
                    </v-sheet>
                  </v-col>
                  <v-col cols="12" md="6" align-self="center">
                    <v-card-title class="text-h3 text-center text-blue"
                      >{{ dashboardData.scheduledAppointments }}
                    </v-card-title>
                  </v-col>
                </v-row>
              </v-card>
            </v-col>

            <v-col cols="12" sm="4" md="4" align-self="center">
              <v-card color="grey-lighten-5" class="mx-auto" hover rounded="lg">
                <v-row>
                  <v-col cols="12" md="6">
                    <v-sheet
                      color="transparent"
                      elevation="0"
                      rounded="lg"
                      align="center"
                      justify="center"
                      class="pa-4"
                    >
                      <v-icon
                        size="70"
                        color="green"
                        icon="mdi-calendar-check-outline"
                      ></v-icon>
                      <v-card-title class="text-green"
                        >Completed
                        <div>Appointments</div>
                      </v-card-title>
                    </v-sheet>
                  </v-col>
                  <v-col cols="12" md="6" align-self="center">
                    <v-card-title class="text-h3 text-center text-green"
                      >{{ dashboardData.completedAppointmentsCount }}
                    </v-card-title>
                  </v-col>
                </v-row>
              </v-card>
            </v-col>

            <v-col cols="12" sm="4" md="4" align-self="center">
              <v-card color="grey-lighten-5" class="mx-auto" hover rounded="lg">
                <v-row>
                  <v-col cols="12" md="6">
                    <v-sheet
                      color="transparent"
                      elevation="0"
                      rounded="lg"
                      align="center"
                      justify="center"
                      class="pa-4"
                    >
                      <v-icon
                        size="70"
                        color="red"
                        icon="mdi-calendar-remove-outline"
                      ></v-icon>
                      <v-card-title class="text-red"
                        >Cancelled
                        <div>Appointments</div>
                      </v-card-title>
                    </v-sheet>
                  </v-col>
                  <v-col cols="12" md="6" align-self="center">
                    <v-card-title class="text-h3 text-center text-red"
                      >{{ dashboardData.cancelledAppointmentsCount }}
                    </v-card-title>
                  </v-col>
                </v-row>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </template>
    </v-row>
  </v-container>
</template>
<script setup>
import { HTTP } from "@/config";
import { useUser } from "@/store/useUser";
import { ref, watch, onMounted, computed } from "vue";
import adminImage from "@/assets/images/roles/Admin.png";
import doctorImage from "@/assets/images/roles/Doctor.png";
import patientImage from "@/assets/images/roles/Patient.png";
import clinicManagerImage from "@/assets/images/roles/Clinic_Manager.png";

const user = useUser();

// User data properties
const userData = ref({});
const userID = ref("");
// Define loading state variable
const loading = ref(true);

const selectedClinic = ref(null);
const doctorClinics = ref([]);
const dashboardData = ref([]);

// Watch for changes in the selected clinic and fetch appointments accordingly
watch(selectedClinic, async (newValue) => {
  if (newValue !== null) {
    await fetchDoctorDashboard();
  }
});

// Fetch doctor's clinics
const fetchDoctorClinics = async () => {
  try {
    const response = await HTTP.get(`/doctorclinics/${userID.value}`);
    doctorClinics.value = response.data.data;
    if (doctorClinics.value.length > 0) {
      selectedClinic.value = doctorClinics.value[0]; // Set the first clinic as selected by default
    }
    console.log("Doctor's Clinics:", doctorClinics.value);
    fetchDoctorDashboard();
    loading.value = false;
  } catch (error) {
    console.error("Error fetching doctor's clinics:", error);
  }
};

// Fetch doctor's clinics
const fetchDoctorDashboard = async () => {
  try {
    loading.value = true;
    const response = await HTTP.get(
      `/dashboards/doctor/${selectedClinic.value.ID}/${userID.value}`
    );
    dashboardData.value = response.data.Data;
    console.log("Doctor's Dashboard:", dashboardData.value);
    loading.value = false;
  } catch (error) {
    console.error("Error fetching doctor's clinics:", error);
  }
};
// Method to fetch user data
const fetchUserData = async () => {
  try {
    console.log("Fetching user data...");
    const response = await HTTP.get(`/user/${user.ID}`);
    console.log("User data responce:", response.data.data);
    userData.value = response.data.data;
    const userResponse = await HTTP.get(
      `users/${userData.value.ID}/additional-info`
    );
    let addInfo = null;
    userID.value = userResponse.data.ID;
    addInfo = [
      { Specialization: userResponse.data.specialization.name },
      { Experience: userResponse.data.experience },
      { Additional_Info: userResponse.data.additional_info },
    ];
    userData.value.additionalInfo = addInfo;

    console.log("User data:", userData.value);
    // Once fetchUserData is completed, set loading to false
    fetchDoctorClinics(userID.value);
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
};

// Define the computed property to format the user data
const formattedUserData = computed(() => {
  return {
    "Email:": userData.value.Email,
    "Phone:": userData.value.Phone,
    "Mobile:": userData.value.Mobile,
    "Address:": userData.value.Address,
    "Date Of Birth:": userData.value.DateOfBirth,
    "Gender:": userData.value.Gender,
  };
});
// Fetch user data on component mounted
onMounted(async () => {
  await fetchUserData();
});

// Method to get the role photo URL
const getRolePhoto = (role) => {
  switch (role) {
    case "Admin":
      return adminImage;
    case "Doctor":
      return doctorImage;
    case "Patient":
      return patientImage;
    case "Clinic Manager":
      return clinicManagerImage;
    default:
      return "https://cdn.vuetifyjs.com/images/john.jpg"; // URL for default photo or placeholder
  }
};
</script>
