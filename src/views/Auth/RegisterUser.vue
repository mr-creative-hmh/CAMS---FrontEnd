<template>
  <v-container class="fill-height">
    <v-row align="center" justify="center">
      <v-col cols="12" md="8" lg="10">
        <v-card color="red-lighten-5" class="mx-auto">
          <v-row>
            <v-col cols="12" md="6" align-self="center">
              <v-sheet
                color="transparent"
                elevation="0"
                rounded="lg"
                align="center"
              >
                <v-img src="@/assets/logo/logo.png" height="300" />
                <h1 class="mt-4">C.A.M.S</h1>
                <h2 class="text-green-darken-3">Register</h2>
              </v-sheet>
            </v-col>

            <v-col cols="12" md="6">
              <v-card class="ma-3" color="indigo-lighten-5">
                <v-card-text>
                  <v-form @submit.prevent="register">
                    <v-row>
                      <v-col cols="12" sm="6">
                        <v-text-field
                          v-model="patientData.name"
                          label="Name"
                          color="blue"
                          variant="outlined"
                          required
                          :error-messages="nameErrors"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6">
                        <v-text-field
                          v-model="patientData.email"
                          label="Email"
                          color="blue"
                          variant="outlined"
                          required
                          type="email"
                          :error-messages="emailErrors"
                        ></v-text-field>
                      </v-col>
                    </v-row>

                    <v-row>
                      <v-col cols="12" sm="6">
                        <v-text-field
                          v-model="patientData.password"
                          label="Password"
                          color="blue"
                          variant="outlined"
                          required
                          :append-inner-icon="
                            PasswordVisible ? 'mdi-eye-off' : 'mdi-eye'
                          "
                          :type="PasswordVisible ? 'text' : 'password'"
                          @click:append-inner="
                            PasswordVisible = !PasswordVisible
                          "
                          :error-messages="passwordErrors"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6">
                        <v-text-field
                          v-model="patientData.phone"
                          label="Phone"
                          color="blue"
                          variant="outlined"
                          required
                          type="text"
                          :error-messages="phoneErrors"
                        ></v-text-field>
                      </v-col>
                    </v-row>

                    <v-row>
                      <v-col cols="12" sm="6">
                        <v-text-field
                          v-model="patientData.mobile"
                          label="Mobile"
                          color="blue"
                          variant="outlined"
                          required
                          type="text"
                          :error-messages="mobileErrors"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6">
                        <v-text-field
                          v-model="patientData.address"
                          label="Address"
                          color="blue"
                          variant="outlined"
                          required
                          type="text"
                          :error-messages="addressErrors"
                        ></v-text-field>
                      </v-col>
                    </v-row>

                    <v-row>
                      <v-col cols="12" sm="6">
                        <v-text-field
                          v-model="patientData.date_of_birth"
                          label="Date of Birth"
                          color="blue"
                          variant="outlined"
                          required
                          type="date"
                          :error-messages="dateOfBirthErrors"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6">
                        <v-select
                          v-model="patientData.gender"
                          label="Gender"
                          color="blue"
                          variant="outlined"
                          :items="['Male', 'Female', 'Other']"
                          required
                          :error-messages="genderErrors"
                        ></v-select>
                      </v-col>
                    </v-row>

                    <v-row>
                      <v-col cols="12" sm="6">
                        <v-text-field
                          v-model.number="patientData.weight"
                          label="Weight"
                          color="blue"
                          variant="outlined"
                          outlined
                          type="number"
                          min="0"
                          hide-spin-buttons
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6">
                        <v-text-field
                          v-model.number="patientData.height"
                          label="Height"
                          color="blue"
                          variant="outlined"
                          outlined
                          type="number"
                          min="0"
                          hide-spin-buttons
                        ></v-text-field>
                      </v-col>
                    </v-row>

                    <v-text-field
                      v-model="patientData.additional_info"
                      label="Additional Info"
                      color="blue"
                      variant="outlined"
                      type="text"
                    ></v-text-field>

                    <v-btn
                      type="submit"
                      color="green"
                      rounded="lg"
                      size="large"
                      block
                      class="mt-3"
                      :loading="isLoading"
                    >
                      Register
                      <v-icon end>mdi-account-plus</v-icon>
                    </v-btn>
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
import { ref } from "vue";
import { RegisterPatient } from "@/services";
import { useAuth } from "@/store/useAuthentication";
import { useRouter } from "vue-router";

export default {
  setup() {
    const router = useRouter();
    const auth = useAuth();

    const nameErrors = ref([]);
    const emailErrors = ref([]);
    const passwordErrors = ref([]);
    const phoneErrors = ref([]);
    const mobileErrors = ref([]);
    const addressErrors = ref([]);
    const dateOfBirthErrors = ref([]);
    const genderErrors = ref([]);

    const PasswordVisible = ref(false);

    const isLoading = ref(false); // Initialize loading state

    const handleErrors = (errors) => {
      if (errors.name) {
        nameErrors.value = errors.name;
      }

      if (errors.email) {
        emailErrors.value = errors.email;
      }

      if (errors.password) {
        passwordErrors.value = errors.password;
      }

      if (errors.phone) {
        phoneErrors.value = errors.phone;
      }

      if (errors.mobile) {
        mobileErrors.value = errors.mobile;
      }

      if (errors.address) {
        addressErrors.value = errors.address;
      }

      if (errors.date_of_birth) {
        dateOfBirthErrors.value = errors.date_of_birth;
      }

      if (errors.gender) {
        genderErrors.value = errors.gender;
      }

      // Handle other fields similarly
    };

    const handleResponse = (response) => {
      if (response.error && response.errors) {
        handleErrors(response.errors);
      }
    };

    const patientData = ref({
      name: "",
      email: "",
      password: "",
      phone: "",
      mobile: "",
      address: "",
      date_of_birth: "",
      gender: "Male",
      weight: null,
      height: null,
      additional_info: "",
    });

    // Here, you can perform client-side validation before sending the request

    async function register() {
      // prevent page from reload when submit the form.
      // Your login logic here

      isLoading.value = true; // Set loading state to true when registration starts

      try {
        const response = await RegisterPatient(
          patientData.value.name,
          patientData.value.email,
          patientData.value.password,
          patientData.value.phone,
          patientData.value.mobile,
          patientData.value.address,
          patientData.value.date_of_birth,
          patientData.value.gender,
          parseInt(patientData.value.weight),
          parseInt(patientData.value.height),
          patientData.value.additional_info
        );

        auth.$patch({
          showAlert: true,
          message: response.data.Message,
          isError: false,
        });
        router.push("/login");
      } catch (error) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.errors
        ) {
          console.log("errors:", error.response.data.errors);
          handleErrors(error.response.data.errors);
          auth.$patch({
            showAlert: true,
            message: error.response.data.message,
            isError: true,
          });
        } else {
          auth.$patch({
            showAlert: true,
            message:
              "An error occurred while registering. Please try again later.",
            isError: true,
          });
        }
      } finally {
        isLoading.value = false; // Set loading state to false when registration completes
      }
    }

    return {
      auth,
      patientData,
      nameErrors,
      emailErrors,
      passwordErrors,
      phoneErrors,
      mobileErrors,
      addressErrors,
      dateOfBirthErrors,
      genderErrors,
      handleResponse,
      isLoading,
      PasswordVisible,
      register,
    };
  },
};
</script>
