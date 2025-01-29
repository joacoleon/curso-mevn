<template>
    <v-container fluid class="fill-height justify-center">
        <v-card width="400">
            <v-form ref="changePasswordForm" v-model="changePasswordValidForm" @submit.prevent>
                <v-toolbar>
                    <v-toolbar-title>
                        Change password
                    </v-toolbar-title>
                </v-toolbar>
                <v-card-text>
                    <v-container>
                        <v-row>
                            <v-col cols="12">
                                <v-text-field v-model="password" label="Password" :type="showPassword ? 'text' : 'password'" :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'" :rules="passwordRules" @click:append-inner="showPassword = !showPassword" required>
                                </v-text-field>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12">
                                <v-text-field v-model="repeatPassword" label="Repeat password" :type="showPassword ? 'text' : 'password'" :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'" :rules="passwordRules" @click:append-inner="showPassword = !showPassword" required>
                                </v-text-field>
                            </v-col>
                        </v-row>
                        <p class="text-error">{{ changePasswordErrorMessage }}</p>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-row justify="center">
                        <v-col cols="auto">
                            <v-btn variant="tonal" block @click="changePassword">
                                Confirm
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

const authStore = useAuthStore();
const password = ref("");
const repeatPassword = ref("");
const showPassword = ref(false);
const changePasswordErrorMessage = ref("");

//VALIDATION
const changePasswordForm = ref();
const changePasswordValidForm = ref(false);
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

async function validateChangePasswordForm() {
    const { valid } = await changePasswordForm.value.validate();
    return valid;
}

async function changePassword() {
    if (await validateChangePasswordForm()) {
        let user = {
            _id: authStore.user._id,
            password: password.value
        }
        
        ApiHelper.put('user/changePassword', user)
            .then(async (response) => {
                if (response.status == 200) {
                    authStore.logout();
                }
            }).catch((e) => {
                changePasswordErrorMessage.value = e.status == 404 ? e.response.data.message : 'An error occurred. Try again later.';
            })
    }
}

watch(password, val => {
    changePasswordErrorMessage.value = "";
})

watch(repeatPassword, val => {
    changePasswordErrorMessage.value = "";
})
</script>