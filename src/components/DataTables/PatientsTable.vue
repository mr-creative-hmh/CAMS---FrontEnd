<template>
  <v-container>
    <v-responsive>
      <v-data-table
        :headers="headers"
        :items="patients"
        v-model:search="search"
        :sort-by="[{ key: 'id', order: 'asc' }]"
      >
        <template v-slot:top>
          <v-toolbar color="grey-darken-3" rounded flat>
            <v-toolbar-title
              ><v-icon>mdi-account-injury</v-icon> Patients
              Management</v-toolbar-title
            >
            <v-dialog v-model="dialog" max-width="500px">
              <template v-slot:activator="{ props }">
                <v-text-field
                  v-model="search"
                  prepend-inner-icon="mdi-magnify"
                  density="compact"
                  label="Search"
                  single-line
                  flat
                  hide-details
                  variant="solo-filled"
                ></v-text-field>
                <v-divider class="mx-5" inset vertical></v-divider>
                <v-btn
                  color="success"
                  elevation="4"
                  variant="outlined"
                  v-bind="props"
                >
                  <v-icon start>mdi-plus-circle</v-icon>
                  New Patient
                </v-btn>
              </template>
              <v-card>
                <v-toolbar
                  :color="formTitle == 'New Patient' ? 'primary' : 'info'"
                  :title="formTitle"
                ></v-toolbar>
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" sm="6" md="12">
                        <v-text-field
                          :error-messages="emailErrors"
                          :disabled="!createEdit"
                          v-model="editedItem.User.Email"
                          label="Email"
                        ></v-text-field>
                        <v-text-field
                          v-if="createEdit"
                          v-model="editedItem.Password"
                          label="Password"
                          :append-inner-icon="
                            PasswordVisible ? 'mdi-eye-off' : 'mdi-eye'
                          "
                          :type="PasswordVisible ? 'text' : 'password'"
                          @click:append-inner="
                            PasswordVisible = !PasswordVisible
                          "
                          :error-messages="passwordErrors"
                        ></v-text-field>
                        <v-text-field
                          :error-messages="nameErrors"
                          v-model="editedItem.User.Name"
                          label="Name"
                        ></v-text-field>
                        <v-text-field
                          :error-messages="phoneErrors"
                          v-model="editedItem.User.Phone"
                          label="Phone"
                        ></v-text-field>
                        <v-text-field
                          :error-messages="mobileErrors"
                          v-model="editedItem.User.Mobile"
                          label="Mobile"
                        ></v-text-field>
                        <v-text-field
                          :error-messages="addressErrors"
                          v-model="editedItem.User.Address"
                          label="Address"
                        ></v-text-field>
                        <v-text-field
                          :error-messages="dateOfBirthErrors"
                          type="date"
                          v-model="editedItem.User.DateOfBirth"
                          label="Date Of Birth"
                        ></v-text-field>
                        <v-select
                          :error-messages="genderErrors"
                          v-model="editedItem.User.Gender"
                          :items="['Male', 'Female', 'Other']"
                          label="Gender"
                        ></v-select>
                        <v-text-field
                          v-model="editedItem.Weight"
                          label="Weight (Kg)"
                          type="number"
                        ></v-text-field>
                        <v-text-field
                          v-model="editedItem.Height"
                          label="Height (CM)"
                          type="number"
                        ></v-text-field>
                        <v-text-field
                          v-model="editedItem.AdditionalInfo"
                          label="Additional Info"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue-darken-1" variant="text" @click="close()">
                    Cancel
                  </v-btn>
                  <v-btn color="green-darken-1" variant="text" @click="save()">
                    {{ dialogBtn }}
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>

            <v-dialog v-model="dialogDelete" max-width="500px">
              <v-card>
                <v-toolbar color="red" title="Delete Patient"></v-toolbar>
                <v-card-title class="text-h6 text-center"
                  >Are you sure you want to delete this Patient?</v-card-title
                >
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    color="blue-darken-1"
                    variant="text"
                    @click="closeDelete"
                    >Cancel</v-btn
                  >
                  <v-btn
                    color="red-darken-1"
                    variant="text"
                    @click="deleteItemConfirm"
                    >OK</v-btn
                  >
                  <v-spacer></v-spacer>
                </v-card-actions>
              </v-card>
            </v-dialog>

            <!-- Change Password Dialog -->
            <v-dialog v-model="changePasswordDialog" max-width="600px">
              <v-card>
                <v-toolbar color="green" title="Change Password"></v-toolbar>
                <v-card-text>
                  <!-- New Password -->
                  <v-text-field
                    v-model="newPassword"
                    :append-icon="
                      newPasswordVisible ? 'mdi-eye-off' : 'mdi-eye'
                    "
                    :type="newPasswordVisible ? 'text' : 'password'"
                    @click:append="newPasswordVisible = !newPasswordVisible"
                    label="New Password"
                  ></v-text-field>
                </v-card-text>
                <v-card-actions>
                  <v-btn color="blue darken-1" @click="changepassuser"
                    >Change Password</v-btn
                  >
                  <v-btn color="grey darken-3" @click="closeChange"
                    >Cancel</v-btn
                  >
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-toolbar>
        </template>

        <template v-slot:[`item.actions`]="{ item }">
          <v-icon
            size="small"
            color="blue"
            class="me-2"
            @click="editItem(item)"
          >
            mdi-pencil
          </v-icon>
          <v-icon
            size="small"
            color="red"
            class="me-2"
            @click="deleteItem(item)"
          >
            mdi-delete
          </v-icon>
          <v-icon size="small" color="green" @click="changepass(item)">
            mdi-key
          </v-icon>
        </template>
        <template v-slot:no-data>
          <v-btn color="primary" @click="initialize"> Load Data </v-btn>
        </template>
      </v-data-table>
    </v-responsive>
  </v-container>
</template>
<script setup>
import { HTTP } from "@/config";
import { useAuth } from "@/store/useAuthentication";
import { API_AUTH } from "@/api";
import { computed, nextTick, ref, watch } from "vue";

const auth = useAuth();
const dialog = ref(false);
const dialogDelete = ref(false);
const search = ref("");
const changePasswordDialog = ref(false);
const headers = ref([
  {
    title: "ID",
    align: "start",
    sortable: false,
    key: "ID",
  },
  { title: "Name", key: "User.Name" },
  { title: "Email", key: "User.Email" },
  { title: "Phone", key: "User.Phone" },
  { title: "Mobile", key: "User.Mobile" },
  { title: "Address", key: "User.Address" },
  { title: "Date Of Birth", key: "User.DateOfBirth" },
  { title: "Gender", key: "User.Gender" },
  { title: "Weight", key: "Weight" },
  { title: "Height", key: "Height" },
  { title: "AdditionalInfo", key: "AdditionalInfo" },
  { title: "Actions", key: "actions", sortable: false },
]);

const editedItem = ref({
  User: {
    Name: "",
    Email: "",
    Password: "",
    Phone: "",
    Mobile: "",
    Address: "",
    DateOfBirth: "",
    Gender: "",
  },
  Password: "",
  Weight: "",
  Height: "",
  AdditionalInfo: "",
});
const defaultItem = ref({
  User: {
    Name: "",
    Email: "",
    Password: "",
    Phone: "",
    Mobile: "",
    Address: "",
    DateOfBirth: "",
    Gender: "",
  },
  Password: "",
  Weight: "",
  Height: "",
  AdditionalInfo: "",
});

const nameErrors = ref([]);
const emailErrors = ref([]);
const passwordErrors = ref([]);
const phoneErrors = ref([]);
const mobileErrors = ref([]);
const addressErrors = ref([]);
const dateOfBirthErrors = ref([]);
const genderErrors = ref([]);

// New password and confirm password

const newPassword = ref("");
const newPasswordVisible = ref(false);

// Method to change user password
const changePassword = async (item) => {
  try {
    const response = await HTTP.post(API_AUTH.RESET_ADMIN(item.User.ID), {
      new_password: newPassword.value,
    });
    auth.$patch({
      showAlert: true,
      message: response.data.Message,
      isError: false,
    });
    changePasswordDialog.value = false;
    // Reset password fields
    newPassword.value = "";
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

const PasswordVisible = ref(false);

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

const patients = ref([]);
const editedIndex = ref(-1);

const formTitle = computed(() => {
  return editedIndex.value === -1 ? "New Patient" : "Edit Patient";
});

const dialogBtn = computed(() => {
  return editedIndex.value === -1 ? "Create" : "Save";
});

const createEdit = computed(() => {
  return editedIndex.value === -1 ? true : false;
});

function fetchpatients() {
  HTTP.get("/patient")
    .then((response) => {
      patients.value = response.data.data;
      console.log(patients.value);
      console.log("patients :", response.data.data);
    })
    .catch((error) => {
      console.error("Error fetching patients:", error);
    });
}

function editPatient(item) {
  HTTP.put("/patient/" + item.ID, {
    name: item.User.Name,
    phone: item.User.Phone,
    mobile: item.User.Mobile,
    address: item.User.Address,
    date_of_birth: item.User.DateOfBirth,
    gender: item.User.Gender,
    weight: parseInt(item.Weight),
    height: parseInt(item.Height),
    additional_info: item.AdditionalInfo,
  })
    .then((response) => {
      auth.$patch({
        showAlert: true,
        message: response.data.Message,
        isError: false,
      });
    })
    .catch((error) => {
      console.error("Error edit patient:", error);
      auth.$patch({
        showAlert: true,
        message:
          "An error occurred while editing the patient. Please try again later.",
        isError: true,
      });
    });
}

async function createPatient(item) {
  try {
    console.log("patient : ", item);
    const response = await HTTP.post("/patient", {
      name: item.User.Name,
      email: item.User.Email,
      password: item.Password,
      phone: item.User.Phone,
      mobile: item.User.Mobile,
      address: item.User.Address,
      date_of_birth: item.User.DateOfBirth,
      gender: item.User.Gender,
      weight: parseInt(item.Weight),
      height: parseInt(item.Height),
      additional_info: item.AdditionalInfo,
    });
    auth.$patch({
      showAlert: true,
      message: response.data.Message,
      isError: false,
    });
  } catch (error) {
    if (error.response && error.response.data && error.response.data.errors) {
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
        message: "An error occurred while registering. Please try again later.",
        isError: true,
      });
    }
  }
}

function deletePatient(item) {
  HTTP.delete("/patient/" + item.ID)
    .then((response) => {
      auth.$patch({
        showAlert: true,
        message: response.data.Message,
        isError: false,
      });
    })
    .catch((error) => {
      console.error("Error delete patient:", error);
      auth.$patch({
        showAlert: true,
        message:
          "An error occurred while deleting the patient. Please try again later.",
        isError: true,
      });
    });
}

function initialize() {
  fetchpatients();
}
function changepass(item) {
  editedIndex.value = patients.value.indexOf(item);
  editedItem.value = Object.assign({}, item);
  changePasswordDialog.value = true;
}
function editItem(item) {
  editedIndex.value = patients.value.indexOf(item);
  editedItem.value = Object.assign({}, item);
  console.log("patinet data:", item);
  dialog.value = true;
}
function deleteItem(item) {
  editedIndex.value = patients.value.indexOf(item);
  editedItem.value = Object.assign({}, item);
  dialogDelete.value = true;
}
function deleteItemConfirm() {
  deletePatient(editedItem.value);
  patients.value.splice(editedIndex.value, 1);
  initialize();
  closeDelete();
}
function close() {
  dialog.value = false;
  nextTick(() => {
    editedItem.value = Object.assign({}, defaultItem.value);
    editedIndex.value = -1;
  });
}
function closeDelete() {
  dialogDelete.value = false;
  nextTick(() => {
    editedItem.value = Object.assign({}, defaultItem.value);
    editedIndex.value = -1;
  });
}
function closeChange() {
  changePasswordDialog.value = false;
  nextTick(() => {
    editedItem.value = Object.assign({}, defaultItem.value);
    editedIndex.value = -1;
  });
}
function changepassuser() {
  changePassword(editedItem.value);
}
function save() {
  if (editedIndex.value > -1) {
    //Edit
    editPatient(editedItem.value);
    Object.assign(patients.value[editedIndex.value], editedItem.value);
  } else {
    //Create
    createPatient(editedItem.value);
    patients.value.push(editedItem.value);
  }
  if (!auth.isError) {
    initialize();
    close();
  }
}
watch(dialog, (val) => {
  val || close();
});
watch(dialogDelete, (val) => {
  val || closeDelete();
});
initialize();
</script>
