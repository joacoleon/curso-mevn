<template>
  <v-app>
    <div v-if="userLogged">
      <v-app-bar app color="#FFFFFF">
        <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
        <v-app-bar-title>MEVN APP</v-app-bar-title>
      </v-app-bar>
      
      <NavigationDrawer :model-value="drawer" @update:model-value="drawer = $event"></NavigationDrawer>
    </div>

    <v-main app>
      <RouterView />
    </v-main>
    <Footer></Footer>

    <FeedbackSnackbar :snackbar="snackbarStore.snackbar"></FeedbackSnackbar> 
  </v-app>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterView } from 'vue-router'
import { useAuthStore } from './stores/AuthStore';
import { useSnackbarStore } from './stores/SnackbarStore';
import NavigationDrawer from './components/TheNavigationDrawer.vue';
import Footer from './components/TheFooter.vue';
import FeedbackSnackbar from './components/TheFeedbackSnackbar.vue';

// #region VARIABLES
const authStore = useAuthStore();
const snackbarStore = useSnackbarStore();
const drawer = ref(false);
// #endregion

// #region CREATED
init();
// #endregion

// #region METHODS
function init() {
  authStore.autoLogin();
}
// #endregion

// #region COMPUTED
const userLogged = computed(() => {
  return authStore.user;
})
// #endregion
</script>

<style>

</style>
