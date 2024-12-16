<template>
    <v-footer app color="#FFFFFF" border elevation="24">
        <v-row justify="center" no-gutters>
            <v-btn v-for="link in links" :key="link" class="mx-2" rounded="xl" variant="text">
                {{ link }}
            </v-btn>
            <v-col class="text-center mt-4" cols="12">
                {{ new Date().getFullYear() }} — <strong>Vuetify</strong>
            </v-col>
        </v-row>
    </v-footer>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const links = ref([
    'Home',
    'About Us',
    'Team',
    'Services',
    'Blog',
    'Contact Us',
])
</script>