<template>
  <div v-if="isVisible" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
      <!-- Header -->
      <div class="flex items-center justify-between p-4 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900">{{ translations[currentLang].insertMedia }}</h3>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- Content -->
      <div class="p-6">
        <!-- Tabs -->
        <div class="flex border-b border-gray-200 mb-4">
          <button
            @click="activeTab = 'upload'"
            :class="[
              'px-4 py-2 text-sm font-medium border-b-2 transition-colors',
              activeTab === 'upload' 
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            ]"
          >
            Upload File
          </button>
          <button
            @click="activeTab = 'url'"
            :class="[
              'px-4 py-2 text-sm font-medium border-b-2 transition-colors',
              activeTab === 'url' 
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            ]"
          >
            URL
          </button>
          <button
            @click="activeTab = 'html'"
            :class="[
              'px-4 py-2 text-sm font-medium border-b-2 transition-colors',
              activeTab === 'html' 
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            ]"
          >
            Paste HTML
          </button>
        </div>

        <!-- Upload Tab -->
        <div v-if="activeTab === 'upload'" class="space-y-4">
          <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input
              ref="fileInput"
              type="file"
              accept="image/*,video/*,audio/*"
              class="hidden"
              @change="onFileSelect"
            />
            <button
              @click="$refs.fileInput.click()"
              class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Choose File
            </button>
            <p class="mt-2 text-sm text-gray-500">
              Supported: Images, Videos, Audio files
            </p>
          </div>
        </div>

        <!-- URL Tab -->
        <div v-if="activeTab === 'url'" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Media URL</label>
            <input
              v-model="mediaUrl"
              type="url"
              placeholder="https://example.com/image.jpg"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Alt Text</label>
            <input
              v-model="altText"
              type="text"
              placeholder="Description for accessibility"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <!-- HTML Tab -->
        <div v-if="activeTab === 'html'" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Paste HTML Code</label>
            <textarea
              v-model="htmlCode"
              rows="6"
              placeholder="<img src='...' alt='...' /> or <video src='...' controls></video>"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
            ></textarea>
          </div>
        </div>

        <!-- Media Preview -->
        <div v-if="mediaPreview" class="mt-4 p-4 border border-gray-200 rounded-lg">
          <h4 class="text-sm font-medium text-gray-700 mb-2">Preview:</h4>
          <div class="max-w-full overflow-hidden">
            <div v-html="mediaPreview"></div>
          </div>
        </div>

        <!-- Size Controls (for images) -->
        <div v-if="showSizeControls" class="mt-4 space-y-4">
          <h4 class="text-sm font-medium text-gray-700">Size Controls:</h4>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm text-gray-600 mb-1">Width</label>
              <input
                v-model="mediaWidth"
                type="text"
                placeholder="auto"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label class="block text-sm text-gray-600 mb-1">Height</label>
              <input
                v-model="mediaHeight"
                type="text"
                placeholder="auto"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div class="flex gap-2">
            <button
              @click="setSize('small')"
              class="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
            >
              Small
            </button>
            <button
              @click="setSize('medium')"
              class="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
            >
              Medium
            </button>
            <button
              @click="setSize('large')"
              class="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
            >
              Large
            </button>
            <button
              @click="setSize('full')"
              class="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
            >
              Full Width
            </button>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex items-center justify-end gap-2 p-4 border-t border-gray-200">
        <button
          @click="$emit('close')"
          class="px-4 py-2 text-sm bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
        >
          Cancel
        </button>
        <button
          @click="insertMedia"
          :disabled="!canInsert"
          class="px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Insert
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false
  },
  currentLang: {
    type: String,
    default: 'ar'
  },
  translations: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'insert'])

const activeTab = ref('upload')
const mediaUrl = ref('')
const altText = ref('')
const htmlCode = ref('')
const mediaWidth = ref('')
const mediaHeight = ref('')
const selectedFile = ref(null)
const mediaPreview = ref('')

const showSizeControls = computed(() => {
  return selectedFile.value?.type?.startsWith('image/') || 
         mediaUrl.value?.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i) ||
         htmlCode.value?.includes('<img')
})

const canInsert = computed(() => {
  return selectedFile.value || 
         (mediaUrl.value && mediaUrl.value.trim()) ||
         (htmlCode.value && htmlCode.value.trim())
})

function onFileSelect(event) {
  const file = event.target.files[0]
  if (!file) return

  selectedFile.value = file
  const reader = new FileReader()
  reader.onload = (e) => {
    mediaPreview.value = createMediaElement(e.target.result, file.type)
  }
  reader.readAsDataURL(file)
}

function createMediaElement(src, type) {
  if (type.startsWith('image/')) {
    return `<img src="${src}" alt="${altText.value || 'Image'}" style="max-width: 100%; height: auto;" />`
  } else if (type.startsWith('video/')) {
    return `<video src="${src}" controls style="max-width: 100%; height: auto;"></video>`
  } else if (type.startsWith('audio/')) {
    return `<audio src="${src}" controls></audio>`
  }
  return ''
}

function setSize(size) {
  const sizes = {
    small: { width: '200px', height: 'auto' },
    medium: { width: '400px', height: 'auto' },
    large: { width: '600px', height: 'auto' },
    full: { width: '100%', height: 'auto' }
  }
  
  const sizeConfig = sizes[size]
  mediaWidth.value = sizeConfig.width
  mediaHeight.value = sizeConfig.height
}

function insertMedia() {
  let mediaHtml = ''

  if (activeTab.value === 'upload' && selectedFile.value) {
    const reader = new FileReader()
    reader.onload = (e) => {
      mediaHtml = createMediaElement(e.target.result, selectedFile.value.type)
      addSizeAttributes(mediaHtml)
      emit('insert', mediaHtml)
      resetForm()
    }
    reader.readAsDataURL(selectedFile.value)
  } else if (activeTab.value === 'url' && mediaUrl.value) {
    const url = mediaUrl.value.trim()
    const isImage = url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)
    const isVideo = url.match(/\.(mp4|webm|ogg|mov)$/i)
    const isAudio = url.match(/\.(mp3|wav|ogg|aac)$/i)

    if (isImage) {
      mediaHtml = `<img src="${url}" alt="${altText.value || 'Image'}" />`
    } else if (isVideo) {
      mediaHtml = `<video src="${url}" controls></video>`
    } else if (isAudio) {
      mediaHtml = `<audio src="${url}" controls></audio>`
    } else {
      // Assume it's an image if we can't determine
      mediaHtml = `<img src="${url}" alt="${altText.value || 'Image'}" />`
    }
    
    addSizeAttributes(mediaHtml)
    emit('insert', mediaHtml)
    resetForm()
  } else if (activeTab.value === 'html' && htmlCode.value) {
    mediaHtml = htmlCode.value.trim()
    addSizeAttributes(mediaHtml)
    emit('insert', mediaHtml)
    resetForm()
  }
}

function addSizeAttributes(html) {
  if (!showSizeControls.value) return html

  // Create a temporary div to parse the HTML
  const tempDiv = document.createElement('div')
  tempDiv.innerHTML = html

  const mediaElement = tempDiv.querySelector('img, video, audio')
  if (mediaElement) {
    if (mediaWidth.value) {
      mediaElement.style.width = mediaWidth.value
    }
    if (mediaHeight.value) {
      mediaElement.style.height = mediaHeight.value
    }
  }

  return tempDiv.innerHTML
}

function resetForm() {
  activeTab.value = 'upload'
  mediaUrl.value = ''
  altText.value = ''
  htmlCode.value = ''
  mediaWidth.value = ''
  mediaHeight.value = ''
  selectedFile.value = null
  mediaPreview.value = ''
  if (this.$refs.fileInput) {
    this.$refs.fileInput.value = ''
  }
}

// Watch for changes to update preview
watch([mediaUrl, altText], () => {
  if (mediaUrl.value && activeTab.value === 'url') {
    const url = mediaUrl.value.trim()
    const isImage = url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)
    const isVideo = url.match(/\.(mp4|webm|ogg|mov)$/i)
    const isAudio = url.match(/\.(mp3|wav|ogg|aac)$/i)

    if (isImage) {
      mediaPreview.value = `<img src="${url}" alt="${altText.value || 'Image'}" style="max-width: 100%; height: auto;" />`
    } else if (isVideo) {
      mediaPreview.value = `<video src="${url}" controls style="max-width: 100%; height: auto;"></video>`
    } else if (isAudio) {
      mediaPreview.value = `<audio src="${url}" controls></audio>`
    }
  }
})

watch(htmlCode, () => {
  if (htmlCode.value && activeTab.value === 'html') {
    mediaPreview.value = htmlCode.value
  }
})
</script> 