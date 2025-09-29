<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <!-- Logo -->
      <div class="text-center">
        <Logo />
      </div>
      
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {{ t('auth.forgotPassword.title') }}
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          {{ t('auth.forgotPassword.subtitle') }}
        </p>
      </div>
      
      <form class="mt-8 space-y-6" @submit.prevent="handleForgotPassword">
        <div v-if="errors.general" class="bg-red-50 border border-red-200 rounded-md p-3">
          <p class="text-sm text-red-600">{{ errors.general }}</p>
        </div>
        
        <div>
          <label for="email" class="form-label">{{ t('auth.forgotPassword.email') }}</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            required
            class="input"
            :class="{ 'input-error': errors.email }"
            :placeholder="t('auth.forgotPassword.emailPlaceholder')"
          />
          <p v-if="errors.email" class="error-message">{{ errors.email }}</p>
        </div>

        <div>
          <button
            type="submit"
            :disabled="loading"
            class="btn btn-primary w-full"
          >
            <span v-if="loading" class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ t('auth.forgotPassword.sending') }}
            </span>
            <span v-else>{{ t('auth.forgotPassword.sendOtp') }}</span>
          </button>
        </div>

        <div class="text-center">
          <router-link to="/login" class="font-medium text-primary-600 hover:text-primary-500">
            {{ t('auth.forgotPassword.backToLogin') }}
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '@/services/authService'
import { useLabels } from '@/composables/useLabels'
import { useToast } from 'vue-toastification'
import Logo from '@/components/common/Logo.vue'

const router = useRouter()
const toast = useToast()
const { t } = useLabels()

const form = reactive({
  email: ''
})

const errors = ref({})
const loading = ref(false)

const handleForgotPassword = async () => {
  errors.value = {}
  loading.value = true

  try {
    const response = await authService.requestPasswordReset(form.email)
    
    // Store email for next step
    try {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        sessionStorage.setItem('forgot_password_email', form.email)
      }
    } catch (error) {
      console.error('Error storing email in sessionStorage:', error)
    }
    
    toast.success('OTP sent to your email!')
    // Navigate to OTP verification step
    router.push('/forgot-password/verify-otp')
  } catch (error) {
    console.error('Forgot password error:', error)
    if (error.response?.data?.errors) {
      errors.value = error.response.data.errors
    } else if (error.response?.data?.message) {
      errors.value = { general: error.response.data.message }
    } else {
      errors.value = { general: 'Failed to send OTP. Please try again.' }
    }
  } finally {
    loading.value = false
  }
}
</script>

