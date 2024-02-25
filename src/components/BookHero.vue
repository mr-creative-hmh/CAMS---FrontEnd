<template>
  <v-sheet
    elevation="0"
    class="mx-auto landing-warpper text-left"
    rounded
    theme="light"
  >
    <v-sheet
      elevation="0"
      color="transparent"
      max-width="1600 "
      class="mx-auto my-10"
    >
      <v-row no-gutters align="stretch">
        <v-col cols="12">
          <v-card
            elevation="0"
            height="100%"
            class="mx-auto pa-10 pa-md-15 d-flex flex-column justify-center"
          >
            <div>
              <v-card-title class="text-info font-weight-bold text-h5">
                BOOK WITH US
              </v-card-title>
              <h1 class="font-weight-black text-h3 mt-5 mb-10">
                Let's get you
                <span class="text-success">Started</span>
                with Us.
              </h1>
              <h4>benifit from our book appointments service.</h4>
              <router-link to="/register">
                <v-btn
                  color="green-darken-4"
                  rounded="lg"
                  min-width="228"
                  rel="noopener noreferrer"
                  size="large"
                  class="mt-10"
                >
                  Register Now!
                  <v-icon
                    size="large"
                    end
                    icon="mdi-checkbox-marked-circle"
                  ></v-icon>
                </v-btn>
              </router-link>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12">
          <v-card height="100%"> </v-card>
        </v-col>
      </v-row>
    </v-sheet>
  </v-sheet>
</template>
