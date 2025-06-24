<template>
  <div v-if="isVisible" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
      <!-- Header -->
      <div class="flex items-center justify-between p-4 border-b border-gray-200">
        <div class="flex items-center gap-2">
          <Icon name="Preview" class="icon" />
          <h3 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
            Preview
          </h3>
        </div>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- Language Toggle -->
      <div class="flex justify-end p-4 pt-2 gap-2">
        <button
          v-for="lang in ['en', 'ar']"
          :key="lang"
          :class="[
            'px-3 py-1 rounded text-sm font-medium border',
            currentLang === lang ? 'bg-blue-500 text-white border-blue-500' : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
          ]"
          @click="currentLang = lang"
        >
          {{ lang === 'en' ? 'English' : 'العربية' }}
        </button>
      </div>

      <!-- Content -->
      <div class="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
        <div class="prose max-w-none">
          <div 
            v-html="contentToShow" 
            class="preview-content"
            :dir="direction"
            :class="direction === 'rtl' ? 'text-right' : 'text-left'"
          ></div>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex items-center justify-between p-4 border-t border-gray-200">
        <div class="text-sm text-gray-500">
          {{ currentLang === 'ar' ? 'العربية' : 'English' }}
        </div>
        <div class="flex gap-2 items-center">
          <button
            @click="copyToClipboard"
            class="px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Copy HTML
          </button>
          <span v-if="copied" class="text-green-600 text-xs ml-2">Copied!</span>
          <button
            @click="$emit('close')"
            class="px-4 py-2 text-sm bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import Icon from '../icons/Icon.vue'

const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false
  },
  content: {
    type: String,
    default: ''
  },
  language: {
    type: String,
    default: 'ar'
  },
  // Accept both ar/en for toggling
  contentAr: String,
  contentEn: String
})

const emit = defineEmits(['close'])

const currentLang = ref(props.language)
watch(() => props.language, (val) => { currentLang.value = val })

const direction = computed(() => {
  return currentLang.value === 'ar' ? 'rtl' : 'ltr'
})

const contentToShow = computed(() => {
  if (props.contentAr && props.contentEn) {
    return currentLang.value === 'ar' ? props.contentAr : props.contentEn
  }
  return props.content
})

const copied = ref(false)
function copyToClipboard() {
  navigator.clipboard.writeText(contentToShow.value).then(() => {
    copied.value = true
    setTimeout(() => copied.value = false, 1200)
  }).catch(err => {
    console.error('Failed to copy: ', err)
  })
}
</script>

<style scoped>
.preview-content {
  font-family: 'Tajawal', sans-serif;
  line-height: 1.6;
}

.preview-content h1 {
  font-size: 2em;
  font-weight: bold;
  margin: 0.67em 0;
}

.preview-content h2 {
  font-size: 1.5em;
  font-weight: bold;
  margin: 0.75em 0;
}

.preview-content h3 {
  font-size: 1.17em;
  font-weight: bold;
  margin: 0.83em 0;
}

.preview-content h4 {
  font-size: 1em;
  font-weight: bold;
  margin: 1.12em 0;
}

.preview-content h5 {
  font-size: 0.83em;
  font-weight: bold;
  margin: 1.5em 0;
}

.preview-content img {
  max-width: 100%;
  height: auto;
  border-radius: 4px;
}

.preview-content video,
.preview-content audio {
  max-width: 100%;
  border-radius: 4px;
}
</style> 