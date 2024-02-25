// Home Page
<template>
  <v-container class="fill-height">
    <v-responsive class="align-center text-center fill-height">
      <v-card elevation="1" class="px-2 mx-2">
        <LandHero />
        <BookHero />
        <ServicesHero />
      </v-card>
    </v-responsive>
  </v-container>
</template>

<script>
import { useAuth } from "@/store/useAuthentication";
import { useUser } from "@/store/useUser";
import LandHero from "@/components/LandHero.vue";
import BookHero from "@/components/BookHero.vue";
import ServicesHero from "@/components/ServicesHero.vue";
// import ContactUs from "@/components/ContactUs.vue";

export default {
  setup() {
    // store
    const auth = useAuth();
    const user = useUser();
    return {
      auth,
      user,
    };
  },
  components: { LandHero, BookHero, ServicesHero },
};
</script>
