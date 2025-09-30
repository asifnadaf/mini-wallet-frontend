<template>
    <div class="space-y-6 max-w-7xl mx-auto">
        <!-- Welcome Section -->
        <div class="card">
            <h1 class="text-2xl font-bold text-gray-900 mb-2">
                {{ t('dashboard.welcome', { name: user?.name }) }}
            </h1>
            <p class="text-gray-600">
                {{ t('dashboard.subtitle') }}
            </p>
        </div>

        <!-- Account Balance -->
        <div class="card bg-gradient-to-r from-primary-50 to-primary-100 border-primary-200">
            <div class="flex items-center justify-between">
                <div>
                    <h2 class="text-lg font-medium text-gray-900">{{ t('dashboard.accountBalance') }}</h2>
                    <p class="text-3xl font-bold text-primary-600 mt-2">
                        {{ formatCurrency(balance) }}
                    </p>
                    <p class="text-sm text-gray-600 mt-1">{{ t('dashboard.availableBalance') }}</p>
                </div>
                <div class="p-4 bg-primary-200 rounded-full">
                    <svg class="h-8 w-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1">
                        </path>
                    </svg>
                </div>
            </div>
        </div>

        <!-- Quick Actions -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            <div class="card hover:shadow-lg transition-shadow cursor-pointer" @click="handleCreateTransaction">
                <div class="flex items-center">
                    <div class="p-3 bg-yellow-100 rounded-lg">
                        <svg class="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                        </svg>
                    </div>
                    <div class="ml-4">
                        <h3 class="text-lg font-medium text-gray-900">{{ t('dashboard.newTransfer') }}</h3>
                        <p class="text-sm text-gray-500">{{ t('dashboard.createTransfer') }}</p>
                    </div>
                </div>
            </div>

            <div class="card hover:shadow-lg transition-shadow cursor-pointer" @click="$router.push('/transactions')">
                <div class="flex items-center">
                    <div class="p-3 bg-primary-100 rounded-lg">
                        <svg class="h-6 w-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2">
                            </path>
                        </svg>
                    </div>
                    <div class="ml-4">
                        <h3 class="text-lg font-medium text-gray-900">{{ t('dashboard.transactions') }}</h3>
                        <p class="text-sm text-gray-500">{{ t('dashboard.viewTransactions') }}</p>
                    </div>
                </div>
            </div>

            <div class="card hover:shadow-lg transition-shadow cursor-pointer" @click="$router.push('/profile')">
                <div class="flex items-center">
                    <div class="p-3 bg-green-100 rounded-lg">
                        <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                        </svg>
                    </div>
                    <div class="ml-4">
                        <h3 class="text-lg font-medium text-gray-900">{{ t('dashboard.profile') }}</h3>
                        <p class="text-sm text-gray-500">{{ t('dashboard.manageProfile') }}</p>
                    </div>
                </div>
            </div>


        </div>

        <!-- Recent Transactions -->
        <div class="card">
            <div class="flex items-center justify-between mb-4">
                <h2 class="text-lg font-medium text-gray-900">{{ t('dashboard.recentTransactions') }}</h2>
                <router-link to="/transactions" class="text-primary-600 hover:text-primary-500 text-sm font-medium"
                    v-if="recentTransactions.length !== 0">
                    {{ t('dashboard.viewAll') }}
                </router-link>
            </div>

            <div v-if="recentTransactions.length === 0" class="text-center py-8">
                <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2">
                    </path>
                </svg>
                <h3 class="mt-2 text-sm font-medium text-gray-900">{{ t('dashboard.noTransactions') }}</h3>
                <p class="mt-1 text-sm text-gray-500">{{ t('dashboard.noTransactionsSubtitle') }}</p>
            </div>

            <div v-else class="space-y-3">
                <div v-for="transaction in recentTransactions" :key="transaction.id"
                    class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div class="flex items-center">
                        <div class="p-2 bg-primary-100 rounded-lg">
                            <svg class="h-4 w-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1">
                                </path>
                            </svg>
                        </div>
                        <div class="ml-3">
                            <p class="text-sm font-medium text-gray-900">
                                {{ transaction.type === 'sent' ? 'Sent to' : 'Received from' }} {{
                                transaction.other_party }}
                            </p>
                            <p class="text-xs text-gray-500">{{ formatDate(transaction.created_at) }}</p>
                        </div>
                    </div>
                    <div class="text-right">
                        <p class="text-sm font-medium"
                            :class="transaction.type === 'sent' ? 'text-red-600' : 'text-green-600'">
                            {{ transaction.type === 'sent' ? '-' : '+' }}{{ formatCurrency(transaction.amount) }}
                        </p>
                        <p class="text-xs text-gray-500" v-if="transaction.commission_fee">
                            Fee: ${{ parseFloat(transaction.commission_fee).toFixed(2) }}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { ref, computed, onMounted, onUnmounted } from 'vue'
    import { useRouter } from 'vue-router'
    import { useAuthStore } from '@/stores/auth'
    import { useTransactionStore } from '@/stores/transactions'
    import { useLabels } from '@/composables/useLabels'
    import { usePusher } from '@/composables/usePusher'

    const router = useRouter()
    const authStore = useAuthStore()
    const transactionStore = useTransactionStore()
    const { t } = useLabels()

    // Pusher integration
    const {
        initializePusher,
        subscribeToPrivate,
        unsubscribe,
        handleTransactionCreated
    } = usePusher()

    const user = computed(() => authStore.user)
    const recentTransactions = computed(() => transactionStore.recentTransactions)
    const balance = computed(() => transactionStore.balance)

    const handleCreateTransaction = () => {
        // Navigate to create transaction page
        router.push('/transactions/create')
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString()
    }

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount)
    }

    onMounted(async () => {
        try {
            await transactionStore.fetchTransactions(1, 5)

            // Initialize Pusher and subscribe to user-specific channels
            if (user.value?.id) {
                initializePusher()

                // Subscribe to user-specific events
                subscribeToPrivate(`private-user.${user.value.id}`, 'transaction.created', async (data) => {
                    handleTransactionCreated(data)
                    // Refresh both balance and transactions for Dashboard
                    try {
                        await transactionStore.fetchTransactions(1, 5)
                    } catch (error) {
                        console.error('Error refreshing transactions after transaction:', error)
                    }
                })
            }
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