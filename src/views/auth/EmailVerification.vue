<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <!-- Logo -->
      <div class="text-center">
        <Logo />
      </div>
      
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {{ t('auth.emailVerification.title') }}
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          {{ t('auth.emailVerification.subtitle') }}
        </p>
      </div>
      
      <form class="mt-8 space-y-6" @submit.prevent="handleVerifyEmail">
        <div>
          <label class="form-label flex justify-center">{{ t('auth.emailVerification.otp') }}</label>
          <div class="flex justify-center space-x-2 mb-4">
            <input
              v-for="(digit, index) in otpDigits"
              :key="index"
              v-model="otpDigits[index]"
              type="text"
              maxlength="1"
              class="w-12 h-12 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none transition-colors duration-200"
              :class="{ 
                'border-red-500 bg-red-50': errors.token,
                'border-primary-500 bg-primary-50': digit && !errors.token
              }"
              @input="handleOtpInput(index, $event)"
              @keydown="handleOtpKeydown(index, $event)"
              @paste="handleOtpPaste"
            />
          </div>
          <p v-if="errors.token" class="error-message text-center">{{ errors.token }}</p>
        </div>

        <div v-if="errors.general" class="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
          <p class="text-sm text-red-600">{{ errors.general }}</p>
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
              {{ t('auth.emailVerification.verifying') }}
            </span>
            <span v-else>{{ t('auth.emailVerification.verify') }}</span>
          </button>
        </div>

        <div class="text-center">
          <button
            type="button"
            @click="handleResendToken"
            :disabled="resendLoading"
            class="text-sm text-primary-600 hover:text-primary-500 disabled:opacity-50"
          >
            <span v-if="resendLoading">{{ t('auth.emailVerification.resending') }}</span>
            <span v-else>{{ t('auth.emailVerification.resend') }}</span>
          </button>
          <p class="text-xs text-gray-500 mt-2">
            {{ t('auth.emailVerification.backToLogin') }}
          </p>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useLabels } from '@/composables/useLabels'
import Logo from '@/components/common/Logo.vue'

const router = useRouter()
const authStore = useAuthStore()
const { t } = useLabels()

const otpDigits = ref(['', '', '', '', '', ''])
const errors = ref({})
const loading = ref(false)
const resendLoading = ref(false)

const handleVerifyEmail = async () => {
  errors.value = {}
  loading.value = true

  try {
    // Join the OTP digits into a single token
    const token = otpDigits.value.join('')
    if (token.length !== 6) {
      errors.value = { token: 'Please enter all 6 digits' }
      loading.value = false
      return
    }

    const response = await authStore.verifyEmailToken(token)
    
    await router.push('/')
  } catch (error) {
    console.error('Email verification error:', error)
    if (error.response?.data?.errors) {
      errors.value = error.response.data.errors
    } else if (error.response?.data?.message) {
      errors.value = { general: error.response.data.message }
    } else {
      errors.value = { general: 'Email verification failed. Please try again.' }
    }
  } finally {
    loading.value = false
  }
}

const handleResendToken = async () => {
  resendLoading.value = true

  try {
    await authStore.sendEmailVerificationToken()
    if (typeof window !== 'undefined' && window.sessionStorage) {
      sessionStorage.setItem('otp_sent_timestamp', Date.now().toString())
    }
  } catch (error) {
    console.error('Error resending token:', error)
    if (error.response?.data?.errors) {
      errors.value = error.response.data.errors
    }
  } finally {
    resendLoading.value = false
  }
}

// OTP input handling functions
const handleOtpInput = (index, event) => {
  const value = event.target.value
  
  // Only allow single digit
  if (value.length > 1) {
    otpDigits.value[index] = value.slice(-1)
  }
  
  // Move to next input if current is filled
  if (value && index < 5) {
    const nextInput = event.target.parentElement.children[index + 1]
    if (nextInput) {
      nextInput.focus()
    }
  }
}

const handleOtpKeydown = (index, event) => {
  // Handle backspace
  if (event.key === 'Backspace' && !otpDigits.value[index] && index > 0) {
    const prevInput = event.target.parentElement.children[index - 1]
    if (prevInput) {
      prevInput.focus()
    }
  }
  
  // Handle arrow keys
  if (event.key === 'ArrowLeft' && index > 0) {
    const prevInput = event.target.parentElement.children[index - 1]
    if (prevInput) {
      prevInput.focus()
    }
  }
  
  if (event.key === 'ArrowRight' && index < 5) {
    const nextInput = event.target.parentElement.children[index + 1]
    if (nextInput) {
      nextInput.focus()
    }
  }
}

const handleOtpPaste = (event) => {
  event.preventDefault()
  const pastedData = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
  
  if (pastedData.length === 6) {
    otpDigits.value = pastedData.split('')
    // Focus the last input
    const lastInput = event.target.parentElement.children[5]
    if (lastInput) {
      lastInput.focus()
    }
  }
}

// Email verification page mounted - no automatic OTP sending needed
// Backend already sends OTP during registration
onMounted(() => {
  // OTP should already be sent by backend during registration
})
</script>

