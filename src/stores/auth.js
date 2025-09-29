import { defineStore } from 'pinia'
import { authService } from '@/services/authService'
import { useToast } from 'vue-toastification'

const toast = useToast()

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: (() => {
            try {
                if (typeof window !== 'undefined' && window.sessionStorage) {
                    const user = sessionStorage.getItem('user')
                    return user ? JSON.parse(user) : null
                }
                return null
            } catch (error) {
                console.error('Error parsing user from sessionStorage:', error)
                return null
            }
        })(),
        token: (() => {
            try {
                if (typeof window !== 'undefined' && window.sessionStorage) {
                    return sessionStorage.getItem('auth_token') || null
                }
                return null
            } catch (error) {
                console.error('Error getting token from sessionStorage:', error)
                return null
            }
        })(),
        loading: false
    }),

    getters: {
        isAuthenticated: (state) => !!state.token,
        isEmailVerified: (state) => {
            if (!state.user) return false
            return !!state.user.email_verified_at
        }
    },

    actions: {
        async login(credentials) {
            this.loading = true
            try {
                const response = await authService.login(credentials)
                // Handle the API response structure: { success, message, data: { user, access_token } }
                const { data } = response

                this.setAuth(data.user, data.access_token)

                toast.success('Login successful!')
                return response
            } catch (error) {
                console.error('Login error in store:', error)
                throw error
            } finally {
                this.loading = false
            }
        },

        async register(userData) {
            this.loading = true
            try {
                const response = await authService.register(userData)
                // Handle the API response structure: { success, message, data: { user, access_token } }
                const { data } = response

                // Automatically log in the user after registration
                this.setAuth(data.user, data.access_token)

                toast.success('Registration successful! Please verify your email.')
                return response
            } catch (error) {
                console.error('Register error in store:', error)
                throw error
            } finally {
                this.loading = false
            }
        },

        async logout() {
            try {
                await authService.logout()
            } catch (error) {
                console.error('Logout error:', error)
            } finally {
                this.clearAuth()
                toast.success('Logged out successfully!')
            }
        },

        async fetchUser() {
            try {
                const response = await authService.getUser()
                // Handle the API response structure
                const user = response.data?.user || response.user
                this.user = user
                if (typeof window !== 'undefined' && window.sessionStorage) {
                    sessionStorage.setItem('user', JSON.stringify(user))
                }
                return response
            } catch (error) {
                this.clearAuth()
                throw error
            }
        },

        async sendEmailVerificationToken() {
            try {
                const response = await authService.sendEmailVerificationToken()
                toast.success('Verification token sent to your email!')
                return response
            } catch (error) {
                throw error
            }
        },

        async verifyEmailToken(token) {
            try {
                const response = await authService.verifyEmailToken(token)
                // Handle the API response structure: { success, message, data: { user } }
                const verifiedUser = response.data?.user || response.user

                // Only update the email_verified_at field, preserve other user data
                if (this.user && verifiedUser.email_verified_at) {
                    this.user.email_verified_at = verifiedUser.email_verified_at
                    if (typeof window !== 'undefined' && window.sessionStorage) {
                        sessionStorage.setItem('user', JSON.stringify(this.user))
                    }
                } else {
                    // Fallback: update entire user if current user is not available
                    this.user = verifiedUser
                    if (typeof window !== 'undefined' && window.sessionStorage) {
                        sessionStorage.setItem('user', JSON.stringify(verifiedUser))
                    }
                }

                toast.success('Email verified successfully!')
                return response
            } catch (error) {
                console.error('Email verification error:', error)
                throw error
            }
        },

        async changePassword(data) {
            try {
                const response = await authService.changePassword(data)
                toast.success('Password changed successfully!')
                return response
            } catch (error) {
                throw error
            }
        },

        setAuth(user, token) {
            this.user = user
            this.token = token
            try {
                if (typeof window !== 'undefined' && window.sessionStorage) {
                    sessionStorage.setItem('user', JSON.stringify(user))
                    sessionStorage.setItem('auth_token', token)
                }
            } catch (error) {
                console.error('Error setting auth in sessionStorage:', error)
            }
        },

        clearAuth() {
            this.user = null
            this.token = null
            try {
                if (typeof window !== 'undefined' && window.sessionStorage) {
                    sessionStorage.removeItem('user')
                    sessionStorage.removeItem('auth_token')
                }
            } catch (error) {
                console.error('Error clearing auth from sessionStorage:', error)
            }
        }
    }
})

