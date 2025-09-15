
<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import ChatMessage from './ChatMessage.vue'
import OnlineUsers from './OnlineUsers.vue'
import { socketService } from '../services/socketService'
import type { Message, User } from '../types'
import EmojiPicker from './EmojiPicker.vue'
import 'vue3-emoji-picker/css'

const props = defineProps<{
  currentUser: string
}>()

const emit = defineEmits<{
  logout: []
}>()


const messages = ref<Message[]>([])
const onlineUsers = ref<User[]>([])
const newMessage = ref('')
const messagesContainer = ref<HTMLElement>()
const messageInput = ref<HTMLInputElement>()
const isTyping = ref(false)
const typingUsers = ref<string[]>([])


const sendMessage = () => {
  if (!newMessage.value.trim()) return
  socketService.sendMessage(newMessage.value.trim())
  socketService.emitStopTyping(props.currentUser)
  newMessage.value = ''
}

const scrollToBottom = async () => {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

const handleLogout = () => {
  emit('logout')
}

const handleTyping = () => {
  if (newMessage.value.trim()) {
    socketService.emitTyping(props.currentUser)
  } else {
    socketService.emitStopTyping(props.currentUser)
  }
}

onMounted(() => {
  // Set up socket event listeners
  socketService.onMessageReceived((message) => {
    messages.value.push(message)
    scrollToBottom()
  })

  socketService.onUserJoined((notification) => {
    messages.value.push(notification)
    scrollToBottom()
  })

  socketService.onUserLeft((notification) => {
    messages.value.push(notification)
    scrollToBottom()
  })

  socketService.onOnlineUsersUpdated((users) => {
    onlineUsers.value = users
  })

  socketService.onUserTyping((data) => {
    if (!typingUsers.value.includes(data.username)) {
      typingUsers.value.push(data.username)
    }
  })

  socketService.onUserStopTyping((data) => {
    typingUsers.value = typingUsers.value.filter(u => u !== data.username)
  })

  // Initial scroll to bottom
  scrollToBottom()
})

const showEmojiPicker = ref(false)

function insertEmoji(emoji: string) {
  // Accept emoji object from picker and extract unicode string
  let emojiStr = emoji?.unicode || emoji?.i || (typeof emoji === 'string' ? emoji : '')
  if (!emojiStr) return
    // Removed console.log for production code cleanliness
  const input = messageInput.value
  let start = newMessage.value.length
  let end = newMessage.value.length
  // Only use selection if input is focused
  if (input && document.activeElement === input) {
    start = input.selectionStart ?? newMessage.value.length
    end = input.selectionEnd ?? newMessage.value.length
  }
  newMessage.value =
    newMessage.value.slice(0, start) + emojiStr + newMessage.value.slice(end)
  nextTick(() => {
    input?.focus()
    input?.setSelectionRange(start + (emojiStr?.length ?? 2), start + (emojiStr?.length ?? 2))
  })
  // Do not close picker automatically; let user close or toggle manually
}

onUnmounted(() => {
  socketService.removeAllListeners()
})
</script>

<template>
  <div class="h-full flex bg-gray-50">
    <!-- Main chat area -->
    <div class="flex-1 flex flex-col">
      <!-- Header -->
      <header class="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
            </svg>
          </div>
          <div>
            <h1 class="text-lg font-semibold text-gray-900">Current room</h1>
            <p class="text-sm text-gray-500">{{ onlineUsers.length }} user{{ onlineUsers.length !== 1 ? 's' : '' }} online</p>
          </div>
        </div>
        
        <div class="flex items-center space-x-4">
          <span class="user-badge">{{ currentUser }}</span>
          <button
            @click="handleLogout"
            class="text-gray-500 hover:text-red-600 transition-colors"
            title="Logout"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
            </svg>
          </button>
        </div>
      </header>

      <!-- Messages area -->
      <div 
        ref="messagesContainer"
        class="flex-1 overflow-y-auto p-6 space-y-4 scroll-smooth"
      >
        <div v-if="messages.length === 0" class="text-center text-gray-500 py-8">
          <svg class="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
          </svg>
          <p>No messages yet. Be the first to start the conversation!</p>
        </div>
        
        <ChatMessage 
          v-for="message in messages" 
          :key="message.id"
          :message="message"
          :isOwnMessage="message.username === currentUser"
        />
      </div>

      <!-- Message input -->
      <div class="bg-white border-t border-gray-200 p-4">
        <div class="relative flex items-center space-x-2">
          <form @submit.prevent="sendMessage" class="flex-1 flex space-x-4 items-center">
            <input
              v-model="newMessage"
              @input="handleTyping"
              type="text"
              placeholder="Type your message..."
              maxlength="500"
              class="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              ref="messageInput"
            />
            <button type="submit"
              :disabled="!newMessage.trim()"
              class="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
              </svg>
            </button>
          </form>
          <button type="button" @click="showEmojiPicker = !showEmojiPicker" class="px-2 py-2 rounded-lg bg-gray-100 hover:bg-gray-200">
            😊
          </button>
          <div v-if="showEmojiPicker" class="absolute right-0 bottom-full z-50 mb-2">
            <EmojiPicker :native="true" @select="insertEmoji" />
          </div>
        </div>
      </div>
    </div>

    <!-- Online users sidebar -->
    <OnlineUsers :users="onlineUsers" :currentUser="currentUser" :typingUsers="typingUsers" />
  </div>
</template>