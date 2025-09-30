import api from './api'

export const transactionService = {
    async getTransactions(page = 1, perPage = 10) {
        const response = await api.get(`/transactions?page=${page}&per_page=${perPage}`)
        return response.data
    },

    async createTransaction(transactionData) {
        const response = await api.post('/transactions', transactionData)
        return response.data
    },

}

