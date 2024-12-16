import { defineStore } from 'pinia';
import { jwtDecode } from 'jwt-decode';
import router from '@/router';
import { ref } from 'vue';

export const useAuthStore = defineStore('authStore', () => {
    const user = ref();
    const token = ref();

    function saveToken(newToken: any) {
        user.value = jwtDecode(newToken);
        token.value = newToken;
        localStorage.setItem("token", newToken);
    }

    function autoLogin() {
        let savedToken = localStorage.getItem("token");
        if (savedToken) {
            user.value = jwtDecode(savedToken);
            token.value = savedToken;
        }
    }

    function logout() {
        user.value = "";
        token.value = "";
        localStorage.removeItem("token");
        router.push({ name: 'login' });
    }

    return { user, token, saveToken, autoLogin, logout }
})