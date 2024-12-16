<template>
    <v-snackbar transition="scale-transition" multi-line location="top right" :color="snackbar.color" timeout="5000" v-model="snackbar.show">
        <v-container>
            <v-row>
                <v-col cols="2" class="d-flex align-center justify-center">
                    <v-icon size="50">{{ snackbarIcon }}</v-icon>
                </v-col>
                <v-col cols="10">
                    <strong>{{ snackbarTitle }}</strong>
                    <p>{{ snackbar.message }} </p>
                </v-col>
            </v-row>
        </v-container>
    </v-snackbar>
</template>

<script setup lang="ts">
import { computed, toRefs } from 'vue';

interface Snackbar {
    show: boolean,
    message: string,
    color: string
}

const props = defineProps<{
    snackbar: Snackbar
}>()

const { snackbar } = toRefs(props);

const snackbarTitle = computed(() => {
    return snackbar.value.color == 'error' ? 'Error' : 'Success';
})

const snackbarIcon = computed(() => {
    return snackbar.value.color == 'error' ? 'mdi-alert-circle-outline' : 'mdi-check-circle-outline';
})

</script>