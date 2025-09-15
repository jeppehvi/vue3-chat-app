<script setup lang="ts">
import { ref } from 'vue'
import { chatApi } from '../services/chatApi'

const emit = defineEmits<{
  login: [username: string]
}>()

const props = defineProps<{
  isConnecting: boolean
}>()

const username = ref('')
const error = ref('')
const isLoading = ref(false)

const handleSubmit = async () => {
  if (!username.value.trim()) {
    error.value = 'Please enter a username'
    return
  }

  isLoading.value = true
  error.value = ''

  try {
    const response = await chatApi.joinChat(username.value.trim())
    if (response.success) {
      emit('login', username.value.trim())
    }
  } catch (err: any) {
    error.value = err.response?.data?.error || 'Failed to join chat'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md animate-slide-up">
    <div class="text-center mb-8">
      <div class="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
        </svg>
      </div>
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Join us now..</h1>
      <p class="text-gray-600">Please enter a username to start chatting</p>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <div>
        <label for="username" class="block text-sm font-medium text-gray-700 mb-2">
          Username
        </label>
        <input
          id="username"
          v-model="username"
          type="text"
          required
          maxlength="20"
          placeholder="Enter your username"
          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
          :disabled="isLoading || isConnecting"
        />
      </div>

      <div v-if="error" class="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
        {{ error }}
      </div>

      <button
        type="submit"
        :disabled="isLoading || isConnecting"
        class="w-full bg-primary-600 text-white py-3 px-6 rounded-lg hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span v-if="isLoading || isConnecting" class="flex items-center justify-center">
          <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Joining...
        </span>
        <span v-else>Start chatting</span>
      </button>
    </form>
  </div>
</template>