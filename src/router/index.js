import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
    {
        path: '/',
        name: 'dashboard',
        component: () => import('@/views/Dashboard.vue'),
        meta: { requiresAuth: true, requiresEmailVerified: true }
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/auth/Login.vue'),
        meta: { requiresGuest: true }
    },
    {
        path: '/register',
        name: 'register',
        component: () => import('@/views/auth/Register.vue'),
        meta: { requiresGuest: true }
    },
    {
        path: '/forgot-password',
        name: 'forgot-password',
        component: () => import('@/views/auth/ForgotPassword.vue'),
        meta: { requiresGuest: true }
    },
    {
        path: '/forgot-password/verify-otp',
        name: 'forgot-password-verify-otp',
        component: () => import('@/views/auth/ForgotPasswordVerifyOtp.vue'),
        meta: { requiresGuest: true }
    },
    {
        path: '/forgot-password/reset-password',
        name: 'forgot-password-reset',
        component: () => import('@/views/auth/ForgotPasswordReset.vue'),
        meta: { requiresGuest: true }
    },
    {
        path: '/email-verification',
        name: 'email-verification',
        component: () => import('@/views/auth/EmailVerification.vue'),
        meta: { requiresAuth: true }
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

// Track redirect attempts to prevent infinite loops
let redirectAttempts = 0
const MAX_REDIRECT_ATTEMPTS = 3

router.beforeEach((to, from, next) => {
    const authStore = useAuthStore()

    // Check sessionStorage directly to see if there's a mismatch
    let sessionToken = null
    let sessionUser = null
    try {
        if (typeof window !== 'undefined' && window.sessionStorage) {
            sessionToken = sessionStorage.getItem('auth_token')
            const userStr = sessionStorage.getItem('user')
            sessionUser = userStr ? JSON.parse(userStr) : null
        }
    } catch (error) {
        console.error('Error reading from sessionStorage:', error)
    }


    // Reset redirect attempts if we're navigating to a different path
    if (to.path !== from.path) {
        redirectAttempts = 0
    }

    // Prevent infinite loops by checking redirect attempts
    if (redirectAttempts >= MAX_REDIRECT_ATTEMPTS) {
        redirectAttempts = 0
        next()
        return
    }

    // Prevent infinite loops by checking if we're already on the target page
    if (to.path === from.path) {
        next()
        return
    }

    // Use sessionStorage values as fallback if authStore is not properly initialized
    const isAuthenticated = authStore.isAuthenticated || !!sessionToken
    const user = authStore.user || sessionUser
    const isEmailVerified = user && !!user.email_verified_at

    if (to.meta.requiresAuth && !isAuthenticated) {
        if (to.path !== '/login') {
            redirectAttempts++
            next('/login')
        } else {
            next()
        }
    } else if (to.meta.requiresGuest && isAuthenticated) {
        if (to.path !== '/') {
            redirectAttempts++
            next('/')
        } else {
            next()
        }
    } else if (to.meta.requiresEmailVerified && user && !isEmailVerified) {
        if (to.path !== '/email-verification') {
            redirectAttempts++
            next('/email-verification')
        } else {
            next()
        }
    } else {
        redirectAttempts = 0
        next()
    }
})

export default router

