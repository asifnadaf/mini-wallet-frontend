import api from './api'

export const authService = {
    // Guest routes
    async register(userData) {
        const response = await api.post('/register', userData)
        return response.data
    },

    async login(credentials) {
        const response = await api.post('/login', credentials)
        return response.data
    },

    async requestPasswordReset(email) {
        const response = await api.post('/forgot-password/email/token', { email })
        return response.data
    },

    async verifyPasswordResetToken(data) {
        const response = await api.post('/forgot-password/verify/token', data)
        return response.data
    },

    async resetPassword(data) {
        const response = await api.post('/forgot-password/reset-password', data)
        return response.data
    },

    // Authenticated routes
    async sendEmailVerificationToken() {
        const response = await api.post('/email/send-token')
        return response.data
    },

    async verifyEmailToken(token) {
        const response = await api.post('/email/verify-token', { token })
        return response.data
    },

    async getUser() {
        const response = await api.get('/user')
        return response.data
    },

    async logout() {
        const response = await api.post('/logout')
        return response.data
    },

    async changePassword(data) {
        const response = await api.post('/change-password', data)
        return response.data
    }
}

