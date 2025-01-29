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

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  // Allow access to routes with 'meta.all' set (public routes like login, 404, etc.)
  if (to.matched.some(record => record.meta.all)) {
    return next();
  }

  if (authStore.user) {
    // Allow all authenticated users to access the changePassword route
    if (to.name === 'changePassword') {
      return next(); // Allow user to visit the changePassword route
    }

    // If the user has a default password, redirect them to change password page
    if (authStore.user.hasDefaultPassword) {
      return next({ name: 'changePassword' });
    }

    // Define a mapping for roles to required meta properties
    const roleRouteMap = {
      'Admin': 'admin',
      'Sales': 'sales',
      'Storage': 'storage',
    };

    const userRole = authStore.user.role.userTypeDescription as keyof typeof roleRouteMap;

    // Check if the user role has a corresponding route and meta permissions
    if (roleRouteMap[userRole]) {
      return to.matched.some(record => record.meta[roleRouteMap[userRole]])
        ? next()
        : next({ name: '404' });
    }

    // If no matching role found, redirect to a 404 page
    return next({ name: '404' });
  }

  // If the user is not authenticated, redirect to the login page
  next({ name: 'login' });
});


export default router
