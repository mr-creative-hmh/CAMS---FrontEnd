<template>
  <v-container fluid align="center" justify="center">
    <v-row align="center" justify="center">
      <v-col cols="12" md="6">
        <v-card color="red-lighten-5" class="mx-auto">
          <v-row>
            <v-col cols="12" md="6" align-self="center">
              <v-sheet
                color="transparent"
                elevation="0"
                rounded="lg"
                align="center"
                justify="center"
              >
                <v-img height="300" src="@/assets/logo/logo.png" />
                <v-card-title class="text-center"
                  >About Our
                  <h5>
                    <strong class="text-blue-lighten-1">C</strong>linic
                    <strong class="text-blue-lighten-1">A</strong>ppointments
                    <strong class="text-blue-lighten-1">M</strong>anagement
                    <strong class="text-blue-lighten-1">S</strong>ystem
                  </h5>
                </v-card-title>
              </v-sheet>
            </v-col>
            <v-col cols="12" md="6">
              <v-card class="ma-3" color="indigo-lighten-5">
                <v-card-text align="left" class="ma-5 ml-8 mr-8 pa-5">
                  <p class="font-weight-black">
                    Our clinic appointments management system is designed to
                    streamline the process of managing appointments, scheduling,
                    and patient information for clinics of all sizes. Whether
                    you're a small private practice or a large medical facility,
                    our system provides robust features to meet your needs.
                  </p>
                  <br />
                  <p class="font-weight-medium">
                    Key features of our clinic appointments management system
                    include:
                  </p>
                  <br />
                  <ul>
                    <li>
                      Efficient appointment scheduling for doctors and patients
                    </li>
                    <li>
                      Real-time availability of doctors and appointment slots
                    </li>
                    <li>Secure patient information management</li>
                    <li>Customizable settings and preferences</li>
                  </ul>
                  <br />
                  <p class="font-weight-medium">
                    Our goal is to provide a user-friendly and efficient
                    solution that enhances the patient experience and improves
                    clinic operations.
                  </p>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "AboutApp",
};
</script>

<style scoped>
.about-app-card {
  max-width: 800px;
  margin-top: 30px;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
}

@media screen and (max-width: 600px) {
  .about-app-card {
    max-width: 100%;
  }
}
</style>
