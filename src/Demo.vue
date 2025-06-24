<template>
  <div :dir="isRtl ? 'rtl' : 'ltr'" :class="isRtl ? 'rtl' : 'ltr'">
    <button @click="isRtl = !isRtl" class="fixed top-4 right-4 z-50 bg-gray-200 rounded-full p-2 shadow hover:bg-gray-300 transition">
      <span v-if="isRtl">🌐 LTR</span>
      <span v-else>🌐 RTL</span>
    </button>
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
            :rtl="isRtl"
          />
        </div>
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

const isRtl = ref(false)
</script>

<style scoped>
body {
  margin: 0;
  font-family: 'Tajawal', 'Inter', sans-serif;
}
</style> 