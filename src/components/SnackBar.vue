<template>
  <v-snackbar
    v-model="auth.showAlert"
    :color="auth.isError ? 'red' : 'green'"
  >
    {{ auth.message }}

    <template v-slot:actions>
      <v-btn
        color="white"
        variant="text"
        @click="auth.showAlert = false"
      >
        X
      </v-btn>
    </template>

  </v-snackbar>
</template>
<script>
  import {useAuth} from '@/store/useAuthentication';

  export default {
    setup() {
        const auth = useAuth();
        return{
          auth
        }
  },
}
</script>
