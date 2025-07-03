<template>
  <div v-if="isVisible" class="mini-editor-preview-modal fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
    <div class="bg-white rounded-2xl shadow-2xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col">
      <!-- Header -->
      <div class="flex items-center justify-between px-6 py-2 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
        <div class="flex items-center gap-2">
          <Icon name="Preview" class="icon text-blue-600" />
          <h3 class="text-xl font-bold text-gray-900">Preview</h3>
        </div>
        <button
          @click="$emit('close')"
          class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition"
        >
          <svg class="w-6 h-6 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- Language Toggle -->
      <div class="flex justify-end px-6 pt-4 gap-2">
        <div class="inline-flex bg-gray-100 rounded-full p-1">
          <button
            v-for="lang in ['en', 'ar']"
            :key="lang"
            :class="[
              'px-4 py-1 rounded-full text-sm font-semibold focus:outline-none transition',
              currentLang === lang ? 'bg-blue-600 text-white shadow' : 'text-gray-700 hover:bg-gray-200'
            ]"
            @click="currentLang = lang"
          >
            {{ lang === 'en' ? 'English' : 'العربية' }}
          </button>
        </div>
      </div>

      <!-- Content -->
      <div class="flex-1 p-8 overflow-y-auto">
        <div class="prose max-w-none">
          <div 
            v-html="contentToShow" 
            class="preview-content"
            :dir="direction"
            :class="direction === 'rtl' ? 'text-right' : 'text-left'"
          ></div>
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
  if (currentLang.value === 'ar') return props.contentAr || ''
  if (currentLang.value === 'en') return props.contentEn || ''
  return ''
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

/* Modern modal tweaks */
.prose {
  color: #22292f;
}

::-webkit-scrollbar {
  width: 8px;
  background: #f3f4f6;
}
::-webkit-scrollbar-thumb {
  background: #e5e7eb;
  border-radius: 4px;
}

.preview-content .resize-handle,
.preview-content .media-remove-btn,
.prose .resize-handle,
.prose .media-remove-btn {
  display: none !important;
}
</style>

<style>
.mini-editor-preview-modal .resize-handle,
.mini-editor-preview-modal .media-remove-btn {
  display: none !important;
}
</style> 