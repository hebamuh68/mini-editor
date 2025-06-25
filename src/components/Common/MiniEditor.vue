<template>
  <div class="inline-flex flex-col justify-start items-end w-full">
    <div class="bg-white rounded-xl border border-gray-200 editor-container">
          <!-- Dynamic Label -->
      <label
        v-if="label"
        class="border-b border-gray-200 p-2 ps-4 pe-4 mb-2 w-full flex items-center text-start text-[#261E27] text-base font-tajawal font-normal"
        :for="`editor-${Math.random().toString(36).substr(2, 9)}`"
      >  
        <span
          v-if="hint"
          class="relative group text-[#FABF35] me-1 cursor-pointer align-middle"
        >
          <Icon name="Info" class="inline-block w-4 h-4 align-middle" />
          <span
            class="absolute bottom-full z-10 px-2 py-1 text-xs text-white whitespace-nowrap bg-black rounded shadow-lg opacity-0 transition-opacity pointer-events-none start-1/2 -ms-1 group-hover:opacity-100"
          >
            {{ hint }}
          </span>
        </span>
        {{ label }}
        <span v-if="required" class="text-red-600 ms-1">*</span>
      </label>
    
      <div class="p-4 relative">
        <!-- Toolbar -->
        <MiniEditorToolbar
          :current-lang="currentLang"
          :translations="props.translations"
          :active-formats="activeFormats"
          :show-language-switcher="showLanguageSwitcher"
          :show-text-color="showTextColor"
          :show-highlight="showHighlight"
          :show-bold="showBold"
          :show-italic="showItalic"
          :show-underline="showUnderline"
          :show-strike="showStrike"
          :show-bullet-list="showBulletList"
          :show-numbered-list="showNumberedList"
          :show-align-right="showAlignRight"
          :show-align-center="showAlignCenter"
          :show-align-left="showAlignLeft"
          :show-headings="showHeadings"
          :show-media="showMedia"
          :show-undo="showUndo"
          :show-redo="showRedo"
          :show-clear-formatting="showClearFormatting"
          :show-preview="showPreview"
          @switch-language="switchLanguage"
          @toggle-text-color="showTextColorPanel = !showTextColorPanel"
          @toggle-highlight="showHilitePanel = !showHilitePanel"
          @format="format"
          @format-heading="formatHeading"
          @insert-media="showMediaUploader = true"
          @clear-formatting="clearFormatting"
          @preview="showPreviewModal = true"
        />
        <!-- Color Panels -->
        <div v-if="showTextColorPanel" ref="textColorPanelRef"
          :class="['color-panel-root', 'absolute z-30', props.rtl ? 'right-0' : 'left-0']">
            <div class="color-picker-advanced">
              <div 
                class="color-gradient-area"
                data-type="text"
                :style="{ 
                  '--hue-color': `hsl(${textHue}, 100%, 50%)`,
                  background: `
                    linear-gradient(to bottom, transparent, black), 
                    linear-gradient(to right, white, hsl(${textHue}, 100%, 50%))
              `,
                }"
                @mousedown="startColorDrag($event, 'text')"
              >
                <div 
                  class="color-selector-circle"
                  :style="{ 
                    left: `${textSaturation}%`, 
                top: `${100 - textLightness}%`,
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
            <div
              class="color-preview"
              :style="{ backgroundColor: textColor }"
            ></div>
            </div>
          </div>
        <div v-if="showHilitePanel" ref="hilitePanelRef"
          :class="['color-panel-root', 'absolute z-30', props.rtl ? 'right-0' : 'left-0']">
            <div class="color-picker-advanced">
              <div 
                class="color-gradient-area"
                data-type="hilite"
                :style="{ 
                  '--hue-color': `hsl(${hiliteHue}, 100%, 50%)`,
                  background: `
                    linear-gradient(to bottom, transparent, black), 
                    linear-gradient(to right, white, hsl(${hiliteHue}, 100%, 50%))
              `,
                }"
                @mousedown="startColorDrag($event, 'hilite')"
              >
                <div 
                  class="color-selector-circle"
                  :style="{ 
                    left: `${hiliteSaturation}%`, 
                top: `${100 - hiliteLightness}%`,
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
            <div
              class="color-preview"
              :style="{ backgroundColor: hiliteColor }"
            ></div>
            </div>
          </div>
        <!-- Editor Area -->
        <div
        ref="editor"
        contenteditable="true"
        class="editor-area"
        :class="currentLang === 'ar' ? 'text-right' : 'text-left'"
        :dir="currentLang === 'ar' ? 'rtl' : 'ltr'"
        :placeholder="placeholder"
        @input="updateValue"
        @blur="updateValue"
          @paste="handlePaste"
        ></div>
      </div>
      </div>

    <!-- Media Uploader Modal -->
    <MediaUploader
      :is-visible="showMediaUploader"
      :current-lang="currentLang"
      :translations="props.translations"
      @close="showMediaUploader = false"
      @insert="insertMedia"
    />

    <!-- Preview Modal -->
    <MiniEditorPreview
      :is-visible="showPreviewModal"
      :content-ar="modelValue.ar"
      :content-en="modelValue.en"
      :language="currentLang"
      @close="showPreviewModal = false"
    />
  </div>
</template>

<script setup>
import { ref, watch, onMounted, computed, onBeforeUnmount, nextTick } from "vue";
import { createPopper } from '@popperjs/core'
import Icon from '../icons/Icon.vue'
import MiniEditorToolbar from '../Toolbar/MiniEditorToolbar.vue'
import MediaUploader from '../Media/MediaUploader.vue'
import MiniEditorPreview from '../Preview/MiniEditorPreview.vue'

const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
  },
  placeholder: String,
  label: String,
  hint: String,
  required: Boolean,
  // Translation props
  translations: {
    type: Object,
    default: () => ({
      ar: {
        switchLanguage: "تبديل اللغة",
        textColor: "لون النص",
        highlight: "تمييز",
        bold: "عريض",
        italic: "مائل",
        underline: "تحت خط",
        strike: "شطب",
        bulletList: "قائمة نقطية",
        numberedList: "قائمة مرقمة",
        alignRight: "محاذاة لليمين",
        alignCenter: "محاذاة للوسط",
        alignLeft: "محاذاة لليسار",
        heading1: "عنوان 1",
        heading2: "عنوان 2",
        heading3: "عنوان 3",
        heading4: "عنوان 4",
        heading5: "عنوان 5",
        insertMedia: "إدراج وسائط",
        undo: "تراجع",
        redo: "إعادة",
        clearFormatting: "مسح التنسيق",
      },
      en: {
        switchLanguage: "Switch Language",
        textColor: "Text Color",
        highlight: "Highlight",
        bold: "Bold",
        italic: "Italic",
        underline: "Underline",
        strike: "Strike",
        bulletList: "Bullet List",
        numberedList: "Numbered List",
        alignRight: "Align Right",
        alignCenter: "Align Center",
        alignLeft: "Align Left",
        heading1: "Heading 1",
        heading2: "Heading 2",
        heading3: "Heading 3",
        heading4: "Heading 4",
        heading5: "Heading 5",
        insertMedia: "Insert Media",
        undo: "Undo",
        redo: "Redo",
        clearFormatting: "Clear Formatting",
      },
    }),
  },
  showLanguageSwitcher: {
    type: Boolean,
    default: true,
  },
  defaultLanguage: {
    type: String,
    default: "ar",
    validator: (value) => ["ar", "en"].includes(value),
  },
  // Toolbar customization props
  showTextColor: { type: Boolean, default: true },
  showHighlight: { type: Boolean, default: true },
  showBold: { type: Boolean, default: true },
  showItalic: { type: Boolean, default: true },
  showUnderline: { type: Boolean, default: true },
  showStrike: { type: Boolean, default: true },
  showBulletList: { type: Boolean, default: true },
  showNumberedList: { type: Boolean, default: true },
  showAlignRight: { type: Boolean, default: true },
  showAlignCenter: { type: Boolean, default: true },
  showAlignLeft: { type: Boolean, default: true },
  showHeadings: { type: Boolean, default: true },
  showMedia: { type: Boolean, default: true },
  showUndo: { type: Boolean, default: true },
  showRedo: { type: Boolean, default: true },
  showClearFormatting: { type: Boolean, default: true },
  showPreview: { type: Boolean, default: true },
  rtl: { type: Boolean, default: false },
});

const emit = defineEmits(["update:modelValue", "languageChange"]);
const editor = ref(null);
const textColor = ref("#000000");
const hiliteColor = ref("#ffff00");
const currentLang = ref(props.defaultLanguage);
const showHilitePanel = ref(false);
const showTextColorPanel = ref(false);
const showMediaUploader = ref(false);
const showPreviewModal = ref(false);

// Color picker state
const textHue = ref(0);
const textSaturation = ref(0);
const textLightness = ref(0);

const hiliteHue = ref(60);
const hiliteSaturation = ref(100);
const hiliteLightness = ref(50);

// Drag state
const isDraggingColor = ref(false);
const isDraggingHue = ref(false);
const currentDragType = ref("");

// Active formats tracking
const activeFormats = ref({});

const currentValue = computed({
  get() {
    return props.modelValue?.[currentLang.value] || "";
  },
  set(val) {
    emit("update:modelValue", {
      ...props.modelValue,
      [currentLang.value]: val,
    });
  },
});

const toolbarRef = ref(null)
const textColorBtnRef = ref(null)
const highlightBtnRef = ref(null)
const textColorPanelRef = ref(null)
const hilitePanelRef = ref(null)
let textColorPopper = null
let hilitePopper = null

function switchLanguage(lang) {
  currentLang.value = lang;
  emit("languageChange", lang);
  if (editor.value) {
    editor.value.focus();
  }
}

function format(command, value = null) {
  if (!editor.value) return;
  editor.value.focus();
  
  try {
    document.execCommand(command, false, value);
    
    // Add Tailwind classes based on the command
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const container = range.commonAncestorContainer;
      
      // Find the affected element
      let element = container.nodeType === 1 ? container : container.parentElement;
      while (element && element !== editor.value && !element.matches) {
        element = element.parentElement;
      }
      
      if (element && element.matches) {
        switch (command) {
          case 'bold':
            if (element.tagName === 'B' || element.tagName === 'STRONG') {
              element.className = 'font-bold';
            }
            break;
          case 'italic':
            if (element.tagName === 'I' || element.tagName === 'EM') {
              element.className = 'italic';
            }
            break;
          case 'underline':
            if (element.tagName === 'U') {
              element.className = 'underline';
            }
            break;
          case 'strikeThrough':
            if (element.tagName === 'S' || element.tagName === 'STRIKE') {
              element.className = 'line-through';
            }
            break;
        }
      }
    }
  } catch (e) {
    // fallback for headings
    if (command === "formatBlock" && value && !value.startsWith("<")) {
      document.execCommand(command, false, "<" + value + ">");
    }
  }
  updateValue();
  updateActiveFormats();
}

function formatHeading(level) {
  if (!editor.value) return;
  editor.value.focus();

  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return;
  const range = selection.getRangeAt(0);

  // Find the block element
  let node = selection.anchorNode;
  while (node && node !== editor.value && !(node.nodeType === 1 && /^(P|DIV|H[1-6])$/i.test(node.nodeName))) {
    node = node.parentNode;
  }
  if (!node || node === editor.value) return;

  // Heading classes configuration
  const headingConfig = {
    1: 'text-4xl font-bold mt-8 mb-4',
    2: 'text-3xl font-bold mt-6 mb-3',
    3: 'text-2xl font-semibold mt-5 mb-2.5',
    4: 'text-xl font-semibold mt-4 mb-2',
    5: 'text-lg font-medium mt-3 mb-1.5',
    6: 'text-base font-medium mt-2 mb-1'
  };

  // Create or update the heading
  const heading = document.createElement('div');
  heading.className = headingConfig[level] || 'text-base font-medium';
  heading.dataset.headingLevel = level; // Store heading level as data attribute
  heading.innerHTML = node.innerHTML;
  
  node.parentNode.replaceChild(heading, node);
  placeCursorAtStart(heading);
  updateValue();
  updateActiveFormats();
}

function placeCursorAtStart(el) {
  const range = document.createRange();
  range.selectNodeContents(el);
  range.collapse(true);
  const sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);
}

function updateActiveFormats() {
  if (!editor.value) return;
  
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return;

  const formats = {};
  
  // Basic formatting states
  formats.bold = document.queryCommandState('bold');
  formats.italic = document.queryCommandState('italic');
  formats.underline = document.queryCommandState('underline');
  formats.strikeThrough = document.queryCommandState('strikeThrough');
  
  // Check for headings
  let node = selection.anchorNode;
  while (node && node !== editor.value) {
    if (node.nodeType === 1 && node.dataset?.headingLevel) {
      const level = node.dataset.headingLevel;
      formats[`heading${level}`] = true;
      break;
    }
    node = node.parentNode;
  }
  
  activeFormats.value = formats;
}

function applyTextColor() {
  format("foreColor", textColor.value);
  
  // Add Tailwind color class
  const selection = window.getSelection();
  if (selection && selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    const container = range.commonAncestorContainer;
    let element = container.nodeType === 1 ? container : container.parentElement;
    
    while (element && element !== editor.value && !element.matches) {
      element = element.parentElement;
    }
    
    if (element && element.matches) {
      // Convert hex color to Tailwind class (simplified mapping)
      const colorMap = {
        '#000000': 'text-black',
        '#ffffff': 'text-white',
        '#ef4444': 'text-red-500',
        '#f97316': 'text-orange-500',
        '#eab308': 'text-yellow-500',
        '#22c55e': 'text-green-500',
        '#3b82f6': 'text-blue-500',
        '#8b5cf6': 'text-purple-500',
        '#ec4899': 'text-pink-500'
      };
      
      const tailwindClass = colorMap[textColor.value.toLowerCase()];
      if (tailwindClass) {
        element.className = tailwindClass;
      }
    }
  }
}

function applyHiliteColor() {
  format("hiliteColor", hiliteColor.value);
  
  // Add Tailwind highlight class
  const selection = window.getSelection();
  if (selection && selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    const container = range.commonAncestorContainer;
    let element = container.nodeType === 1 ? container : container.parentElement;
    
    while (element && element !== editor.value && !element.matches) {
      element = element.parentElement;
    }
    
    if (element && element.matches) {
      // Convert hex color to Tailwind background class
      const colorMap = {
        '#ffff00': 'bg-yellow-200',
        '#ffeb3b': 'bg-yellow-300',
        '#ffc107': 'bg-yellow-400',
        '#ff9800': 'bg-orange-400',
        '#ff5722': 'bg-red-400',
        '#e91e63': 'bg-pink-400',
        '#9c27b0': 'bg-purple-400',
        '#3f51b5': 'bg-indigo-400',
        '#2196f3': 'bg-blue-400',
        '#00bcd4': 'bg-cyan-400',
        '#009688': 'bg-teal-400',
        '#4caf50': 'bg-green-400',
        '#8bc34a': 'bg-lime-400'
      };
      
      const tailwindClass = colorMap[hiliteColor.value.toLowerCase()];
      if (tailwindClass) {
        element.className = tailwindClass + ' px-1 py-0.5 rounded';
      }
    }
  }
}

function cleanEditorOutput(html) {
  // Remove all --tw-... variables from style attributes
  html = html.replace(/--tw-[^:;]+:[^;]+;?/g, '');
  // DO NOT remove Tailwind classes - we want to keep them
  return html;
}

function ensureHeadingClasses() {
  if (!editor.value) return;
  
  // Ensure all headings have proper Tailwind classes
  const headings = editor.value.querySelectorAll('h1, h2, h3, h4, h5, h6');
  headings.forEach(heading => {
    const level = parseInt(heading.tagName.charAt(1));
    const headingClasses = {
      1: 'text-3xl font-bold',
      2: 'text-2xl font-semibold',
      3: 'text-xl font-semibold',
      4: 'text-lg font-medium',
      5: 'text-base font-medium',
      6: 'text-sm font-medium'
    };
    
    if (!heading.className.includes('text-')) {
      heading.className = headingClasses[level] || 'text-base font-medium';
    }
  });
}

function ensureTailwindClasses() {
  if (!editor.value) return;
  
  // Process all content blocks
  const blocks = editor.value.querySelectorAll('div, p');
  blocks.forEach(block => {
    // Skip if already processed
    if (block.dataset?.processed) return;
    
    // Handle headings
    if (block.dataset?.headingLevel) {
      const level = block.dataset.headingLevel;
      const headingConfig = {
        1: 'text-4xl font-bold mt-8 mb-4',
        2: 'text-3xl font-bold mt-6 mb-3',
        3: 'text-2xl font-semibold mt-5 mb-2.5',
        4: 'text-xl font-semibold mt-4 mb-2',
        5: 'text-lg font-medium mt-3 mb-1.5',
        6: 'text-base font-medium mt-2 mb-1'
      };
      block.className = headingConfig[level] || 'text-base font-medium';
    } 
    // Handle paragraphs
    else if (block.tagName === 'P') {
      block.className = 'text-base leading-relaxed my-3';
    }
    
    block.dataset.processed = 'true';
  });

  // Ensure links have proper classes
  const links = editor.value.querySelectorAll('a');
  links.forEach(link => {
    link.className = 'text-blue-600 underline hover:text-blue-800 transition';
  });
}

function updateValue() {
  // Remove orphaned media remove buttons before saving
  Array.from(editor.value.querySelectorAll(".media-remove-btn")).forEach(
    (btn) => btn.remove()
  );
  
  // Ensure Tailwind classes are applied
  ensureTailwindClasses();
  
  // Clean the output before emitting
  const cleaned = cleanEditorOutput(editor.value.innerHTML);
  currentValue.value = cleaned;
  updateActiveFormats();
}

function handlePaste(event) {
  event.preventDefault();
  
  // Get plain text or HTML from clipboard
  const clipboardData = event.clipboardData || window.clipboardData;
  const pastedData = clipboardData.getData('text/html') || clipboardData.getData('text');
  
  // Insert the pasted content
  document.execCommand('insertHTML', false, pastedData);
  
  // Ensure Tailwind classes are applied to pasted content
  nextTick(() => {
    ensureTailwindClasses();
    updateValue();
  });
}

function insertMedia(mediaHtml) {
  if (!editor.value) return;
  
  editor.value.focus();
  
  // Create a temporary div to parse the HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = mediaHtml;
  
  // Insert the media element
  const mediaElement = tempDiv.firstElementChild;
  if (mediaElement) {
    // Add remove button for images and videos
    if (mediaElement.tagName === 'IMG' || mediaElement.tagName === 'VIDEO') {
      const container = document.createElement('span');
      container.style.display = 'inline-block';
      container.style.position = 'relative';
      
      container.appendChild(mediaElement);
      container.appendChild(createRemoveButton(container));
      
      insertAtCursor(container);
    } else {
      insertAtCursor(mediaElement);
    }
  }
  
  updateValue();
}

function createRemoveButton(parentNode) {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.innerHTML = "✕";
  btn.className = "media-remove-btn";
  btn.onclick = function (ev) {
    ev.stopPropagation();
    parentNode.remove();
    updateValue();
  };
  return btn;
}

function insertAtCursor(node) {
  let sel = window.getSelection();
  if (!sel || !sel.rangeCount) return;
  let range = sel.getRangeAt(0);
  range.collapse(false);
  range.insertNode(node);
  range.setStartAfter(node);
  range.setEndAfter(node);
  sel.removeAllRanges();
  sel.addRange(range);
}

function clearFormatting() {
  if (!editor.value) return;
  editor.value.focus();

  const selection = window.getSelection();
  if (!selection || selection.isCollapsed) {
    const range = document.createRange();
    range.selectNodeContents(editor.value);
    selection.removeAllRanges();
    selection.addRange(range);
  }

  // Remove all formatting
  document.execCommand("removeFormat", false, null);

  // Convert headings to paragraphs
  const headings = editor.value.querySelectorAll('[data-heading-level]');
  headings.forEach(heading => {
    const p = document.createElement('p');
    p.className = 'text-base leading-relaxed my-3';
    p.innerHTML = heading.innerHTML;
    heading.parentNode.replaceChild(p, heading);
  });

  selection.removeAllRanges();
  updateValue();
}

watch(
  () => props.modelValue,
  (val) => {
    if (
      editor.value &&
      editor.value.innerHTML !== (val?.[currentLang.value] || "")
    ) {
      editor.value.innerHTML = val?.[currentLang.value] || "";
    }
  }
);

watch(currentLang, (lang) => {
  if (editor.value) {
    editor.value.innerHTML = currentValue.value;
  }
});

onMounted(() => {
  if (editor.value && props.modelValue) {
    editor.value.innerHTML = props.modelValue?.[currentLang.value] || "";
  }
  
  // Initialize color picker state
  const textHsl = rgbToHsl(0, 0, 0); // black
  textHue.value = textHsl.h;
  textSaturation.value = textHsl.s;
  textLightness.value = textHsl.l;

  const hiliteHsl = rgbToHsl(255, 255, 0); // yellow
  hiliteHue.value = hiliteHsl.h;
  hiliteSaturation.value = hiliteHsl.s;
  hiliteLightness.value = hiliteHsl.l;
  
  // Ensure all elements have proper Tailwind classes
  nextTick(() => {
    ensureTailwindClasses();
  });
  
  // Add global mouse event listeners for drag functionality
  document.addEventListener("mousemove", handleGlobalMouseMove);
  document.addEventListener("mouseup", handleGlobalMouseUp);
});

onBeforeUnmount(() => {
  // Clean up global event listeners
  document.removeEventListener("mousemove", handleGlobalMouseMove);
  document.removeEventListener("mouseup", handleGlobalMouseUp);
  if (textColorPopper) textColorPopper.destroy()
  if (hilitePopper) hilitePopper.destroy()
});

// Helper function to update color values
function updateColorValues(type, saturation, lightness, hue = null) {
  if (type === "text") {
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
    const colorArea = document.querySelector(
      `.color-gradient-area[data-type="${currentDragType.value}"]`
    );
    if (colorArea) {
      const rect = colorArea.getBoundingClientRect();
      const x = Math.max(0, Math.min(rect.width, event.clientX - rect.left));
      const y = Math.max(0, Math.min(rect.height, event.clientY - rect.top));
      
      const saturation = (x / rect.width) * 100;
      const lightness = 100 - (y / rect.height) * 100;
      
      updateColorValues(currentDragType.value, saturation, lightness);
    }
  } else if (isDraggingHue.value) {
    const hueSlider = document.querySelector(
      `.hue-slider[data-type="${currentDragType.value}"]`
    );
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
  currentDragType.value = "";
}

// Color conversion functions
function hslToRgb(h, s, l) {
  h /= 360;
  s /= 100;
  l /= 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h * 6) % 2) - 1));
  const m = l - c / 2;

  let r, g, b;

  if (0 <= h && h < 1 / 6) {
    r = c;
    g = x;
    b = 0;
  } else if (1 / 6 <= h && h < 2 / 6) {
    r = x;
    g = c;
    b = 0;
  } else if (2 / 6 <= h && h < 3 / 6) {
    r = 0;
    g = c;
    b = x;
  } else if (3 / 6 <= h && h < 4 / 6) {
    r = 0;
    g = x;
    b = c;
  } else if (4 / 6 <= h && h < 5 / 6) {
    r = x;
    g = 0;
    b = c;
  } else {
    r = c;
    g = 0;
    b = x;
  }

  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);

  return { r, g, b };
}

function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const diff = max - min;

  let h = 0;
  let s = 0;
  let l = (max + min) / 2;
  
  if (diff !== 0) {
    s = l > 0.5 ? diff / (2 - max - min) : diff / (max + min);
    
    switch (max) {
      case r:
        h = (g - b) / diff + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / diff + 2;
        break;
      case b:
        h = (r - g) / diff + 4;
        break;
    }
    h /= 6;
  }
  
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

function rgbToHex(r, g, b) {
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
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
  const rgb = hslToRgb(
    textHue.value,
    textSaturation.value,
    textLightness.value
  );
  textColor.value = rgbToHex(rgb.r, rgb.g, rgb.b);
  applyTextColor();
}

function updateHiliteColor() {
  const rgb = hslToRgb(
    hiliteHue.value,
    hiliteSaturation.value,
    hiliteLightness.value
  );
  hiliteColor.value = rgbToHex(rgb.r, rgb.g, rgb.b);
  applyHiliteColor();
}

// Click outside logic for color panels
function useClickOutside(refs, closeFn) {
  function handler(e) {
    if (refs.some((r) => r.value && r.value.contains(e.target))) return;
    closeFn();
  }
  onMounted(() => document.addEventListener("mousedown", handler));
  onBeforeUnmount(() => document.removeEventListener("mousedown", handler));
}

useClickOutside([textColorPanelRef], () => (showTextColorPanel.value = false));
useClickOutside([hilitePanelRef], () => (showHilitePanel.value = false));
</script>

<style scoped>
.color-panel-root {
  all: initial;
  font-family: inherit;
  box-sizing: border-box;
  background: #fff;
  border-radius: 0.75rem;
  box-shadow: 0 2px 16px 0 rgba(0,0,0,0.10);
  border: 1px solid #e5e7eb;
  padding: 1rem;
  min-width: 240px;
  min-height: 180px;
  z-index: 9999;
  position: absolute;
  margin-top: 0.25rem;
}
.color-panel-root * {
  box-sizing: border-box;
}
</style>