<template>
  <div class="inline-flex flex-col justify-start items-end w-full">


    <div class="editor-container rounded-xl bg-white border border-gray-200">
          <!-- Dynamic Label -->
      <label
        v-if="label"
        class="border-b border-gray-200 p-2 ps-4 pe-4 mb-2 w-full flex items-center text-start text-[#261E27] text-base font-tajawal font-normal"
        :for="`editor-${Math.random().toString(36).substr(2, 9)}`"
      >  
        <span v-if="hint" class="relative group text-[#FABF35] me-1 cursor-pointer align-middle"> 
          <Icon name="Info" class="w-4 h-4 inline-block align-middle" /> 
          <span class="absolute bottom-full z-10 px-2 py-1 text-xs text-white whitespace-nowrap bg-black rounded shadow-lg opacity-0 transition-opacity pointer-events-none start-1/2 -ms-1 group-hover:opacity-100"> 
            {{ hint }}
          </span>
        </span>
        {{ label }}
        <span v-if="required" class="text-red-600 ms-1">*</span>
      </label>
    
      <div class="p-4">
        <div class="flex flex-wrap gap-2 mb-3 items-center flex-row relative">
          <!-- Text color -->
          <button @click="showTextColorPanel = !showTextColorPanel" :class="toolbarBtn('foreColor')" title="Text Color" type="button">
            <Icon name="TextColor" />
          </button>
          <div v-if="showTextColorPanel" ref="textColorPanelRef" class="absolute z-30 bg-white border rounded-lg shadow-lg p-4 min-w-[280px] mt-1 left-0">            
            <div class="color-picker-advanced">
              <div 
                class="color-gradient-area"
                data-type="text"
                :style="{ 
                  '--hue-color': `hsl(${textHue}, 100%, 50%)`,
                  background: `
                    linear-gradient(to bottom, transparent, black), 
                    linear-gradient(to right, white, hsl(${textHue}, 100%, 50%))
                  `
                }"
                @mousedown="startColorDrag($event, 'text')"
              >
                <div 
                  class="color-selector-circle"
                  :style="{ 
                    left: `${textSaturation}%`, 
                    top: `${100 - textLightness}%` 
                  }"
                ></div>
              </div>
              
              <div 
                class="hue-slider"
                data-type="text"
                @mousedown="startHueDrag($event, 'text')"
              >
                <div 
                  class="hue-selector"
                  :style="{ left: `${(textHue / 360) * 100}%` }"
                ></div>
              </div>
              
              <div class="color-preview" :style="{ backgroundColor: textColor }"></div>
            </div>
          </div>
          <!-- Highlight color -->
          <button @click="showHilitePanel = !showHilitePanel" :class="toolbarBtn('hiliteColor')" title="Highlight" type="button">
            <Icon name="Highlight" />
          </button>
          <div v-if="showHilitePanel" ref="hilitePanelRef" class="absolute z-30 bg-white border rounded-lg shadow-lg p-4 min-w-[280px] mt-1 left-0">            
            <div class="color-picker-advanced">
              <div 
                class="color-gradient-area"
                data-type="hilite"
                :style="{ 
                  '--hue-color': `hsl(${hiliteHue}, 100%, 50%)`,
                  background: `
                    linear-gradient(to bottom, transparent, black), 
                    linear-gradient(to right, white, hsl(${hiliteHue}, 100%, 50%))
                  `
                }"
                @mousedown="startColorDrag($event, 'hilite')"
              >
                <div 
                  class="color-selector-circle"
                  :style="{ 
                    left: `${hiliteSaturation}%`, 
                    top: `${100 - hiliteLightness}%` 
                  }"
                ></div>
              </div>
              
              <div 
                class="hue-slider"
                data-type="hilite"
                @mousedown="startHueDrag($event, 'hilite')"
              >
                <div 
                  class="hue-selector"
                  :style="{ left: `${(hiliteHue / 360) * 100}%` }"
                ></div>
              </div>
              
              <div class="color-preview" :style="{ backgroundColor: hiliteColor }"></div>
            </div>
          </div>
          <!-- Bold, Italic, Underline, Strike -->
          <button @click="format('bold')" :class="toolbarBtn('bold')" title="Bold">
            <Icon name="Bold" />
          </button>
          <button @click="format('italic')" :class="toolbarBtn('italic')" title="Italic">
            <Icon name="Italic" />
          </button>
          <button @click="format('underline')" :class="toolbarBtn('underline')" title="Underline">
            <Icon name="Underline" />
          </button>
          <button @click="format('strikeThrough')" :class="toolbarBtn('strikeThrough')" title="Strike">
            <Icon name="Strikethrough" />
          </button>
          <!-- Lists -->
          <button @click="format('insertUnorderedList')" :class="toolbarBtn()" title="Bullet List">
            <Icon name="ListPoint" />
          </button>
          <button @click="format('insertOrderedList')" :class="toolbarBtn()" title="Numbered List">
            <Icon name="ListNum" />
          </button>
          <!-- Alignment -->
          <button @click="format('justifyLeft')" :class="toolbarBtn()" title="Align Left">
            <Icon name="AlignLeft" />
          </button>
          <button @click="format('justifyCenter')" :class="toolbarBtn()" title="Align Center">
            <Icon name="AlignCenter" />
          </button>
          <button @click="format('justifyRight')" :class="toolbarBtn()" title="Align Right">
            <Icon name="AlignRight" />
          </button>
          <!-- Headings -->
          <button @click="formatHeading(1)" :class="toolbarBtn(null, isHeading(1))" title="Heading 1">
            <Icon name="H1" />
          </button>
          <button @click="formatHeading(2)" :class="toolbarBtn(null, isHeading(2))" title="Heading 2">
            <Icon name="H2" />
          </button>
          <button @click="formatHeading(3)" :class="toolbarBtn(null, isHeading(3))" title="Heading 3">
            <Icon name="H3" />
          </button>
          <button @click="formatHeading(4)" :class="toolbarBtn(null, isHeading(4))" title="Heading 4">
            <Icon name="H4" />
          </button>
          <button @click="formatHeading(5)" :class="toolbarBtn(null, isHeading(5))" title="Heading 5">
            <Icon name="H5" />
          </button>
          <!-- Media Upload -->
          <input ref="mediaInput" type="file" accept="image/*,video/*,audio/*" class="hidden" @change="onMediaUpload" />
          <button type="button" class="toolbar-btn" title="Insert Media" @click="triggerMediaInput">
            <Icon name="Media" />
          </button>
          <!-- Undo/Redo -->
          <button @click="format('undo')" :class="toolbarBtn()" title="Undo">
            <Icon name="Undo" />
          </button>
          <button @click="format('redo')" :class="toolbarBtn()" title="Redo">
            <Icon name="Redo" />
          </button>
          <!-- Clear Formatting -->
          <button @click="clearFormatting()" :class="toolbarBtn()" title="Clear Formatting" style="background-color: #FFC6C6;">
            <Icon name="Broom" />
          </button>
        </div>
        <div
        ref="editor"
        contenteditable="true"
        class="editor-area"
        :class="currentLang === 'ar' ? 'text-right' : 'text-left'"
        :dir="currentLang === 'ar' ? 'rtl' : 'ltr'"
        :placeholder="placeholder"
        @input="updateValue"
        @blur="updateValue"
        ></div>
      </div>


    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, computed, onBeforeUnmount } from 'vue'
import Icon from '../icons/Icon.vue'

const langConfig = {
  ar: { shortLabel: 'ع', label: 'العربية' },
  en: { shortLabel: 'EN', label: 'English' }
}
const props = defineProps({
  modelValue: {
    type: Object,
    required: true
  },
  placeholder: String,
  label: String,
  hint: String,
  required: Boolean
})

const emit = defineEmits(['update:modelValue'])
const editor = ref(null)
const textColor = ref('#000000')
const hiliteColor = ref('#ffff00')
const currentLang = ref('ar')
const mediaInput = ref(null)
const showHilitePanel = ref(false)
const showTextColorPanel = ref(false)

// Color picker state
const textHue = ref(0)
const textSaturation = ref(0)
const textLightness = ref(0)

const hiliteHue = ref(60)
const hiliteSaturation = ref(100)
const hiliteLightness = ref(50)

// Drag state
const isDraggingColor = ref(false)
const isDraggingHue = ref(false)
const currentDragType = ref('')

const currentValue = computed({
  get() {
    return props.modelValue?.[currentLang.value] || ''
  },
  set(val) {
    emit('update:modelValue', {
      ...props.modelValue,
      [currentLang.value]: val
    })
  }
})

function switchLanguage(lang) {
  currentLang.value = lang
  if (editor.value) {
    editor.value.focus()
  }
}

function triggerMediaInput() {
  if (mediaInput.value) mediaInput.value.value = '';
  mediaInput.value?.click();
}

function format(command, value = null) {
  if (!editor.value) return;
  editor.value.focus();
  try {
    document.execCommand(command, false, value);
  } catch (e) {
    // fallback for headings
    if (command === 'formatBlock' && value && !value.startsWith('<')) {
      document.execCommand(command, false, '<' + value + '>');
    }
  }
  updateValue();
}

function formatHeading(level) {
  if (!editor.value) return;
  editor.value.focus();
  
  // Remove any existing heading formatting first
  const selection = window.getSelection();
  if (selection && selection.rangeCount > 0) {
    let node = selection.anchorNode;
    while (node && node !== editor.value) {
      if (node.nodeType === 1 && /^H[1-6]$/i.test(node.nodeName)) {
        // If clicking the same heading level, remove formatting
        if (node.nodeName.toLowerCase() === 'h' + level) {
          const p = document.createElement('p');
          p.innerHTML = node.innerHTML;
          node.parentNode.replaceChild(p, node);
          updateValue();
          return;
        }
        // Otherwise, change to new heading level
        const newHeading = document.createElement('H' + level);
        newHeading.innerHTML = node.innerHTML;
        node.parentNode.replaceChild(newHeading, node);
        updateValue();
        return;
      }
      node = node.parentNode;
    }
  }
  
  // If no existing heading, create new one
  try {
    document.execCommand('formatBlock', false, 'H' + level);
  } catch (e) {
    document.execCommand('formatBlock', false, '<H' + level + '>');
  }
  updateValue();
}

// Helper function to traverse DOM nodes up to editor
function traverseToEditor(startNode, callback) {
  if (!editor.value) return false;
  let node = startNode;
  while (node && node !== editor.value) {
    if (node.nodeType === 1 && callback(node)) {
      return true;
    }
    node = node.parentNode;
  }
  return false;
}

function isHeading(level) {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return false;
  
  return traverseToEditor(selection.anchorNode, (node) => 
    node.nodeName.toLowerCase() === 'h' + level
  );
}

function isActive(command) {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return false;
  
  const nodeCheckers = {
    'bold': (node) => node.nodeName === 'B' || node.nodeName === 'STRONG',
    'italic': (node) => node.nodeName === 'I' || node.nodeName === 'EM',
    'underline': (node) => node.nodeName === 'U',
    'strikeThrough': (node) => node.nodeName === 'S' || node.nodeName === 'STRIKE' || node.nodeName === 'DEL'
  };
  
  const checker = nodeCheckers[command];
  return checker ? traverseToEditor(selection.anchorNode, checker) : false;
}

function applyTextColor() {
  format('foreColor', textColor.value);
}
function applyHiliteColor() {
  format('hiliteColor', hiliteColor.value);
}

function updateValue() {
  // Remove orphaned media remove buttons before saving
  Array.from(editor.value.querySelectorAll('.media-remove-btn')).forEach(btn => btn.remove());
  currentValue.value = editor.value.innerHTML;
}

function toolbarBtn(cmd = null, active = false) {
  return [
    'toolbar-btn',
    (active || (cmd && isActive(cmd))) ? 'toolbar-btn-active' : ''
  ].join(' ');
}

function onMediaUpload(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(evt) {
    if (evt.target.result) {
      insertMedia(evt.target.result, file.type);
    }
  };
  reader.readAsDataURL(file);
  e.target.value = '';
}

// Helper function to create remove button for media elements
function createRemoveButton(parentNode) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.innerHTML = '✕';
  btn.className = 'media-remove-btn';
  Object.assign(btn.style, {
    position: 'absolute',
    top: '2px',
    right: '2px',
    background: '#fff',
    border: '1px solid #ccc',
    borderRadius: '50%',
    width: '20px',
    height: '20px',
    fontSize: '14px',
    cursor: 'pointer'
  });
  btn.onclick = function(ev) {
    ev.stopPropagation();
    parentNode.remove();
    updateValue();
  };
  return btn;
}

function insertMedia(src, type) {
  const container = document.createElement('span');
  container.style.display = 'inline-block';
  container.style.position = 'relative';
  
  let mediaElement;
  
  if (type.startsWith('image/')) {
    mediaElement = document.createElement('img');
    mediaElement.src = src;
    mediaElement.className = 'inline-block max-h-40 my-2 rounded shadow';
    mediaElement.style.verticalAlign = 'middle';
  } else if (type.startsWith('video/')) {
    mediaElement = document.createElement('video');
    mediaElement.src = src;
    mediaElement.controls = true;
    mediaElement.className = 'inline-block max-h-52 my-2 rounded shadow';
    mediaElement.style.verticalAlign = 'middle';
  } else if (type.startsWith('audio/')) {
    mediaElement = document.createElement('audio');
    mediaElement.src = src;
    mediaElement.controls = true;
    mediaElement.className = 'my-2';
    mediaElement.style.verticalAlign = 'middle';
  }
  
  if (mediaElement) {
    container.appendChild(mediaElement);
    container.appendChild(createRemoveButton(container));
    insertAtCursor(container);
    updateValue();
  }
}

function insertAtCursor(node) {
  let sel = window.getSelection()
  if (!sel || !sel.rangeCount) return
  let range = sel.getRangeAt(0)
  range.collapse(false)
  range.insertNode(node)
  range.setStartAfter(node)
  range.setEndAfter(node)
  sel.removeAllRanges()
  sel.addRange(range)
}

watch(() => props.modelValue, (val) => {
  if (editor.value && editor.value.innerHTML !== (val?.[currentLang.value] || '')) {
    editor.value.innerHTML = val?.[currentLang.value] || ''
  }
})

watch(currentLang, (lang) => {
  if (editor.value) {
    editor.value.innerHTML = currentValue.value;
  }
});

onMounted(() => {
  if (editor.value && props.modelValue) {
    editor.value.innerHTML = props.modelValue?.[currentLang.value] || ''
  }
  
  // Initialize color picker state
  const textHsl = rgbToHsl(0, 0, 0) // black
  textHue.value = textHsl.h
  textSaturation.value = textHsl.s
  textLightness.value = textHsl.l
  
  const hiliteHsl = rgbToHsl(255, 255, 0) // yellow
  hiliteHue.value = hiliteHsl.h
  hiliteSaturation.value = hiliteHsl.s
  hiliteLightness.value = hiliteHsl.l
  
  // Add global mouse event listeners for drag functionality
  document.addEventListener('mousemove', handleGlobalMouseMove)
  document.addEventListener('mouseup', handleGlobalMouseUp)
})

onBeforeUnmount(() => {
  // Clean up global event listeners
  document.removeEventListener('mousemove', handleGlobalMouseMove)
  document.removeEventListener('mouseup', handleGlobalMouseUp)
})

// Helper function to update color values
function updateColorValues(type, saturation, lightness, hue = null) {
  if (type === 'text') {
    if (saturation !== null) textSaturation.value = saturation;
    if (lightness !== null) textLightness.value = lightness;
    if (hue !== null) textHue.value = hue;
    updateTextColor();
  } else {
    if (saturation !== null) hiliteSaturation.value = saturation;
    if (lightness !== null) hiliteLightness.value = lightness;
    if (hue !== null) hiliteHue.value = hue;
    updateHiliteColor();
  }
}

function handleGlobalMouseMove(event) {
  if (isDraggingColor.value) {
    const colorArea = document.querySelector(`.color-gradient-area[data-type="${currentDragType.value}"]`);
    if (colorArea) {
      const rect = colorArea.getBoundingClientRect();
      const x = Math.max(0, Math.min(rect.width, event.clientX - rect.left));
      const y = Math.max(0, Math.min(rect.height, event.clientY - rect.top));
      
      const saturation = (x / rect.width) * 100;
      const lightness = 100 - (y / rect.height) * 100;
      
      updateColorValues(currentDragType.value, saturation, lightness);
    }
  } else if (isDraggingHue.value) {
    const hueSlider = document.querySelector(`.hue-slider[data-type="${currentDragType.value}"]`);
    if (hueSlider) {
      const rect = hueSlider.getBoundingClientRect();
      const x = Math.max(0, Math.min(rect.width, event.clientX - rect.left));
      const hue = (x / rect.width) * 360;
      
      updateColorValues(currentDragType.value, null, null, hue);
    }
  }
}

function handleGlobalMouseUp() {
  isDraggingColor.value = false;
  isDraggingHue.value = false;
  currentDragType.value = '';
}

// --- Click outside logic for color panels ---
function useClickOutside(refs, closeFn) {
  function handler(e) {
    if (refs.some(r => r.value && r.value.contains(e.target))) return;
    closeFn();
  }
  onMounted(() => document.addEventListener('mousedown', handler));
  onBeforeUnmount(() => document.removeEventListener('mousedown', handler));
}

const textColorPanelRef = ref(null)
const hilitePanelRef = ref(null)
useClickOutside([textColorPanelRef], () => showTextColorPanel.value = false)
useClickOutside([hilitePanelRef], () => showHilitePanel.value = false)

// Color conversion functions
function hslToRgb(h, s, l) {
  h /= 360
  s /= 100
  l /= 100
  
  const c = (1 - Math.abs(2 * l - 1)) * s
  const x = c * (1 - Math.abs((h * 6) % 2 - 1))
  const m = l - c / 2
  
  let r, g, b
  
  if (0 <= h && h < 1/6) {
    r = c; g = x; b = 0
  } else if (1/6 <= h && h < 2/6) {
    r = x; g = c; b = 0
  } else if (2/6 <= h && h < 3/6) {
    r = 0; g = c; b = x
  } else if (3/6 <= h && h < 4/6) {
    r = 0; g = x; b = c
  } else if (4/6 <= h && h < 5/6) {
    r = x; g = 0; b = c
  } else {
    r = c; g = 0; b = x
  }
  
  r = Math.round((r + m) * 255)
  g = Math.round((g + m) * 255)
  b = Math.round((b + m) * 255)
  
  return { r, g, b }
}

function rgbToHsl(r, g, b) {
  r /= 255
  g /= 255
  b /= 255
  
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const diff = max - min
  
  let h = 0
  let s = 0
  let l = (max + min) / 2
  
  if (diff !== 0) {
    s = l > 0.5 ? diff / (2 - max - min) : diff / (max + min)
    
    switch (max) {
      case r: h = (g - b) / diff + (g < b ? 6 : 0); break
      case g: h = (b - r) / diff + 2; break
      case b: h = (r - g) / diff + 4; break
    }
    h /= 6
  }
  
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  }
}

function rgbToHex(r, g, b) {
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
}

// Color picker event handlers
function startColorDrag(event, type) {
  event.preventDefault();
  isDraggingColor.value = true;
  currentDragType.value = type;
  
  const rect = event.currentTarget.getBoundingClientRect();
  const x = Math.max(0, Math.min(rect.width, event.clientX - rect.left));
  const y = Math.max(0, Math.min(rect.height, event.clientY - rect.top));
  
  const saturation = (x / rect.width) * 100;
  const lightness = 100 - (y / rect.height) * 100;
  
  updateColorValues(type, saturation, lightness);
}

function startHueDrag(event, type) {
  event.preventDefault();
  isDraggingHue.value = true;
  currentDragType.value = type;
  
  const rect = event.currentTarget.getBoundingClientRect();
  const x = Math.max(0, Math.min(rect.width, event.clientX - rect.left));
  const hue = (x / rect.width) * 360;
  
  updateColorValues(type, null, null, hue);
}

function updateTextColor() {
  const rgb = hslToRgb(textHue.value, textSaturation.value, textLightness.value)
  textColor.value = rgbToHex(rgb.r, rgb.g, rgb.b)
  applyTextColor()
}

function updateHiliteColor() {
  const rgb = hslToRgb(hiliteHue.value, hiliteSaturation.value, hiliteLightness.value)
  hiliteColor.value = rgbToHex(rgb.r, rgb.g, rgb.b)
  applyHiliteColor()
}

function clearFormatting() {
  if (!editor.value) return;
  editor.value.focus();

  // Save media elements (img, video, audio)
  const mediaElements = Array.from(editor.value.querySelectorAll('img,video,audio')).map(el => el.cloneNode(true));

  // Remove all HTML tags, keep only text content
  editor.value.innerHTML = editor.value.textContent || '';

  // Re-insert media elements at the end (optional, or you can skip this if you want to remove all)
  mediaElements.forEach(media => editor.value.appendChild(media));

  updateValue();
}
</script>

<style scoped>
.editor-container {
  max-width: 100%;
  margin: 0;
  width: 100%;
}
.editor-area {
  min-height: 120px;
  max-height: 260px;
  padding: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #f9fafb;
  font-size: 15px;
  outline: none;
  overflow-y: auto;
  transition: border 0.2s;
  font-family: 'Tajawal', sans-serif;
}
.editor-area:focus {
  border-color: #6366f1;
  background: #fff;
}
.toolbar-select {
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 2px 6px;
  font-size: 13px;
  background: #f9fafb;
  transition: border 0.2s;
}
.toolbar-select:focus {
  border-color: #6366f1;
  outline: none;
}
.toolbar-color {
  width: 28px;
  height: 28px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  background: #f9fafb;
  padding: 0;
}
.toolbar-btn {
  background: #f3f4f6;
  border: none;
  border-radius: 6px;
  padding: 5px 7px;
  transition: background 0.2s, box-shadow 0.2s;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
.toolbar-btn:hover, .toolbar-btn:focus {
  background: #e0e7ef;
  box-shadow: 0 1px 4px #e0e7ef;
}
.toolbar-btn-active {
  background: #6366f1 !important;
  color: #fff !important;
}
.icon {
  width: 18px;
  height: 18px;
  display: block;
  color: inherit;
}
[contenteditable][placeholder]:empty:before {
  content: attr(placeholder);
  color: #a0aec0;
  pointer-events: none;
  display: block;
}

.media-remove-btn {
  z-index: 10;
  box-shadow: 0 1px 4px #e0e7ef;
}

/* Advanced Color Picker Styles */
.color-picker-advanced {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.color-gradient-area {
  position: relative;
  width: 100%;
  height: 160px;
  border-radius: 8px;
  cursor: crosshair;
  background: 
    linear-gradient(to bottom, transparent, black), 
    linear-gradient(to right, white, transparent);
  overflow: hidden;
}

.color-selector-circle {
  position: absolute;
  width: 12px;
  height: 12px;
  border: 2px solid white;
  border-radius: 50%;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.3), 0 2px 4px rgba(0, 0, 0, 0.2);
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: 2;
}

.hue-slider {
  position: relative;
  width: 100%;
  height: 16px;
  border-radius: 8px;
  cursor: pointer;
  background: linear-gradient(to right, 
    #ff0000 0%, 
    #ffff00 16.66%, 
    #00ff00 33.33%, 
    #00ffff 50%, 
    #0000ff 66.66%, 
    #ff00ff 83.33%, 
    #ff0000 100%
  );
}

.hue-selector {
  position: absolute;
  width: 16px;
  height: 16px;
  background: white;
  border: 2px solid #fff;
  border-radius: 50%;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.3), 0 2px 4px rgba(0, 0, 0, 0.2);
  transform: translateX(-50%);
  pointer-events: none;
  top: 0;
}

.color-preview {
  width: 100%;
  height: 32px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
}

/* Responsive adjustments for color picker */
@media (max-width: 640px) {
  .color-gradient-area {
    height: 140px;
  }
}

/* Header font sizes */
.editor-area h1 { font-size: 2em; font-weight: bold; margin: 0.67em 0; }
.editor-area h2 { font-size: 1.5em; font-weight: bold; margin: 0.75em 0; }
.editor-area h3 { font-size: 1.17em; font-weight: bold; margin: 0.83em 0; }
.editor-area h4 { font-size: 1em; font-weight: bold; margin: 1.12em 0; }
.editor-area h5 { font-size: 0.83em; font-weight: bold; margin: 1.5em 0; }
.editor-area h6 { font-size: 0.75em; font-weight: bold; margin: 1.67em 0; }
</style>