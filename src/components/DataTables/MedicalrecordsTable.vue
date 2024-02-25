<template>
  <v-container>
    <v-responsive>
      <v-data-table
        :headers="headers"
        :items="medicalrecords"
        v-model:search="search"
        :sort-by="[{ key: 'id', order: 'asc' }]"
      >
        <template v-slot:[`item.Active`]="{ item }">
          <v-checkbox
            :model-value="isActive(item.Active)"
            color="green"
            @change="updateActiveStatus(item)"
          ></v-checkbox>
        </template>
        <template v-slot:top>
          <v-toolbar color="grey-darken-3" rounded flat>
            <v-toolbar-title
              ><v-icon>mdi-clipboard-pulse</v-icon> Medical Records
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
                  New Medical Record
                </v-btn>
              </template>
              <v-card>
                <v-toolbar
                  color="info"
                  title="Create Medical Record"
                ></v-toolbar>
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" sm="6" md="12">
                        <v-select
                          v-model="createItem.Appointment"
                          :items="appointmentsWithConcatenatedDateTime"
                          label="Appointment"
                          item-title="concatenatedDateTime"
                          item-value="ID"
                        >
                        </v-select>

                        <!-- Display appointment details -->
                        <v-card
                          v-if="selectedAppointmentDetails"
                          class="mb-4"
                          variant="outlined"
                          color="indigo"
                        >
                          <v-card-title>Appointment Details:</v-card-title>
                          <v-list>
                            <v-list-item
                              v-for="(
                                value, title
                              ) in selectedAppointmentDetails"
                              :key="title"
                            >
                              <v-list-item>
                                <v-list-item-title>{{
                                  title
                                }}</v-list-item-title>
                                <v-list-item-subtitle>{{
                                  value
                                }}</v-list-item-subtitle>
                              </v-list-item>
                            </v-list-item>
                          </v-list>
                        </v-card>

                        <v-text-field
                          v-model="createItem.MedicalCondition"
                          label="Medical Condition"
                        >
                        </v-text-field>
                        <v-text-field
                          v-model="createItem.Diagnosis"
                          label="Diagnosis"
                        >
                        </v-text-field>
                        <v-textarea
                          clearable
                          clear-icon="mdi-close-circle"
                          v-model="createItem.Prescription"
                          label="Prescription"
                        >
                        </v-textarea>
                        <v-text-field
                          type="date"
                          v-model="createItem.FollowUpDate"
                          label="FollowUp Date"
                        ></v-text-field>
                        <v-text-field
                          v-model="createItem.AdditionalNotes"
                          label="Additional Notes"
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
                <v-toolbar color="info" title="Edit Medical Record"></v-toolbar>
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" sm="6" md="12">
                        <v-text-field
                          v-model="editedItem.MedicalCondition"
                          label="Medical Condition"
                        >
                        </v-text-field>
                        <v-text-field
                          v-model="editedItem.Diagnosis"
                          label="Diagnosis"
                        >
                        </v-text-field>
                        <v-textarea
                          clearable
                          clear-icon="mdi-close-circle"
                          v-model="editedItem.Prescription"
                          label="Prescription"
                        >
                        </v-textarea>
                        <v-text-field
                          type="date"
                          v-model="editedItem.FollowUpDate"
                          label="FollowUp Date"
                        ></v-text-field>
                        <v-text-field
                          v-model="editedItem.AdditionalNotes"
                          label="Additional Notes"
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
                <v-toolbar
                  color="red"
                  title="Delete Medical Record"
                ></v-toolbar>
                <v-card-title class="text-h6 text-center"
                  >Are you sure you want to delete this Medical
                  Record?</v-card-title
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
  { title: "Doctor", value: "Appointment.DoctorSchedule.Doctor.User.Name" },
  { title: "Patient", value: "Appointment.Patient.User.Name" },
  { title: "Date of Visit", value: "Appointment.AppointmentDate" },
  { title: "Visit Time", value: "Appointment.AppointmentTime" },
  { title: "Medical Condition", value: "MedicalCondition" },
  { title: "Diagnosis", value: "Diagnosis" },
  { title: "Prescription", value: "Prescription" },
  { title: "FollowUp Date", value: "FollowUpDate" },
  { title: "Additional Notes", value: "AdditionalNotes" },
  { title: "Active", key: "Active" },
  { title: "Actions", key: "actions", sortable: false },
]);

const editedItem = ref({
  Appointment: "",
  MedicalCondition: "",
  Diagnosis: "",
  Prescription: "",
  FollowUpDate: "",
  AdditionalNotes: "",
  Active: true,
});
const defaultItem = ref({
  Appointment: "",
  MedicalCondition: "",
  Diagnosis: "",
  Prescription: "",
  FollowUpDate: "",
  AdditionalNotes: "",
  Active: true,
});

const createItem = ref({
  Appointment: "",
  MedicalCondition: "",
  Diagnosis: "",
  Prescription: "",
  FollowUpDate: "",
  AdditionalNotes: "",
  Active: true,
});

const defaultcreateItem = ref({
  Appointment: "",
  MedicalCondition: "",
  Diagnosis: "",
  Prescription: "",
  FollowUpDate: "",
  AdditionalNotes: "",
  Active: true,
});

// Define the function to convert 1 and 0 to booleans
const isActive = (value) => {
  return value === 1 ? true : false;
};

const updateActiveStatus = async (item) => {
  try {
    let activeChange = item.Active ? 0 : 1;
    console.log("activeChange : ", activeChange);
    // Update the "Active" status of the medical record in the backend
    await HTTP.put(`/medicalrecord/${item.ID}`, { active: activeChange });
    initialize();
    console.log("Medical Record Active Changed!");
  } catch (error) {
    console.error("Error updating active status:", error);
    // Handle error as needed
  }
};

// Computed property to get the details of the selected appointment
const selectedAppointmentDetails = computed(() => {
  if (!createItem.value.Appointment) return null;

  const selected = appointmentsWithConcatenatedDateTime.value.find(
    (appointment) => appointment.ID === createItem.value.Appointment
  );
  if (!selected) return null;

  return {
    "Clinic:": selected.DoctorSchedule.Clinic.Name,
    "Doctor:": selected.DoctorSchedule.Doctor.User.Name,
    "Patient:": selected.Patient.User.Name,
    "Appointment Day:": selected.DoctorSchedule.DayOfWeek,
    "Appointment Date:": selected.AppointmentDate,
    "Appointment Time:": selected.AppointmentTime,
    "Appointment Type:": selected.AppointmentType,
  };
});
// const fetchClinicDoctors = async (clinicId) => {
//   try {
//     const response = await HTTP.get(`/clinicdoctors/${clinicId}`);
//     clinicdoctors.value = response.data.Data;
//     console.log("doctors:", clinicdoctors.value);
//   } catch (error) {
//     console.error(`Error fetching doctors for clinic ${clinicId}:`, error);
//   }
// };

// watch(
//   () => selectedClinic.value,
//   (newVal, oldVal) => {
//     // Check if the value has changed
//     if (newVal !== "" && newVal !== oldVal) {
//       fetchClinicDoctors(newVal);
//     }
//   }
// );

const medicalrecords = ref([]);
const appointments = ref([]);
const appointmentsWithConcatenatedDateTime = ref([]);
const editedIndex = ref(-1);

function fetchappointments() {
  HTTP.get("/appointment")
    .then((response) => {
      appointments.value = response.data.data;
      appointmentsWithConcatenatedDateTime.value = appointments.value.map(
        (appointment) => ({
          ...appointment,
          concatenatedDateTime: `Clinic: ${appointment.DoctorSchedule.Clinic.Name} - Dr. ${appointment.DoctorSchedule.Doctor.User.Name} - Patient: ${appointment.Patient.User.Name} - "${appointment.AppointmentDate} ${appointment.AppointmentTime}"`,
        })
      );
      console.log(appointments.value);
      console.log("appointment :", response.data.data);
    })
    .catch((error) => {
      console.error("Error fetching appointment:", error);
    });
}

function fetchmedicalrecords() {
  HTTP.get("/medicalrecord")
    .then((response) => {
      medicalrecords.value = response.data.data;
      console.log(medicalrecords.value);
      console.log("Medical Records :", response.data.data);
    })
    .catch((error) => {
      console.error("Error fetching appointment:", error);
    });
}

function editMedicalRecord(item) {
  const payload = {
    medical_condition: item.MedicalCondition,
    diagnosis: item.Diagnosis,
    prescription: item.Prescription,
    follow_up_date: item.FollowUpDate,
    additional_notes: item.AdditionalNotes,
  };

  HTTP.put("/medicalrecord/" + item.ID, payload)
    .then((response) => {
      auth.$patch({
        showAlert: true,
        message: response.data.Message,
        isError: false,
      });
    })
    .catch((error) => {
      console.error("Error edit Medical Record:", error);
      auth.$patch({
        showAlert: true,
        message:
          "An error occurred while editing the Medical Record. Please try again later.",
        isError: true,
      });
    });
}

async function createMedicalRecord(item) {
  try {
    console.log("medical record : ", item);
    const response = await HTTP.post("/medicalrecord", {
      appointment_id: item.Appointment,
      medical_condition: item.MedicalCondition,
      diagnosis: item.Diagnosis,
      prescription: item.Prescription,
      follow_up_date: item.FollowUpDate,
      additional_notes: item.AdditionalNotes,
      active: item.Active,
    });

    auth.$patch({
      showAlert: true,
      message: response.data.Message,
      isError: false,
    });
  } catch (error) {
    if (error.response && error.response.status === 409) {
      // Handle the conflict error (status code 409)
      auth.$patch({
        showAlert: true,
        message: error.response.data.Message,
        isError: true,
      });
    } else {
      // Handle other errors
      console.error("Error creating medical record:", error);
      auth.$patch({
        showAlert: true,
        message:
          "An error occurred while creating the medical record. Please try again later.",
        isError: true,
      });
    }
  }
}

function deleteMedicalRecord(item) {
  HTTP.delete("/medicalrecord/" + item.ID)
    .then((response) => {
      auth.$patch({
        showAlert: true,
        message: response.data.Message,
        isError: false,
      });
    })
    .catch((error) => {
      console.error("Error delete medical record:", error);
      auth.$patch({
        showAlert: true,
        message:
          "An error occurred while deleting the medical record. Please try again later.",
        isError: true,
      });
    });
}

function initialize() {
  fetchmedicalrecords();
  fetchappointments();
}

function editItem(item) {
  editedIndex.value = medicalrecords.value.indexOf(item);
  editedItem.value = Object.assign({}, item);
  // fetchavailableDates(item);
  dialogEdit.value = true;
}
function deleteItem(item) {
  editedIndex.value = medicalrecords.value.indexOf(item);
  editedItem.value = Object.assign({}, item);
  dialogDelete.value = true;
}
function deleteItemConfirm() {
  deleteMedicalRecord(editedItem.value);
  medicalrecords.value.splice(editedIndex.value, 1);
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
    editMedicalRecord(editedItem.value);
    Object.assign(medicalrecords.value[editedIndex.value], editedItem.value);
  }
  if (!auth.isError) {
    initialize();
    close();
  }
}

function create() {
  createMedicalRecord(createItem.value);
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
