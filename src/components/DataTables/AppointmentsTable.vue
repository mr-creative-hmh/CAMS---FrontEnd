<template>
  <v-container>
    <v-responsive>
      <v-data-table
        :headers="headers"
        :items="appointments"
        v-model:search="search"
        :sort-by="[{ key: 'id', order: 'asc' }]"
      >
        <template v-slot:top>
          <v-toolbar color="grey-darken-3" rounded flat>
            <v-toolbar-title
              ><v-icon>mdi-calendar-clock</v-icon> Appointments
              Management</v-toolbar-title
            >
            <v-dialog v-model="dialogCreate" max-width="500px">
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
                  New Appointment
                </v-btn>
              </template>
              <v-card>
                <v-toolbar color="info" title="Create Appointment"></v-toolbar>
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" sm="6" md="12">
                        <v-select
                          v-model="selectedClinic"
                          :items="clinics"
                          item-value="ID"
                          item-title="Name"
                          label="Clinic"
                        ></v-select>
                        <v-select
                          v-model="selectedClinicDoctor"
                          :items="clinicdoctors"
                          item-value="ID"
                          item-title="User.Name"
                          label="Doctor"
                        ></v-select>
                        <v-select
                          v-model="createItem.Patient"
                          :items="clinicpatients"
                          label="Patient"
                          item-title="User.Name"
                          item-value="ID"
                        >
                        </v-select>
                        <v-select
                          v-model="createItem.DoctorSchedule"
                          :items="doctorschedulesDates"
                          label="Appointment Date"
                          item-title="date"
                          return-object
                        >
                        </v-select>
                        <v-select
                          v-model="createItem.AppointmentDateTime"
                          :items="availableAppointmentsDT"
                          label="Appointment Time"
                          item-title="time"
                          item-value="date"
                        >
                        </v-select>
                        <v-select
                          v-model="createItem.AppointmentType"
                          :items="['Normal', 'Follow-Up', 'Re-Scheduled']"
                          label="Appointment Type"
                        ></v-select>
                        <v-select
                          v-model="createItem.AppointmentStatus"
                          :items="['Scheduled', 'Cancelled', 'Completed']"
                          label="Appointment Status"
                        ></v-select>
                        <v-text-field
                          v-model="createItem.ReasonForVisit"
                          label="Reason For Visit"
                        >
                        </v-text-field>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    color="blue-darken-1"
                    variant="text"
                    @click="closeCreate()"
                  >
                    Cancel
                  </v-btn>
                  <v-btn
                    color="green-darken-1"
                    variant="text"
                    @click="create()"
                  >
                    Create
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>

            <v-dialog v-model="dialogEdit" max-width="500px">
              <v-card>
                <v-toolbar color="info" title="Edit Appointment"></v-toolbar>
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" sm="6" md="12">
                        <v-select
                          v-model="editedItem.AppointmentDate"
                          :items="availableDates"
                          item-value="item"
                          label="Appointment Date"
                        ></v-select>
                        <v-select
                          v-model="editedItem.AppointmentTime"
                          :items="availableAppointments"
                          label="Appointment Time"
                          item-title="time"
                          item-value="date"
                        >
                        </v-select>
                        <v-select
                          v-model="editedItem.AppointmentType"
                          :items="['Normal', 'Follow-Up', 'Re-Scheduled']"
                          label="Appointment Type"
                        ></v-select>
                        <v-select
                          v-model="editedItem.AppointmentStatus"
                          :items="['Scheduled', 'Cancelled', 'Completed']"
                          label="Appointment Status"
                        ></v-select>
                        <v-text-field
                          v-model="editedItem.ReasonForVisit"
                          label="Reason For Visit"
                        >
                        </v-text-field>
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
                    Save
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>

            <v-dialog v-model="dialogDelete" max-width="500px">
              <v-card>
                <v-toolbar color="red" title="Delete Appointment"></v-toolbar>
                <v-card-title class="text-h6 text-center"
                  >Are you sure you want to delete this
                  Appointment?</v-card-title
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
import { nextTick, ref, watch } from "vue";

const auth = useAuth();
const dialogCreate = ref(false);
const dialogEdit = ref(false);
const search = ref("");
const dialogDelete = ref(false);
const headers = ref([
  {
    title: "ID",
    align: "start",
    sortable: false,
    key: "ID",
  },
  { title: "Clinic", value: "DoctorSchedule.Clinic.Name" },
  { title: "Doctor", value: "DoctorSchedule.Doctor.User.Name" },
  { title: "Patient", value: "Patient.User.Name" },
  { title: "Appointment Day", value: "DoctorSchedule.DayOfWeek" },
  { title: "Appointemnt Date", value: "AppointmentDate" },
  { title: "Appointment Time", value: "AppointmentTime" },
  { title: "Appointment Type", value: "AppointmentType" },
  { title: "Appointment Status", value: "AppointmentStatus" },
  { title: "Reason For Visit", value: "ReasonForVisit" },
  { title: "Actions", key: "actions", sortable: false },
]);

const editedItem = ref({
  AppointmentDate: "",
  AppointmentTime: "",
  AppointmentType: "",
  AppointmentStatus: "",
  ReasonForVisit: "",
});
const defaultItem = ref({
  AppointmentDate: "",
  AppointmentTime: "",
  AppointmentType: "",
  AppointmentStatus: "",
  ReasonForVisit: "",
});

const createItem = ref({
  DoctorSchedule: "",
  Patient: "",
  AppointmentDateTime: "",
  AppointmentType: "",
  AppointmentStatus: "",
  ReasonForVisit: "",
});

const defaultcreateItem = ref({
  DoctorSchedule: "",
  Patient: "",
  AppointmentDateTime: "",
  AppointmentType: "",
  AppointmentStatus: "",
  ReasonForVisit: "",
});

const clinics = ref([]);
const selectedClinic = ref("");
const clinicdoctors = ref([]);
const selectedClinicDoctor = ref("");
const clinicpatients = ref([]);
const doctorschedulesDates = ref([]);
const availableAppointmentsDT = ref([]);

const fetchClinicDoctors = async (clinicId) => {
  try {
    const response = await HTTP.get(`/clinicdoctors/${clinicId}`);
    clinicdoctors.value = response.data.Data;
    console.log("doctors:", clinicdoctors.value);
  } catch (error) {
    console.error(`Error fetching doctors for clinic ${clinicId}:`, error);
  }
};

watch(
  () => selectedClinic.value,
  (newVal, oldVal) => {
    // Check if the value has changed
    if (newVal !== "" && newVal !== oldVal) {
      fetchClinicDoctors(newVal);
    }
  }
);

const fetchClinicPatients = async (clinicId) => {
  try {
    const response = await HTTP.get(`/clinicpatients/${clinicId}`);
    clinicpatients.value = response.data.Data;
  } catch (error) {
    console.error(`Error fetching patients for clinic ${clinicId}:`, error);
  }
};

watch(
  () => selectedClinicDoctor.value,
  (newVal, oldVal) => {
    // Check if the value has changed
    if (newVal !== "" && newVal !== oldVal) {
      fetchClinicPatients(newVal);
      fetchdoctorschedulesDates(
        selectedClinic.value,
        selectedClinicDoctor.value
      );
    }
  }
);

const fetchdoctorschedulesDates = async (clinicId, doctorId) => {
  try {
    const response = await HTTP.get(
      `/doctorschedulesdates/${clinicId}/${doctorId}`
    );
    doctorschedulesDates.value = response.data;
  } catch (error) {
    console.error(`Error fetching patients for clinic ${clinicId}:`, error);
  }
};

watch(
  () => createItem.value.DoctorSchedule,
  (newVal, oldVal) => {
    // Check if the value has changed
    if (newVal !== "" && newVal !== oldVal) {
      fetchAvailableAppointmentsDT(
        createItem.value.DoctorSchedule.doctor_schedule_id,
        createItem.value.DoctorSchedule.date
      );
    }
  }
);

async function fetchAvailableAppointmentsDT(dsid, date) {
  try {
    console.log("Selected date:", date);
    const response = await HTTP.get(`/available-appointments/${dsid}/${date}`);
    availableAppointmentsDT.value = response.data.available_appointments;
    console.log(availableAppointments.value);
    console.log("appointment :", response.data.data);
  } catch (error) {
    if (error.response && error.response.data && error.response.data.errors) {
      console.log("errors:", error.response.data.errors);
      auth.$patch({
        showAlert: true,
        message: error.response.data.message,
        isError: true,
      });
    } else {
      auth.$patch({
        showAlert: true,
        message: "No Doctor Schedule Available.",
        isError: true,
      });
    }
  }
}

const currentSchedule = ref(1);
const availableDates = ref([]);
const availableAppointments = ref([]);
const appointments = ref([]);
const editedIndex = ref(-1);

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

function fetchappointments() {
  HTTP.get("/appointment")
    .then((response) => {
      appointments.value = response.data.data;
      console.log(appointments.value);
      console.log("appointment :", response.data.data);
    })
    .catch((error) => {
      console.error("Error fetching appointment:", error);
    });
}

async function fetchavailableDates(item) {
  try {
    const response = await HTTP.get(
      `/generate-dates/${item.DoctorSchedule.ID}`
    );
    availableDates.value = response.data.dates;
    currentSchedule.value = parseInt(response.data.doctor_schedule_id);
    console.log(availableDates.value);
    console.log("available Dates :", response.data.data);
  } catch (error) {
    if (error.response && error.response.data && error.response.data.errors) {
      console.log("errors:", error.response.data.errors);
      auth.$patch({
        showAlert: true,
        message: error.response.data.message,
        isError: true,
      });
    } else {
      auth.$patch({
        showAlert: true,
        message:
          "An error occurred while getting available dates. Please try again later.",
        isError: true,
      });
    }
  }
}

// Watch for changes in editedItem.AppointmentDate
watch(
  () => editedItem.value.AppointmentDate,
  (newVal, oldVal) => {
    // Check if the value has changed
    if (newVal !== "" && newVal !== oldVal) {
      fetchAvailableAppointments(newVal);
    }
  }
);

async function fetchAvailableAppointments(selectedDate) {
  try {
    console.log("Selected date:", selectedDate);
    const response = await HTTP.get(
      `/available-appointments/${currentSchedule.value}/${selectedDate}`
    );
    availableAppointments.value = response.data.available_appointments;
    console.log(availableAppointments.value);
    console.log("appointment :", response.data.data);
  } catch (error) {
    if (error.response && error.response.data && error.response.data.errors) {
      console.log("errors:", error.response.data.errors);
      auth.$patch({
        showAlert: true,
        message: error.response.data.message,
        isError: true,
      });
    } else {
      auth.$patch({
        showAlert: true,
        message: "No Doctor Schedule Available.",
        isError: true,
      });
    }
  }
}

function editAppointment(item) {
  const payload = {
    appointment_type: item.AppointmentType,
    appointment_status: item.AppointmentStatus,
    reason_for_visit: item.ReasonForVisit,
  };
  // Check if AppointmentTime is in the format "10:00 PM"
  if (!item.AppointmentTime.match(/^\d{1,2}:\d{2}\s(AM|PM)$/)) {
    // Only include the appointment_date field if it's not in the specified format
    payload.appointment_date = item.AppointmentTime;
  }

  HTTP.put("/appointment/" + item.ID, payload)
    .then((response) => {
      auth.$patch({
        showAlert: true,
        message: response.data.Message,
        isError: false,
      });
    })
    .catch((error) => {
      console.error("Error edit appointment:", error);
      auth.$patch({
        showAlert: true,
        message:
          "An error occurred while editing the appointment. Please try again later.",
        isError: true,
      });
    });
}

async function createAppointment(item) {
  try {
    console.log("appointment : ", item);
    const response = await HTTP.post("/appointment", {
      doctor_schedule_id: item.DoctorSchedule.doctor_schedule_id,
      patient_id: item.Patient,
      appointment_date: item.AppointmentDateTime,
      appointment_type: item.AppointmentType,
      appointment_status: item.AppointmentStatus,
      reason_for_visit: item.ReasonForVisit,
    });
    auth.$patch({
      showAlert: true,
      message: response.data.Message,
      isError: false,
    });
  } catch (error) {
    if (error.response && error.response.data && error.response.data.errors) {
      console.log("errors:", error.response.data.errors);
      auth.$patch({
        showAlert: true,
        message: error.response.data.message,
        isError: true,
      });
    } else {
      auth.$patch({
        showAlert: true,
        message: "An error occurred while Creating. Please try again later.",
        isError: true,
      });
    }
  }
}

function deleteAppointment(item) {
  HTTP.delete("/appointment/" + item.ID)
    .then((response) => {
      auth.$patch({
        showAlert: true,
        message: response.data.Message,
        isError: false,
      });
    })
    .catch((error) => {
      console.error("Error delete appointment:", error);
      auth.$patch({
        showAlert: true,
        message:
          "An error occurred while deleting the appointment. Please try again later.",
        isError: true,
      });
    });
}

function initialize() {
  fetchappointments();
  fetchclinics();
}

function editItem(item) {
  editedIndex.value = appointments.value.indexOf(item);
  editedItem.value = Object.assign({}, item);
  fetchavailableDates(item);
  dialogEdit.value = true;
}
function deleteItem(item) {
  editedIndex.value = appointments.value.indexOf(item);
  editedItem.value = Object.assign({}, item);
  dialogDelete.value = true;
}
function deleteItemConfirm() {
  deleteAppointment(editedItem.value);
  appointments.value.splice(editedIndex.value, 1);
  initialize();
  closeDelete();
}
function close() {
  dialogEdit.value = false;
  nextTick(() => {
    editedItem.value = Object.assign({}, defaultItem.value);
    editedIndex.value = -1;
  });
}
function closeCreate() {
  dialogCreate.value = false;
  nextTick(() => {
    createItem.value = Object.assign({}, defaultcreateItem.value);
    selectedClinic.value = "";
    selectedClinicDoctor.value = "";
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
    editAppointment(editedItem.value);
    Object.assign(appointments.value[editedIndex.value], editedItem.value);
  }
  if (!auth.isError) {
    initialize();
    close();
  }
}

function create() {
  createAppointment(createItem.value);
  appointments.value.push(editedItem.value);
  if (!auth.isError) {
    initialize();
    closeCreate();
  }
}

watch(dialogEdit, (val) => {
  val || close();
});
watch(dialogDelete, (val) => {
  val || closeDelete();
});
initialize();
</script>
