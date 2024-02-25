<template>
  <v-container>
    <v-btn color="success" elevation="4" variant="outlined" @click="openDialog">
      <v-icon start>mdi-plus-box</v-icon>
      New Appointment
    </v-btn>
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-toolbar color="primary" title="Create Appointment"></v-toolbar>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="6" md="12">
                <v-select
                  v-model="selectedClinic"
                  :items="clinics"
                  item-title="Name"
                  item-value="ID"
                  label="Select Clinic"
                  @change="fetchDoctors"
                ></v-select>
                <v-select
                  v-model="selectedDoctor"
                  :items="doctors"
                  item-title="User.Name"
                  item-value="ID"
                  label="Select Doctor"
                  @change="fetchDoctorSchedules"
                ></v-select>
                <v-date-picker v-model="selectedDate" label="Select Date" />
                <!-- <v-select
                  v-model="editedItem.Patient"
                  :items="clinics"
                  item-title="User.Name"
                  item-value="ID"
                  label="Clinic"
                ></v-select> -->
                <v-select
                  v-model="selectedStatus"
                  :items="['Monday', 'Tuesday', 'Wednesday']"
                  label="Day Of Week"
                ></v-select>
                <v-text-field v-model="ReasonOfVisit" label="Reason Of Visit">
                </v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue-darken-1" variant="text" @click="closeDialog">
            Cancel
          </v-btn>
          <v-btn
            color="green-darken-1"
            variant="text"
            @click="submitAppointment"
          >
            Create
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { HTTP } from "@/config";
import { ref } from "vue";

const dialog = ref(false);
const clinics = ref([]);
const doctors = ref([]);
const selectedClinic = ref(null);
const selectedDoctor = ref(null);
const selectedDate = ref(null);
const selectedStatus = ref(null);
const ReasonOfVisit = ref("");

const fetchClinics = async () => {
  try {
    HTTP.get("/clinic")
      .then((response) => {
        clinics.value = response.data.data;
        console.log(clinics.value);
        console.log("clinics :", response.data.data);
        dialog.value = true;
      })
      .catch((error) => {
        console.error("Error fetching clinics:", error);
      });
  } catch (error) {
    console.error("Error fetching clinics:", error);
  }
};

const fetchDoctors = async () => {
  try {
    const response = await HTTP.get(`/clinicdoctors/${selectedClinic.value}`);
    doctors.value = response.data.Data;
  } catch (error) {
    console.error("Error fetching doctors:", error);
  }
};

const fetchDoctorSchedules = async () => {
  if (!selectedDoctor.value) return;
  try {
    const response = await HTTP.get(
      `/appointment/doctorschedules/${selectedClinic.value}/${selectedDoctor.value}`
    );
    // Handle response to set available dates
    const schedules = response.data.date;

    // Filter dates based on day of the week and add them to an array
    const availableDates = schedules
      .filter((schedule) => {
        const scheduleDate = new Date(schedule.date);
        return scheduleDate.getDay() === selectedDate.value.getDay();
      })
      .map((schedule) => schedule.date); // Assuming schedule date is in the correct format

    // Set the available dates for the date picker
    availableDates.value = availableDates;
  } catch (error) {
    console.error("Error fetching doctor schedules:", error);
  }
};

const submitAppointment = () => {
  // Logic to submit the appointment
};

const openDialog = () => {
  fetchClinics(); // Fetch clinics when dialog opens
};

const closeDialog = () => {
  dialog.value = false;
};
</script>
