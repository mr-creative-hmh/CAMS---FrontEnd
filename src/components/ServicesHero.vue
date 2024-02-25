<!--
* @Component:
* @Maintainer: J.K. Yang
* @Description:
-->
<script setup>
const services = [
  {
    name: "Clinics Managment",
    icon: "mdi-hospital-building",
    logo: "@/assets/images/services/clinics.jpg",
  },
  {
    name: "Doctors Managment",
    icon: "mdi-doctor",
    logo: "@/assets/images/services/doctors.jpg",
  },
  {
    name: "Patients Managment",
    icon: "mdi-account",
    logo: "@/assets/images/services/patients.jpg",
  },
  {
    name: "Doctors Schedules Managment",
    icon: "mdi-calendar-clock",
    logo: "@/assets/images/services/doctorschedules.jpg",
  },
  {
    name: "Appointments Managment",
    icon: "mdi-calendar",
    logo: "@/assets/images/services/appointments.jpg",
  },
  {
    name: "Medical Records Managment",
    icon: "mdi-file-multiple",
    logo: "@/assets/images/services/medicalrecords.jpg",
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
