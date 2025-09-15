<script setup lang="ts">
import { ref, onMounted } from 'vue'
import LoginForm from './components/LoginForm.vue'
import ChatRoom from './components/ChatRoom.vue'
import { socketService } from './services/socketService'

const currentUser = ref<string | null>(null)
const isConnecting = ref(false)

const handleUserLogin = async (username: string) => {
  isConnecting.value = true
  try {
    await socketService.connect()
    socketService.joinChat(username)
    currentUser.value = username
  } catch (error) {
    console.error('Failed to connect:', error)
  } finally {
    isConnecting.value = false
  }
}

const handleLogout = () => {
  socketService.disconnect()
  currentUser.value = null
}

onMounted(() => {
  // Clean up on component unmount
  return () => {
    socketService.disconnect()
  }
})
</script>

<template>
  <div id="app" class="h-full">
    <div v-if="!currentUser" class="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100">
      <LoginForm @login="handleUserLogin" :isConnecting="isConnecting" />
    </div>
    
    <div v-else class="h-screen">
      <ChatRoom :currentUser="currentUser" @logout="handleLogout" />
    </div>
  </div>
</template>