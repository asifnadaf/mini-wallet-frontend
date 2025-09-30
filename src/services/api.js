import axios from 'axios'
import { useToast } from 'vue-toastification'

const toast = useToast()

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1'

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
})

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        try {
            if (typeof window !== 'undefined' && window.sessionStorage) {
                const token = sessionStorage.getItem('auth_token')
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`
                }
            }
        } catch (error) {
            console.error('Error getting token from sessionStorage:', error)
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// Response interceptor to handle errors
api.interceptors.response.use(
    (response) => {
        return response
    },
    (error) => {
        if (error.response?.status === 401) {
            try {
                if (typeof window !== 'undefined' && window.sessionStorage) {
                    sessionStorage.removeItem('auth_token')
                    sessionStorage.removeItem('user')
                }
            } catch (storageError) {
                console.error('Error clearing sessionStorage:', storageError)
            }

            // Only redirect to login if not already on login page
            if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
                window.location.href = '/login'
            }
        }

        const message = error.response?.data?.message || 'An error occurred'
        toast.error(message)

        return Promise.reject(error)
    }
)

export default api

