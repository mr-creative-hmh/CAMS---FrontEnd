<template>
  <v-container>
    <v-responsive>
      <v-data-table
        :headers="headers"
        :items="clinics"
        :sort-by="[{ key: 'id', order: 'asc' }]"
      >
        <template v-slot:top>
          <v-toolbar color="grey-darken-3" rounded flat>
            <v-toolbar-title
              ><v-icon>mdi-hospital-building</v-icon> Clinics
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
                  New Clinic
                </v-btn>
              </template>
              <v-card>
                <v-toolbar
                  :color="formTitle == 'New Clinic ' ? 'primary' : 'info'"
                  :title="formTitle"
                ></v-toolbar>
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" sm="6" md="12">
                        <v-text-field
                          v-model="editedItem.Name"
                          label="Name"
                        ></v-text-field>
                        <v-text-field
                          v-model="editedItem.Address"
                          label="Address"
                        ></v-text-field>
                        <v-text-field
                          v-model="editedItem.Phone"
                          label="Phone"
                        ></v-text-field>
                        <v-text-field
                          v-model="editedItem.OpenHours"
                          label="Open Hours"
                        ></v-text-field>
                        <v-select
                          v-model="editedItem.Category"
                          label="Category"
                          :items="categories"
                          item-title="Name"
                          item-value="ID"
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
                <v-toolbar color="red" title="Delete Clinic"></v-toolbar>
                <v-card-title class="text-h6 text-center"
                  >Are you sure you want to delete this Clinic?</v-card-title
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
  { title: "Name", key: "Name" },
  { title: "Address", key: "Address" },
  { title: "Phone", key: "Phone" },
  { title: "Open Hours", key: "OpenHours" },
  { title: "Category", key: "Category.Name" },
  { title: "Actions", key: "actions", sortable: false },
]);
const clinics = ref([]);
const categories = ref([]);
const editedIndex = ref(-1);
const editedItem = ref({
  Name: "",
  Address: "",
  Phone: "",
  OpenHours: "",
  Category: { ID: "", Name: "" }, // Update the structure to include Category ID
});
const defaultItem = ref({
  Name: "",
  Address: "",
  Phone: "",
  OpenHours: "",
  Category: { ID: "", Name: "" },
});
const formTitle = computed(() => {
  return editedIndex.value === -1 ? "New Clinic" : "Edit Clinic";
});

const dialogBtn = computed(() => {
  return editedIndex.value === -1 ? "Create" : "Save";
});

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

function fetchcategories() {
  HTTP.get("/category")
    .then((response) => {
      categories.value = response.data.data;
      console.log(categories.value);
      console.log("categories :", response.data.data);
    })
    .catch((error) => {
      console.error("Error fetching categories:", error);
    });
}

function editClinic(item) {
  HTTP.put("/clinic/" + item.ID, {
    name: item.Name,
    address: item.Address,
    phone: item.Phone,
    operating_hours: item.OpenHours,
    category_id: item.Category,
  })
    .then((response) => {
      auth.$patch({
        showAlert: true,
        message: response.data.Message,
        isError: false,
      });
    })
    .catch((error) => {
      console.error("Error edit clinic:", error);
      auth.$patch({
        showAlert: true,
        message: error.response.data.message,
        isError: true,
      });
    });
}

function createClinic(item) {
  console.log("clinic : ", item);
  HTTP.post("/clinic/", {
    name: item.Name,
    address: item.Address,
    phone: item.Phone,
    operating_hours: item.OpenHours,
    category_id: item.Category,
  })
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
        message: error.response.data.message,
        isError: true,
      });
    });
}

function deleteClinic(item) {
  HTTP.delete("/clinic/" + item.ID)
    .then((response) => {
      auth.$patch({
        showAlert: true,
        message: response.data.Message,
        isError: false,
      });
    })
    .catch((error) => {
      console.error("Error delete clinics:", error);
      auth.$patch({
        showAlert: true,
        message: error.response.data.message,
        isError: true,
      });
    });
}

function initialize() {
  fetchclinics();
  fetchcategories();
}
function editItem(item) {
  editedIndex.value = clinics.value.indexOf(item);
  editedItem.value = Object.assign({}, item);
  dialog.value = true;
}
function deleteItem(item) {
  editedIndex.value = clinics.value.indexOf(item);
  editedItem.value = Object.assign({}, item);
  dialogDelete.value = true;
}
function deleteItemConfirm() {
  deleteClinic(editedItem.value);
  clinics.value.splice(editedIndex.value, 1);
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
    editClinic(editedItem.value);
    Object.assign(clinics.value[editedIndex.value], editedItem.value);
    initialize();
  } else {
    //Create
    createClinic(editedItem.value);
    clinics.value.push(editedItem.value);
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

<style scoped>
/* Add any custom styles here */
.loading-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 65vh; /* Adjust height as needed */
}

/* Center the loading spinner */
.v-progress-circular {
  margin: 0 auto;
}
</style>
