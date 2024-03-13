<template>
  <!-- App.vue -->

  <v-app>
    <v-layout>
      <SideBar app>
        <!-- -->
      </SideBar>

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

      <DefaultFooter app>
        <!-- -->
      </DefaultFooter>
    </v-layout>
  </v-app>
</template>

<script setup>
import AppBar from "@/components/AppBar.vue";
import DefaultFooter from "@/components/PageFooter.vue";
import SnackBar from "@/components/SnackBar.vue";
import SideBar from "@/components/SideBar.vue";
</script>
