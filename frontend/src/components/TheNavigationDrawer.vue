<template>
  <v-navigation-drawer app color="#2B2D42" temporary :model-value="drawer"
  @update:model-value="emit('update:model-value', $event)">
    <v-list v-model:selected="selected" nav>
      <v-list-item title="Home" :to="{ name: 'home' }" value="/"></v-list-item>
      <v-list-item title="Categories" :to="{ name: 'category' }" value="category"
        v-if="isAdmin || isStorage"></v-list-item>
      <v-list-item title="Users" :to="{ name: 'user' }" value="user" v-if="isAdmin"></v-list-item>
    </v-list>
    <template v-slot:append>
      <div class="pa-2">
        <v-btn variant="tonal" class="mb-2" block @click="goToChangePassword()">
          Change password
        </v-btn>
        <v-btn variant="tonal" class="mb-2" block @click="copyToken()" v-if="isDevelopment">
          Copy token
        </v-btn>
        <v-btn variant="tonal" block @click="logout()">
          Logout
        </v-btn>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useAuthStore } from '@/stores/AuthStore';
import router from '@/router';
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  modelValue: Boolean, // modelValue replaces "drawer"
});

const emit = defineEmits(['update:model-value']);

const drawer = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:model-value', value),
});

function logout() {
  emit('update:model-value', false);
  authStore.logout();
}

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

function goToChangePassword() {
  router.push({ name: 'changePassword' });
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

const isDevelopment = computed(() => import.meta.env.MODE === 'development');
</script>