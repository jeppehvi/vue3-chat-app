<script setup lang="ts">

// Emoji parsing

import { computed } from 'vue'
import EmojiConvertor from 'emoji-js'

const emoji = new EmojiConvertor()
emoji.replace_mode = 'unified'
emoji.allow_native = true

function renderMessageWithEmojis(text: string) {
  return emoji.replace_colons(text)
}

const props = defineProps<{
  message: Message
  isOwnMessage: boolean
}>()

const formattedTime = computed(() => {
  return new Date(props.message.timestamp).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
})

const messageClass = computed(() => {
  if (props.message.type === 'system') {
    return 'system-message'
  }
  return 'chat-message'
})
</script>

<template>
  <div :class="messageClass">
    <div v-if="message.type === 'system'" class="system-message">
      {{ message.content || `${message.username} ${message.content || (message.type === 'user_joined' ? 'joined the chat' : 'left the chat')}` }}
    </div>
    
    <div v-else class="message-bubble" :class="{ 'ml-12': isOwnMessage, 'mr-12': !isOwnMessage }">
      <div class="flex items-start space-x-3">
        <div class="flex-shrink-0">
          <div 
            class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium"
            :class="isOwnMessage ? 'bg-primary-500 text-white' : 'bg-gray-500 text-white'"
          >
            {{ message.username.charAt(0).toUpperCase() }}
          </div>
        </div>
        
        <div class="flex-1">
          <div class="flex items-center space-x-2 mb-1">
            <span class="font-medium text-gray-900" :class="{ 'text-primary-600': isOwnMessage }">
              {{ message.username }}
            </span>
            <span class="text-xs text-gray-500">{{ formattedTime }}</span>
          </div>
          
          <p class="text-gray-700">{{ renderMessageWithEmojis(message.content) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>