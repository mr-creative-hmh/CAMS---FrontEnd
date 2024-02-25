
<template>
    <v-bottom-navigation :active="display.smAndDown" color="indigo">
      <v-btn>
      BTN 1
      </v-btn>
      <v-btn>
        BTN 2
        </v-btn>
        <v-btn>
        BTN 3
        </v-btn>
        <v-btn>
        BTN 4
        </v-btn>
        <v-btn>
        BTN 5
        </v-btn>
        <v-btn>
        BTN 6
        </v-btn>
        <v-btn>
        BTN 7
        </v-btn>
        <v-btn>
        BTN 8
        </v-btn>
    </v-bottom-navigation>
</template>

<script>

import { ref } from "vue";
import { useRouter } from "vue-router";
import { useDisplay } from "vuetify";



export default {
  setup() {

    const display = ref(useDisplay());
    // const navItems = ref(
    //   AdminNav
    //   [
    //     { label: "Dashboard", route: "" },
    //     { label: "Users Managment", route: "" },
    //     { label: "Roles Managment", route: "" },
    //     { label: "Categories Managment", route: "" },
    //     { label: "Specializations Managment", route: "" },
    //     { label: "Clinics Managment", route: "" },
    //     { label: "Doctors Schedules Managment", route: "" },
    //     { label: "Appointments Managment", route: "" },
    //     { label: "Medical Records Managment", route: "" },
    //   ],
    //   ClinicManNav
    //   [
    //     { label: "Dashboard", route: "" },
    //     { label: "Today Appointments", route: "" },
    //     { label: "Appointments Managment", route: "" },
    //     { label: "Patients Managment", route: "" },
    //     { label: "Doctors Managment", route: "" },
    //   ],
    //   DoctorNav
    //   [
    //     { label: "Dashboard", route: "" },
    //     { label: "Today Appointments", route: "" },
    //     { label: "Patients Managment", route: "" },
    //   ],
    //   PatientNav
    //   [
    //     { label: "Book Appointment", route: "" },
    //     { label: "My Appointments", route: "" },
    //     { label: "My Medical Records", route: "" },
    //   ]

    // );






    const router = useRouter();
    const navigateTo = (path) => {
        router.push(path);
      };

    return {
      display,
      navigateTo,
    };
  },
  data: () => ({ active: true }),
}
</script>
