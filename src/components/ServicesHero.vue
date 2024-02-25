<!--
* @Component:
* @Maintainer: J.K. Yang
* @Description:
-->

<script setup>
import clinicsImage from "@/assets/images/services/clinics.jpg";
import doctorsImage from "@/assets/images/services/doctors.jpg";
import patientsImage from "@/assets/images/services/patients.jpg";
import doctorSchedulesImage from "@/assets/images/services/doctorschedules.jpg";
import appointmentsImage from "@/assets/images/services/appointments.jpg";
import medicalRecordsImage from "@/assets/images/services/medicalrecords.jpg";

const services = [
  {
    name: "Clinics Managment",
    icon: "mdi-hospital-building",
    logo: clinicsImage,
  },
  {
    name: "Doctors Managment",
    icon: "mdi-doctor",
    logo: doctorsImage,
  },
  {
    name: "Patients Managment",
    icon: "mdi-account",
    logo: patientsImage,
  },
  {
    name: "Doctors Schedules Managment",
    icon: "mdi-calendar-clock",
    logo: doctorSchedulesImage,
  },
  {
    name: "Appointments Managment",
    icon: "mdi-calendar",
    logo: appointmentsImage,
  },
  {
    name: "Medical Records Managment",
    icon: "mdi-file-multiple",
    logo: medicalRecordsImage,
  },
];
</script>

<template>
  <v-sheet
    elevation="0"
    class="mx-auto landing-warpper text-left"
    rounded="lg"
    color="#F2F5F8"
  >
    <v-sheet
      elevation="0"
      color="transparent"
      max-width="1400"
      class="mx-auto my-10 pa-5"
    >
      <h1 class="text-h3 text-center my-10 font-weight-bold text-blue-darken-4">
        Our Services
      </h1>
      <v-container>
        <v-row align="stretch">
          <v-col
            cols="12"
            md="4"
            v-for="service in services"
            :key="service.name"
          >
            <v-card
              class="base-card mx-auto d-flex flex-column justify-center"
              max-width="400"
              rounded="lg"
              hover
            >
              <v-card-title
                class="text-center text-h6 text-light-blue-darken-4 mb-3 mt-2"
              >
                <v-icon start size="x-large">{{ service.icon }}</v-icon>
                {{ service.name }}
              </v-card-title>
              <v-img cover :src="service.logo" />
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-sheet>
  </v-sheet>
</template>
