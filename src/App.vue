<template>
    <div id="app">
        <Navbar v-if="isAuthenticated" />
        <main :class="{ 'with-navbar': isAuthenticated }">
            <router-view />
        </main>
    </div>
</template>

<script>
    import { computed } from 'vue'
    import { useAuthStore } from './stores/auth'
    import { useActivityTracker } from './composables/useActivityTracker'
    import Navbar from './components/layout/Navbar.vue'

    export default {
        name: 'App',
        components: {
            Navbar
        },
        setup() {
            const authStore = useAuthStore()

            // Initialize activity tracker
            useActivityTracker()

            const isAuthenticated = computed(() => authStore.isAuthenticated)

            return {
                isAuthenticated
            }
        }
    }
</script>

<style>
    .with-navbar {
        padding-top: 3rem;
        padding-bottom: 4rem;
    }
</style>