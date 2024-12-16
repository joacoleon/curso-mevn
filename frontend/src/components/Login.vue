<template>
    <v-container fluid class="fill-height justify-center">
        <v-card width="400">
            <v-form ref="loginForm" v-model="loginValidForm" @submit.prevent>
                <v-toolbar>
                    <v-toolbar-title>
                        Login
                    </v-toolbar-title>
                </v-toolbar>
                <v-card-text>
                    <v-container>
                        <v-row>
                            <v-col cols="12">
                                <v-text-field v-model="email" label="User" :rules="emailRules" required>
                                </v-text-field>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12">
                                <v-text-field v-model="password" label="Password" :type="showPassword ? 'text' : 'password'" :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'" :rules="passwordRules" @click:append-inner="showPassword = !showPassword" required>
                                </v-text-field>
                            </v-col>
                        </v-row>
                        <p class="text-error">{{ loginErrorMessage }}</p>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-row justify="center">
                        <v-col cols="auto">
                            <v-btn variant="tonal" block @click="login">
                                Login
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-card-actions>
            </v-form>
        </v-card>
    </v-container>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/AuthStore';
import { ref, watch } from 'vue'
import ApiHelper from '@/commons/ApiHelper';
import router from '@/router';

const authStore = useAuthStore();
const email = ref("");
const password = ref("");
const showPassword = ref(false);
const loginErrorMessage = ref("");

//VALIDATION
const loginForm = ref();
const loginValidForm = ref(false);
const emailRules = ref([
    (value: any) => {
        if (value) return true
        return 'Email is required.'
    },
    (value: any) => {
        if (value.length <= 50) return true
        return 'Email must be 50 characters or less.'
    }
]);
const passwordRules = ref([
    (value: any) => {
        if (value) return true
        return 'Password is required.'
    },
    (value: any) => {
        if (value.length <= 50) return true
        return 'Password must be 50 characters or less.'
    }
]);

async function validateLoginForm() {
    const { valid } = await loginForm.value.validate();
    return valid;
}

async function login() {
    if (await validateLoginForm()) {
        let user = {
            email: email.value,
            password: password.value
        }
        
        ApiHelper.post('user/login', user)
            .then(async (response) => {
                if (response.status == 200) {
                    authStore.saveToken(response.data.userToken);
                    router.push({ name: 'home' });
                }
            }).catch((e) => {
                loginErrorMessage.value = e.status == 404 ? e.response.data.message : 'An error occurred. Try again later.';
            })
    }
}

watch(email, val => {
    loginErrorMessage.value = "";
})

watch(password, val => {
    loginErrorMessage.value = "";
})
</script>