<template>
  <div>
    <v-tabs v-model="tab" grow>
      <v-tab v-for="(item, index) in tabs" :key="index">{{ item }}</v-tab>
    </v-tabs>

    <v-window v-model="tab">
      <v-window-item v-for="(item, index) in tabs" :key="index">
        <component :is="selectedComponent(index)" />
      </v-window-item>
    </v-window>
  </div>
</template>

<script setup>
import { ref } from "vue";
import ClinicsTable from "@/components/DataTables/ClinicsTable.vue";
import ClinicDoctors from "@/components/ClinicDoctors.vue";
import ClinicPatients from "@/components/ClinicPatients.vue";
// Import other user table components as needed

const tab = ref(null);
const tabs = ["Clinics", "Clinics Doctors", "Clinic Patients"]; // Define tab names

// Define function to get the selected component based on tab index
const selectedComponent = (index) => {
  switch (index) {
    case 0:
      return ClinicsTable;
    case 1:
      return ClinicDoctors;
    case 2:
      return ClinicPatients;
    default:
      return null; // Return null if tab index is invalid
  }
};
</script>
