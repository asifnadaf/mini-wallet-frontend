<template>
    <div id="app">
        <Navbar v-if="isAuthenticated" />
        <router-view />
    </div>
</template>

<script>
    import { computed } from 'vue'
    import { useAuthStore } from './stores/auth'
    import Navbar from './components/layout/Navbar.vue'

    export default {
        name: 'App',
        components: {
            Navbar
        },
        setup() {
            const authStore = useAuthStore()

            const isAuthenticated = computed(() => authStore.isAuthenticated)

            return {
                isAuthenticated
            }
        }
    }
</script>

<style></style>