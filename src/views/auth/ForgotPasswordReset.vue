<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <!-- Logo -->
      <div class="text-center">
        <Logo />
      </div>
      
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {{ t('auth.forgotPasswordReset.title') }}
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          {{ t('auth.forgotPasswordReset.subtitle') }}
        </p>
        <p class="mt-1 text-center text-sm text-gray-500">
          {{ email }}
        </p>
      </div>
      
      <form class="mt-8 space-y-6" @submit.prevent="handleResetPassword">
        <div v-if="errors.general" class="bg-red-50 border border-red-200 rounded-md p-3">
          <p class="text-sm text-red-600">{{ errors.general }}</p>
        </div>
        
        <div>
          <label for="password" class="form-label">{{ t('auth.forgotPasswordReset.newPassword') }}</label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            required
            class="input"
            :class="{ 'input-error': errors.password }"
            :placeholder="t('auth.forgotPasswordReset.newPasswordPlaceholder')"
          />
          <p v-if="errors.password" class="error-message">{{ errors.password }}</p>
        </div>

        <div>
          <label for="password_confirmation" class="form-label">{{ t('auth.forgotPasswordReset.confirmPassword') }}</label>
          <input
            id="password_confirmation"
            v-model="form.password_confirmation"
            type="password"
            required
            class="input"
            :class="{ 'input-error': errors.password_confirmation }"
            :placeholder="t('auth.forgotPasswordReset.confirmPasswordPlaceholder')"
          />
          <p v-if="errors.password_confirmation" class="error-message">{{ errors.password_confirmation }}</p>
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
              {{ t('auth.forgotPasswordReset.resetting') }}
            </span>
            <span v-else>{{ t('auth.forgotPasswordReset.resetPassword') }}</span>
          </button>
        </div>

        <div class="text-center">
          <router-link to="/login" class="font-medium text-primary-600 hover:text-primary-500">
            {{ t('auth.forgotPasswordReset.backToLogin') }}
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '@/services/authService'
import { useLabels } from '@/composables/useLabels'
import { useToast } from 'vue-toastification'
import Logo from '@/components/common/Logo.vue'

const router = useRouter()
const toast = useToast()
const { t } = useLabels()

const form = reactive({
  password: '',
  password_confirmation: ''
})

const errors = ref({})
const loading = ref(false)

const email = computed(() => {
  try {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      return sessionStorage.getItem('forgot_password_email') || ''
    }
    return ''
  } catch (error) {
    console.error('Error getting email from sessionStorage:', error)
    return ''
  }
})

const otp = computed(() => {
  try {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      return sessionStorage.getItem('forgot_password_otp') || ''
    }
    return ''
  } catch (error) {
    console.error('Error getting OTP from sessionStorage:', error)
    return ''
  }
})

const handleResetPassword = async () => {
  errors.value = {}
  loading.value = true

  try {
    // Validate passwords match
    if (form.password !== form.password_confirmation) {
      errors.value = { password_confirmation: 'Passwords do not match' }
      loading.value = false
      return
    }

    const response = await authService.resetPassword({
      email: email.value,
      password: form.password,
      token: otp.value
    })
    
    
    // Clear session storage
    try {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        sessionStorage.removeItem('forgot_password_email')
        sessionStorage.removeItem('forgot_password_otp')
      }
    } catch (error) {
      console.error('Error clearing sessionStorage:', error)
    }
    
    toast.success('Password reset successfully! You can now login with your new password.')
    // Navigate to login page
    router.push('/login')
  } catch (error) {
    console.error('Reset password error:', error)
    if (error.response?.data?.errors) {
      errors.value = error.response.data.errors
    } else if (error.response?.data?.message) {
      errors.value = { general: error.response.data.message }
    } else {
      errors.value = { general: 'Failed to reset password. Please try again.' }
    }
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  // Check if email and OTP exist in session storage
  if (!email.value || !otp.value) {
    router.push('/forgot-password')
  }
})
</script>
