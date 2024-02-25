<template>
  <v-container>
    <v-responsive>
  <v-data-table :headers="headers" :items="roles" :sort-by="[{ key: 'id', order: 'asc' }]">
    <template v-slot:top>
      <v-toolbar color="grey-darken-3" rounded flat>
      <v-toolbar-title>Roles Management</v-toolbar-title>
          <v-divider class="mx-5" inset vertical></v-divider>
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ props }">
              <v-btn color="success" elevation="4" variant="outlined" v-bind="props">
                <v-icon start>mdi-plus-box</v-icon>
                New Role
              </v-btn>
            </template>
            <v-card>
              <v-toolbar :color="formTitle == 'New Role' ? 'primary' : 'info'" :title=formTitle></v-toolbar>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6" md="12">
                    <v-text-field v-model="editedItem.name" label="Role Name"></v-text-field>
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
            <v-toolbar color="red" title="Delete Role"></v-toolbar>
              <v-card-title class="text-h6 text-center ">Are you sure you want to delete this role?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue-darken-1" variant="text" @click="closeDelete">Cancel</v-btn>
              <v-btn color="red-darken-1" variant="text" @click="deleteItemConfirm">OK</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:[`item.actions`]="{ item }">
      <v-icon size="small" color="blue" class="me-2" @click="editItem(item)">
        mdi-pencil
      </v-icon>
      <v-icon size="small" color="red" @click="deleteItem(item)">
        mdi-delete
      </v-icon>
    </template>
    <template v-slot:no-data>
      <v-btn color="primary" @click="initialize">
        Load Data
      </v-btn>
    </template>
  </v-data-table>
  </v-responsive>
  </v-container>
</template>
<script setup>
import { HTTP } from '@/config';
import { useAuth } from '@/store/useAuthentication';
import { computed, nextTick, ref, watch } from 'vue'

const auth = useAuth()
const dialog = ref(false)
const dialogDelete = ref(false)
const headers = ref([
  {
    title: 'ID',
    align: 'start',
    sortable: false,
    key: 'id',
  },
  { title: 'Role', key: 'name' },
  { title: 'Actions', key: 'actions', sortable: false },
])
const roles = ref([])
const editedIndex = ref(-1)
const editedItem = ref({
  name: '',
})
const defaultItem = ref({
  name: '',

})
const formTitle = computed(() => {
  return editedIndex.value === -1 ? 'New Role' : 'Edit Role'
})

const dialogBtn = computed(() => {
  return editedIndex.value === -1 ? 'Create' : 'Save'
})

function fetchRoles()
{
  HTTP.get('/role')
    .then(response => {
      roles.value = response.data.data;
      console.log(roles.value);
      console.log("roles :", response.data.data);
    })
    .catch(error => {
      console.error('Error fetching roles:', error);
    });
}

function editRole(item) {
  HTTP.put('/role/' + item.id ,{name: item.name})
    .then(response => {
      auth.$patch({ showAlert: true, message: response.data.Message, isError: false });
      initialize
    })
    .catch(error => {
      console.error('Error edit roles:', error);
      auth.$patch({
        showAlert: true,
        message: "An error occurred while editing the role. Please try again later.",
        isError: true
      });
    });
}

function createRole(item) {
  HTTP.post('/role/', { name: item.name })
    .then(response => {
      auth.$patch({ showAlert: true, message: response.data.Message, isError: false });
      initialize
    })
    .catch(error => {
      console.error('Error create role:', error);
      auth.$patch({
        showAlert: true,
        message: "An error occurred while creating the role. Please try again later.",
        isError: true
      });
    });
}

function deleteRole(item) {
  HTTP.delete('/role/' + item.id)
    .then(response => {
      auth.$patch({ showAlert: true, message: response.data.Message, isError: false });
      initialize
    })
    .catch(error => {
      console.error('Error delete roles:', error);
      auth.$patch({
        showAlert: true,
        message: "An error occurred while deleting the role. Please try again later.",
        isError: true
      });
    });
}

function initialize() {
  fetchRoles();

}
function editItem(item) {
  editedIndex.value = roles.value.indexOf(item)
  editedItem.value = Object.assign({}, item)
  dialog.value = true
}
function deleteItem(item) {
  editedIndex.value = roles.value.indexOf(item)
  editedItem.value = Object.assign({}, item)
  dialogDelete.value = true
}
function deleteItemConfirm() {
  deleteRole(editedItem.value)
  roles.value.splice(editedIndex.value, 1)
  closeDelete()
}
function close() {
  dialog.value = false
  nextTick(() => {
    editedItem.value = Object.assign({}, defaultItem.value)
    editedIndex.value = -1
  })
}
function closeDelete() {
  dialogDelete.value = false
  nextTick(() => {
    editedItem.value = Object.assign({}, defaultItem.value)
    editedIndex.value = -1
  })
}
function save() {
  if (editedIndex.value > -1) {
    //Edit
    editRole(editedItem.value)
    Object.assign(roles.value[editedIndex.value], editedItem.value)
  } else {
    //Create
    createRole(editedItem.value)
    console.log("Created Role:" , editedItem.value)
    roles.value.push(editedItem.value)
  }
  close()
}
watch(dialog, val => {
  val || close()
})
watch(dialogDelete, val => {
  val || closeDelete()
})
initialize()
</script>
