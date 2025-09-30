import { defineStore } from 'pinia'
import { transactionService } from '@/services/transactionService'
import { useToast } from 'vue-toastification'

const toast = useToast()

export const useTransactionStore = defineStore('transactions', {
    state: () => ({
        transactions: [],
        balance: '0.00',
        pagination: {
            current_page: 1,
            last_page: 1,
            per_page: 10,
            total: 0
        },
        loading: false
    }),

    getters: {
        recentTransactions: (state) => state.transactions.slice(0, 5)
    },

    actions: {
        async fetchTransactions(page = 1, perPage = 10) {
            this.loading = true
            try {
                const response = await transactionService.getTransactions(page, perPage)

                // Handle the new API response structure
                if (response.data) {
                    this.transactions = response.data.transactions.data || []
                    this.balance = response.data.balance || '0.00'
                    this.pagination = {
                        current_page: response.data.transactions.current_page || 1,
                        last_page: response.data.transactions.last_page || 1,
                        per_page: response.data.transactions.per_page || 10,
                        total: response.data.transactions.total || 0,
                        from: response.data.transactions.from || 0,
                        to: response.data.transactions.to || 0
                    }
                }
                return response
            } catch (error) {
                console.error('Error fetching transactions:', error)
                throw error
            } finally {
                this.loading = false
            }
        },

        async createTransaction(transactionData) {
            this.loading = true
            try {
                const response = await transactionService.createTransaction(transactionData)
                // Only add transaction if it has the required properties
                if (response.transaction && response.transaction.id) {
                    this.transactions.unshift(response.transaction)
                }
                return response
            } catch (error) {
                throw error
            } finally {
                this.loading = false
            }
        },

    }
})

