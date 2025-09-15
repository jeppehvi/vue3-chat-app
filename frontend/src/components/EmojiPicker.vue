<template>
  <vue3-emoji-picker @emojiClick="onEmojiClick" :search="true" :recent="true" />
</template>

<script setup lang="ts">
import { defineEmits } from 'vue'
import Vue3EmojiPicker from 'vue3-emoji-picker'
// No custom function needed, use @select event directly
</script>

<style>
/* Optional: style the emoji picker popup */
</style>
