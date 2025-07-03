<template>
  <div v-if="isVisible" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 font-tajawal">
    <div class="bg-white rounded-lg shadow-xl max-w-xl w-full mx-4 relative font-tajawal">
      <!-- Header -->
      <div class="flex items-center justify-center p-4 border-b border-gray-200 relative font-tajawal">
        <h3 class="text-2xl font-semibold text-center w-full font-tajawal">إضافة</h3>
        <button @click="$emit('close')" :class="['absolute', 'top-4', currentLang === 'ar' ? 'left-4' : 'right-4', 'text-gray-400', 'hover:text-gray-600', 'transition-colors', 'font-tajawal']">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
      <!-- Content -->
      <div class="p-6 font-tajawal">
        <!-- Drag & Drop Area -->
        <div
          class="border-2 border-dashed border-blue-300 rounded-lg p-6 text-center mb-4 relative cursor-pointer font-tajawal"
          @dragover.prevent="dragActive = true"
          @dragleave.prevent="dragActive = false"
          @drop.prevent="onDrop"
          @click="triggerFileInput"
          :class="{ 'bg-blue-50 border-blue-500': dragActive }"
        >
          <div class="flex flex-col items-center justify-center h-full font-tajawal">
            <svg class="w-12 h-12 text-blue-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5-5m0 0l5 5m-5-5v12" />
            </svg>
            <span class="block text-gray-700 mb-2 font-tajawal">اسحب ملفاتك لبدء التحميل أو <span class="text-blue-500 underline cursor-pointer font-tajawal">تحميل الملف</span></span>
            <span class="block text-xs text-gray-400 mb-2 font-tajawal">حجم الصورة يجب أن يكون أقل من 500 كيلو بايت<br>الصورة يجب أن تكون بصيغة JPG, PNG, JPEG</span>
            <input ref="fileInput" type="file" accept="image/*" class="hidden" multiple @change="onFileSelect" />
          </div>
        </div>
        <!-- File List -->
        <div v-if="files.length" class="mb-4 flex flex-wrap gap-2 font-tajawal">
          <div v-for="(file, idx) in files" :key="file.name + idx" class="flex items-center bg-white border border-blue-300 rounded-full px-3 py-1 text-sm text-blue-700 relative font-tajawal">
            <span class="truncate max-w-[120px] font-tajawal">{{ file.name }}</span>
            <button @click.stop="removeFile(idx)" class="ml-2 text-pink-500 hover:text-red-700 text-lg font-tajawal">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>
        <!-- Size Controls for first image -->
        <div v-if="files.length" class="mb-4 grid grid-cols-2 gap-4 font-tajawal">
          <div>
            <label class="block text-sm text-gray-600 mb-1 font-tajawal">العرض (px)</label>
            <input v-model="imageWidth" type="number" min="1" placeholder="auto" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-tajawal" />
          </div>
          <div>
            <label class="block text-sm text-gray-600 mb-1 font-tajawal">الارتفاع (px)</label>
            <input v-model="imageHeight" type="number" min="1" placeholder="auto" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-tajawal" />
          </div>
        </div>
      </div>
      <!-- Footer -->
      <div class="flex items-center justify-center p-4 border-t border-gray-200 font-tajawal">
        <button @click="insertImages" :disabled="!files.length" class="w-full py-2 text-white rounded text-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-tajawal" style="background:#082F49;">إضافة</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  isVisible: Boolean,
  currentLang: { type: String, default: 'ar' },
})
const emit = defineEmits(['close', 'insert'])

const files = ref([])
const dragActive = ref(false)
const imageWidth = ref('')
const imageHeight = ref('')
const fileInput = ref(null)

function triggerFileInput() {
  if (files.value.length >= 5) return;
  fileInput.value && fileInput.value.click();
}

function onFileSelect(e) {
  const selected = Array.from(e.target.files).filter(f => f.type.startsWith('image/') && f.size <= 500 * 1024)
  files.value = [...files.value, ...selected].slice(0, 5)
  e.target.value = ''
}

function onDrop(e) {
  dragActive.value = false
  const dropped = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/') && f.size <= 500 * 1024)
  files.value = [...files.value, ...dropped].slice(0, 5)
}

function removeFile(idx) {
  files.value.splice(idx, 1)
}

function insertImages() {
  files.value.forEach(file => {
    const reader = new FileReader()
    reader.onload = (e) => {
      let style = ''
      if (imageWidth.value) style += `width:${imageWidth.value}px;`
      if (imageHeight.value) style += `height:${imageHeight.value}px;`
      const html = `<img src="${e.target.result}" alt="" style="${style}max-width:100%;height:auto;" />`
      emit('insert', html)
    }
    reader.readAsDataURL(file)
  })
  files.value = []
  imageWidth.value = ''
  imageHeight.value = ''
  emit('close')
}
</script> 