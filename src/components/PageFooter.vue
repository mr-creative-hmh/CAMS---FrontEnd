<template>
  <v-footer
    padless
    color="blue-darken-4"
    app
    style="padding: 0; border-radius: 0"
  >
    <v-card
      tile
      flat
      width="100%"
      color="blue-darken-4"
      blue-darken-3
      height="50px"
      class="d-flex align-center justify-center"
    >
      {{ new Date().getFullYear() }} , made with &nbsp;
      <v-icon color="red">mdi-heart</v-icon> &nbsp;by our Team &copy; , SVU -
      ITE
    </v-card>
  </v-footer>
</template>
