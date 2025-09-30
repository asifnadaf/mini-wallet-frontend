import { ref, onMounted, onUnmounted } from 'vue'
import pusherService from '@/services/pusherService'
import { useToast } from 'vue-toastification'

export function usePusher() {
    const toast = useToast()
    const isConnected = ref(false)
    const subscribedChannels = ref(new Set())

    // Initialize Pusher connection
    const initializePusher = () => {
        try {
            // Check Sanctum authentication first
            if (!pusherService.authenticateWithSanctum()) {
                console.warn('⚠️ Sanctum authentication failed - Pusher may not work properly')
            }

            // Force reinitialize to ensure we get the latest token
            const pusher = pusherService.forceReinitialize()
            if (pusher) {
                isConnected.value = pusherService.isConnected
            } else {
                console.warn('❌ Pusher initialization failed - using fallback mode')
                isConnected.value = false
            }
        } catch (error) {
            console.warn('❌ Failed to initialize Pusher - using fallback mode:', error)
            isConnected.value = false
        }
    }

    // Subscribe to a public channel
    const subscribe = (channelName, eventName, callback) => {
        try {
            const channel = pusherService.subscribe(channelName, eventName, callback)
            subscribedChannels.value.add(channelName)
            return channel
        } catch (error) {
            console.error(`Failed to subscribe to channel ${channelName}:`, error)
            return null
        }
    }

    // Subscribe to a private channel
    const subscribeToPrivate = (channelName, eventName, callback) => {
        try {
            if (!pusherService.pusher) {
                console.error('Pusher not initialized. Cannot subscribe to private channel.')
                return null
            }

            const channel = pusherService.subscribeToPrivateChannel(channelName, eventName, callback)
            subscribedChannels.value.add(`private-${channelName}`)
            return channel
        } catch (error) {
            console.error(`Failed to subscribe to private channel ${channelName}:`, error)
            return null
        }
    }

    // Subscribe to a presence channel
    const subscribeToPresence = (channelName, eventName, callback) => {
        try {
            const channel = pusherService.subscribeToPresenceChannel(channelName, eventName, callback)
            subscribedChannels.value.add(`presence-${channelName}`)
            return channel
        } catch (error) {
            console.error(`Failed to subscribe to presence channel ${channelName}:`, error)
            return null
        }
    }

    // Unsubscribe from a channel
    const unsubscribe = (channelName) => {
        try {
            pusherService.unsubscribe(channelName)
            subscribedChannels.value.delete(channelName)
        } catch (error) {
            console.error(`Failed to unsubscribe from channel ${channelName}:`, error)
        }
    }

    // Unsubscribe from all channels
    const unsubscribeAll = () => {
        try {
            pusherService.unsubscribeAll()
            subscribedChannels.value.clear()
        } catch (error) {
            console.error('Failed to unsubscribe from all channels:', error)
        }
    }

    // Show toast notification
    const showNotification = (title, message, type = 'info') => {
        const toastOptions = {
            title,
            message,
            type,
            timeout: 5000,
            closeOnClick: true,
            pauseOnFocusLoss: true,
            pauseOnHover: true,
            draggable: true,
            draggablePercent: 0.6,
            showCloseButtonOnHover: false,
            hideProgressBar: false,
            closeButton: 'button',
            icon: true,
            rtl: false
        }

        switch (type) {
            case 'success':
                toast.success(message, toastOptions)
                break
            case 'error':
                toast.error(message, toastOptions)
                break
            case 'warning':
                toast.warning(message, toastOptions)
                break
            case 'info':
            default:
                toast.info(message, toastOptions)
                break
        }
    }

    // Common event handlers for wallet app
    const handleTransactionCreated = (data) => {

        const { transaction } = data
        const currentUserId = getCurrentUserId()


        if (!currentUserId) {
            return
        }

        const isReceiver = transaction.receiver_id === currentUserId
        const senderName = transaction.sender_name
        const receiverName = transaction.receiver_name


        if (isReceiver) {
            showNotification(
                'Money Received',
                `You received money from ${senderName}`,
                'success'
            )
        }

        // Note: We don't add the transaction to the store here because
        // the broadcasted data is incomplete. Instead, we rely on the
        // component to refresh the data from the API after receiving
        // the Pusher event.
    }

    const getCurrentUserId = () => {
        try {
            if (typeof window !== 'undefined' && window.sessionStorage) {
                const user = sessionStorage.getItem('user')
                return user ? JSON.parse(user).id : null
            }
            return null
        } catch (error) {
            console.error('Error getting current user ID:', error)
            return null
        }
    }

    const handleEmailVerified = (data) => {
        showNotification(
            'Email Verified',
            'Your email has been successfully verified!',
            'success'
        )
    }

    const handlePasswordChanged = (data) => {
        showNotification(
            'Password Changed',
            'Your password has been successfully changed.',
            'success'
        )
    }

    // Cleanup on component unmount
    onUnmounted(() => {
        unsubscribeAll()
    })

    // Refresh authentication when token changes
    const refreshAuthentication = () => {
        try {
            if (pusherService.refreshAuth()) {
                console.log('✅ Pusher authentication refreshed successfully')
                return true
            } else {
                console.warn('⚠️ Failed to refresh Pusher authentication')
                return false
            }
        } catch (error) {
            console.error('❌ Error refreshing Pusher authentication:', error)
            return false
        }
    }

    return {
        isConnected,
        subscribedChannels,
        initializePusher,
        subscribe,
        subscribeToPrivate,
        subscribeToPresence,
        unsubscribe,
        unsubscribeAll,
        showNotification,
        handleTransactionCreated,
        handleEmailVerified,
        handlePasswordChanged,
        refreshAuthentication
    }
}
