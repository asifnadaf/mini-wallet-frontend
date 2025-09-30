<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <!-- Logo -->
      <div class="text-center">
        <Logo />
      </div>

      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {{ t('auth.forgotPasswordVerifyOtp.title') }}
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          {{ t('auth.forgotPasswordVerifyOtp.subtitle') }}
        </p>
        <p class="mt-1 text-center text-sm text-gray-500">
          {{ email }}
        </p>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="handleVerifyOtp">
        <div v-if="errors.general" class="bg-red-50 border border-red-200 rounded-md p-3">
          <p class="text-sm text-red-600">{{ errors.general }}</p>
        </div>

        <div>
          <label class="form-label">{{ t('auth.forgotPasswordVerifyOtp.otp') }}</label>
          <div class="flex justify-center space-x-2 mb-4">
            <input v-for="(digit, index) in otpDigits" :key="index" v-model="otpDigits[index]" type="text" maxlength="1"
              class="w-12 h-12 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none transition-colors duration-200"
              :class="{
                'border-red-500 bg-red-50': errors.otp,
                'border-primary-500 bg-primary-50': digit && !errors.otp
              }" @input="handleOtpInput(index, $event)" @keydown="handleOtpKeydown(index, $event)"
              @paste="handleOtpPaste" />
          </div>
          <p v-if="errors.otp" class="error-message">{{ errors.otp }}</p>
        </div>

        <div>
          <button type="submit" :disabled="loading" class="btn btn-primary w-full">
            <span v-if="loading" class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
                viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                </path>
              </svg>
              {{ t('auth.forgotPasswordVerifyOtp.verifying') }}
            </span>
            <span v-else>{{ t('auth.forgotPasswordVerifyOtp.verify') }}</span>
          </button>
        </div>

        <div class="text-center">
          <button @click="handleResendOtp" :disabled="resendLoading"
            class="text-sm text-primary-600 hover:text-primary-500 font-medium">
            <span v-if="resendLoading">{{ t('auth.forgotPasswordVerifyOtp.resending') }}</span>
            <span v-else>{{ t('auth.forgotPasswordVerifyOtp.resend') }}</span>
          </button>
        </div>

        <div class="text-center">
          <router-link to="/forgot-password" class="font-medium text-primary-600 hover:text-primary-500">
            {{ t('auth.forgotPasswordVerifyOtp.backToLogin') }}
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

  const otpDigits = ref(['', '', '', '', '', ''])
  const errors = ref({})
  const loading = ref(false)
  const resendLoading = ref(false)

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

  const handleOtpInput = (index, event) => {
    const value = event.target.value

    // Only allow digits
    if (!/^\d*$/.test(value)) {
      event.target.value = otpDigits.value[index]
      return
    }

    otpDigits.value[index] = value

    // Auto-focus next input
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
    const pastedData = event.clipboardData.getData('text')

    // Only allow digits and limit to 6 characters
    const digits = pastedData.replace(/\D/g, '').slice(0, 6)

    // Fill the inputs with pasted digits
    for (let i = 0; i < 6; i++) {
      otpDigits.value[i] = digits[i] || ''
    }

    // Focus the next empty input or the last one
    const nextEmptyIndex = otpDigits.value.findIndex(digit => !digit)
    const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex
    const focusInput = event.target.parentElement.children[focusIndex]
    if (focusInput) {
      focusInput.focus()
    }
  }

  const handleVerifyOtp = async () => {
    errors.value = {}
    loading.value = true

    try {
      const otp = otpDigits.value.join('')

      if (otp.length !== 6) {
        errors.value = { otp: 'Please enter all 6 digits' }
        loading.value = false
        return
      }

      const response = await authService.verifyPasswordResetToken({
        email: email.value,
        token: otp
      })


      // Store OTP for next step
      try {
        if (typeof window !== 'undefined' && window.sessionStorage) {
          sessionStorage.setItem('forgot_password_otp', otp)
        }
      } catch (error) {
        console.error('Error storing OTP in sessionStorage:', error)
      }

      toast.success('OTP verified successfully!')
      // Navigate to reset password step
      router.push('/forgot-password/reset-password')
    } catch (error) {
      console.error('OTP verification error:', error)
      if (error.response?.data?.errors) {
        errors.value = error.response.data.errors
      } else if (error.response?.data?.message) {
        errors.value = { general: error.response.data.message }
      } else {
        errors.value = { general: 'Invalid OTP. Please try again.' }
      }
    } finally {
      loading.value = false
    }
  }

  const handleResendOtp = async () => {
    resendLoading.value = true

    try {
      await authService.requestPasswordReset(email.value)
      toast.success('OTP resent to your email!')
    } catch (error) {
      console.error('Resend OTP error:', error)
      toast.error('Failed to resend OTP. Please try again.')
    } finally {
      resendLoading.value = false
    }
  }

  onMounted(() => {
    // Check if email exists in session storage
    if (!email.value) {
      router.push('/forgot-password')
    }
  })
</script>
