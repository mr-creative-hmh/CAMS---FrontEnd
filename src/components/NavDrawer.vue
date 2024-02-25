<template>
      <v-navigation-drawer
        color="primary"

        app
      >

      <v-list>
            <v-list-item
              prepend-avatar="https://randomuser.me/api/portraits/women/85.jpg"
              title = "User Name"
              subtitle = "User Email"
            ></v-list-item>
          </v-list>
      <v-divider></v-divider>
      <v-list-item link title="Home"></v-list-item>
      <v-list-item link title="Clinics"></v-list-item>
      <v-list-item link title="About"></v-list-item>



    </v-navigation-drawer>
</template>
<script>
import { useAuth } from '@/store/useAuthentication';
import { useUser } from '@/store/useUser';

export default {
  setup() {
    // store
    const auth = useAuth();
    const user = useUser();

    return {
      auth,
      user
    }
  },
}
</script>

