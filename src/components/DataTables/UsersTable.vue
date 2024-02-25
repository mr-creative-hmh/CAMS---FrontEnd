<template>
  <v-container>
    <v-responsive>
      <v-data-table
        :headers="headers"
        :items="users"
        v-model:search="search"
        :sort-by="[{ key: 'id', order: 'asc' }]"
      >
        <template v-slot:[`item.Role.RoleName`]="{ item }">
          <v-chip
            class="font-weight-bold"
            :color="getRoleColor(item.Role.RoleName)"
            size="small"
            rounded="xl"
            label
          >
            {{ item.Role.RoleName }}</v-chip
          >
        </template>
        <template v-slot:top>
          <v-toolbar color="grey-darken-3" rounded flat>
            <v-toolbar-title
              ><v-icon>mdi-account</v-icon> Users Management</v-toolbar-title
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
                  New Admin
                </v-btn>
              </template>

              <v-card>
                <v-toolbar
                  :color="formTitle == 'New Admin' ? 'primary' : 'info'"
                  :title="formTitle"
                ></v-toolbar>
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" sm="6" md="12">
                        <v-text-field
                          :error-messages="emailErrors"
                          v-model="editedItem.Email"
                          label="Email"
                          :disabled="!createEdit"
                        ></v-text-field>
                        <v-text-field
                          v-if="createEdit"
                          v-model="editedItem.password"
                          label="Password"
                          :append-icon="
                            PasswordVisible ? 'mdi-eye-off' : 'mdi-eye'
                          "
                          :type="PasswordVisible ? 'text' : 'password'"
                          @click:append="PasswordVisible = !PasswordVisible"
                          :error-messages="passwordErrors"
                        ></v-text-field>
                        <v-text-field
                          :error-messages="nameErrors"
                          v-model="editedItem.Name"
                          label="Name"
                        ></v-text-field>
                        <v-text-field
                          :error-messages="phoneErrors"
                          v-model="editedItem.Phone"
                          label="Phone"
                        ></v-text-field>
                        <v-text-field
                          :error-messages="mobileErrors"
                          v-model="editedItem.Mobile"
                          label="Mobile"
                        ></v-text-field>
                        <v-text-field
                          :error-messages="addressErrors"
                          v-model="editedItem.Address"
                          label="Address"
                        ></v-text-field>
                        <v-text-field
                          :error-messages="dateOfBirthErrors"
                          v-model="editedItem.DateOfBirth"
                          type="date"
                          label="Date Of Birth"
                        ></v-text-field>
                        <v-select
                          :error-messages="genderErrors"
                          v-model="editedItem.Gender"
                          :items="['Male', 'Female', 'Other']"
                          label="Gender"
                        ></v-select>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue-darken-1" variant="text" @click="close">
                    Cancel
                  </v-btn>
                  <v-btn color="green-darken-1" variant="text" @click="save">
                    {{ dialogBtn }}
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>

            <v-dialog v-model="dialogDelete" max-width="500px">
              <v-card>
                <v-toolbar color="red" title="Delete User"></v-toolbar>
                <v-card-title class="text-h6 text-center"
                  >Are you sure you want to delete this User?</v-card-title
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
          <template v-if="item.ID != userD.ID">
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
import { useUser } from "@/store/useUser";
import { API_AUTH } from "@/api";
import { computed, nextTick, ref, watch } from "vue";

const auth = useAuth();
const userD = useUser();
const dialog = ref(false);
const search = ref("");
const dialogDelete = ref(false);
const changePasswordDialog = ref(false);

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

const headers = ref([
  {
    title: "ID",
    align: "start",
    sortable: false,
    key: "ID",
  },
  { title: "Name", key: "Name" },
  { title: "Email", key: "Email" },
  { title: "Phone", key: "Phone" },
  { title: "Mobile", key: "Mobile" },
  { title: "Address", key: "Address" },
  { title: "Date Of Birth", key: "DateOfBirth" },
  { title: "Gender", key: "Gender" },
  { title: "Role", key: "Role.RoleName" },
  { title: "Actions", key: "actions", sortable: false },
]);

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
const changePassword = async (user) => {
  try {
    const response = await HTTP.post(API_AUTH.RESET_ADMIN(user.ID), {
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

const users = ref([]);
const editedIndex = ref(-1);
const editedItem = ref({
  Name: "",
  Email: "",
  Password: "",
  Phone: "",
  Mobile: "",
  Address: "",
  DateOfBirth: "",
  Gender: "",
});
const defaultItem = ref({
  Name: "",
  Email: "",
  Password: "",
  Phone: "",
  Mobile: "",
  Address: "",
  DateOfBirth: "",
  Gender: "",
});
const formTitle = computed(() => {
  return editedIndex.value === -1 ? "New Admin" : "Edit User";
});

const dialogBtn = computed(() => {
  return editedIndex.value === -1 ? "Create" : "Save";
});

const createEdit = computed(() => {
  return editedIndex.value === -1 ? true : false;
});

function fetchusers() {
  HTTP.get("/user")
    .then((response) => {
      users.value = response.data.data;
      console.log(users.value);
      console.log("users :", response.data.data);
    })
    .catch((error) => {
      console.error("Error fetching users:", error);
    });
}

function editUser(item) {
  HTTP.put("/user/" + item.ID, {
    name: item.Name,
    phone: item.Phone,
    mobile: item.Mobile,
    address: item.Address,
    date_of_birth: item.DateOfBirth,
    gender: item.Gender,
  })
    .then((response) => {
      auth.$patch({
        showAlert: true,
        message: response.data.Message,
        isError: false,
      });
    })
    .catch((error) => {
      console.error("Error edit user:", error);
      auth.$patch({
        showAlert: true,
        message:
          "An error occurred while editing the user. Please try again later.",
        isError: true,
      });
    });
}

async function createUser(item) {
  try {
    console.log("user : ", item);
    const response = await HTTP.post("/Auth/Register", {
      name: item.Name,
      email: item.Email,
      password: item.Password,
      phone: item.Phone,
      mobile: item.Mobile,
      address: item.Address,
      date_of_birth: item.DateOfBirth,
      gender: item.Gender,
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

function deleteUser(item) {
  HTTP.delete("/user/" + item.ID)
    .then((response) => {
      auth.$patch({
        showAlert: true,
        message: response.data.Message,
        isError: false,
      });
    })
    .catch((error) => {
      console.error("Error delete user:", error);
      auth.$patch({
        showAlert: true,
        message:
          "An error occurred while deleting the user. Please try again later.",
        isError: true,
      });
    });
}

function initialize() {
  fetchusers();
}
function changepass(item) {
  editedIndex.value = users.value.indexOf(item);
  editedItem.value = Object.assign({}, item);
  changePasswordDialog.value = true;
}
function editItem(item) {
  editedIndex.value = users.value.indexOf(item);
  editedItem.value = Object.assign({}, item);
  dialog.value = true;
}
function deleteItem(item) {
  editedIndex.value = users.value.indexOf(item);
  editedItem.value = Object.assign({}, item);
  dialogDelete.value = true;
}
function deleteItemConfirm() {
  deleteUser(editedItem.value);
  users.value.splice(editedIndex.value, 1);
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
    editUser(editedItem.value);
    Object.assign(users.value[editedIndex.value], editedItem.value);
  } else {
    //Create
    createUser(editedItem.value);
    users.value.push(editedItem.value);
  }
  initialize();
  close();
}
watch(dialog, (val) => {
  val || close();
});
watch(dialogDelete, (val) => {
  val || closeDelete();
});
initialize();
</script>
