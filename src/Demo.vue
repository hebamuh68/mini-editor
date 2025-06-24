<template>
  <div class="min-h-screen bg-gray-50 p-8">
    <div class="max-w-4xl mx-auto">
      <header class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">
          Mini Editor Demo
        </h1>
        <p class="text-gray-600">
          A lightweight, feature-rich rich text editor for Vue 3
        </p>
      </header>

      <div class="bg-white rounded-lg shadow-sm border p-6">
        <MiniEditor
          v-model="content"
          label="Rich Text Editor"
          hint="Start typing to see the editor in action"
          placeholder="Write your content here..."
          :show-language-switcher="true"
          :default-language="'en'"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { MiniEditor } from './index'

const content = ref({
  ar: '',
  en: ''
})
</script>

<style scoped>
body {
  margin: 0;
  font-family: 'Tajawal', 'Inter', sans-serif;
}
</style> 