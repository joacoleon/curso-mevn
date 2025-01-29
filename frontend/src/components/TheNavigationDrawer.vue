<template>
    <v-navigation-drawer app color="#2B2D42" temporary>
        <v-list v-model:selected="selected" nav>
          <v-list-item title="Home" :to="{ name: 'home' }" value="/"></v-list-item>
          <v-list-item title="Categories" :to="{ name: 'category' }" value="category"
            v-if="isAdmin || isStorage"></v-list-item>
            <v-list-item title="Users" :to="{ name: 'user' }" value="user"
            v-if="isAdmin"></v-list-item>
        </v-list>
        <template v-slot:append>
          <div class="pa-2">
            <v-btn variant="tonal" class="mb-2" block @click="copyToken()">
              Copy Token
            </v-btn>
            <v-btn variant="tonal" block @click="authStore.logout()">
              Logout
            </v-btn>
          </div>
        </template>
      </v-navigation-drawer>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useAuthStore } from '@/stores/AuthStore';

const authStore = useAuthStore();
const selected = ref([]);

function copyToken() {
  var text = document.createElement("textarea");
      document.body.appendChild(text);
      text.value = authStore.token;
      text.select();
      document.execCommand("copy");
      document.body.removeChild(text);
}

const isAdmin = computed(() => {
  return authStore.user && authStore.user.role.userTypeDescription == 'Admin';
})

const isSales = computed(() => {
  return authStore.user && authStore.user.role.userTypeDescription == 'Sales';
})

const isStorage = computed(() => {
  return authStore.user && authStore.user.role.userTypeDescription == 'Storage';
})
</script>