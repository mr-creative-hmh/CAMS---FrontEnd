<template>
  <v-app-bar class="mb-7" color="teal-darken-4" tile app>
    <template v-slot:image>
      <v-img
        gradient="to top right, rgba(255, 0, 0, 0.5), rgba(0, 0, 255, 0.2)"
      ></v-img>
    </template>

    <!-- SideBar Toggle -->

    <!-- Logo and App Title -->
    <template v-slot:prepend>
      <v-btn icon @click="toggleDrawer" v-if="auth.isAuthenticated">
        <v-icon>mdi-menu</v-icon>
      </v-btn>

      <v-list-item
        lines="three"
        prepend-avatar="@/assets/logo/logo.png"
        @click="navigateTo('/')"
        v-if="!display.smAndDown"
      >
        <h3 class="mt-1">Clinics Appointments Management System</h3>
      </v-list-item>
      <v-list-item
        lines="three"
        prepend-avatar="@/assets/logo/logo.png"
        @click="navigateTo('/')"
        v-if="display.smAndDown"
      >
        <h2 class="mt-1">C . A . M . S</h2>
      </v-list-item>
    </template>

    <!-- Navigation Links - Desktop Mode -->
    <template v-if="!display.smAndDown">
      <div v-if="!auth.isAuthenticated" class="mr-4">
        <v-btn
          v-for="(item, index) in navigationItems"
          :key="index"
          :prepend-icon="item.icon"
          color="pink-lighten-5"
          variant="outlined"
          rounded="lg"
          class="mr-2"
          @click="navigateTo(item.route)"
        >
          {{ item.label }}
        </v-btn>
      </div>
      <!-- <v-list-item
        @click="$router.push({ path: getRoleProfile(user.Role) })"
        :prepend-avatar="getRolePhoto(user.Role)"
        :title="user.Name"
        :subtitle="user.Email"
        v-if="auth.isAuthenticated"
      >
      </v-list-item>
      <v-list-item v-if="auth.isAuthenticated">
        <template v-slot:append>
          <strong :style="{ color: getRoleColor(user.Role) }">
            {{ user.Role }}
            <v-icon
              end
              icon="mdi-account-box"
              :color="getRoleColor(user.Role)"
            ></v-icon
          ></strong>
        </template>
      </v-list-item> -->

      <!-- Login/Logout Button -->
      <v-btn
        v-if="!auth.isAuthenticated"
        rounded="lg"
        variant="outlined"
        color="blue"
        elevation="4"
        @click="navigateTo('/login')"
      >
        Login
        <v-icon end icon="mdi-login" />
      </v-btn>
      <v-btn
        color="red"
        rounded="lg"
        variant="outlined"
        class="mr-2 ml-3"
        v-if="!auth.isAuthenticated"
        @click="navigateTo('/register')"
      >
        Register
        <v-icon end size="large" icon="mdi-account-plus"></v-icon>
      </v-btn>
      <v-btn
        v-else
        rounded="lg"
        variant="outlined"
        color="red"
        elevation="4"
        @click="handleLogout"
      >
        Logout
        <v-icon end icon="mdi-logout" />
      </v-btn>
    </template>

    <!-- Mobile Menu - Hamburger Icon -->
    <v-menu bottom left :close-on-content-click="true" v-if="display.smAndDown">
      <template v-slot:activator="{ props }">
        <v-btn icon="mdi-dots-vertical" v-bind="props"></v-btn>
      </template>
      <v-card min-width="300">
        <v-list v-if="auth.isAuthenticated">
          <v-list-item
            :prepend-avatar="getRolePhoto(user.Role)"
            :title="user.Name"
            :subtitle="user.Email"
            link
            @click="$router.push({ path: getRoleProfile(user.Role) })"
          >
            <template v-slot:append>
              <strong :style="{ color: getRoleColor(user.Role) }"
                >{{ user.Role }}
                <v-icon
                  end
                  icon="mdi-account-box"
                  :color="getRoleColor(user.Role)"
                ></v-icon
              ></strong>
            </template>
          </v-list-item>
        </v-list>

        <v-divider></v-divider>

        <v-list>
          <div v-if="!auth.isAuthenticated">
            <v-list-item
              v-for="(item, index) in navigationItems"
              :key="index"
              text
              @click="navigateTo(item.route)"
            >
              <v-list-item-title>
                <strong>{{ item.label }}</strong>
              </v-list-item-title>
            </v-list-item>

            <v-divider></v-divider>
          </div>
          <v-list-item class="mt-2">
            <!-- Login/Logout Button -->
            <v-btn
              v-if="!auth.isAuthenticated"
              rounded="lg"
              color="blue"
              @click="navigateTo('/login')"
              class="mr-2 ml-3"
            >
              Login
              <v-icon end size="large" icon="mdi-login" />
            </v-btn>
            <v-btn
              color="red"
              rounded="lg"
              class="mr-2 ml-3"
              v-if="!auth.isAuthenticated"
              @click="navigateTo('/register')"
            >
              Register
              <v-icon
                end
                size="large"
                icon="mdi-checkbox-marked-circle"
              ></v-icon>
            </v-btn>

            <v-btn v-else block rounded="lg" color="red" @click="handleLogout">
              Logout
              <v-icon end icon="mdi-logout" />
            </v-btn>
          </v-list-item>
        </v-list>
      </v-card>
    </v-menu>
  </v-app-bar>
</template>

<script>
import { useAuth } from "@/store/useAuthentication";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useDisplay } from "vuetify";
import { useUser } from "@/store/useUser";
import { useAppStore } from "@/store/app";

export default {
  setup() {
    // Store
    const auth = useAuth();
    const user = useUser();
    const router = useRouter();
    const appStore = useAppStore();
    const display = ref(useDisplay());
    const navigationItems = ref([
      { label: "Home", icon: "mdi-home", route: "/" },
      {
        label: "Doctors Schedules",
        icon: "mdi-clipboard-text-clock",
        route: "/doctorschedules",
      },
      { label: "About", icon: "mdi-information", route: "/about" },
      // Add more items as needed
    ]);

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

    const getRoleColor = (role) => {
      switch (role) {
        case "Admin":
          return "red ";
        case "Doctor":
          return "green";
        case "Patient":
          return "gray";
        case "Clinic Manager":
          return "orange";
        default:
          return "black"; // URL for default photo or placeholder
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

    // Methods
    const navigateTo = (path) => {
      router.push(path);
    };

    const handleLogout = async () => {
      await auth.logout();
      navigateTo("/");
    };

    const toggleDrawer = () => {
      appStore.toggleDrawer();
    };

    // Computed Property to determine if the screen is desktop
    const isDesktop = window.innerWidth >= 600; // Adjust breakpoint as needed

    return {
      auth,
      user,
      navigationItems,
      getRolePhoto,
      getRoleColor,
      getRoleProfile,
      navigateTo,
      handleLogout,
      display,
      isDesktop,
      toggleDrawer,
    };
  },
};
</script>
