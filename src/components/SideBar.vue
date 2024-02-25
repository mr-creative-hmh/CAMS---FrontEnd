<template>
  <v-navigation-drawer
    color="blue-darken-4"
    app
    density="compact"
    v-model="drawer"
  >
    <!-- Logo and App Title -->
    <template v-slot:prepend>
      <v-list-item lines="two" prepend-avatar="@/assets/Logo/logo.png">
        <h2 class="mt-1">C . A . M . S</h2>
      </v-list-item>
    </template>

    <v-divider></v-divider>

    <v-list-item
      link
      @click="$router.push({ path: getRoleProfile(user.Role) })"
      :prepend-avatar="getRolePhoto(user.Role)"
      :title="user.Name"
      :subtitle="user.Email"
    >
    </v-list-item>

    <v-divider></v-divider>

    <!-- Your list items here -->
    <v-list density="compact" slim nav>
      <v-list-item
        v-for="(item, index) in navigationItems"
        :key="index"
        :prepend-icon="item.icon"
        :title="item.label"
        link
        @click="$router.push({ path: item.route })"
      >
      </v-list-item>
    </v-list>
    <v-divider></v-divider>
    <v-list-item class="mt-2 mb-1" align="center" justify="bottom">
      <v-btn
        color="red-darken-3"
        elevation="4"
        rounded="xl"
        icon="mdi-chevron-left"
        @click="toggleDrawer"
      >
      </v-btn>
    </v-list-item>
  </v-navigation-drawer>
</template>

<script setup>
import { navItems } from "@/store/navItems";
import { useUser } from "@/store/useUser";
import { useAppStore } from "@/store/app";
import { ref, toRef } from "vue";
// import { useDisplay } from "vuetify/lib/framework.mjs";

const navItem = navItems();
const user = useUser();

// const display = ref(useDisplay());
const navigationItems = ref([]);
// Get the sidebarOpen state from the appStore
const appStore = useAppStore();

const drawer = toRef(appStore, "drawer");

// Method to get the role photo URL
const getRolePhoto = (role) => {
  switch (role) {
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

const getRoleProfile = (role) => {
  switch (role) {
    case "Admin":
      return "/admin/userprofile";
    case "Doctor":
      return "/doctor/userprofile";
    case "Patient":
      return "/patient/userprofile";
    case "Clinic Manager":
      return "/clinicmanager/userprofile";
    default:
      return "/"; // URL for default photo or placeholder
  }
};

const getnav = (role) => {
  switch (role) {
    case "Admin":
      return navItem.AdminNav;
    case "Doctor":
      return navItem.DoctorNav;
    case "Patient":
      return navItem.PatientNav;
    case "Clinic Manager":
      return navItem.ClinicManNav;
    default:
      return [{ label: "Home", route: "/" }]; // URL for default photo or placeholder
  }
};
const toggleDrawer = () => {
  appStore.toggleDrawer();
};

navigationItems.value = getnav(user.Role);
</script>
