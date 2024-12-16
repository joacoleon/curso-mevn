import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/AuthStore'
import Login from '@/components/Login.vue'
import Home from '@/components/Home.vue'
import Category from '@/components/Category.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: {
        all: true
      }
    },
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: {
        admin: true,
        storage: true,
        sales: true
      }
    },
    {
      path: '/category',
      name: 'category',
      component: Category,
      meta: {
        admin: true,
        storage: true
      }
    },
    {
      path: '/:pathMatch(.*)', //TODO -> Ver de agregar una pantalla indicando que la pagina no existe
      redirect: '/'
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  authStore.overlay = false; //Si cambio de pantalla cuando se estaba llamando un servicio, saco el overlay

  if (to.matched.some(record => record.meta.all)) {
    next();
  } else if (authStore.user && authStore.user.role.userTypeDescription == 'Admin') {
    if (to.matched.some(record => record.meta.admin)) {
      next();
    }
  } else if (authStore.user && authStore.user.role.userTypeDescription == 'Sales') {
    if (to.matched.some(record => record.meta.sales)) {
      next();
    }
  } else if (authStore.user && authStore.user.role.userTypeDescription == 'Storage') {
    if (to.matched.some(record => record.meta.storage)) {
      next();
    }
  } else {
    next({ name: 'login' })
  }
})

export default router
