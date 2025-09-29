<template>
  <nav class="bg-white shadow-lg">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo -->
        <div class="flex items-center">
          <router-link to="/" class="flex items-center">
            <Logo :show-subtitle="false" />
          </router-link>
        </div>

        <!-- Desktop Navigation Links -->
        <div class="hidden md:flex items-center space-x-4">
          <router-link to="/" class="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium">
            {{ t('navigation.dashboard') }}
          </router-link>

        </div>

        <!-- Mobile Menu Button -->
        <div class="md:hidden">
          <button @click="toggleMobileMenu"
            class="text-gray-700 hover:text-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 p-2">
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path v-if="!showMobileMenu" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"></path>
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12">
              </path>
            </svg>
          </button>
        </div>

        <!-- Desktop User Menu -->
        <div class="hidden md:flex items-center space-x-4">
          <div class="relative" ref="userMenuRef">
            <button @click="toggleUserMenu"
              class="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
              <div class="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center text-white font-medium">
                {{ userInitials }}
              </div>
              <span class="ml-2 text-gray-700">{{ user?.name }}</span>
            </button>

            <!-- Desktop Dropdown Menu -->
            <div v-if="showUserMenu" class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
              <router-link to="/profile" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                @click="showUserMenu = false">
                {{ t('navigation.profile') }}
              </router-link>
              <button class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                {{ t('navigation.logout') }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Mobile Menu -->
      <div v-if="showMobileMenu" class="md:hidden">
        <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50 border-t">
          <!-- Mobile Navigation Links -->
          <router-link to="/"
            class="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-100 rounded-md"
            @click="showMobileMenu = false">
            {{ t('navigation.dashboard') }}
          </router-link>

          <!-- Mobile User Section -->
          <div class="border-t border-gray-200 pt-4 mt-4">
            <div class="flex items-center px-3 py-2">
              <div class="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center text-white font-medium">
                {{ userInitials }}
              </div>
              <span class="ml-3 text-base font-medium text-gray-800">{{ user?.name }}</span>
            </div>
            <router-link to="/profile"
              class="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-100 rounded-md"
              @click="showMobileMenu = false">
              {{ t('navigation.profile') }}
            </router-link>
            <button
              class="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-100 rounded-md">
              {{ t('navigation.logout') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
  import { ref, computed, onMounted, onUnmounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { useAuthStore } from '@/stores/auth'
  import { useLabels } from '@/composables/useLabels'
  import Logo from '@/components/common/Logo.vue'

  const router = useRouter()
  const authStore = useAuthStore()
  const { t } = useLabels()

  const showUserMenu = ref(false)
  const showMobileMenu = ref(false)
  const userMenuRef = ref(null)

  const user = computed(() => authStore.user)
  const userInitials = computed(() => {
    if (!user.value?.name) return 'U'
    return user.value.name
      .split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  })

  const toggleUserMenu = () => {
    showUserMenu.value = !showUserMenu.value
  }

  const toggleMobileMenu = () => {
    showMobileMenu.value = !showMobileMenu.value
    // Close user menu when opening mobile menu
    if (showMobileMenu.value) {
      showUserMenu.value = false
    }
  }


  const handleClickOutside = (event) => {
    if (userMenuRef.value && !userMenuRef.value.contains(event.target)) {
      showUserMenu.value = false
    }
  }

  onMounted(() => {
    document.addEventListener('click', handleClickOutside)
  })

  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
  })
</script>
