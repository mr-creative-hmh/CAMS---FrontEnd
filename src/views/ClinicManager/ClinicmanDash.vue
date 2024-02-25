<template>
  <v-container>
    <v-row>
      <v-col>
        <v-toolbar class="mb-3 pl-4" color="blue-darken-2" rounded="lg">
          <v-icon start>mdi-view-dashboard</v-icon> Clinic Manager Dashboard
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
                        <v-img :src="getRolePhoto()" />
                      </v-avatar>
                      <v-card-title>
                        {{ userData.Name }}
                      </v-card-title>
                    </v-sheet>
                  </v-col>
                  <v-col cols="12" md="6" align-self="center">
                    <v-card class="ma-3">
                      <v-card-title class="mb-n2">
                        Clinic Manager information:
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
                        {{ Clinic.Name }}
                      </v-card-title>
                    </v-sheet>
                  </v-col>
                  <v-col cols="12" md="6" align-self="center">
                    <v-card class="ma-4">
                      <v-card-title> Clinic information: </v-card-title>
                      <v-list>
                        <v-list-item align="left" density="compact">
                          <v-list-item-title>
                            <v-icon start color="orange"
                              >mdi-hospital-building</v-icon
                            >
                            <strong>{{ Clinic.Category.Name }}</strong>
                          </v-list-item-title>
                        </v-list-item>
                        <v-list-item align="left" density="compact">
                          <v-list-item-title
                            ><strong>Address: </strong>
                            {{ Clinic.Address }}</v-list-item-title
                          >
                        </v-list-item>
                        <v-list-item align="left" density="compact">
                          <v-list-item-title
                            ><strong>Phone: </strong>
                            {{ Clinic.Phone }}</v-list-item-title
                          >
                        </v-list-item>
                        <v-list-item align="left" density="compact">
                          <v-list-item-title
                            ><strong>Open Hours:</strong>
                            {{ Clinic.OpenHours }}</v-list-item-title
                          >
                        </v-list-item>
                      </v-list>
                    </v-card>
                    <v-card class="mb-3" variant="text">
                      <v-card-actions>
                        <v-btn
                          class="ml-3"
                          variant="outlined"
                          color="green-darken-4"
                          @click="editItem()"
                          >Edit Clinic Data</v-btn
                        >
                      </v-card-actions>
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
                      <v-icon size="70" color="blue" icon="mdi-doctor"></v-icon>
                      <v-card-title class="text-blue"
                        >Doctors Count
                      </v-card-title>
                    </v-sheet>
                  </v-col>
                  <v-col cols="12" md="6" align-self="center">
                    <v-card-title class="text-h3 text-center text-blue"
                      >{{ dashboardData.doctorsCount }}
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
                        color="blue"
                        icon="mdi-account-injury-outline"
                      ></v-icon>
                      <v-card-title class="text-blue"
                        >Patients Count
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

            <v-col cols="12" sm="6" md="3" align-self="center">
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
                        >Today
                        <div>Appointments</div>
                      </v-card-title>
                    </v-sheet>
                  </v-col>
                  <v-col cols="12" md="3" align-self="center">
                    <v-card-title class="text-h3 text-center text-orange"
                      >{{ dashboardData.todayAppointmentsCount }}
                    </v-card-title>
                  </v-col>
                </v-row>
              </v-card>
            </v-col>

            <v-col cols="12" sm="4" md="3" align-self="center">
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
                        >Total
                        <div>Appointments</div>
                      </v-card-title>
                    </v-sheet>
                  </v-col>
                  <v-col cols="12" md="6" align-self="center">
                    <v-card-title class="text-h3 text-center text-blue"
                      >{{ dashboardData.totalAppointmentsCount }}
                    </v-card-title>
                  </v-col>
                </v-row>
              </v-card>
            </v-col>

            <v-col cols="12" sm="4" md="3" align-self="center">
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

            <v-col cols="12" sm="4" md="3" align-self="center">
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

    <v-dialog v-model="editClinicDialog" max-width="500px">
      <v-card>
        <v-toolbar color="info" title="Edit Clinic Data"></v-toolbar>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="6" md="12">
                <v-text-field
                  v-model="editedItem.Name"
                  label="Name"
                ></v-text-field>
                <v-text-field
                  v-model="editedItem.Address"
                  label="Address"
                ></v-text-field>
                <v-text-field
                  v-model="editedItem.Phone"
                  label="Phone"
                ></v-text-field>
                <v-text-field
                  v-model="editedItem.OpenHours"
                  label="Open Hours"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue-darken-1" variant="outlined" @click="close">
            Cancel
          </v-btn>
          <v-btn color="green-darken-1" variant="outlined" @click="save">
            Save
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
import { computed } from "vue";
import { onMounted } from "vue";
import { ref } from "vue";

const user = useUser();
const auth = useAuth();
// User data properties
const userData = ref({});
const userID = ref("");

// Define loading state variable
const loading = ref(true);
const editClinicDialog = ref(false);
const Clinic = ref("");
const dashboardData = ref([]);

const editedItem = ref({
  Name: "",
  Address: "",
  Phone: "",
  OpenHours: "",
});
// Fetch doctor's clinics
const fetchClinicManagerDashboard = async () => {
  try {
    loading.value = true;
    const response = await HTTP.get(
      `/dashboards/clinicmanager/${Clinic.value.ID}`
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
    Clinic.value = userResponse.data.Clinic;
    console.log("Clinic:", Clinic.value);
    userID.value = userResponse.data.ID;
    console.log("User data:", userData.value);
    // Once fetchUserData is completed, set loading to false
    fetchClinicManagerDashboard();
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
};

function editItem() {
  editedItem.value = Clinic.value;
  editClinicDialog.value = true;
}

function close() {
  editClinicDialog.value = false;
}

function save() {
  close();
  loading.value = true;
  editClinic(editedItem.value);
}

function editClinic(item) {
  HTTP.put("/clinic/" + item.ID, {
    name: item.Name,
    address: item.Address,
    phone: item.Phone,
    operating_hours: item.OpenHours,
  })
    .then((response) => {
      auth.$patch({
        showAlert: true,
        message: response.data.Message,
        isError: false,
      });
      fetchUserData();
    })
    .catch((error) => {
      console.error("Error edit clinic:", error);
      auth.$patch({
        showAlert: true,
        message: error.response.data.message,
        isError: true,
      });
    });
}

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
const getRolePhoto = () => {
  switch (user.Role) {
    case "Admin":
      return "/src/assets/images/roles/Admin.png";
    case "Doctor":
      return "/src/assets/images/roles/Doctor.png";
    case "Patient":
      return "/src/assets/images/roles/Patient.png";
    case "Clinic Manager":
      return "/src/assets/images/roles/Clinic_Manager.png";
    default:
      return "https://cdn.vuetifyjs.com/images/john.jpg"; // URL for default photo or placeholder
  }
};
</script>
