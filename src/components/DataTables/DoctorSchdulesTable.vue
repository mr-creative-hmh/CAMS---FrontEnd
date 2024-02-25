<template>
  <v-container>
    <v-responsive>
      <v-data-table
        :headers="headers"
        :items="doctorschedules"
        v-model:search="search"
        :sort-by="[{ key: 'id', order: 'asc' }]"
      >
        <template v-slot:[`item.StartTime`]="{ item }">
          {{ formatTime(item.StartTime) }}
        </template>
        <template v-slot:[`item.EndTime`]="{ item }">
          {{ formatTime(item.EndTime) }}
        </template>
        <template v-slot:top>
          <v-toolbar color="grey-darken-3" rounded flat>
            <v-toolbar-title
              ><v-icon>mdi-account-details</v-icon> Doctors Schedules
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
                  New Doctor Schedule
                </v-btn>
              </template>
              <v-card>
                <v-toolbar
                  :color="createEdit ? 'primary' : 'info'"
                  :title="formTitle"
                ></v-toolbar>
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" sm="6" md="12">
                        <v-select
                          :error-messages="doctorErrors"
                          v-model="editedItem.Doctor"
                          :items="doctors"
                          item-title="User.Name"
                          item-value="ID"
                          label="Doctor"
                        ></v-select>
                        <v-select
                          :error-messages="clinicErrors"
                          v-model="editedItem.Clinic"
                          :items="clinics"
                          item-title="Name"
                          item-value="ID"
                          label="Clinic"
                        ></v-select>
                        <v-select
                          v-model="editedItem.DayOfWeek"
                          :items="[
                            'Monday',
                            'Tuesday',
                            'Wednesday',
                            'Thursday',
                            'Friday',
                            'Saturday',
                            'Sunday',
                          ]"
                          label="Day Of Week"
                        ></v-select>
                        <v-text-field
                          type="time"
                          v-model="editedItem.StartTime"
                          label="Start Time"
                        >
                        </v-text-field>
                        <v-text-field
                          type="time"
                          v-model="editedItem.EndTime"
                          label="End Time"
                        >
                        </v-text-field>
                        <v-select
                          v-model="editedItem.AppointmentDuration"
                          :items="[15, 30, 45, 60]"
                          label="Appointment Duration (Minutes)"
                        ></v-select>
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
                <v-toolbar
                  color="red"
                  title="Delete Doctor Schedule"
                ></v-toolbar>
                <v-card-title class="text-h6 text-center"
                  >Are you sure you want to delete this Doctor
                  Schedule?</v-card-title
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
import { computed, nextTick, ref, watch } from "vue";

const auth = useAuth();
const dialog = ref(false);
const search = ref("");
const dialogDelete = ref(false);
const headers = ref([
  {
    title: "ID",
    align: "start",
    sortable: false,
    key: "ID",
  },
  { title: "Doctor", value: "Doctor.User.Name" },
  { title: "Clinic", value: "Clinic.Name" },
  { title: "Day of Week", value: "DayOfWeek" },
  { title: "Start Time", value: "StartTime" },
  { title: "End Time", value: "EndTime" },
  { title: "Appointment Duration", value: "AppointmentDuration" },
  { title: "Actions", key: "actions", sortable: false },
]);

const editedItem = ref({
  Doctor: "",
  Clinic: "",
  DayOfWeek: "",
  StartTime: "",
  EndTime: "",
  AppointmentDuration: "",
});
const defaultItem = ref({
  Doctor: "",
  Clinic: "",
  DayOfWeek: "",
  StartTime: "",
  EndTime: "",
  AppointmentDuration: "",
});

const formatTime = (time) => {
  // Example formatTime function, you can adjust it based on your needs
  const formattedTime = new Date(`2000-01-01T${time}`);
  return formattedTime.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
};

// Updating Data
const updateTimeFormat = (timeString) => {
  // Split the time string by colon (:)
  const [hours, minutes] = timeString.split(":");

  // Return the formatted time string
  return `${hours}:${minutes}`;
};
const doctorErrors = ref([]);
const clinicErrors = ref([]);
const starttimeErrors = ref([]);
const endtimeErrors = ref([]);
const durationErrors = ref([]);

const handleErrors = (errors) => {
  if (errors.name) {
    doctorErrors.value = errors.name;
  }

  if (errors.email) {
    clinicErrors.value = errors.email;
  }

  if (errors.password) {
    starttimeErrors.value = errors.password;
  }

  if (errors.phone) {
    endtimeErrors.value = errors.phone;
  }

  if (errors.mobile) {
    durationErrors.value = errors.mobile;
  }
};

const doctors = ref([]);
const clinics = ref([]);
const doctorschedules = ref([]);
const editedIndex = ref(-1);

const formTitle = computed(() => {
  return editedIndex.value === -1
    ? "New Doctor Schedule"
    : "Edit Doctor Schedule";
});

const dialogBtn = computed(() => {
  return editedIndex.value === -1 ? "Create" : "Save";
});

const createEdit = computed(() => {
  return editedIndex.value === -1 ? true : false;
});

function fetchdoctors() {
  HTTP.get("/doctor")
    .then((response) => {
      doctors.value = response.data.data;
      console.log(doctors.value);
      console.log("doctors :", response.data.data);
    })
    .catch((error) => {
      console.error("Error fetching doctors Schedules:", error);
    });
}

function fetchclinics() {
  HTTP.get("/clinic")
    .then((response) => {
      clinics.value = response.data.data;
      console.log(clinics.value);
      console.log("clinics :", response.data.data);
    })
    .catch((error) => {
      console.error("Error fetching clinics:", error);
    });
}

function fetchdoctorschedules() {
  HTTP.get("/doctorschedule")
    .then((response) => {
      doctorschedules.value = response.data.data;
      console.log(doctorschedules.value);
      console.log("doctors schedules :", response.data.data);
    })
    .catch((error) => {
      console.error("Error fetching doctors Schedules:", error);
    });
}

function editDoctorSchedule(item) {
  const doctor = item.Doctor.ID ? item.Doctor.ID : item.Doctor;
  const clinic = item.Clinic.ID ? item.Clinic.ID : item.Doctor;
  HTTP.put("/doctorschedule/" + item.ID, {
    doctor_id: doctor,
    clinic_id: clinic,
    day_of_week: item.DayOfWeek,
    start_time: updateTimeFormat(item.StartTime),
    end_time: updateTimeFormat(item.EndTime),
    appointment_duration: item.AppointmentDuration,
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

async function createDoctorSchedule(item) {
  try {
    console.log("doctor schedule : ", item);
    const response = await HTTP.post("/doctorschedule", {
      doctor_id: item.Doctor,
      clinic_id: item.Clinic,
      day_of_week: item.DayOfWeek,
      start_time: item.StartTime,
      end_time: item.EndTime,
      appointment_duration: item.AppointmentDuration,
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

function deleteDoctorSchedule(item) {
  HTTP.delete("/doctorschedule/" + item.ID)
    .then((response) => {
      auth.$patch({
        showAlert: true,
        message: response.data.Message,
        isError: false,
      });
    })
    .catch((error) => {
      console.error("Error delete doctor schedule:", error);
      auth.$patch({
        showAlert: true,
        message:
          "An error occurred while deleting the doctor schedule. Please try again later.",
        isError: true,
      });
    });
}

function initialize() {
  fetchdoctorschedules();
  fetchdoctors();
  fetchclinics();
}

function editItem(item) {
  editedIndex.value = doctorschedules.value.indexOf(item);
  editedItem.value = Object.assign({}, item);
  dialog.value = true;
}
function deleteItem(item) {
  editedIndex.value = doctorschedules.value.indexOf(item);
  editedItem.value = Object.assign({}, item);
  dialogDelete.value = true;
}
function deleteItemConfirm() {
  deleteDoctorSchedule(editedItem.value);
  doctors.value.splice(editedIndex.value, 1);
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
function save() {
  if (editedIndex.value > -1) {
    //Edit
    editDoctorSchedule(editedItem.value);
    Object.assign(doctors.value[editedIndex.value], editedItem.value);
  } else {
    //Create
    createDoctorSchedule(editedItem.value);
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
watch(dialogDelete, (val) => {
  val || closeDelete();
});
initialize();
</script>
