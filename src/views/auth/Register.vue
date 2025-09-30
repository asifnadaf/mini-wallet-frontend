<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <!-- Logo -->
      <div class="text-center">
        <Logo />
      </div>

      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {{ t('auth.register.title') }}
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          {{ t('auth.register.subtitle') }}
          <router-link to="/login" class="font-medium text-primary-600 hover:text-primary-500">
            {{ t('auth.register.signIn') }}
          </router-link>
        </p>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="handleRegister">
        <div class="space-y-4">
          <div>
            <label for="name" class="form-label">{{ t('auth.register.name') }}</label>
            <input id="name" v-model="form.name" type="text" required class="input"
              :class="{ 'input-error': errors.name }" :placeholder="t('auth.register.namePlaceholder')" />
            <p v-if="errors.name" class="error-message">{{ errors.name }}</p>
          </div>

          <div>
            <label for="email" class="form-label">{{ t('auth.register.email') }}</label>
            <input id="email" v-model="form.email" type="email" required class="input"
              :class="{ 'input-error': errors.email }" :placeholder="t('auth.register.emailPlaceholder')" />
            <p v-if="errors.email" class="error-message">{{ errors.email }}</p>
          </div>

          <div>
            <label for="password" class="form-label">{{ t('auth.register.password') }}</label>
            <input id="password" v-model="form.password" type="password" required class="input"
              :class="{ 'input-error': errors.password }" :placeholder="t('auth.register.passwordPlaceholder')" />
            <p v-if="errors.password" class="error-message">{{ errors.password }}</p>
          </div>

          <div>
            <label for="password_confirmation" class="form-label">{{ t('auth.register.confirmPassword') }}</label>
            <input id="password_confirmation" v-model="form.password_confirmation" type="password" required
              class="input" :class="{ 'input-error': errors.password_confirmation }"
              :placeholder="t('auth.register.confirmPasswordPlaceholder')" />
            <p v-if="errors.password_confirmation" class="error-message">{{ errors.password_confirmation }}</p>
          </div>
        </div>

        <div v-if="errors.general" class="bg-red-50 border border-red-200 rounded-md p-3">
          <p class="text-sm text-red-600">{{ errors.general }}</p>
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
              {{ t('auth.register.creating') }}
            </span>
            <span v-else>{{ t('auth.register.createAccount') }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
  import { ref, reactive } from 'vue'
  import { useRouter } from 'vue-router'
  import { useAuthStore } from '@/stores/auth'
  import { useLabels } from '@/composables/useLabels'
  import Logo from '@/components/common/Logo.vue'

  const router = useRouter()
  const authStore = useAuthStore()
  const { t } = useLabels()

  const form = reactive({
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
  })

  const errors = ref({})
  const loading = ref(false)

  const handleRegister = async () => {
    errors.value = {}
    loading.value = true

    try {
      const response = await authStore.register(form)

      // Redirect to email verification page
      // Backend already sent OTP during registration
      router.push('/email-verification')
    } catch (error) {
      console.error('Registration error:', error)
      if (error.response?.data?.errors) {
        errors.value = error.response.data.errors
      } else if (error.response?.data?.message) {
        errors.value = { general: error.response.data.message }
      } else {
        errors.value = { general: 'Registration failed. Please try again.' }
      }
    } finally {
      loading.value = false
    }
  }
</script>
