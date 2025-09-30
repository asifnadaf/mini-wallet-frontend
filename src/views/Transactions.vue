<template>
  <div class="space-y-6 max-w-7xl mx-auto">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold text-gray-900">{{ t('transactions.title') }}</h1>
      <router-link
        to="/transactions/create"
        class="btn btn-primary flex items-center"
      >
        <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
        </svg>
        {{ t('transactions.sendMoney') }}
      </router-link>
    </div>

    <!-- Transactions List -->
    <div class="card">
      <div v-if="loading" class="text-center py-8">
        <svg class="animate-spin h-8 w-8 text-primary-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p class="mt-2 text-sm text-gray-500">{{ t('common.loading') }}</p>
      </div>
      
      <div v-else-if="transactions.length === 0" class="text-center py-8">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">{{ t('transactions.noTransactions') }}</h3>
      </div>
      
      <div v-else class="space-y-3">
        <div
          v-for="transaction in transactions"
          :key="transaction.id"
          class="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <div class="flex items-center">
            <div class="p-3 bg-primary-100 rounded-lg">
              <svg class="h-5 w-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-900">
                {{ transaction.type === 'sent' ? t('transactions.sentTo') : t('transactions.receivedFrom') }} {{ transaction.other_party }}
              </p>
              <p class="text-xs text-gray-500">{{ formatDate(transaction.created_at) }}</p>
            </div>
          </div>
          <div class="text-right">
            <p class="text-sm font-medium" :class="transaction.type === 'sent' ? 'text-red-600' : 'text-green-600'">
              {{ transaction.type === 'sent' ? '-' : '+' }}{{ formatCurrency(transaction.amount) }}
            </p>
            <p class="text-xs text-gray-500" v-if="transaction.commission_fee">
              Fee: ${{ parseFloat(transaction.commission_fee).toFixed(2) }}
            </p>
          </div>
        </div>
      </div>
      
      <!-- Pagination -->
      <div v-if="transactions.length > 0" class="mt-6 flex items-center justify-between">
        <div class="text-sm text-gray-700">
          Showing {{ pagination.from || 0 }} to {{ pagination.to || 0 }} of {{ pagination.total || 0 }} results
        </div>
        <div class="flex items-center space-x-2">
          <button
            @click="goToPage(pagination.current_page - 1)"
            :disabled="!pagination.prev_page_url"
            class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ t('transactions.previous') }}
          </button>
          
          <div class="flex space-x-1">
            <button
              v-for="page in getPageNumbers()"
              :key="page"
              @click="goToPage(page)"
              :class="[
                'px-3 py-2 text-sm font-medium rounded-md',
                page === pagination.current_page
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
              ]"
            >
              {{ page }}
            </button>
          </div>
          
          <button
            @click="goToPage(pagination.current_page + 1)"
            :disabled="!pagination.next_page_url"
            class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ t('transactions.next') }}
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useTransactionStore } from '@/stores/transactions'
import { useAuthStore } from '@/stores/auth'
import { useLabels } from '@/composables/useLabels'
import { usePusher } from '@/composables/usePusher'

const transactionStore = useTransactionStore()
const authStore = useAuthStore()
const { t } = useLabels()

// Pusher integration
const {
  initializePusher,
  subscribeToPrivate,
  unsubscribe,
  handleTransactionCreated
} = usePusher()

const transactions = computed(() => transactionStore.transactions)
const loading = computed(() => transactionStore.loading)
const pagination = computed(() => transactionStore.pagination)
const currentPage = ref(1)
const user = computed(() => authStore.user)

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString()
}

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount)
}

const goToPage = async (page) => {
  if (page < 1 || page > pagination.value.last_page || page === pagination.value.current_page) {
    return
  }
  
  currentPage.value = page
  try {
    await transactionStore.fetchTransactions(page, 10)
  } catch (error) {
    console.error('Error fetching transactions:', error)
  }
}

const getPageNumbers = () => {
  const current = pagination.value.current_page
  const last = pagination.value.last_page
  const pages = []
  
  // Show up to 5 page numbers
  const start = Math.max(1, current - 2)
  const end = Math.min(last, current + 2)
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
}

onMounted(async () => {
  try {
    await transactionStore.fetchTransactions(1, 10)
    
    // Wait for user data to be available before initializing Pusher
    const initializePusherSubscription = () => {
      if (user.value?.id) {
        try {
          initializePusher()
          
          // Subscribe to user-specific events
          subscribeToPrivate(`private-user.${user.value.id}`, 'transaction.created', async (data) => {
            handleTransactionCreated(data)
            // Refresh both balance and transactions for Transactions page
            try {
              await transactionStore.fetchTransactions(currentPage.value, 10)
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

