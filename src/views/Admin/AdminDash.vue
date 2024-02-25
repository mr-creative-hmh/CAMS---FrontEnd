<template>
  <v-container>
    <v-row>
      <v-col>
        <v-toolbar class="mb-3 pl-4" color="red-darken-2" rounded="lg">
          <v-icon start>mdi-view-dashboard</v-icon> Administrator Dashboard
        </v-toolbar>
      </v-col>
    </v-row>

    <v-row>
      <template v-if="loading">
        <v-col cols="12" sm="6" md="12">
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
                      <v-card>
                        <v-img src="@/assets/images/administrator.jpg"> </v-img>
                      </v-card>
                    </v-sheet>
                  </v-col>
                  <v-col cols="12" md="6" align-self="center">
                    <v-card class="ma-3">
                      <v-card-title class="mb-n2">
                        Administrator information:
                      </v-card-title>

                      <v-list>
                        <v-card-text
                          class="text-red-darken-4 text-h5 font-weight-bold"
                          >{{ user.Name }}</v-card-text
                        >
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
            <v-col cols="12" md="6" self-align="center">
              <v-card class="pa-9 pb-10">
                <Pie :data="chartData" :options="chartOptions" />
              </v-card>
            </v-col>
          </v-row>
          <v-row>
            <!-- Users Count Card -->
            <v-col cols="12" sm="4" md="3" align-self="center">
              <v-card color="grey-lighten-5" class="mx-auto" hover rounded="lg">
                <v-row>
                  <v-col cols="12" md="7">
                    <v-sheet
                      color="transparent"
                      elevation="0"
                      rounded="lg"
                      align="center"
                      justify="center"
                    >
                      <v-icon
                        size="70"
                        color="red"
                        icon="mdi-account-group"
                      ></v-icon>
                      <v-card-title class="text-red">
                        Users
                        <div>Count</div></v-card-title
                      >
                    </v-sheet>
                  </v-col>
                  <v-col cols="12" md="5" align-self="center" class="mb-3">
                    <v-card-title class="text-h3 text-center text-red">{{
                      dashboardData.usersCount
                    }}</v-card-title>
                  </v-col>
                </v-row>
              </v-card>
            </v-col>

            <!-- Doctors Count Card -->
            <v-col cols="12" sm="4" md="3" align-self="center">
              <v-card color="grey-lighten-5" class="mx-auto" hover rounded="lg">
                <v-row>
                  <v-col cols="12" md="7">
                    <v-sheet
                      color="transparent"
                      elevation="0"
                      rounded="lg"
                      align="center"
                      justify="center"
                    >
                      <v-icon
                        size="70"
                        color="green"
                        icon="mdi-doctor"
                      ></v-icon>
                      <v-card-title class="text-green"
                        >Doctors
                        <div>Count</div></v-card-title
                      >
                    </v-sheet>
                  </v-col>
                  <v-col cols="12" md="5" align-self="center" class="mb-3">
                    <v-card-title class="text-h3 text-center text-green">{{
                      dashboardData.doctorsCount
                    }}</v-card-title>
                  </v-col>
                </v-row>
              </v-card>
            </v-col>

            <!-- Clinic Managers Count Card -->
            <v-col cols="12" sm="4" md="3" align-self="center">
              <v-card color="grey-lighten-5" class="mx-auto" hover rounded="lg">
                <v-row>
                  <v-col cols="12" md="7">
                    <v-sheet
                      color="transparent"
                      elevation="0"
                      rounded="lg"
                      align="center"
                      justify="center"
                    >
                      <v-icon
                        size="70"
                        color="blue"
                        icon="mdi-account-tie"
                      ></v-icon>
                      <v-card-title class="text-blue"
                        >Clinic Managers
                        <div>Count</div></v-card-title
                      >
                    </v-sheet>
                  </v-col>
                  <v-col cols="12" md="5" align-self="center" class="mb-3">
                    <v-card-title class="text-h3 text-center text-blue">{{
                      dashboardData.clinicManagersCount
                    }}</v-card-title>
                  </v-col>
                </v-row>
              </v-card>
            </v-col>

            <!-- Patients Count Card -->
            <v-col cols="12" sm="4" md="3" align-self="center">
              <v-card color="grey-lighten-5" class="mx-auto" hover rounded="lg">
                <v-row>
                  <v-col cols="12" md="7">
                    <v-sheet
                      color="transparent"
                      elevation="0"
                      rounded="lg"
                      align="center"
                      justify="center"
                    >
                      <v-icon
                        size="70"
                        color="orange"
                        icon="mdi-account-injury"
                      ></v-icon>
                      <v-card-title class="text-orange"
                        >Patients
                        <div>Count</div></v-card-title
                      >
                    </v-sheet>
                  </v-col>
                  <v-col cols="12" md="5" align-self="center" class="mb-3">
                    <v-card-title class="text-h3 text-center text-orange">{{
                      dashboardData.patientsCount
                    }}</v-card-title>
                  </v-col>
                </v-row>
              </v-card>
            </v-col>

            <!-- Categories Count Card -->
            <v-col cols="12" sm="4" md="3" align-self="center">
              <v-card color="grey-lighten-5" class="mx-auto" hover rounded="lg">
                <v-row>
                  <v-col cols="12" md="7">
                    <v-sheet
                      color="transparent"
                      elevation="0"
                      rounded="lg"
                      align="center"
                      justify="center"
                    >
                      <v-icon
                        size="70"
                        color="purple"
                        icon="mdi-order-bool-descending"
                      ></v-icon>
                      <v-card-title class="text-purple"
                        >Categories
                        <div>Count</div></v-card-title
                      >
                    </v-sheet>
                  </v-col>
                  <v-col cols="12" md="5" align-self="center" class="mb-3">
                    <v-card-title class="text-h3 text-center text-purple">{{
                      dashboardData.categoriesCount
                    }}</v-card-title>
                  </v-col>
                </v-row>
              </v-card>
            </v-col>

            <!-- Specializations Count Card -->
            <v-col cols="12" sm="4" md="3" align-self="center">
              <v-card color="grey-lighten-5" class="mx-auto" hover rounded="lg">
                <v-row>
                  <v-col cols="12" md="7">
                    <v-sheet
                      color="transparent"
                      elevation="0"
                      rounded="lg"
                      align="center"
                      justify="center"
                    >
                      <v-icon
                        size="70"
                        color="teal"
                        icon="mdi-account-star"
                      ></v-icon>
                      <v-card-title class="text-teal"
                        >Specializations
                        <div>Count</div></v-card-title
                      >
                    </v-sheet>
                  </v-col>
                  <v-col cols="12" md="5" align-self="center" class="mb-3">
                    <v-card-title class="text-h3 text-center text-teal">{{
                      dashboardData.specializationsCount
                    }}</v-card-title>
                  </v-col>
                </v-row>
              </v-card>
            </v-col>

            <!-- Appointments Count Card -->
            <v-col cols="12" sm="4" md="3" align-self="center">
              <v-card color="grey-lighten-5" class="mx-auto" hover rounded="lg">
                <v-row>
                  <v-col cols="12" md="7">
                    <v-sheet
                      color="transparent"
                      elevation="0"
                      rounded="lg"
                      align="center"
                      justify="center"
                    >
                      <v-icon
                        size="70"
                        color="indigo"
                        icon="mdi-calendar-clock"
                      ></v-icon>
                      <v-card-title class="text-indigo"
                        >Appointments
                        <div>Count</div></v-card-title
                      >
                    </v-sheet>
                  </v-col>
                  <v-col cols="12" md="5" align-self="center" class="mb-3">
                    <v-card-title class="text-h3 text-center text-indigo">{{
                      dashboardData.appointmentsCount
                    }}</v-card-title>
                  </v-col>
                </v-row>
              </v-card>
            </v-col>

            <!-- Medical Records Count Card -->
            <v-col cols="12" sm="4" md="3" align-self="center">
              <v-card color="grey-lighten-5" class="mx-auto" hover rounded="lg">
                <v-row>
                  <v-col cols="12" md="7">
                    <v-sheet
                      color="transparent"
                      elevation="0"
                      rounded="lg"
                      align="center"
                      justify="center"
                    >
                      <v-icon
                        size="70"
                        color="pink"
                        icon="mdi-clipboard-pulse"
                      ></v-icon>
                      <v-card-title class="text-pink font-weight-medium"
                        >Medical Records
                        <div>Count</div></v-card-title
                      >
                    </v-sheet>
                  </v-col>
                  <v-col cols="12" md="5" align-self="center" class="mb-3">
                    <v-card-title class="text-h3 text-center text-pink">{{
                      dashboardData.medicalRecordsCount
                    }}</v-card-title>
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
// import { useAuth } from "@/store/useAuthentication";
import { useUser } from "@/store/useUser";
import { computed } from "vue";
import { onMounted } from "vue";
import { ref } from "vue";

const user = useUser();
// const auth = useAuth();

// Define loading state variable
const loading = ref(true);

const dashboardData = ref([]);

// Fetch doctor's clinics
const fetchAdminDashboard = async () => {
  try {
    loading.value = true;
    const response = await HTTP.get(`/dashboards/admin/`);
    dashboardData.value = response.data.Data;
    console.log("Doctor's Dashboard:", dashboardData.value);
    Doctors.value = response.data.Data.doctorsCount;
    ClinicManagers.value = response.data.Data.clinicManagersCount;
    Patients.value = response.data.Data.patientsCount;
    Admins.value =
      response.data.Data.usersCount -
      (response.data.Data.doctorsCount +
        response.data.Data.clinicManagersCount +
        response.data.Data.patientsCount);
    loading.value = false;
  } catch (error) {
    console.error("Error fetching doctor's clinics:", error);
  }
};

// Define the computed property to format the user data
const formattedUserData = computed(() => {
  return {
    "Email:": user.Email,
    "Phone:": user.Phone,
    "Mobile:": user.Mobile,
    "Address:": user.Address,
    "Date Of Birth:": user.DateOfBirth,
    "Gender:": user.Gender,
  };
});
// Fetch user data on component mounted
onMounted(async () => {
  await fetchAdminDashboard();
});

const Doctors = ref(0);
const ClinicManagers = ref(0);
const Patients = ref(0);
const Admins = ref(0);

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import { Pie } from "vue-chartjs";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

const chartData = {
  labels: ["Admins", "Doctors", "Clinic Managers", "Patients"],
  datasets: [
    {
      backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4CAF50"],
      data: [Admins, Doctors, ClinicManagers, Patients],
    },
  ],
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "bottom",
    },
    tooltip: {
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      titleFontColor: "white",
      bodyFontColor: "white",
      borderColor: "white",
      borderWidth: 3,
    },
  },
};
</script>
