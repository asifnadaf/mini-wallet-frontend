import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toastification'
import { useRoute } from 'vue-router'

export function useActivityTracker(options = {}) {
    const authStore = useAuthStore()
    const toast = useToast()
    const route = useRoute()

    // Configuration - allow override for testing
    const INACTIVITY_TIMEOUT = options.inactivityTimeout || 2 * 60 * 1000 // 2 minutes in milliseconds
    const WARNING_TIME = options.warningTime || 1 * 60 * 1000 // 1 minute before logout (1 minute warning)

    // Routes where activity tracking should be enabled
    const trackedRoutes = [
        '/',
        '/profile',
        '/transactions',
        '/transactions/create'
    ]

    // Check if current route should have tracking enabled
    const shouldEnableTracking = () => {
        const currentPath = route.path
        const isTrackedRoute = trackedRoutes.includes(currentPath)
        const shouldTrack = isTrackedRoute && authStore.isAuthenticated

        return shouldTrack
    }


    // Reactive state
    const isActive = ref(true)
    const lastActivity = ref(Date.now())
    const warningShown = ref(false)

    // Timer references
    let inactivityTimer = null
    let warningTimer = null

    // Activity events to track
    const activityEvents = [
        'mousedown',
        'mousemove',
        'keypress',
        'scroll',
        'touchstart',
        'click',
        'keydown'
    ]

    // Reset activity tracking
    const resetActivity = () => {
        if (!authStore.isAuthenticated) return

        lastActivity.value = Date.now()
        isActive.value = true
        warningShown.value = false

        // Clear existing timers
        if (inactivityTimer) {
            clearTimeout(inactivityTimer)
        }
        if (warningTimer) {
            clearTimeout(warningTimer)
        }

        // Set warning timer (1 minute)
        warningTimer = setTimeout(() => {
            if (authStore.isAuthenticated) {
                showWarning()
            }
        }, WARNING_TIME)

        // Set logout timer (2 minutes)
        inactivityTimer = setTimeout(() => {
            if (authStore.isAuthenticated) {
                handleAutoLogout()
            }
        }, INACTIVITY_TIMEOUT)
    }

    // Show warning before logout
    const showWarning = () => {
        if (warningShown.value || !authStore.isAuthenticated) return

        warningShown.value = true
        toast.warning('You will be logged out in 1 minute due to inactivity', {
            timeout: 60000, // 1 minute
            closeOnClick: false,
            pauseOnFocusLoss: false,
            pauseOnHover: false,
            draggable: false
        })
    }

    // Handle page focus - check if user should be logged out immediately
    const handlePageFocus = () => {
        if (!authStore.isAuthenticated) return

        // Check how long user has been away
        const now = Date.now()
        const timeSinceActivity = now - lastActivity.value

        // If user has been away for more than the timeout, log them out immediately
        if (timeSinceActivity >= INACTIVITY_TIMEOUT) {
            handleAutoLogout()
            return
        }

        // If user is within the warning period, show warning
        if (timeSinceActivity >= WARNING_TIME && !warningShown.value) {
            showWarning()
        }
        // If warning was already shown, show it again
        else if (warningShown.value) {
            toast.warning('You will be logged out in 1 minute due to inactivity', {
                timeout: 60000,
                closeOnClick: false,
                pauseOnFocusLoss: false,
                pauseOnHover: false,
                draggable: false
            })
        }
    }

    // Handle automatic logout
    const handleAutoLogout = async () => {
        if (!authStore.isAuthenticated) return

        try {
            // Show logout notification
            toast.info('You have been logged out due to inactivity', {
                timeout: 5000
            })

            // Perform logout
            await authStore.logout()

            // Redirect to login page
            if (typeof window !== 'undefined') {
                window.location.href = '/login'
            }
        } catch (error) {
            console.error('Error during auto-logout:', error)
            // Force clear auth even if logout fails
            authStore.clearAuth()
            if (typeof window !== 'undefined') {
                window.location.href = '/login'
            }
        }
    }

    // Handle activity events
    const handleActivity = (event) => {
        if (!authStore.isAuthenticated) return
        resetActivity()
    }

    // Start activity tracking
    const startTracking = () => {
        if (!authStore.isAuthenticated) return

        // Add event listeners
        activityEvents.forEach(event => {
            document.addEventListener(event, handleActivity, true)
        })

        // Handle page focus - show warning if it was triggered while away
        window.addEventListener('focus', handlePageFocus)

        // Start the initial timer
        resetActivity()
    }

    // Stop activity tracking
    const stopTracking = () => {
        // Remove event listeners
        activityEvents.forEach(event => {
            document.removeEventListener(event, handleActivity, true)
        })

        window.removeEventListener('focus', handlePageFocus)

        // Clear timers
        if (inactivityTimer) {
            clearTimeout(inactivityTimer)
            inactivityTimer = null
        }
        if (warningTimer) {
            clearTimeout(warningTimer)
            warningTimer = null
        }

        // Reset state
        isActive.value = true
        warningShown.value = false
    }

    // Check if user is still active
    const checkActivity = () => {
        if (!authStore.isAuthenticated) return false

        const now = Date.now()
        const timeSinceActivity = now - lastActivity.value

        return timeSinceActivity < INACTIVITY_TIMEOUT
    }

    // Get time until logout
    const getTimeUntilLogout = () => {
        if (!authStore.isAuthenticated) return 0

        const now = Date.now()
        const timeSinceActivity = now - lastActivity.value
        const timeUntilLogout = INACTIVITY_TIMEOUT - timeSinceActivity

        return Math.max(0, timeUntilLogout)
    }

    // Function to handle tracking initialization
    const initializeTracking = () => {
        if (!shouldEnableTracking()) return
        startTracking()
    }

    // Initialize tracking when component mounts
    onMounted(() => {
        initializeTracking()
    })

    // Watch for authentication changes
    watch(
        () => authStore.isAuthenticated,
        (newValue, oldValue) => {
            if (newValue && !oldValue) {
                // Wait a bit for the route to change after login
                setTimeout(() => {
                    initializeTracking()
                }, 500) // 500ms delay to allow route change
            } else if (!newValue && oldValue) {
                stopTracking()
            }
        }
    )

    // Watch for route changes (in case user navigates to a tracked route)
    watch(
        () => route.path,
        (newPath, oldPath) => {
            // Check if tracking should be enabled on the new route
            initializeTracking()
        }
    )

    // Cleanup when component unmounts
    onUnmounted(() => {
        stopTracking()
    })


    return {
        isActive,
        lastActivity,
        warningShown,
        startTracking,
        stopTracking,
        resetActivity,
        checkActivity,
        getTimeUntilLogout
    }
}
