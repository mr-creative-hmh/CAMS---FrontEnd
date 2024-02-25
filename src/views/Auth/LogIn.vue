<template>
  <v-container fill-height fluid>
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
                <v-img src="@/assets/logo/logo.png" height="250" />
                <h1 class="mt-4">C.A.M.S</h1>
                <h2 class="text-blue-darken-3">Login</h2>
              </v-sheet>
            </v-col>
            <v-col cols="12" md="6">
              <v-card class="ma-3" color="indigo-lighten-5">
                <v-card-text>
                  <h3 class="text-center">
                    Sign in with your Email and Password:
                  </h3>
                  <br />
                  <br />
                  <br />
                  <v-form @submit.prevent="login">
                    <v-text-field
                      v-model="email"
                      label="Email"
                      color="blue"
                      variant="outlined"
                      required
                    ></v-text-field>

                    <v-text-field
                      v-model="password"
                      label="Password"
                      color="blue"
                      variant="outlined"
                      required
                      :append-inner-icon="
                        showPassword ? 'mdi-eye' : 'mdi-eye-off'
                      "
                      :type="showPassword ? 'text' : 'password'"
                      @click:append-inner="showPassword = !showPassword"
                    ></v-text-field>

                    <v-btn
                      type="submit"
                      color="blue-darken-3"
                      rounded="lg"
                      size="large"
                      block
                      class="mt-1"
                      :loading="isLoading"
                    >
                      <v-icon start>mdi-login</v-icon>
                      Login
                    </v-btn>
                    <br />
                    <h4>
                      Not a registered user ?.
                      <router-link to="/register"
                        ><v-btn variant="tonal" color="success" size="small"
                          >Register Here</v-btn
                        ></router-link
                      >
                    </h4>
                  </v-form>
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
import router from "@/router";
import { Login } from "@/services";
import { ref, onMounted } from "vue";
import { useAuth } from "@/store/useAuthentication";
import { useUser } from "@/store/useUser";

export default {
  setup() {
    const auth = useAuth();
    const userData = useUser();
    const email = ref("");
    const password = ref("");
    const isLoading = ref(false); // Initialize loading state
    // show password field
    const showPassword = ref(false);

    onMounted(() => {
      const token = localStorage.getItem("token");
      if (token) router.push({ path: "/" });
    });
    async function login(e) {
      isLoading.value = true;
      // prevent page from reload when submit the form.
      e.preventDefault();
      // Your login logic here
      try {
        const result = await Login(email.value, password.value);
        userData.$patch({
          ID: result.data.Data.user.ID,
          Name: result.data.Data.user.Name,
          Email: result.data.Data.user.Email,
          Phone: result.data.Data.user.Phone,
          Mobile: result.data.Data.user.Mobile,
          Address: result.data.Data.user.Address,
          DateOfBirth: result.data.Data.user.DateOfBirth,
          Gender: result.data.Data.user.Gender,
          Role: result.data.Data.role.RoleName,
        });
        auth.$patch({
          isAuthenticated: true,
          showAlert: true,
          message: result.data.Message,
          isError: false,
        });
        router.replace("/");
      } catch (error) {
        auth.$patch({
          showAlert: true,
          message: "Email or Password are not Correct!",
          isError: true,
        });
      } finally {
        isLoading.value = false;
      }
    }
    return {
      email,
      password,
      isLoading,
      showPassword,
      login,
    };
  },
};
</script>
