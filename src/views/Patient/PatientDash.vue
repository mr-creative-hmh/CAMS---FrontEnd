<template>
  <v-container fill-height fluid>
    <v-row>
      <v-col>
        <v-card class="pa-4 mb-5">
          <v-list-item
            lines="three"
            prepend-avatar="@/assets/images/roles/Patient.png"
          >
            <h2 class="mt-1">
              Welcome Patient:
              <span class="text-green-darken-3">
                {{ user.Name }}
              </span>
            </h2>
          </v-list-item>

          <v-divider></v-divider>
          <v-card-text> We're Glad to have you here. </v-card-text>
        </v-card>

        <LandHero />
      </v-col>
    </v-row>
  </v-container>
</template>
<script setup>
import LandHero from "@/components/LandHero.vue";
import { useUser } from "@/store/useUser";

const user = useUser();
</script>
