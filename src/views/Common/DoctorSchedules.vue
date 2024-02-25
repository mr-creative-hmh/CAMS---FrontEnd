<template>
  <v-container class="fill-height">
    <v-row align="center" justify="center">
      <v-col cols="12" md="8" lg="10" sm="2">
        <v-card color="red-lighten-5" class="mx-auto">
          <v-row>
            <v-col cols="12" md="4" align-self="center">
              <v-sheet
                color="transparent"
                elevation="0"
                rounded="lg"
                align="center"
              >
                <v-card-title class="text-center align-center" rounded="lg">
                  <v-img
                    src="@/assets/images/doctor_schedule1.png"
                    height="250"
                  />
                  <h4 class="mt-4 mb-2 text-blue-darken-4">Doctor Schedules</h4>
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

                <!-- Doctor Schedules Selection Section -->
                <v-expand-transition>
                  <v-row v-if="selectedDoctor">
                    <v-col align="center" justify="center">
                      <v-btn
                        @click="toggleSection('schedule')"
                        color="red-darken-4"
                        >Show Doctor Schedules</v-btn
                      >
                    </v-col>
                  </v-row>
                </v-expand-transition>

                <!-- Date Selection -->
                <v-expand-transition>
                  <v-row v-show="expandedSection === 'schedule'">
                    <v-col justify="center" align="center" align-self="center">
                      <v-card class="ml-6 mr-6 mb-6">
                        <v-card-title class="text-center">
                          <v-img
                            src="@/assets/images/doctor_schedule.png"
                            height="150"
                          />
                          <h4>Dr. {{ doctorName }}'s Schedules</h4>
                        </v-card-title>
                        <v-divider></v-divider>
                        <v-row>
                          <v-col align-self="center" justify="center">
                            <v-list>
                              <v-list-item
                                v-for="schedule in doctorSchedules"
                                :key="schedule.ID"
                                align="center"
                                rounded="lg"
                                class="mb-3"
                              >
                                <div
                                  class="text-red-darken-2 font-weight-bold pr-2"
                                >
                                  <v-icon start color="blue-darken-2"
                                    >mdi-calendar
                                  </v-icon>
                                  {{ schedule.DayOfWeek }}
                                </div>

                                {{ formatTime(schedule.StartTime) }} -
                                {{ formatTime(schedule.EndTime) }}
                              </v-list-item>
                            </v-list>
                          </v-col>
                        </v-row>
                        <v-divider></v-divider>
                        <div align="center" justify="center">
                          <router-link to="/register">
                            <v-btn
                              rounded="lg"
                              elevation="4"
                              color="success"
                              class="mt-3 mb-3"
                              >Book an appointment
                              <v-icon
                                end
                                icon="mdi-checkbox-marked-circle"
                              ></v-icon
                            ></v-btn>
                          </router-link>
                        </div>
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
import { ref } from "vue";

// Reactive data

const selectedCategory = ref(null);
const selectedClinic = ref(null);
const selectedDoctor = ref(null);
const expandedSection = ref("category");

const categories = ref([]);
const clinics = ref([]);
const clinicdoctors = ref([]);
const doctorName = ref("");
const doctorSchedules = ref([]);

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

function initialize() {
  fetchCategories();
}

// Fetch doctors based on selected clinic
const fetchDoctors = () => {
  HTTP.get(API_GUEST.CLINIC_DOCTORS(selectedClinic.value))
    .then((response) => {
      clinicdoctors.value = response.data.data;
    })
    .catch((error) => {
      console.error("Error fetching doctors:", error);
      // Handle error if necessary
    });
};

const fetchDoctorSchedules = () => {
  HTTP.get(
    API_GUEST.DOCTOR_SCHEDULES(selectedDoctor.value, selectedClinic.value)
  )
    .then((response) => {
      doctorSchedules.value = response.data.data;
      doctorName.value = response.data.data[0]?.Doctor?.User?.Name; // Assuming the first schedule's doctor name is used
    })
    .catch((error) => {
      console.error("Error fetching doctor schedules:", error);
      // Handle error if necessary
    });
};

const formatTime = (time) => {
  const [hours, minutes] = time.split(":");
  const formattedHours = hours % 12 || 12;
  const period = hours >= 12 ? "PM" : "AM";
  return `${formattedHours}:${minutes} ${period}`;
};

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
  toggleSection("schedule"); // Expand the next section
  // Fetch doctor schedules for the selected doctor
  fetchDoctorSchedules();
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
