<template>
  <v-container>
    <v-row>
      <v-col>
        <v-toolbar class="pl-4" color="blue-grey-darken-2" rounded="lg">
          <v-icon start>mdi-calendar-clock</v-icon> Book Appointments
        </v-toolbar>
      </v-col>
    </v-row>
  </v-container>
  <v-container class="fill-height">
    <v-row align="center" justify="center">
      <v-col cols="12" md="8" lg="10">
        <v-card color="red-lighten-5" class="mx-auto">
          <v-row>
            <v-col cols="12" md="4" align-self="center">
              <v-sheet
                color="transparent"
                elevation="0"
                rounded="lg"
                align="center"
              >
                <v-card-title class="text-center">
                  <v-img src="@/assets/images/appointment.png" height="200" />
                  <h4 class="headline mt-4">Book Appointemnt</h4>
                </v-card-title>
              </v-sheet>
            </v-col>
            <v-col cols="12" md="8">
              <v-card
                elevation="4"
                color="indigo-lighten-5"
                class="ma-5"
                rounded="lg"
              >
                <!-- Category Selection Section -->
                <v-expand-transition>
                  <v-row v-if="!selectedCategory">
                    <v-col align="center" justify="center">
                      <v-btn
                        @click="toggleSection('clinic')"
                        color="red-darken-4"
                        class="mt-3 mb-4"
                        >Select Category</v-btn
                      >
                    </v-col>
                  </v-row>
                </v-expand-transition>

                <!-- Category Selection -->
                <v-expand-transition>
                  <v-row v-show="expandedSection === 'category'">
                    <v-row justify="center" class="ml-6 mr-6 mb-6">
                      <v-col
                        v-for="category in categories"
                        :key="category.ID"
                        cols="12"
                        md="3"
                      >
                        <v-card
                          :color="
                            selectedClinic === category.ID
                              ? 'primary'
                              : 'blue-grey-darken-1'
                          "
                          @click="selectCategory(category.ID)"
                          hover
                        >
                          <v-card-text class="text-center">
                            <v-icon size="50">mdi-clipboard-pulse</v-icon>
                            <h3 class="clinic-name">{{ category.Name }}</h3>
                          </v-card-text>
                        </v-card>
                      </v-col>
                    </v-row>
                  </v-row>
                </v-expand-transition>
                <!-- Clinic Selection Section -->
                <v-expand-transition>
                  <v-row v-if="selectedCategory && !selectedClinic">
                    <v-col align="center" justify="center">
                      <v-btn
                        @click="toggleSection('clinic')"
                        color="red-darken-4"
                        class="mt-3 mb-4"
                        >Select Clinic</v-btn
                      >
                    </v-col>
                  </v-row>
                </v-expand-transition>

                <!-- Clinic Selection -->
                <v-expand-transition>
                  <v-row v-show="expandedSection === 'clinic'">
                    <v-row justify="center" class="ml-6 mr-6 mb-6">
                      <v-col
                        v-for="clinic in clinics"
                        :key="clinic.ID"
                        cols="12"
                        md="8"
                        lg="5"
                      >
                        <v-card
                          :color="
                            selectedClinic === clinic.ID
                              ? 'primary'
                              : 'blue-grey-darken-1'
                          "
                          @click="selectClinic(clinic.ID)"
                          hover
                        >
                          <v-card-text class="text-center">
                            <v-icon size="50">mdi-hospital-building</v-icon>
                            <h3 class="clinic-name">{{ clinic.Name }}</h3>
                            <v-chip
                              color="amber-darken-1"
                              variant="outlined"
                              append-icon="mdi-hospital"
                              rounded="xl"
                              class="mb-2 mt-2"
                              label
                            >
                              {{ clinic.Category.Name }}
                            </v-chip>
                            <div class="clinic-address">
                              {{ clinic.Address }}
                            </div>
                            <div class="clinic-phone">{{ clinic.Phone }}</div>
                            <div class="clinic-hours">
                              {{ clinic.OpenHours }}
                            </div>
                          </v-card-text>
                        </v-card>
                      </v-col>
                    </v-row>
                  </v-row>
                </v-expand-transition>

                <!-- Doctor Selection Section -->
                <v-expand-transition>
                  <v-row v-if="selectedClinic && !selectedDoctor">
                    <v-col align="center" justify="center">
                      <v-btn
                        @click="toggleSection('doctor')"
                        color="red-darken-4"
                        class="mb-3"
                        >Select Doctor</v-btn
                      >
                    </v-col>
                  </v-row>
                </v-expand-transition>

                <!-- Doctor Selection -->
                <v-expand-transition>
                  <v-row
                    v-show="expandedSection === 'doctor'"
                    justify="center"
                    class="ml-6 mr-6 mb-6"
                  >
                    <v-col
                      v-for="doctor in clinicdoctors"
                      :key="doctor.ID"
                      cols="12"
                      md="6"
                      lg="6"
                    >
                      <v-card
                        class="clinic-card"
                        @click="selectDoctor(doctor.ID)"
                        :color="
                          selectedDoctor === doctor.ID
                            ? 'primary'
                            : 'blue-grey-darken-1'
                        "
                        hover
                      >
                        <v-card-text class="text-center">
                          <v-icon size="50">mdi-doctor</v-icon>
                          <h3 class="doctor-name">
                            Dr. {{ doctor.User.Name }}
                          </h3>
                          <v-chip
                            color="amber-darken-1"
                            variant="outlined"
                            append-icon="mdi-hospital"
                            rounded="xl"
                            class="mb-2 mt-2"
                            label
                          >
                            {{ doctor.Specialization.Name }}
                          </v-chip>
                          <v-divider class="my-2"></v-divider>
                          <div class="doctor-info">
                            <div>
                              <strong>Email:</strong> {{ doctor.User.Email }}
                            </div>
                            <div>
                              <strong>Phone:</strong> {{ doctor.User.Phone }}
                            </div>
                            <div>
                              <strong>Mobile:</strong> {{ doctor.User.Mobile }}
                            </div>
                            <div>
                              <strong>Experience:</strong>
                              {{ doctor.Experience }} Years
                            </div>
                          </div>
                        </v-card-text>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-expand-transition>

                <!-- Date Selection Section -->
                <v-expand-transition>
                  <v-row v-if="selectedDoctor && !selectedDate">
                    <v-col align="center" justify="center">
                      <v-btn @click="toggleSection('date')" color="red-darken-4"
                        >Select Date</v-btn
                      >
                    </v-col>
                  </v-row>
                </v-expand-transition>

                <!-- Date Selection -->
                <v-expand-transition>
                  <v-row v-show="expandedSection === 'date'">
                    <v-col justify="center">
                      <v-card class="ml-6 mr-6 mb-6">
                        <v-toolbar
                          color="info"
                          title="Select Appointemnt Date:"
                          class="mb-3"
                        ></v-toolbar>
                        <v-row justify="space-around">
                          <v-col>
                            <v-sheet>
                              <v-chip-group
                                mandatory
                                mobile-breakpoint="sm"
                                selected-class="text-blue"
                                variant="outlined"
                                class="ml-6 mr-6"
                                column
                              >
                                <v-chip
                                  v-for="schedule in doctorschedulesDates"
                                  :key="schedule.doctor_schedule_id"
                                  rounded="lg"
                                  prepend-icon="mdi-calendar"
                                  @click="selectDate(schedule)"
                                >
                                  {{ schedule.date }}
                                </v-chip>
                              </v-chip-group>
                            </v-sheet>
                          </v-col>
                        </v-row>

                        <v-row v-if="viewAppointments">
                          <v-col justify="center">
                            <v-toolbar
                              color="blue-grey-darken-2"
                              title="Select Appointemnt Time:"
                              class="mb-3"
                            ></v-toolbar>
                            <v-container v-if="loading">
                              <v-row justify="center" class="ml-5 mr-5">
                                <v-col cols="12" md="2" sm="1">
                                  <v-skeleton-loader
                                    class="mx-auto"
                                    max-width="100"
                                    type="chip"
                                  ></v-skeleton-loader>
                                </v-col>
                                <v-col cols="12" md="2" sm="1">
                                  <v-skeleton-loader
                                    class="mx-auto"
                                    max-width="100"
                                    type="chip"
                                  ></v-skeleton-loader>
                                </v-col>
                                <v-col cols="12" md="2" sm="1">
                                  <v-skeleton-loader
                                    class="mx-auto"
                                    max-width="100"
                                    type="chip"
                                  ></v-skeleton-loader>
                                </v-col>
                                <v-col cols="12" md="2" sm="1">
                                  <v-skeleton-loader
                                    class="mx-auto"
                                    max-width="100"
                                    type="chip"
                                  ></v-skeleton-loader>
                                </v-col>
                                <v-col cols="12" md="2" sm="1">
                                  <v-skeleton-loader
                                    class="mx-auto"
                                    max-width="100"
                                    type="chip"
                                  ></v-skeleton-loader>
                                </v-col>
                                <v-col cols="12" md="2" sm="1">
                                  <v-skeleton-loader
                                    class="mx-auto"
                                    max-width="100"
                                    type="chip"
                                  ></v-skeleton-loader>
                                </v-col>
                              </v-row>
                            </v-container>
                            <v-row
                              class="mb-3"
                              justify="space-around"
                              v-if="!loading"
                            >
                              <v-col>
                                <v-sheet>
                                  <v-chip-group
                                    mandatory
                                    mobile-breakpoint="sm"
                                    selected-class="text-green"
                                    variant="outlined"
                                    class="ml-6 mr-6"
                                    column
                                  >
                                    <v-chip
                                      v-for="appointment in availableAppointmentsDT"
                                      :key="appointment.date"
                                      rounded="lg"
                                      @click="selectAppointment(appointment)"
                                    >
                                      <v-icon
                                        start
                                        color="amber-darken-1"
                                        icon="mdi-clock-time-three"
                                      />
                                      {{ appointment.time }}
                                    </v-chip>
                                  </v-chip-group>
                                </v-sheet>
                              </v-col>
                            </v-row>
                          </v-col>
                        </v-row>
                        <v-text-field
                          v-model="ReasonForVisit"
                          label="Reason For Visit"
                          class="ml-5 mr-5 mt-3"
                          color="blue"
                          rounded="lg"
                          variant="outlined"
                        >
                        </v-text-field>
                        <v-card-actions>
                          <v-btn
                            @click="createAppointment"
                            color="blue"
                            variant="outlined"
                            class="mb-3 ml-2"
                            :loading="bookloading"
                            >Create Appointment</v-btn
                          >
                        </v-card-actions>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-expand-transition>
              </v-card>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { API_GUEST } from "@/api";
import { HTTP } from "@/config";
import { useAuth } from "@/store/useAuthentication";
import { useUser } from "@/store/useUser";
import { ref } from "vue";
import { useRouter } from "vue-router"; // Import Vue Router
// Import your functions for fetching data

// Reactive data

const auth = useAuth();
const user = useUser();
const router = useRouter();
const userID = ref(null);
const userData = ref({});
const viewAppointments = ref(false);
const selectedCategory = ref(null);
const selectedClinic = ref(null);
const selectedDoctor = ref(null);
const selectedDate = ref(null);
const selectedAppointmentDateTime = ref(null);
const ReasonForVisit = ref(null);
const expandedSection = ref("category");

const categories = ref([]);
const clinics = ref([]);
const clinicdoctors = ref([]);
const doctorschedulesDates = ref([]);
const availableAppointmentsDT = ref([]);

const loading = ref(false);
const bookloading = ref(false);

const fetchCategories = () => {
  HTTP.get(API_GUEST.CLINICS_CATEGORIES)
    .then((response) => {
      categories.value = response.data.data;
    })
    .catch((error) => {
      console.error("Error fetching categories:", error);
      // Handle error if necessary
    });
};

const fetchClinics = () => {
  HTTP.get(API_GUEST.CATEGORY_CLINICS(selectedCategory.value))
    .then((response) => {
      clinics.value = response.data.data;
    })
    .catch((error) => {
      console.error("Error fetching clinics:", error);
      // Handle error if necessary
    });
};

const selectAppointment = (appointment) => {
  selectedAppointmentDateTime.value = appointment.date;
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
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
};

const fetchdoctorschedulesDates = async () => {
  try {
    const response = await HTTP.get(
      `/doctorschedulesdates/${selectedClinic.value}/${selectedDoctor.value}`
    );
    doctorschedulesDates.value = response.data;
    console.log("doctorschedulesDates :", doctorschedulesDates.value);
  } catch (error) {
    console.error(`Error fetching doctor schedules dates:`, error);
  }
};

async function fetchAvailableAppointmentsDT(dsid, date) {
  try {
    console.log("Selected date:", date);
    const response = await HTTP.get(`/available-appointments/${dsid}/${date}`);
    availableAppointmentsDT.value = response.data.available_appointments;
    console.log(availableAppointmentsDT.value);
    console.log("appointment :", response.data.data);
  } catch (error) {
    if (error.response && error.response.data && error.response.data.errors) {
      console.log("errors:", error.response.data.errors);
      auth.$patch({
        showAlert: true,
        message: error.response.data.message,
        isError: true,
      });
    } else {
      auth.$patch({
        showAlert: true,
        message: "No Doctor Schedule Available.",
        isError: true,
      });
    }
  }
}

async function createAppointment() {
  try {
    bookloading.value = true;
    console.log("appointment : ");
    const response = await HTTP.post("/appointment", {
      doctor_schedule_id: selectedDate.value.doctor_schedule_id,
      patient_id: userID.value,
      appointment_date: selectedAppointmentDateTime.value,
      appointment_type: "Normal",
      appointment_status: "Scheduled",
      reason_for_visit: ReasonForVisit.value,
    });
    auth.$patch({
      showAlert: true,
      message: response.data.Message,
      isError: false,
    });
    bookloading.value = false;
    router.push("/patient/patientappointments");
  } catch (error) {
    if (error.response && error.response.data && error.response.data.errors) {
      console.log("errors:", error.response.data.errors);
      auth.$patch({
        showAlert: true,
        message: error.response.data.message,
        isError: true,
      });
    } else {
      auth.$patch({
        showAlert: true,
        message: "An error occurred while Creating. Please try again later.",
        isError: true,
      });
    }
  }
}

function initialize() {
  fetchCategories();
  fetchUserData();
}

// Fetch doctors based on selected clinic
const fetchDoctors = async () => {
  try {
    const response = await HTTP.get(`/clinicdoctors/${selectedClinic.value}`);
    clinicdoctors.value = response.data.Data;
    console.log("doctors:", clinicdoctors.value);
  } catch (error) {
    console.error(
      `Error fetching doctors for clinic ${selectedClinic.value}:`,
      error
    );
  }
};

// Fetch appointments based on selected date
// const fetchAppointments = async () => {
//   // Call your function to fetch appointments based on selected date
//   // Update the `appointments` reactive variable
// };

const selectCategory = (categoryId) => {
  selectedCategory.value = categoryId;
  expandedSection.value = null; // Collapse the current section
  toggleSection("clinic"); // Expand the next section
  // Fetch doctors for the selected clinic
  fetchClinics();
};

// Function to select clinic
const selectClinic = (clinicId) => {
  selectedClinic.value = clinicId;
  expandedSection.value = null; // Collapse the current section
  toggleSection("doctor"); // Expand the next section
  // Fetch doctors for the selected clinic
  fetchDoctors();
};

// Function to select doctor
const selectDoctor = (doctorId) => {
  selectedDoctor.value = doctorId;
  expandedSection.value = null; // Collapse the current section
  toggleSection("date"); // Expand the next section
  // Fetch doctor schedules for the selected doctor
  fetchdoctorschedulesDates();
};

const selectDate = (Date) => {
  loading.value = true;
  // Do something with the selected date, such as saving it to a reactive variable
  selectedDate.value = Date;
  availableAppointmentsDT.value = "";
  fetchAvailableAppointmentsDT(
    selectedDate.value.doctor_schedule_id,
    selectedDate.value.date
  );
  loading.value = false;
  viewAppointments.value = true;
  // You can also perform any other actions you need after selecting a date
};

// Function to toggle expandable sections
const toggleSection = (section) => {
  expandedSection.value = expandedSection.value === section ? null : section;
};

initialize();
</script>

<style scoped>
.selected-appointment {
  background-color: lightblue; /* Change to your desired color */
}
</style>
