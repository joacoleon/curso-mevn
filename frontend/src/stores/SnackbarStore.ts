import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useSnackbarStore = defineStore('snackbarStore', () => {
    const snackbar = ref({
        show: false,
        message: '',
        color: ''
    })

    function setSnackbarStore(color: any, message: any) {
        snackbar.value.show = true;
        snackbar.value.color = color;
        snackbar.value.message = message;
    }

    function removeSnackbar(){
        snackbar.value.show = false;
        snackbar.value.color = '';
        snackbar.value.message = '';
    }

    return { snackbar, setSnackbarStore, removeSnackbar }
})