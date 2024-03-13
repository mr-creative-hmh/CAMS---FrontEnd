<template>
  <!-- App.vue -->

  <v-app>
    <AppBar app>
      <!-- -->
    </AppBar>

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
import AppBar from "@/components/AppBar.vue";
import DefaultFooter from "@/components/PageFooter.vue";
import SnackBar from "@/components/SnackBar.vue";
</script>
