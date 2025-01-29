import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/AuthStore'
import Login from '@/components/Login.vue'
import Home from '@/components/Home.vue'
import Category from '@/components/Category.vue'
import User from '@/components/User.vue'
import PageNotFound from '@/components/PageNotFound.vue'
import ChangePassword from '@/components/ChangePassword.vue'

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
      path: '/changePassword',
      name: 'changePassword',
      component: ChangePassword,
      meta: {
        changePassword: true
      }
    },
    {
      path: '/',
      alias: '/home',
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
      path: '/user',
      name: 'user',
      component: User,
      meta: {
        admin: true
      }
    },
    {
      path: '/:pathMatch(.*)?',
      name: '404',
      component: PageNotFound,
      meta: {
        all: true
      }
    }
  ]
})

router.beforeEach(async (to, from, next) => { // TODO -> Allow all users to change their passwords
  const authStore = useAuthStore();
  if (to.matched.some(record => record.meta.all)) {
    next();
  } else if (authStore.user) {
    if (authStore.user.hasDefaultPassword) {
      if (to.matched.some(record => record.meta.changePassword)) {
        next();
      } else {
        next({ name: 'changePassword' })
      }
    } else {
      if (authStore.user.role.userTypeDescription == 'Admin') {
        if (to.matched.some(record => record.meta.admin)) {
          next();
        } else {
          next({ name: '404' })
        }
      } else if (authStore.user.role.userTypeDescription == 'Sales') {
        if (to.matched.some(record => record.meta.sales)) {
          next();
        } else {
          next({ name: '404' })
        }
      } else if (authStore.user.role.userTypeDescription == 'Storage') {
        if (to.matched.some(record => record.meta.storage)) {
          next();
        } else {
          next({ name: '404' })
        }
      }
    }
  } else {
    next({ name: 'login' })
  }
})

export default router
