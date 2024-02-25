<template>
  <v-container>
    <v-responsive>
      <v-data-table
        :headers="headers"
        :items="doctors"
        v-model:search="search"
        :sort-by="[{ key: 'id', order: 'asc' }]"
      >
        <template v-slot:top>
          <v-toolbar color="grey-darken-3" rounded flat>
            <v-toolbar-title
              ><v-icon>mdi-doctor</v-icon> Clinic Doctors
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
                  class="me-3"
                >
                  <v-icon start>mdi-plus-circle</v-icon>
                  New Doctor
                </v-btn>
                <v-btn
                  color="orange"
                  elevation="4"
                  variant="outlined"
                  @click="openAssignDialog"
                >
                  <v-icon start>mdi-account-plus</v-icon>
                  Assign
                </v-btn>
              </template>
              <v-card>
                <v-toolbar
                  :color="formTitle == 'New Doctor' ? 'primary' : 'info'"
                  :title="formTitle"
                ></v-toolbar>
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" sm="6" md="12">
                        <v-text-field
                          :error-messages="emailErrors"
                          v-model="editedItem.User.Email"
                          :disabled="!createEdit"
                          label="Email"
                        ></v-text-field>
                        <v-text-field
                          v-if="createEdit"
                          v-model="editedItem.Password"
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
                        <v-select
                          v-model="editedItem.Specialization"
                          :items="specializations"
                          item-title="Name"
                          item-value="ID"
                          label="Specialization"
                        ></v-select>
                        <v-text-field
                          v-model="editedItem.Experience"
                          label="Experience (Years)"
                        ></v-text-field>
                        <v-text-field
                          v-model="editedItem.AdditionalInfo"
                          label="AdditionalInfo"
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

            <!-- Change Password Dialog -->
            <v-dialog v-model="changePasswordDialog" max-width="600px">
              <v-card>
                <v-toolbar color="green" title="Password Reset"></v-toolbar>
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
            color="orange"
            class="me-2"
            @click="unassignDoctor(item)"
          >
            mdi-account-minus
          </v-icon>
          <v-icon size="small" color="green" @click="changepass(item)">
            mdi-key
          </v-icon>
        </template>
        <template v-slot:no-data>
          <v-btn color="primary" @click="initialize"> Load Data </v-btn>
        </template>
      </v-data-table>

      <!-- Assign Doctor Dialog -->
      <v-dialog v-model="assignDialog" max-width="500px">
        <v-card>
          <v-card-title>Assign Doctor</v-card-title>
          <v-card-text>
            <v-select
              v-model="selectedDoctor"
              :items="unassignedDoctors"
              label="Select Doctor"
              item-title="User.Name"
              item-value="ID"
              :loading="assigning"
            ></v-select>
          </v-card-text>
          <v-card-actions>
            <v-btn
              color="primary"
              @click="assignDoctor(selectedDoctor, selectedClinic)"
              >Assign</v-btn
            >
            <v-btn color="error" @click="assignDialog = false">Cancel</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-responsive>
  </v-container>
</template>
<script setup>
import { HTTP } from "@/config";
import { useAuth } from "@/store/useAuthentication";
import { API_AUTH } from "@/api";
import { computed, nextTick, ref, watch } from "vue";
import { useUser } from "@/store/useUser";

const auth = useAuth();
const user = useUser();
const dialog = ref(false);
const unassignedDoctors = ref([]);
const assignDialog = ref(false);
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
  { title: "Specialization", key: "Specialization.Name" },
  { title: "Experience", key: "Experience" },
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
  Specialization: "",
  Experience: "",
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
  Specialization: "",
  Experience: "",
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

const doctors = ref([]);
const specializations = ref([]);
const editedIndex = ref(-1);

const formTitle = computed(() => {
  return editedIndex.value === -1 ? "New Doctor" : "Edit Doctor";
});

const dialogBtn = computed(() => {
  return editedIndex.value === -1 ? "Create" : "Save";
});

const createEdit = computed(() => {
  return editedIndex.value === -1 ? true : false;
});

const fetchClinic = async () => {
  try {
    const response = await HTTP.get(`users/${user.ID}/additional-info`);
    clinic.value = response.data.Clinic;
    console.log("doctors:", clinic.value);
    fetchClinicDoctors();
  } catch (error) {
    console.error(`Error fetching clinic`, error);
  }
};

const clinic = ref("");
const doctor = ref("");

const fetchClinicDoctors = async () => {
  try {
    const response = await HTTP.get(`/clinicdoctors/${clinic.value.ID}`);
    doctors.value = response.data.Data;
    console.log(doctors.value);
    console.log("doctors :", response.data.data);
  } catch (error) {
    console.error(
      `Error fetching doctors for clinic ${clinic.value.ID}:`,
      error
    );
  }
};

const assignDoctor = async (doctorId) => {
  try {
    const response = await HTTP.post(
      `/clinicdoctors/assign/${doctorId}/${clinic.value.ID}`
    );
    auth.$patch({
      showAlert: true,
      message: response.data.Message,
      isError: false,
    });
    assignDialog.value = false;
    // Refresh the clinics and unassigned patients
    await initialize();
  } catch (error) {
    console.error("Error assigning doctor:", error);
  }
};

const unassignDoctor = async (item) => {
  try {
    const response = await HTTP.delete(
      `/clinicdoctors/unassign/${item.ID}/${clinic.value.ID}`
    );
    auth.$patch({
      showAlert: true,
      message: response.data.Message,
      isError: false,
    });
    // Refresh the clinics and unassigned patients
    await initialize();
  } catch (error) {
    console.error("Error unassigning doctor:", error);
  }
};

const fetchUnassignedDoctors = async () => {
  try {
    const response = await HTTP.get(`/unassigneddoctors/${clinic.value.ID}`);
    unassignedDoctors.value = response.data.Data;
    console.log("unassignedDoctors :", unassignedDoctors);
  } catch (error) {
    console.error("Error fetching unassigned doctors:", error);
  }
};

const openAssignDialog = async () => {
  // Fetch unassigned doctors for the clinic
  await fetchUnassignedDoctors();
  // Open the dialog
  assignDialog.value = true;
};

function editDoctor(item) {
  const specialization = item.Specialization.ID
    ? item.Specialization.ID
    : item.Specialization;
  HTTP.put("/doctor/" + item.ID, {
    name: item.User.Name,
    phone: item.User.Phone,
    mobile: item.User.Mobile,
    address: item.User.Address,
    date_of_birth: item.User.DateOfBirth,
    gender: item.User.Gender,
    specialization_id: specialization,
    experience: parseInt(item.Experience),
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
      console.error("Error edit doctor:", error);
      auth.$patch({
        showAlert: true,
        message:
          "An error occurred while editing the doctor. Please try again later.",
        isError: true,
      });
    });
}

async function createDoctor(item) {
  try {
    console.log("doctor : ", item);
    const response = await HTTP.post("/doctor", {
      name: item.User.Name,
      email: item.User.Email,
      password: item.Password,
      phone: item.User.Phone,
      mobile: item.User.Mobile,
      address: item.User.Address,
      date_of_birth: item.User.DateOfBirth,
      gender: item.User.Gender,
      specialization_id: item.Specialization,
      experience: item.Experience,
      additional_info: item.AdditionalInfo,
    });
    doctor.value = response.data.Data.Doctor;
    assignDoctor(doctor.value.ID);
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

function fetchspecializations() {
  HTTP.get("/specialization")
    .then((response) => {
      specializations.value = response.data.data;
      console.log(specializations.value);
      console.log("specializations :", response.data.data);
    })
    .catch((error) => {
      console.error("Error fetching specializations:", error);
    });
}

function initialize() {
  fetchClinic();
  fetchspecializations();
}
function changepass(item) {
  editedIndex.value = doctors.value.indexOf(item);
  editedItem.value = Object.assign({}, item);
  changePasswordDialog.value = true;
}
function editItem(item) {
  editedIndex.value = doctors.value.indexOf(item);
  editedItem.value = Object.assign({}, item);
  dialog.value = true;
}

function close() {
  dialog.value = false;
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
    editDoctor(editedItem.value);
    Object.assign(doctors.value[editedIndex.value], editedItem.value);
  } else {
    //Create
    createDoctor(editedItem.value);
    doctors.value.push(editedItem.value);
  }
  if (!auth.isError) {
    initialize();
    close();
  }
}
watch(dialog, (val) => {
  val || close();
});
initialize();
</script>
