<template>
  <v-container>
    <v-responsive>
      <v-data-table
        :headers="headers"
        :items="todayAppointments"
        v-model:search="search"
        :sort-by="[
          { key: 'AppointmentDate', order: 'asc' },
          { key: 'AppointmentTime', order: 'asc' },
        ]"
      >
        <template v-slot:top>
          <v-toolbar color="grey-darken-3" rounded flat>
            <v-toolbar-title
              ><v-icon>mdi-calendar-today</v-icon> Today's
              Appointments</v-toolbar-title
            >
            <v-text-field
              v-model="search"
              prepend-inner-icon="mdi-magnify"
              density="compact"
              label="Search"
              single-line
              flat
              hide-details
              variant="solo-filled"
              class="me-4"
            ></v-text-field>
          </v-toolbar>
        </template>

        <template v-slot:[`item.actions`]="{ item }">
          <v-icon
            size="small"
            color="green"
            class="me-2"
            @click="completeAppointment(item)"
          >
            mdi-check
          </v-icon>
          <v-icon
            size="small"
            color="orange"
            class="me-2"
            @click="cancelAppointment(item)"
          >
            mdi-cancel
          </v-icon>
        </template>

        <template v-slot:no-data>
          <v-btn color="primary" @click="initialize"> Load Data </v-btn>
        </template>
      </v-data-table>
    </v-responsive>
  </v-container>
</template>

<script setup>
import { HTTP } from "@/config";
import { useAuth } from "@/store/useAuthentication";
import { useUser } from "@/store/useUser";
import { ref } from "vue";

const auth = useAuth();
const user = useUser();
const clinic = ref("");
const search = ref("");
const headers = ref([
  { title: "Doctor", key: "DoctorSchedule.Doctor.User.Name", sortable: true },
  { title: "Patient", key: "Patient.User.Name", sortable: true },
  { title: "Appointment Date", key: "AppointmentDate", sortable: true },
  { title: "Appointment Time", key: "AppointmentTime", sortable: true },
  { title: "Appointment Type", key: "AppointmentType", sortable: true },
  { title: "Appointment Status", key: "AppointmentStatus", sortable: true },
  { title: "Reason For Visit", key: "ReasonForVisit" },
  { title: "Actions", key: "actions", sortable: false },
]);

const fetchClinic = async () => {
  try {
    const response = await HTTP.get(`users/${user.ID}/additional-info`);
    clinic.value = response.data.Clinic;
    console.log("doctors:", clinic.value);
    fetchTodayAppointments();
  } catch (error) {
    console.error(`Error fetching clinic`, error);
  }
};

const todayAppointments = ref([]);

function initialize() {
  fetchClinic();
}

async function fetchTodayAppointments() {
  try {
    const response = await HTTP.get(`/clinic/appointments/${clinic.value.ID}`);
    const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format
    todayAppointments.value = response.data.data.filter((appointment) => {
      return (
        appointment.AppointmentDate === today &&
        appointment.AppointmentStatus !== "Completed" &&
        appointment.AppointmentStatus !== "Cancelled"
      );
    });
  } catch (error) {
    console.error("Error fetching today's appointments:", error);
  }
}

// Method to cancel appointment
const cancelAppointment = async (item) => {
  try {
    // Make HTTP request to update appointment status to Cancelled
    const response = await HTTP.put(`/appointment/${item.ID}`, {
      appointment_status: "Cancelled",
    });
    auth.$patch({
      showAlert: true,
      message: "Appointment cancelled successfully",
      isError: false,
    });
    // Handle response or show notification
    console.log("Appointment cancelled successfully", response);
    initialize();
  } catch (error) {
    console.error("Error cancelling appointment", error);
  }
};

// Method to mark appointment as completed
const completeAppointment = async (item) => {
  try {
    // Make HTTP request to update appointment status to Completed
    const response = await HTTP.put(`/appointment/${item.ID}`, {
      appointment_status: "Completed",
    });
    auth.$patch({
      showAlert: true,
      message: "Appointment completed successfully",
      isError: false,
    });
    // Handle response or show notification
    console.log("Appointment completed successfully", response);
    initialize();
  } catch (error) {
    console.error("Error completing appointment", error);
  }
};

initialize();
</script>
