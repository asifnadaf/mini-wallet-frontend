import Pusher from 'pusher-js'

class PusherService {
    constructor() {
        this.pusher = null
        this.channels = new Map()
        this.isConnected = false
    }

    initialize() {
        if (this.pusher) {
            return this.pusher
        }

        // Check if required environment variables are available
        const pusherKey = import.meta.env.VITE_PUSHER_APP_KEY
        const apiBaseUrl = import.meta.env.VITE_API_BASE_URL

        // Temporary fallback for development
        const fallbackPusherKey = pusherKey || '27a9a10d9d9deebaa628'
        const fallbackApiBaseUrl = apiBaseUrl || 'http://localhost:8000/api/v1'

        const authToken = this.getAuthToken()

        const config = {
            key: fallbackPusherKey,
            cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER || 'ap2',
            forceTLS: true,
            encrypted: true,
            authEndpoint: `${fallbackApiBaseUrl}/broadcasting/auth`,
            auth: {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Accept': 'application/json'
                }
            }
        }

        this.pusher = new Pusher(config.key, {
            cluster: config.cluster,
            forceTLS: config.forceTLS,
            encrypted: config.encrypted,
            authEndpoint: config.authEndpoint,
            auth: config.auth,
            enabledTransports: ['ws', 'wss']
        })

        // Connection event handlers
        this.pusher.connection.bind('connected', () => {
            this.isConnected = true
        })

        this.pusher.connection.bind('disconnected', () => {
            this.isConnected = false
        })

        this.pusher.connection.bind('error', (error) => {
            console.error('Pusher connection error:', error)
        })

        return this.pusher
    }

    getAuthToken() {
        try {
            if (typeof window !== 'undefined' && window.sessionStorage) {
                // Try to get Sanctum token from sessionStorage
                const token = sessionStorage.getItem('auth_token') || sessionStorage.getItem('sanctum_token')
                if (token) {
                    return token
                }

                // Fallback: try to get from localStorage
                const localToken = localStorage.getItem('auth_token') || localStorage.getItem('sanctum_token')
                if (localToken) {
                    return localToken
                }

                return ''
            }
            return ''
        } catch (error) {
            console.error('Error getting auth token:', error)
            return ''
        }
    }

    subscribe(channelName, eventName, callback) {
        if (!this.pusher) {
            this.initialize()
        }

        const channel = this.pusher.subscribe(channelName)
        this.channels.set(channelName, channel)

        channel.bind(eventName, callback)

        return channel
    }

    subscribeToPrivateChannel(channelName, eventName, callback) {
        if (!this.pusher) {
            this.initialize()
        }


        const channel = this.pusher.subscribe(channelName)
        this.channels.set(channelName, channel)

        channel.bind(eventName, (data) => {
            callback(data)
        })

        // Add channel subscription error handler
        channel.bind('pusher:subscription_error', (error) => {
            console.error(`Failed to subscribe to private channel ${channelName}:`, error)
        })

        return channel
    }

    subscribeToPresenceChannel(channelName, eventName, callback) {
        if (!this.pusher) {
            this.initialize()
        }

        const channel = this.pusher.subscribe(`presence-${channelName}`)
        this.channels.set(`presence-${channelName}`, channel)

        channel.bind(eventName, callback)

        return channel
    }

    unsubscribe(channelName) {
        if (this.pusher && this.channels.has(channelName)) {
            this.pusher.unsubscribe(channelName)
            this.channels.delete(channelName)
        }
    }

    unsubscribeAll() {
        if (this.pusher) {
            this.channels.forEach((channel, channelName) => {
                this.pusher.unsubscribe(channelName)
            })
            this.channels.clear()
        }
    }

    disconnect() {
        if (this.pusher) {
            this.unsubscribeAll()
            this.pusher.disconnect()
            this.pusher = null
            this.isConnected = false
        }
    }

    getConnectionState() {
        return this.pusher ? this.pusher.connection.state : 'disconnected'
    }

    isChannelSubscribed(channelName) {
        return this.channels.has(channelName)
    }

    // Method to handle Sanctum authentication specifically
    authenticateWithSanctum() {
        const token = this.getAuthToken()
        if (!token) {
            return false
        }
        return true
    }

    // Method to refresh authentication if needed
    refreshAuth() {
        const token = this.getAuthToken()
        if (token && this.pusher) {
            // Reinitialize Pusher with new token
            this.disconnect()
            this.initialize()
            return true
        }
        return false
    }
}

// Create singleton instance
const pusherService = new PusherService()

export default pusherService
