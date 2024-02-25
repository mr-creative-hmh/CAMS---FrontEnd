<template>
  <v-container>
    <v-responsive>
      <v-data-table
        :headers="headers"
        :items="specializations"
        :sort-by="[{ key: 'id', order: 'asc' }]"
      >
        <template v-slot:top>
          <v-toolbar color="grey-darken-3" rounded flat>
            <v-toolbar-title
              ><v-icon>mdi-hospital-box-outline</v-icon> Specializations
              Management</v-toolbar-title
            >
            <v-divider class="mx-5" inset vertical></v-divider>
            <v-dialog v-model="dialog" max-width="500px">
              <template v-slot:activator="{ props }">
                <v-btn
                  color="success"
                  elevation="4"
                  variant="outlined"
                  v-bind="props"
                >
                  <v-icon start>mdi-plus-circle</v-icon>
                  New Specialization
                </v-btn>
              </template>
              <v-card>
                <v-toolbar
                  :color="
                    formTitle == 'New Specialization ' ? 'primary' : 'info'
                  "
                  :title="formTitle"
                ></v-toolbar>
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" sm="6" md="12">
                        <v-text-field
                          v-model="editedItem.Name"
                          label="Specialization Name"
                        ></v-text-field>
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
                <v-toolbar
                  color="red"
                  title="Delete Specialization"
                ></v-toolbar>
                <v-card-title class="text-h6 text-center"
                  >Are you sure you want to delete this
                  Specialization?</v-card-title
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
          <v-icon size="small" color="red" @click="deleteItem(item)">
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
const dialogDelete = ref(false);
const headers = ref([
  {
    title: "ID",
    align: "start",
    sortable: false,
    key: "ID",
  },
  { title: "Specialization", key: "Name" },
  { title: "Actions", key: "actions", sortable: false },
]);
const specializations = ref([]);
const editedIndex = ref(-1);
const editedItem = ref({
  name: "",
});
const defaultItem = ref({
  name: "",
});
const formTitle = computed(() => {
  return editedIndex.value === -1
    ? "New Specialization"
    : "Edit Specialization";
});

const dialogBtn = computed(() => {
  return editedIndex.value === -1 ? "Create" : "Save";
});

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

function editSpecialization(item) {
  HTTP.put("/specialization/" + item.ID, { name: item.Name })
    .then((response) => {
      auth.$patch({
        showAlert: true,
        message: response.data.Message,
        isError: false,
      });
    })
    .catch((error) => {
      console.error("Error edit specialization:", error);
      auth.$patch({
        showAlert: true,
        message:
          "An error occurred while editing the specialization. Please try again later.",
        isError: true,
      });
    });
}

function createSpecialization(item) {
  console.log("specialization : ", item);
  HTTP.post("/specialization/", { name: item.Name })
    .then((response) => {
      auth.$patch({
        showAlert: true,
        message: response.data.Message,
        isError: false,
      });
    })
    .catch((error) => {
      console.error("Error create role:", error);
      auth.$patch({
        showAlert: true,
        message:
          "An error occurred while creating the specialization. Please try again later.",
        isError: true,
      });
    });
}

function deleteSpecialization(item) {
  HTTP.delete("/specialization/" + item.ID)
    .then((response) => {
      auth.$patch({
        showAlert: true,
        message: response.data.Message,
        isError: false,
      });
    })
    .catch((error) => {
      console.error("Error delete specializations:", error);
      auth.$patch({
        showAlert: true,
        message:
          "An error occurred while deleting the category. Please try again later.",
        isError: true,
      });
    });
}

function initialize() {
  fetchspecializations();
}
function editItem(item) {
  editedIndex.value = specializations.value.indexOf(item);
  editedItem.value = Object.assign({}, item);
  dialog.value = true;
}
function deleteItem(item) {
  editedIndex.value = specializations.value.indexOf(item);
  editedItem.value = Object.assign({}, item);
  dialogDelete.value = true;
}
function deleteItemConfirm() {
  deleteSpecialization(editedItem.value);
  specializations.value.splice(editedIndex.value, 1);
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
    editSpecialization(editedItem.value);
    Object.assign(specializations.value[editedIndex.value], editedItem.value);
    initialize();
  } else {
    //Create
    createSpecialization(editedItem.value);
    specializations.value.push(editedItem.value);
    initialize();
  }
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
