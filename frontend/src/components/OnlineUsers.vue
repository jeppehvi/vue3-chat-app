<script setup lang="ts">
import { computed } from 'vue'
import type { User } from '../types'

const props = defineProps<{
  users: User[]
  currentUser: string
  typingUsers?: string[]
}>()

const sortedUsers = computed(() => {
  return [...props.users].sort((a, b) => {
    // Current user first
    if (a.username === props.currentUser) return -1
    if (b.username === props.currentUser) return 1
    // Then alphabetically
    return a.username.localeCompare(b.username)
  })
})
</script>

<template>
  <div class="w-64 bg-white border-l border-gray-200 flex flex-col">
    <!-- Header -->
    <div class="p-4 border-b border-gray-200">
      <h2 class="font-semibold text-gray-900 flex items-center">
        <span class="online-indicator mr-2"></span>
        Online users ({{ users.length }})
      </h2>
    </div>

    <!-- Users list -->
    <div class="flex-1 overflow-y-auto p-4">
      <div v-if="users.length === 0" class="text-center text-gray-500 py-8">
        <p class="text-sm">No users online</p>
      </div>
      
      <div v-else class="space-y-2">
        <div 
          v-for="user in sortedUsers" 
          :key="user.id"
          class="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
          :class="{ 'bg-primary-50 border border-primary-200': user.username === currentUser }"
        >
          <div 
            class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium"
            :class="user.username === currentUser ? 'bg-primary-500 text-white' : 'bg-gray-400 text-white'"
          >
            {{ user.username.charAt(0).toUpperCase() }}
          </div>
          
          <div class="flex-1">
              <div class="flex items-center space-x-2">
                <span class="font-medium text-gray-900 text-sm">
                  {{ user.username }}
                </span>
                <span v-if="user.username === currentUser" class="text-xs text-primary-600 font-medium">
                  (You)
                </span>
                <span v-if="props.typingUsers && props.typingUsers.includes(user.username)" class="ml-2 flex items-center">
                  <svg class="w-5 h-5 text-primary-600 animate-pulse mr-1" fill="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="6" />
                  </svg>
                  <span class="text-xs text-primary-600 font-semibold">typing…</span>
                </span>
              </div>
              <div class="flex items-center space-x-1 mt-1">
                <div class="online-indicator"></div>
                <span class="text-xs text-gray-500">Online</span>
              </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>