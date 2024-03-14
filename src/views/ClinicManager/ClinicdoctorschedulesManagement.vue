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
              ><v-icon>mdi-clipboard-text-clock</v-icon> Clinic Doctors
              Schedules Management</v-toolbar-title
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
                          :error-messages="dayErrors"
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
                          :error-messages="starttimeErrors"
                          type="time"
                          v-model="editedItem.StartTime"
                          label="Start Time"
                        >
                        </v-text-field>
                        <v-text-field
                          :error-messages="endtimeErrors"
                          type="time"
                          v-model="editedItem.EndTime"
                          label="End Time"
                        >
                        </v-text-field>
                        <v-select
                          :error-messages="durationErrors"
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
import { useUser } from "@/store/useUser";
import { computed, nextTick, ref, watch } from "vue";

const auth = useAuth();
const user = useUser();
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
  { title: "Day of Week", value: "DayOfWeek" },
  { title: "Start Time", value: "StartTime" },
  { title: "End Time", value: "EndTime" },
  { title: "Appointment Duration", value: "AppointmentDuration" },
  { title: "Actions", key: "actions", sortable: false },
]);

const editedItem = ref({
  Doctor: "",
  DayOfWeek: "",
  StartTime: "",
  EndTime: "",
  AppointmentDuration: "",
});
const defaultItem = ref({
  Doctor: "",
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
const dayErrors = ref([]);
const starttimeErrors = ref([]);
const endtimeErrors = ref([]);
const durationErrors = ref([]);

const handleErrors = (errors) => {
  if (errors.doctor_id) {
    doctorErrors.value = errors.doctor_id;
  }

  if (errors.day_of_week) {
    dayErrors.value = errors.day_of_week;
  }

  if (errors.start_time) {
    starttimeErrors.value = errors.start_time;
  }

  if (errors.end_time) {
    endtimeErrors.value = errors.end_time;
  }

  if (errors.appointment_duration) {
    durationErrors.value = errors.appointment_duration;
  }
};

const doctors = ref([]);
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

function fetchdoctorschedules() {
  HTTP.get(`/doctorsschedules/${clinic.value.ID}`)
    .then((response) => {
      doctorschedules.value = response.data.data;
      console.log(doctorschedules.value);
      console.log("doctors schedules :", response.data.data);
      fetchClinicDoctors();
    })
    .catch((error) => {
      console.error("Error fetching doctors Schedules:", error);
    });
}

function editDoctorSchedule(item) {
  HTTP.put("/doctorschedule/" + item.ID, {
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
        message: "An error occurred while editing. Please try again later.",
        isError: true,
      });
    });
}

async function createDoctorSchedule(item) {
  try {
    console.log("doctor schedule : ", item);
    const response = await HTTP.post("/doctorschedule", {
      doctor_id: item.Doctor,
      clinic_id: clinic.value.ID,
      day_of_week: item.DayOfWeek,
      start_time: item.StartTime,
      end_time: item.EndTime,
      appointment_duration: item.AppointmentDuration,
    });

    // Check if the request was successful
    if (response.status === 200) {
      auth.$patch({
        showAlert: true,
        message: response.data.Message,
        isError: false,
      });
    }
  } catch (error) {
    // Handle different error scenarios
    if (error.response && error.response.data) {
      const responseData = error.response.data;

      if (responseData.StatusCode === 409) {
        // Handle conflict error
        console.log("Conflict error:", responseData.Message);
        auth.$patch({
          showAlert: true,
          message: responseData.Message,
          isError: true,
        });
      } else if (error.response.data.errors) {
        // Handle validation errors
        console.log("Validation errors:", error.response.data.errors);
        handleErrors(error.response.data.errors);
        auth.$patch({
          showAlert: true,
          message: "Validation errors occurred.",
          isError: true,
        });
      } else {
        // Handle other errors
        console.log("Other error:", error.response.data.message);
        auth.$patch({
          showAlert: true,
          message: "An error occurred while Creating. Please try again later.",
          isError: true,
        });
      }
    } else {
      // Handle generic network errors
      console.log("Network error:", error.message);
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

const fetchClinic = async () => {
  try {
    const response = await HTTP.get(`users/${user.ID}/additional-info`);
    clinic.value = response.data.Clinic;
    console.log("clinic:", clinic.value);
    fetchdoctorschedules();
  } catch (error) {
    console.error(`Error fetching clinic`, error);
  }
};

const clinic = ref("");

function initialize() {
  fetchClinic();
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
    Object.assign(doctorschedules.value[editedIndex.value], editedItem.value);
  } else {
    //Create
    createDoctorSchedule(editedItem.value);
    doctorschedules.value.push(editedItem.value);
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
