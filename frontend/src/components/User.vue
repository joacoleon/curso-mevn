<template>
    <v-container class="fill-height">
        <v-card height="100%" width="100%" class="pa-5">
            <h1>Users</h1>
            <v-breadcrumbs :items="items">
                <template v-slot:divider>
                    <v-icon icon="mdi-chevron-right"></v-icon>
                </template>
            </v-breadcrumbs>
            <v-card>
                <v-skeleton-loader :loading="isLoading" height="545" type="list-item, table-tbody, table-tfoot">
                    <v-data-table :headers="headers" :items="users" :search="search"
                        :sort-by="[{ key: 'name', order: 'asc' }]">
                        <template v-slot:top>
                            <v-toolbar color="#8D99AE">
                                <v-spacer v-if="!mobile"></v-spacer>
                                <v-text-field density="compact" base-color="#EDF2F4" variant="outlined"
                                    :class="['bg-white rounded', { 'ml-5': mobile }]" hide-details single-line
                                    append-inner-icon="mdi-magnify" v-model="search"></v-text-field>
                                <v-spacer></v-spacer>
                                <v-dialog v-model="dialog" max-width="500px">
                                    <template v-slot:activator="{ props }">
                                        <v-btn color="#2B2D42" v-bind="props">
                                            {{ mobile ? 'New' : 'New user' }}
                                        </v-btn>
                                    </template>
                                    <v-card>
                                        <v-form ref="userForm" v-model="userValidForm" @submit.prevent>
                                            <v-card-title>
                                                <span class="text-h5">{{ saveUserFormTitle }}</span>
                                            </v-card-title>
                                            <v-skeleton-loader :loading="isSaving" height="263"
                                                type="list-item@2, actions">
                                                <v-container>
                                                    <v-row>
                                                        <v-col cols="6">
                                                            <v-text-field v-model="selectedUser.email" label="Email"
                                                                :rules="categoryNameRules" required>
                                                            </v-text-field>
                                                        </v-col>
                                                        <v-col cols="6">
                                                            <v-text-field v-model="selectedUser.name" label="Name"
                                                                :rules="categoryNameRules" required>
                                                            </v-text-field>
                                                        </v-col>
                                                    </v-row>
                                                    <v-row>
                                                        <v-col cols="6">
                                                            <v-select v-model="selectedUser.id_type"
                                                                :items="userIdTypes" label="Id type"
                                                                item-title="identificationTypeDescription"
                                                                item-value="_id" required>
                                                            </v-select>
                                                        </v-col>
                                                        <v-col cols="6">
                                                            <v-text-field v-model="selectedUser.id_number"
                                                                label="Id number" :rules="categoryDescriptionRules">
                                                            </v-text-field>
                                                        </v-col>
                                                    </v-row>
                                                    <v-row>
                                                        <v-col cols="6">
                                                            <v-text-field v-model="selectedUser.address" label="Address"
                                                                :rules="categoryNameRules" required>
                                                            </v-text-field>
                                                        </v-col>
                                                        <v-col cols="6">
                                                            <v-text-field v-model="selectedUser.phone" label="Phone"
                                                                :rules="categoryNameRules" required>
                                                            </v-text-field>
                                                        </v-col>
                                                    </v-row>
                                                    <v-row>
                                                        <v-col cols="12">
                                                            <v-select v-model="selectedUser.role" :items="userTypes"
                                                                label="Role"
                                                                item-title="userTypeDescription" item-value="_id"
                                                                required>
                                                            </v-select>
                                                        </v-col>
                                                    </v-row>
                                                    <v-card-actions>
                                                        <v-spacer></v-spacer>
                                                        <v-btn color="blue-darken-1" variant="text"
                                                            @click="closeSaveUserModal">
                                                            Cancel
                                                        </v-btn>
                                                        <v-btn type="submit" color="blue-darken-1" variant="text"
                                                            @click="saveUser">
                                                            Save
                                                        </v-btn>
                                                    </v-card-actions>
                                                </v-container>
                                            </v-skeleton-loader>
                                        </v-form>
                                    </v-card>
                                </v-dialog>

                                <v-dialog v-model="statusDialog" max-width="640px">
                                    <v-card>
                                        <v-card-title class="text-h5">Are you sure you want to {{ selectedUser.isActive
                                            ?
                                            'disable' : 'enable' }}
                                            the user {{ selectedUser.name }}?</v-card-title>
                                        <v-card-actions>
                                            <v-spacer></v-spacer>
                                            <v-btn color="blue-darken-1" variant="text"
                                                @click="closeChangeUserStatusModal">Cancel</v-btn>
                                            <v-btn color="blue-darken-1" variant="text"
                                                @click="saveUserStatus">OK</v-btn>
                                            <v-spacer></v-spacer>
                                        </v-card-actions>
                                    </v-card>
                                </v-dialog>
                            </v-toolbar>
                        </template>
                        <template v-slot:item.isActive="{ value }">
                            <v-chip density="compact" size="small" :color="value ? 'green' : 'red'">
                                {{ value ? 'ACTIVE' : 'INACTIVE' }}
                            </v-chip>
                        </template>
                        <template v-slot:item.actions="{ item }: any">
                            <v-tooltip text="Edit" location="top">
                                <template v-slot:activator="{ props }">
                                    <v-icon v-bind="props" class="me-2" color="info" size="small"
                                        @click="openSaveUserModal(item)">
                                        mdi-pencil
                                    </v-icon>
                                </template>
                            </v-tooltip>
                            <v-tooltip text="Enable" location="top" v-if="!item.isActive">
                                <template v-slot:activator="{ props }">
                                    <v-icon v-bind="props" color="success" class="me-2" size="small"
                                        @click="openChangeUserStatusModal(item)">
                                        mdi-check-circle-outline
                                    </v-icon>
                                </template>
                            </v-tooltip>
                            <v-tooltip text="Disable" location="top" v-if="item.isActive">
                                <template v-slot:activator="{ props }">
                                    <v-icon v-bind="props" color="red" class="me-2" size="small"
                                        @click="openChangeUserStatusModal(item)">
                                        mdi-cancel
                                    </v-icon>
                                </template>
                            </v-tooltip>
                        </template>
                        <template v-slot:no-data>
                            <div v-if="getUsersServiceError">
                                <v-container>
                                    <v-icon color="grey" size="100">mdi-alert-circle-outline</v-icon>
                                    <p class="my-3">An error occurred. Try again later.</p>
                                    <v-btn color="primary" size="small" @click="init()">
                                        Retry
                                    </v-btn>
                                </v-container>
                            </div>
                            <div v-else-if="search">
                                <v-container>
                                    <p class="mb-3">No matches found for: <b>{{ search }}</b>.</p>
                                    <v-btn color="primary" @click="init()">
                                        Reset
                                    </v-btn>
                                </v-container>
                            </div>
                            <div v-else>
                                <v-container>
                                    <p>You have to create users in order to see them in this list.</p>
                                </v-container>
                            </div>
                        </template>
                    </v-data-table>
                </v-skeleton-loader>
            </v-card>
        </v-card>
    </v-container>
</template>

<script setup lang="ts">
import { useSnackbarStore } from '@/stores/SnackbarStore';
import { computed, nextTick, ref, watch } from 'vue';
import ApiHelper from '@/commons/ApiHelper';
import { useDisplay } from 'vuetify';

// #region VARIABLES
const snackbarStore = useSnackbarStore();
const { mobile } = useDisplay();

const items = ref([
    {
        title: 'Home',
        disabled: false,
        href: '/',
    },
    {
        title: 'Users',
        disabled: true,
        href: '/user',
    }
])
const search = ref("");
const users = ref<object[]>([]);
const userIdTypes = ref([]);
const userTypes = ref([]);
const dialog = ref(false);
const statusDialog = ref(false);
const headers = ref<object[]>([
    { title: 'Name', key: 'name', sortable: true },
    { title: 'Role', key: 'role.userTypeDescription', sortable: true },
    { title: 'Email', key: 'email', sortable: true },
    { title: 'Id type', key: 'id_type.identificationTypeDescription', sortable: true },
    { title: 'Id number', key: 'id_number', sortable: true },
    { title: 'Phone', key: 'phone', sortable: true },
    { title: 'Status', key: 'isActive', sortable: true },
    { title: 'Actions', key: 'actions', sortable: false }
])
const selectedUserIndex = ref(-1)
const selectedUser = ref({
    email: '',
    name: '',
    id_type: null,
    id_number: '',
    address: '',
    phone: '',
    role: null,
    isActive: true
})
const defaultUser = ref({
    email: '',
    name: '',
    id_type: null,
    id_number: '',
    description: '',
    address: '',
    phone: '',
    role: null,
    isActive: true
})
const isSaving = ref(false);
const isLoading = ref(false);

// VALIDATION
const userForm = ref();
const userValidForm = ref(false);
const categoryNameRules = ref([
    (value: any) => {
        if (value) return true
        return 'Category name is required.'
    },
    (value: any) => {
        if (value.length <= 50) return true
        return 'Category name must be 50 characters or less.'
    }
]);
const categoryDescriptionRules = ref([
    (value: any) => {
        if (value.length <= 255) return true
        return 'Category description must be 255 characters or less.'
    }
])

//ERROR HANDLING
const getUsersServiceError = ref(false);
// #endregion

// #region CREATED
init();
// #endregion

// #region METHODS
async function init() {
    search.value = "";
    await getUsers();

    //TODO -> Llamar estos 2 servicios al abrir el modal y bloquear el form con el skeleton
    await getIdTypes();
    await getRoles();
}

async function getUsers() {
    getUsersServiceError.value = false;
    isLoading.value = true;

    setTimeout(() => {
        ApiHelper.get('user/list')
            .then((response) => {
                users.value = response.data;
            }).catch((e) => {
                console.log(e);
                getUsersServiceError.value = true;
            }).finally(() => {
                isLoading.value = false;
            })
    }, 3000)
}

async function saveUser() { //Guarda, ya sea edicion o nuevo
    if (await validateUserForm()) { //Si el form es valido
        if (selectedUserIndex.value > -1) { //Si el index es mayor a -1, quiere decir que es una edicion
            editUser();
        } else { //Si el index no es mayor a -1, quiere decir que es una categoria nueva
            newUser();
        }
    }
}

async function validateUserForm() {
    const { valid } = await userForm.value.validate();
    return valid;
}

async function editUser() {
    isSaving.value = true;
    snackbarStore.removeSnackbar();

    setTimeout(() => {
        ApiHelper.put('user/update', selectedUser.value)
            .then(async (response) => {
                if (response.status == 200) {
                    closeSaveUserModal();
                    await getUsers();
                    snackbarStore.setSnackbarStore('success', 'User updated succesfully!');
                }
            }).catch((e) => {
                snackbarStore.setSnackbarStore('error', 'There was an error updating the user. Try again later.');
            }).finally(() => {
                isSaving.value = false;
            })
    }, 3000)
}

async function newUser() {
    isSaving.value = true;
    snackbarStore.removeSnackbar();

    setTimeout(() => {
        ApiHelper.post('user/add', selectedUser.value)
            .then(async (response) => {
                if (response.status == 200) {
                    closeSaveUserModal();
                    await getUsers();
                    snackbarStore.setSnackbarStore('success', 'SUCCESS');
                }
            }).catch((e) => {
                snackbarStore.setSnackbarStore('error', 'ERROR');
            }).finally(() => {
                isSaving.value = false;
            })
    }, 3000)
}

async function getIdTypes() {
    getUsersServiceError.value = false;
    isLoading.value = true;

    setTimeout(() => {
        ApiHelper.get('identificationType/list')
            .then((response) => {
                userIdTypes.value = response.data;
            }).catch((e) => {
                console.log(e);
                getUsersServiceError.value = true;
            }).finally(() => {
                isLoading.value = false;
            })
    }, 3000)
}

async function getRoles() {
    getUsersServiceError.value = false;
    isLoading.value = true;

    setTimeout(() => {
        ApiHelper.get('userType/list')
            .then((response) => {
                userTypes.value = response.data;
            }).catch((e) => {
                console.log(e);
                getUsersServiceError.value = true;
            }).finally(() => {
                isLoading.value = false;
            })
    }, 3000)
}

async function saveUserStatus() {
    if (selectedUser.value.isActive) {
        await disableUser();
    } else {
        await enableUser();
    }
}

async function enableUser() {
    ApiHelper.put('user/activate', selectedUser.value)
        .then(async (response) => {
            if (response.status == 200) {
                closeChangeUserStatusModal();
                await getUsers();
            }
        }).catch((e) => {
            console.log(e);
        })
}

async function disableUser() {
    ApiHelper.put('category/deactivate', selectedUser.value)
        .then(async (response) => {
            if (response.status == 200) {
                closeChangeUserStatusModal();
                await getUsers();
            }
        }).catch((e) => {
            console.log(e);
        })
}

function openSaveUserModal(item: any) { //Se llama al tocar el lapiz
    selectedUserIndex.value = users.value.indexOf(item); //editedIndex es igual al index de la categoria que le paso por parametro
    selectedUser.value = Object.assign({}, item);
    dialog.value = true;
}

function openChangeUserStatusModal(item: any) {
    selectedUserIndex.value = users.value.indexOf(item); //editedIndex es igual al index de la categoria que le paso por parametro
    selectedUser.value = Object.assign({}, item);
    statusDialog.value = true;
}

function closeSaveUserModal() { //Se llama despues de editar, agregar o cancelar
    dialog.value = false
    nextTick(() => {
        selectedUser.value = Object.assign({}, defaultUser.value)
        selectedUserIndex.value = -1
    })
}

function closeChangeUserStatusModal() {
    statusDialog.value = false
    nextTick(() => {
        selectedUser.value = Object.assign({}, defaultUser.value)
        selectedUserIndex.value = -1
    })
}

// #endregion

// #region COMPUTED
const saveUserFormTitle = computed(() => {
    return selectedUserIndex.value === -1 ? 'New user' : 'Edit user'
})
// #endregion

// #region WATCHES
watch(dialog, val => { //TODO -> Ver para que sirve esto
    val || closeSaveUserModal()
})
// #endregion
</script>

<style scoped>
.v-toolbar-title {
    /* Para sacarle el espacio a la derecha y poder alinear el text-field */
    flex: none;
}
</style>