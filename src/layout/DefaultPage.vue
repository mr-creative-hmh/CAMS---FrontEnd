<template>
  <!-- App.vue -->

  <v-app>
    <!-- <NavDrawer app>

    </NavDrawer> -->

    <DefaultBar app>
      <!-- -->
    </DefaultBar>

    <!-- Sizes your content based upon application components -->
    <v-main>
      <!-- Provides the application the proper gutter -->
      <v-container fluid>
        <!-- If using vue-router -->
        <router-view></router-view>
      </v-container>
      <SnackBar />
    </v-main>
    <DefaultFooter app> </DefaultFooter>
  </v-app>
</template>

<script setup>
import DefaultBar from "@/components/AppBar.vue";
import DefaultFooter from "@/components/PageFooter.vue";

import SnackBar from "@/components/SnackBar.vue";

// import NavDrawer from '@/components/NavDrawer.vue';
// import { computed, unref } from 'vue'
// import { useDisplay } from 'vuetify';

// const display = useDisplay()

// const isMobile = computed(() => {
//   return unref(display.mobile)
// })
</script>
