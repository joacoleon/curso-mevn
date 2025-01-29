import { defineStore } from 'pinia';
import { jwtDecode } from 'jwt-decode';
import router from '@/router';
import { ref } from 'vue';

export const useAuthStore = defineStore('authStore', () => {
    const user = ref();
    const token = ref();

    function saveToken(newToken: any, newUser: any) { //Le paso el usuario para setear si tiene default password o no
        user.value = newUser;
        token.value = newToken;
        localStorage.setItem("token", newToken);
        localStorage.setItem("hasDefaultPassword", user.value.hasDefaultPassword);
    }

    function autoLogin() { //Revisar aca, se pierde el booleano
        let savedToken = localStorage.getItem("token");
        if (savedToken) {
            user.value = jwtDecode(savedToken);
            user.value.hasDefaultPassword = localStorage.getItem("hasDefaultPassword") === "true" ? true : false;
            if (Date.now() >= user.value.exp * 1000) { //Si el token expiro
                logout();
            } else {
                token.value = savedToken;
            }
        }
    }

    function logout() {
        user.value = "";
        token.value = "";
        localStorage.removeItem("token");
        localStorage.removeItem("hasDefaultPassword");
        router.push({ name: 'login' });
    }

    return { user, token, saveToken, autoLogin, logout }
})