<template>
  <div class="max-w-2xl mx-auto space-y-6">
    <!-- Profile Information -->
    <div class="card">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">{{ t('profile.title') }}</h1>
      
      <div class="space-y-6">
        <div class="space-y-4">
          <div>
            <label class="form-label">{{ t('profile.name') }}</label>
            <div class="mt-1 p-3 bg-gray-50 border border-gray-300 rounded-lg">
              <span class="text-gray-900 font-medium">{{ user?.name || 'Not provided' }}</span>
            </div>
          </div>
          
          <div>
            <label class="form-label">{{ t('profile.email') }}</label>
            <div class="mt-1 p-3 bg-gray-50 border border-gray-300 rounded-lg">
              <span class="text-gray-900 font-medium">{{ user?.email || 'Not provided' }}</span>
            </div>
          </div>
          
          <div>
            <label class="form-label">{{ t('profile.emailVerificationStatus') }}</label>
            <div class="mt-1 flex items-center">
              <span
                class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                :class="user?.email_verified_at ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
              >
                <svg v-if="user?.email_verified_at" class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                </svg>
                <svg v-else class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
                </svg>
                {{ user?.email_verified_at ? t('profile.emailVerified') : t('profile.emailNotVerified') }}
              </span>
            </div>
          </div>
          
        </div>
        
        <div v-if="!user?.email_verified_at" class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div class="flex items-center">
            <svg class="w-5 h-5 text-yellow-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
            </svg>
            <div class="flex-1">
              <h3 class="text-sm font-medium text-yellow-800">{{ t('profile.emailNotVerifiedWarning') }}</h3>
              <p class="text-sm text-yellow-700 mt-1">{{ t('profile.emailNotVerifiedWarning') }}</p>
            </div>
            <button
              @click="handleVerifyEmail"
              class="ml-4 bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
            >
              {{ t('profile.verifyEmail') }}
            </button>
          </div>
        </div>
        
        <div>
          <label class="form-label">{{ t('profile.accountBalance') }}</label>
          <div class="mt-1 p-3 bg-gray-50 border border-gray-300 rounded-lg">
            <span class="text-gray-900 font-medium text-lg">
              {{ balance ? `$${parseFloat(balance).toFixed(2)}` : '$0.00' }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Change Password - Only for verified users -->
    <div v-if="user?.email_verified_at" class="card">
      <h2 class="text-xl font-bold text-gray-900 mb-6">{{ t('profile.changePassword') }}</h2>
      
      <form @submit.prevent="handleChangePassword" class="space-y-4">
        <div v-if="passwordErrors.general" class="bg-red-50 border border-red-200 rounded-md p-3">
          <p class="text-sm text-red-600">{{ passwordErrors.general }}</p>
        </div>
        
        <div class="form-group">
          <label for="current_password" class="form-label">{{ t('profile.currentPassword') }}</label>
          <input
            id="current_password"
            v-model="passwordForm.current_password"
            type="password"
            class="input"
            :class="{ 'input-error': passwordErrors.current_password }"
            :placeholder="t('profile.currentPasswordPlaceholder')"
          />
          <p v-if="passwordErrors.current_password" class="error-message">{{ passwordErrors.current_password }}</p>
        </div>
        
        <div class="form-group">
          <label for="new_password" class="form-label">{{ t('profile.newPassword') }}</label>
          <input
            id="new_password"
            v-model="passwordForm.new_password"
            type="password"
            class="input"
            :class="{ 'input-error': passwordErrors.new_password }"
            :placeholder="t('profile.newPasswordPlaceholder')"
          />
          <p v-if="passwordErrors.new_password" class="error-message">{{ passwordErrors.new_password }}</p>
        </div>
        
        <div class="form-group">
          <label for="new_password_confirmation" class="form-label">{{ t('profile.confirmPassword') }}</label>
          <input
            id="new_password_confirmation"
            v-model="passwordForm.new_password_confirmation"
            type="password"
            class="input"
            :class="{ 'input-error': passwordErrors.new_password_confirmation }"
            :placeholder="t('profile.confirmPasswordPlaceholder')"
          />
          <p v-if="passwordErrors.new_password_confirmation" class="error-message">{{ passwordErrors.new_password_confirmation }}</p>
        </div>
        
        <div class="flex justify-end">
          <button
            type="submit"
            :disabled="passwordLoading"
            class="btn btn-primary"
          >
            <span v-if="passwordLoading" class="flex items-center">
              <svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ t('profile.updating') }}
            </span>
            <span v-else>{{ t('profile.updatePassword') }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useTransactionStore } from '@/stores/transactions'
import { useLabels } from '@/composables/useLabels'
import { useToast } from 'vue-toastification'
import { usePusher } from '@/composables/usePusher'

const router = useRouter()
const authStore = useAuthStore()
const transactionStore = useTransactionStore()
const toast = useToast()
const { t } = useLabels()

// Pusher integration
const {
  initializePusher,
  subscribeToPrivate,
  unsubscribe,
  handleTransactionCreated
} = usePusher()

const user = computed(() => authStore.user)
const balance = computed(() => transactionStore.balance)

const passwordForm = reactive({
  current_password: '',
  new_password: '',
  new_password_confirmation: ''
})

const passwordErrors = ref({})
const passwordLoading = ref(false)

const handleChangePassword = async () => {
  passwordErrors.value = {}
  passwordLoading.value = true

  try {
    // Map the form data to match backend expectations
    const changePasswordData = {
      old_password: passwordForm.current_password,
      new_password: passwordForm.new_password,
      new_password_confirmation: passwordForm.new_password_confirmation
    }
    
    await authStore.changePassword(changePasswordData)
    passwordForm.current_password = ''
    passwordForm.new_password = ''
    passwordForm.new_password_confirmation = ''
  } catch (error) {
    console.error('Change password error:', error)
    if (error.response?.data?.errors) {
      passwordErrors.value = error.response.data.errors
    } else if (error.response?.data?.message) {
      passwordErrors.value = { general: error.response.data.message }
    } else {
      passwordErrors.value = { general: 'Password change failed. Please try again.' }
    }
  } finally {
    passwordLoading.value = false
  }
}

const handleVerifyEmail = () => {
  router.push('/email-verification')
}

onMounted(async () => {
  try {
    await transactionStore.fetchTransactions()
    
    // Wait for user data to be available before initializing Pusher
    const initializePusherSubscription = () => {
      if (user.value?.id) {
        try {
          initializePusher()
          
          // Subscribe to user-specific events - only refresh balance for Profile page
          subscribeToPrivate(`private-user.${user.value.id}`, 'transaction.created', async (data) => {
            handleTransactionCreated(data)
            // Only refresh transactions for Profile page
            try {
              await transactionStore.fetchTransactions(1, 5)
            } catch (error) {
              console.error('Error refreshing transactions after transaction:', error)
            }
          })
        } catch (error) {
          console.error('Error initializing Pusher subscription:', error)
        }
      } else {
        // If user data is not available yet, wait a bit and try again
        setTimeout(initializePusherSubscription, 100)
      }
    }
    
    initializePusherSubscription()
  } catch (error) {
    console.error('Error fetching transactions:', error)
  }
})

onUnmounted(() => {
  // Clean up Pusher subscriptions when component is unmounted
  if (user.value?.id) {
    unsubscribe(`private-user.${user.value.id}`)
  }
})

</script>

