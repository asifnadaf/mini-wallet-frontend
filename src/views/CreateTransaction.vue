<template>
  <div class="max-w-2xl mx-auto space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">{{ t('createTransaction.title') }}</h1>
        <p class="text-sm text-gray-600 mt-1">{{ t('createTransaction.subtitle') }}</p>
      </div>
      <router-link to="/transactions" class="text-primary-600 hover:text-primary-500 text-sm font-medium">
        {{ t('createTransaction.backToTransactions') }}
      </router-link>
    </div>

    <!-- Transfer Form -->
    <div class="card">
      <form @submit.prevent="handleCreateTransaction" class="space-y-6">
        <div v-if="errors.general" class="bg-red-50 border border-red-200 rounded-md p-3">
          <p class="text-sm text-red-600">{{ errors.general }}</p>
        </div>
        
        <div class="form-group">
          <label for="receiver_id" class="form-label">{{ t('createTransaction.receiverId') }}</label>
          <input
            id="receiver_id"
            v-model="form.receiver_id"
            type="number"
            required
            class="input"
            :class="{ 'input-error': errors.receiver_id }"
            :placeholder="t('createTransaction.receiverIdPlaceholder')"
          />
          <p v-if="errors.receiver_id" class="error-message">{{ errors.receiver_id }}</p>
          <p class="text-sm text-gray-500 mt-1">{{ t('createTransaction.receiverIdHelp') }}</p>
        </div>
        
        <div class="form-group">
          <label for="amount" class="form-label">{{ t('createTransaction.amount') }}</label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span class="text-gray-500 sm:text-sm">$</span>
            </div>
            <input
              id="amount"
              v-model="form.amount"
              type="number"
              step="0.01"
              min="0.01"
              required
              class="input pl-7"
              :class="{ 'input-error': errors.amount }"
              :placeholder="t('createTransaction.amountPlaceholder')"
            />
          </div>
          <p v-if="errors.amount" class="error-message">{{ errors.amount }}</p>
          <p class="text-sm text-gray-500 mt-1">{{ t('createTransaction.amountHelp') }}</p>
        </div>
        
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div class="flex items-start">
            <svg class="h-5 w-5 text-blue-600 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
            </svg>
            <div>
              <h3 class="text-sm font-medium text-blue-800">{{ t('createTransaction.transferInfo') }}</h3>
              <p class="text-sm text-blue-700 mt-1">
                {{ t('createTransaction.transferInfoText') }}
              </p>
            </div>
          </div>
        </div>
        
        <div class="flex justify-end space-x-3 pt-4 border-t">
          <router-link
            to="/transactions"
            class="btn btn-secondary"
          >
            {{ t('createTransaction.cancel') }}
          </router-link>
          <button
            type="submit"
            :disabled="loading"
            class="btn btn-primary"
          >
            <span v-if="loading" class="flex items-center">
              <svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ t('createTransaction.sending') }}
            </span>
            <span v-else>{{ t('createTransaction.sendMoney') }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTransactionStore } from '@/stores/transactions'
import { useLabels } from '@/composables/useLabels'
import { useToast } from 'vue-toastification'

const router = useRouter()
const transactionStore = useTransactionStore()
const toast = useToast()
const { t } = useLabels()

const form = reactive({
  receiver_id: '',
  amount: ''
})

const errors = ref({})
const loading = ref(false)

const handleCreateTransaction = async () => {
  errors.value = {}
  loading.value = true

  try {
    // Validate form
    if (!form.receiver_id || parseInt(form.receiver_id) <= 0) {
      errors.value = { receiver_id: 'Valid receiver ID is required' }
      loading.value = false
      return
    }
    
    if (!form.amount || parseFloat(form.amount) <= 0) {
      errors.value = { amount: 'Amount must be greater than 0' }
      loading.value = false
      return
    }

    // Prepare transfer data
    const transferData = {
      receiver_id: parseInt(form.receiver_id),
      amount: parseFloat(form.amount)
    }

    
    const response = await transactionStore.createTransaction(transferData)
    
    // Show success message with transaction details
    const transaction = response.data?.transaction
    
    if (transaction) {
      toast.success(`Transfer successful! Sent $${transaction.amount} to ${transaction.receiver_name}. Commission: $${transaction.commission_fee}`)
    } else {
      toast.success('Transfer successful!')
    }
    
    // Reset form
    form.receiver_id = ''
    form.amount = ''
    
    // Navigate back to transactions
    router.push('/transactions')
  } catch (error) {
    console.error('Create transfer error:', error)
    if (error.response?.data?.errors) {
      errors.value = error.response.data.errors
    } else if (error.response?.data?.message) {
      errors.value = { general: error.response.data.message }
    } else {
      errors.value = { general: 'Failed to create transfer. Please try again.' }
    }
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  // Component mounted
})
</script>
