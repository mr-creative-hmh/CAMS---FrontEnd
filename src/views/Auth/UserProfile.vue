<template>
  <v-container fill-height fluid align="center">
    <template v-if="loading">
      <!-- Skeleton loading markup -->
      <v-skeleton-loader
        :loading="loading"
        class="mx-auto border"
        max-width="900"
        type="image,text@1,text@1,text@1,text@1,text@1,text@1,text@1, divider ,sentences , actions"
      ></v-skeleton-loader>
    </template>
    <!-- Display user information -->
    <template v-else>
      <v-row align="center" justify="center">
        <v-col cols="12" md="7">
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
                  <v-avatar
                    color="grey"
                    size="300"
                    rounded="10"
                    class="mb-4 mt-4"
                  >
                    <v-img :src="getRolePhoto(userData.Role.RoleName)" />
                  </v-avatar>
                  <v-card-title>
                    {{ userData.Name }}
                  </v-card-title>
                  <v-chip
                    :color="getRoleColor(userData.Role.RoleName)"
                    size="large"
                    variant="outlined"
                    append-icon="mdi-account-circle"
                    rounded="xl"
                    class="mb-2"
                    label
                  >
                    {{ userData.Role.RoleName }}
                  </v-chip>
                </v-sheet>
              </v-col>
              <v-col cols="12" md="6">
                <v-card class="ma-3">
                  <v-list class="mb-4 mt-4 ml-5 mr-5">
                    <v-list-item
                      v-for="(value, key) in formattedUserData"
                      :key="key"
                      align="left"
                    >
                      <v-list-item-title
                        ><strong>{{ key }}</strong>
                        {{ value }}</v-list-item-title
                      >
                    </v-list-item>
                    <!-- Display additional information -->
                    <template v-if="userData.additionalInfo">
                      <v-list-item
                        v-for="(info, index) in userData.additionalInfo"
                        :key="index"
                        align="left"
                      >
                        <v-list-item-title
                          v-for="(value, key) in info"
                          :key="key"
                        >
                          <strong>{{ key }}:</strong> {{ value }}
                        </v-list-item-title>
                      </v-list-item>
                    </template>
                  </v-list>
                  <v-divider></v-divider>
                  <v-container>
                    <!-- Buttons to open dialogs -->
                    <v-btn
                      @click="editDataDialog = true"
                      class="ml-2 mr-2 mb-2"
                      color="info"
                      >Edit Data</v-btn
                    >
                    <v-btn
                      @click="changePasswordDialog = true"
                      class="ml-2 mr-2 mb-2"
                      color="green"
                      >Change Password</v-btn
                    >
                  </v-container>
                </v-card>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </template>
    <!-- Edit Data Dialog -->
    <v-dialog v-model="editDataDialog" max-width="600px">
      <v-card>
        <v-toolbar color="info" title="Edit Profile Data"></v-toolbar>
        <v-card-text>
          <v-text-field v-model="userData.Name" label="Name"></v-text-field>
          <v-text-field v-model="userData.Phone" label="Phone"></v-text-field>
          <v-text-field v-model="userData.Mobile" label="Mobile"></v-text-field>
          <v-text-field
            v-model="userData.Address"
            label="Address"
          ></v-text-field>
          <v-text-field
            v-model="userData.DateOfBirth"
            type="date"
            label="Date of Birth"
          ></v-text-field>
          <v-select
            v-model="userData.Gender"
            label="Gender"
            :items="['Male', 'Female', 'Other']"
          ></v-select>
          <v-text-field
            v-model="userData.Role.RoleName"
            label="Role"
            disabled
          ></v-text-field>
          <!-- Additional input fields based on role -->
          <template v-if="userData.Role.RoleName === 'Doctor'">
            <v-text-field
              v-model="userData.additionalInfo[0].Specialization"
              label="Specialization"
              disabled
            ></v-text-field>
            <v-text-field
              v-model="userData.additionalInfo[1].Experience"
              label="Experience"
            ></v-text-field>
            <v-text-field
              v-model="userData.additionalInfo[2].Additional_Info"
              label="Additional Info"
            ></v-text-field>
          </template>
          <template v-else-if="userData.Role.RoleName === 'Patient'">
            <v-text-field
              v-model="userData.additionalInfo[0].Weight"
              label="Weight"
            ></v-text-field>
            <v-text-field
              v-model="userData.additionalInfo[1].Height"
              label="Height"
            ></v-text-field>
            <v-text-field
              v-model="userData.additionalInfo[2].Additional_Info"
              label="Additional Info"
            ></v-text-field>
          </template>
          <template v-else-if="userData.Role.RoleName === 'Clinic Manager'">
            <v-text-field
              v-model="userData.additionalInfo[0].Additional_Info"
              label="Additional Info"
            ></v-text-field>
          </template>
        </v-card-text>
        <v-card-actions>
          <v-btn color="blue darken-1" @click="saveUserData">Save</v-btn>
          <v-btn color="grey darken-3" @click="editDataDialog = false"
            >Cancel</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Change Password Dialog -->
    <v-dialog v-model="changePasswordDialog" max-width="600px">
      <v-card>
        <v-toolbar color="green" title="Change Password"></v-toolbar>
        <v-card-text>
          <!-- Current Password -->
          <v-text-field
            v-model="currentPassword"
            :append-inner-icon="
              currentPasswordVisible ? 'mdi-eye-off' : 'mdi-eye'
            "
            :type="currentPasswordVisible ? 'text' : 'password'"
            @click:append-inner="
              currentPasswordVisible = !currentPasswordVisible
            "
            label="Current Password"
          ></v-text-field>

          <!-- New Password -->
          <v-text-field
            v-model="newPassword"
            :append-inner-icon="newPasswordVisible ? 'mdi-eye-off' : 'mdi-eye'"
            :type="newPasswordVisible ? 'text' : 'password'"
            @click:append-inner="newPasswordVisible = !newPasswordVisible"
            label="New Password"
          ></v-text-field>

          <!-- Confirm New Password -->
          <v-text-field
            v-model="confirmPassword"
            :append-inner-icon="
              confirmPasswordVisible ? 'mdi-eye-off' : 'mdi-eye'
            "
            :type="confirmPasswordVisible ? 'text' : 'password'"
            @click:append-inner="
              confirmPasswordVisible = !confirmPasswordVisible
            "
            label="Confirm New Password"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn
            color="blue darken-1"
            variant="outlined"
            @click="changePassword"
            >Change Password</v-btn
          >
          <v-btn
            color="grey darken-3"
            variant="outlined"
            @click="changePasswordDialog = false"
            >Cancel</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { ref } from "vue";
import { useUser } from "@/store/useUser";
import { HTTP } from "@/config";
import { API_AUTH } from "@/api";
import { useAuth } from "@/store/useAuthentication";
import { computed, onMounted } from "vue";

export default {
  setup() {
    const user = useUser();
    const auth = useAuth();

    // User data properties
    const userData = ref({});
    const userID = ref("");
    // Define loading state variable
    const loading = ref(true);

    // Dialog states
    const editDataDialog = ref(false);
    const changePasswordDialog = ref(false);

    // New password and confirm password
    const currentPassword = ref("");
    const newPassword = ref("");
    const confirmPassword = ref("");

    const currentPasswordVisible = ref(false);
    const newPasswordVisible = ref(false);
    const confirmPasswordVisible = ref(false);

    const getRoleColor = (role) => {
      switch (role) {
        case "Admin":
          return "red ";
        case "Doctor":
          return "green";
        case "Patient":
          return "gray";
        case "Clinic Manager":
          return "orange";
        default:
          return "black"; // URL for default photo or placeholder
      }
    };

    // Method to fetch user data
    const fetchUserData = async () => {
      try {
        console.log("Fetching user data...");
        const response = await HTTP.get(`/user/${user.ID}`);
        console.log("User data responce:", response.data.data);
        userData.value = response.data.data;
        if (userData.value.Role.RoleName !== "Admin") {
          const userResponse = await HTTP.get(
            `users/${userData.value.ID}/additional-info`
          );
          let addInfo = null;
          // Retrieve additional information based on user's role
          switch (userData.value.Role.RoleName) {
            case "Doctor":
              userID.value = userResponse.data.ID;
              addInfo = [
                { Specialization: userResponse.data.specialization.name },
                { Experience: userResponse.data.experience },
                { Additional_Info: userResponse.data.additional_info },
              ];
              userData.value.additionalInfo = addInfo;
              break;
            case "Patient":
              userID.value = userResponse.data.ID;
              addInfo = [
                { Weight: userResponse.data.weight },
                { Height: userResponse.data.height },
                { Additional_Info: userResponse.data.additional_info },
              ];
              userData.value.additionalInfo = addInfo;
              break;
            case "Clinic Manager":
              userID.value = userResponse.data.ID;
              addInfo = [
                { Additional_Info: userResponse.data.additional_info },
              ];
              userData.value.additionalInfo = addInfo;
              break;
            default:
              // No additional information for other roles
              userData.value.additionalInfo = null;
          }
        }
        console.log("User data:", userData.value);
        // Once fetchUserData is completed, set loading to false
        loading.value = false;
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    // Fetch user data on component mounted
    onMounted(async () => {
      await fetchUserData();
    });
    // Define the computed property to format the user data
    const formattedUserData = computed(() => {
      return {
        "Email:": userData.value.Email,
        "Phone:": userData.value.Phone,
        "Mobile:": userData.value.Mobile,
        "Address:": userData.value.Address,
        "Date Of Birth:": userData.value.DateOfBirth,
        "Gender:": userData.value.Gender,
      };
    });

    // Method to save edited user data
    const saveUserData = async () => {
      try {
        let requestData = {
          name: userData.value.Name,
          phone: userData.value.Phone,
          date_of_birth: userData.value.DateOfBirth,
          address: userData.value.Address,
          mobile: userData.value.Mobile,
        };

        // Check if the role is not "Admin"
        if (userData.value.Role.RoleName !== "Admin") {
          switch (userData.value.Role.RoleName) {
            case "Clinic Manager":
              requestData = {
                ...requestData,
                additional_info:
                  userData.value.additionalInfo[0].Additional_Info,
              };
              await HTTP.put(`/clinicmanager/${userID.value}`, requestData);
              break;
            case "Doctor":
              requestData = {
                ...requestData,
                experience: userData.value.additionalInfo[0].Experience,
                additional_info:
                  userData.value.additionalInfo[1].Additional_Info,
              };
              await HTTP.put(`/doctor/${userID.value}`, requestData);
              break;
            case "Patient":
              requestData = {
                ...requestData,
                weight: userData.value.additionalInfo[0].Weight,
                height: userData.value.additionalInfo[1].Height,
                additional_info:
                  userData.value.additionalInfo[2].Additional_Info,
              };
              await HTTP.put(`/patient/${userID.value}`, requestData);
              break;
            default:
              console.error("Role not recognized");
              return;
          }
        } else {
          await HTTP.put(`/user/${userData.value.ID}`, requestData);
        }

        auth.$patch({
          showAlert: true,
          message: "User data updated successfully",
          isError: false,
        });

        // Set New User Data
        localStorage.setItem("Name", userData.value.Name);
        localStorage.setItem("Email", userData.value.Email);
        localStorage.setItem("Phone", userData.value.Phone);
        localStorage.setItem("Mobile", userData.value.Mobile);
        localStorage.setItem("Address", userData.value.Address);
        localStorage.setItem("DateOfBirth", userData.value.DateOfBirth);

        editDataDialog.value = false;
        await fetchUserData();
      } catch (error) {
        console.error("Error saving user data:", error);
      }
    };

    // Method to change user password
    const changePassword = async () => {
      try {
        if (newPassword.value !== confirmPassword.value) {
          auth.$patch({
            showAlert: true,
            message: "new password and confirm password do not match",
            isError: true,
          });
          console.error("New password and confirm password do not match");
          return;
        }
        const response = await HTTP.post(API_AUTH.RESET_USER(user.ID), {
          current_password: currentPassword.value,
          new_password: newPassword.value,
        });
        auth.$patch({
          showAlert: true,
          message: response.data.Message,
          isError: false,
        });
        changePasswordDialog.value = false;
        // Reset password fields
        currentPassword.value = "";
        newPassword.value = "";
        confirmPassword.value = "";
      } catch (error) {
        if (error.response.data.message) {
          console.log("errors:", error.response.data.errors);
          auth.$patch({
            showAlert: true,
            message: error.response.data.message,
            isError: true,
          });
        } else {
          auth.$patch({
            showAlert: true,
            message: error.response.data.Message,
            isError: true,
          });
        }
      }
    };

    // Method to get the role photo URL
    const getRolePhoto = (role) => {
      switch (role) {
        case "Admin":
          return "/src/assets/images/roles/Admin.png";
        case "Doctor":
          return "/src/assets/images/roles/Doctor.png";
        case "Patient":
          return "/src/assets/images/roles/Patient.png";
        case "Clinic Manager":
          return "/src/assets/images/roles/Clinic_Manager.png";
        default:
          return "https://cdn.vuetifyjs.com/images/john.jpg"; // URL for default photo or placeholder
      }
    };

    return {
      userData,
      editDataDialog,
      changePasswordDialog,
      currentPassword,
      newPassword,
      confirmPassword,
      fetchUserData,
      saveUserData,
      currentPasswordVisible,
      newPasswordVisible,
      confirmPasswordVisible,
      getRolePhoto,
      changePassword,
      formattedUserData,
      loading,
      getRoleColor,
    };
  },
};
</script>
