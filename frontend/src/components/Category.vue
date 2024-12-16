<template>
    <v-container>
        <h1>Categories</h1>
        <v-breadcrumbs :items="items">
            <template v-slot:divider>
                <v-icon icon="mdi-chevron-right"></v-icon>
            </template>
        </v-breadcrumbs>
        <v-card>
            <v-skeleton-loader :loading="isLoading" height="545" type="list-item, table-tbody, table-tfoot"
                class="p-3">
                <v-data-table :headers="headers" :items="categories" :search="search"
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
                                        {{ mobile ? 'New' : 'New category' }}
                                    </v-btn>
                                </template>
                                <v-card>
                                    <v-form ref="categoryForm" v-model="categoryValidForm" @submit.prevent>
                                        <v-card-title>
                                            <span class="text-h5">{{ saveCategoryFormTitle }}</span>
                                        </v-card-title>
                                        <v-skeleton-loader :loading="isSaving"
                                            height="263"
                                            type="list-item@2, actions">
                                            <v-container>
                                                    <v-row>
                                                        <v-col cols="12">
                                                            <v-text-field v-model="selectedCategory.name"
                                                                label="Category name" :rules="categoryNameRules"
                                                                required>
                                                            </v-text-field>
                                                        </v-col>
                                                    </v-row>
                                                    <v-row>
                                                        <v-col cols="12">
                                                            <v-text-field v-model="selectedCategory.description"
                                                                label="Category description"
                                                                :rules="categoryDescriptionRules">
                                                            </v-text-field>
                                                        </v-col>
                                                    </v-row>
                                                <v-card-actions>
                                                    <v-spacer></v-spacer>
                                                    <v-btn color="blue-darken-1" variant="text"
                                                        @click="closeSaveCategoryModal">
                                                        Cancel
                                                    </v-btn>
                                                    <v-btn type="submit" color="blue-darken-1" variant="text"
                                                        @click="saveCategory">
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
                                    <v-card-title class="text-h5">Are you sure you want to {{ selectedCategory.isActive
                                        ?
                                        'disable' : 'enable' }}
                                        the category {{ selectedCategory.name }}?</v-card-title>
                                    <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <v-btn color="blue-darken-1" variant="text"
                                            @click="closeChangeCategoryStatusModal">Cancel</v-btn>
                                        <v-btn color="blue-darken-1" variant="text"
                                            @click="saveCategoryStatus">OK</v-btn>
                                        <v-spacer></v-spacer>
                                    </v-card-actions>
                                </v-card>
                            </v-dialog>
                        </v-toolbar>
                    </template>
                    <template v-slot:item.isActive="{ value }">
                        <v-chip label density="compact" :color="value ? 'green' : 'red'">
                            {{ value ? 'ACTIVE' : 'INACTIVE' }}
                        </v-chip>
                    </template>
                    <template v-slot:item.actions="{ item }: any">
                        <v-tooltip text="Edit" location="top">
                            <template v-slot:activator="{ props }">
                                <v-icon v-bind="props" class="me-2" color="info" size="small"
                                    @click="openSaveCategoryModal(item)">
                                    mdi-pencil
                                </v-icon>
                            </template>
                        </v-tooltip>
                        <v-tooltip text="Enable" location="top" v-if="!item.isActive">
                            <template v-slot:activator="{ props }">
                                <v-icon v-bind="props" color="success" class="me-2" size="small"
                                    @click="openChangeCategoryStatusModal(item)">
                                    mdi-check-circle-outline
                                </v-icon>
                            </template>
                        </v-tooltip>
                        <v-tooltip text="Disable" location="top" v-if="item.isActive">
                            <template v-slot:activator="{ props }">
                                <v-icon v-bind="props" color="red" class="me-2" size="small"
                                    @click="openChangeCategoryStatusModal(item)">
                                    mdi-cancel
                                </v-icon>
                            </template>
                        </v-tooltip>
                    </template>
                    <template v-slot:no-data>
                        <div v-if="getCategoriesServiceError">
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
                                <p>You have to create categories in order to see them in this list.</p>
                            </v-container>
                        </div>
                    </template>
                </v-data-table>
            </v-skeleton-loader>
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
        title: 'Categories',
        disabled: true,
        href: '/category',
    }
])
const search = ref("");
const categories = ref<object[]>([]); //TODO -> Ver si esto esta bien
const dialog = ref(false);
const statusDialog = ref(false);
const headers = ref<object[]>([
    { title: 'Name', key: 'name', sortable: true },
    { title: 'Description', key: 'description', sortable: true },
    { title: 'Status', key: 'isActive', sortable: true },
    { title: 'Actions', key: 'actions', sortable: false }
])
const selectedCategoryIndex = ref(-1)
const selectedCategory = ref({
    name: '',
    description: '',
    isActive: true
})
const defaultCategory = ref({
    name: '',
    description: '',
    isActive: true
})
const isSaving = ref(false);
const isLoading = ref(false);

// VALIDATION
const categoryForm = ref();
const categoryValidForm = ref(false);
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
const getCategoriesServiceError = ref(false);
// #endregion

// #region CREATED
init();
// #endregion

// #region METHODS
async function init() {
    search.value = "";
    await getCategories();
}

async function getCategories() {
    getCategoriesServiceError.value = false;
    isLoading.value = true;

    setTimeout(() => {
        ApiHelper.get('category/list')
            .then((response) => {
                categories.value = response.data;
            }).catch((e) => {
                console.log(e);
                getCategoriesServiceError.value = true;
            }).finally(() => {
                isLoading.value = false;
            })
    }, 3000)
}

async function saveCategory() { //Guarda, ya sea edicion o nuevo
    if (await validateCategoryForm()) { //Si el form es valido
        if (selectedCategoryIndex.value > -1) { //Si el index es mayor a -1, quiere decir que es una edicion
            editCategory();
        } else { //Si el index no es mayor a -1, quiere decir que es una categoria nueva
            newCategory();
        }
    }
}

async function validateCategoryForm() {
    const { valid } = await categoryForm.value.validate();
    return valid;
}

async function editCategory() {
    isSaving.value = true;
    snackbarStore.removeSnackbar();

    setTimeout(() => {
        ApiHelper.put('category/update', selectedCategory.value)
            .then(async (response) => {
                if (response.status == 200) {
                    closeSaveCategoryModal();
                    await getCategories();
                    snackbarStore.setSnackbarStore('success', 'Category updated succesfully!');
                }
            }).catch((e) => {
                snackbarStore.setSnackbarStore('error', 'There was an error updating the category. Try again later.');
            }).finally(() => {
                isSaving.value = false;
            })
    }, 3000)
}

async function newCategory() {
    isSaving.value = true;
    snackbarStore.removeSnackbar();

    setTimeout(() => {
        ApiHelper.post('category/add', selectedCategory.value)
            .then(async (response) => {
                if (response.status == 200) {
                    closeSaveCategoryModal();
                    await getCategories();
                    snackbarStore.setSnackbarStore('success', 'SUCCESS');
                }
            }).catch((e) => {
                snackbarStore.setSnackbarStore('error', 'ERROR');
            }).finally(() => {
                isSaving.value = false;
            })
    }, 3000)
}

async function saveCategoryStatus() {
    if (selectedCategory.value.isActive) {
        await disableItem();
    } else {
        await enableItem();
    }
}

async function enableItem() {
    ApiHelper.put('category/activate', selectedCategory.value)
        .then(async (response) => {
            if (response.status == 200) {
                closeChangeCategoryStatusModal();
                await getCategories();
            }
        }).catch((e) => {
            console.log(e);
        })
}

async function disableItem() {
    ApiHelper.put('category/deactivate', selectedCategory.value)
        .then(async (response) => {
            if (response.status == 200) {
                closeChangeCategoryStatusModal();
                await getCategories();
            }
        }).catch((e) => {
            console.log(e);
        })
}

function openSaveCategoryModal(item: any) { //Se llama al tocar el lapiz
    selectedCategoryIndex.value = categories.value.indexOf(item); //editedIndex es igual al index de la categoria que le paso por parametro
    selectedCategory.value = Object.assign({}, item);
    dialog.value = true;
}

function openChangeCategoryStatusModal(item: any) {
    selectedCategoryIndex.value = categories.value.indexOf(item); //editedIndex es igual al index de la categoria que le paso por parametro
    selectedCategory.value = Object.assign({}, item);
    statusDialog.value = true;
}

function closeSaveCategoryModal() { //Se llama despues de editar, agregar o cancelar
    dialog.value = false
    nextTick(() => {
        selectedCategory.value = Object.assign({}, defaultCategory.value)
        selectedCategoryIndex.value = -1
    })
}

function closeChangeCategoryStatusModal() {
    statusDialog.value = false
    nextTick(() => {
        selectedCategory.value = Object.assign({}, defaultCategory.value)
        selectedCategoryIndex.value = -1
    })
}

// #endregion

// #region COMPUTED
const saveCategoryFormTitle = computed(() => {
    return selectedCategoryIndex.value === -1 ? 'New category' : 'Edit category'
})
// #endregion

// #region WATCHES
watch(dialog, val => { //TODO -> Ver para que sirve esto
    val || closeSaveCategoryModal()
})
// #endregion
</script>

<style scoped>
.v-toolbar-title {
    /* Para sacarle el espacio a la derecha y poder alinear el text-field */
    flex: none;
}

/*::v-deep(th) {
    background-color: red;

    When using scoped sometimes it is required to use ::v-deep(...) wrapper because 
    scoped styles try to be smart and apply to only the classes used in the template 
    but the algorithm won't resolve classes hidden inside components. I suggest ::v-deep(.v-table) > .v-table__wrapper > ... 
}*/
</style>