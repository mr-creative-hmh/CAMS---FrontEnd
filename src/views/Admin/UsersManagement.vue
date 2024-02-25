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
import UsersTable from "@/components/DataTables/UsersTable.vue"; // Import UsersTable component
import ClinicManagersTable from "@/components/DataTables/ClinicManagersTable.vue"; // Import ClinicManagersTable component
import DoctorsTable from "@/components/DataTables/DoctorsTable.vue";
import PatientsTable from "@/components/DataTables/PatientsTable.vue";
// Import other user table components as needed

const tab = ref(null);
const tabs = ["Users", "Clinic Managers", "Doctors", "Patients"]; // Define tab names

// Define function to get the selected component based on tab index
const selectedComponent = (index) => {
  switch (index) {
    case 0:
      return UsersTable; // Load UsersTable component when tab index is 0 (Users)
    case 1:
      return ClinicManagersTable; // Load ClinicManagersTable component when tab index is 1 (Clinic Managers)
    case 2:
      return DoctorsTable; // Load DoctorsTable component when tab index is 2 (Doctors)
    case 3:
      return PatientsTable; // Load PatientsTable component when tab index is 3 (Patients)
    default:
      return null; // Return null if tab index is invalid
  }
};
</script>

<style scoped>
/* Add custom styles here */
</style>
