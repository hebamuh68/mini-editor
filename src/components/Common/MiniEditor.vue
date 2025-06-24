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
        <div class="relative inline-block">
          <div
            v-if="showTextColorPanel"
            ref="textColorPanelRef"
            class="absolute z-30 bg-white border rounded-lg shadow-lg p-4 min-w-[280px] mt-1 left-0"
          >
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
        </div>
        <div class="relative inline-block">
          <div
            v-if="showHilitePanel"
            ref="hilitePanelRef"
            class="absolute z-30 bg-white border rounded-lg shadow-lg p-4 min-w-[280px] mt-1 left-0"
          >
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
import { ref, watch, onMounted, computed, onBeforeUnmount } from "vue";
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
  
  // Remove any existing heading formatting first
  const selection = window.getSelection();
  if (selection && selection.rangeCount > 0) {
    let node = selection.anchorNode;
    while (node && node !== editor.value) {
      if (node.nodeType === 1 && /^H[1-6]$/i.test(node.nodeName)) {
        // If clicking the same heading level, remove formatting
        if (node.nodeName.toLowerCase() === "h" + level) {
          const p = document.createElement("p");
          p.innerHTML = node.innerHTML;
          node.parentNode.replaceChild(p, node);
          updateValue();
          updateActiveFormats();
          return;
        }
        // Otherwise, change to new heading level
        const newHeading = document.createElement("H" + level);
        newHeading.innerHTML = node.innerHTML;
        node.parentNode.replaceChild(newHeading, node);
        updateValue();
        updateActiveFormats();
        return;
      }
      node = node.parentNode;
    }
  }
  
  // If no existing heading, create new one
  try {
    document.execCommand("formatBlock", false, "H" + level);
  } catch (e) {
    document.execCommand("formatBlock", false, "<H" + level + ">");
  }
  updateValue();
  updateActiveFormats();
}

function updateActiveFormats() {
  if (!editor.value) return;
  
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return;

  const formats = {};
  
  // Check for bold, italic, underline, strikethrough
  formats.bold = document.queryCommandState('bold');
  formats.italic = document.queryCommandState('italic');
  formats.underline = document.queryCommandState('underline');
  formats.strikeThrough = document.queryCommandState('strikeThrough');
  
  // Check for headings
  let node = selection.anchorNode;
  while (node && node !== editor.value) {
    if (node.nodeType === 1 && /^H[1-6]$/i.test(node.nodeName)) {
      const level = node.nodeName.charAt(1);
      formats[`heading${level}`] = true;
      break;
    }
    node = node.parentNode;
  }
  
  activeFormats.value = formats;
}

function applyTextColor() {
  format("foreColor", textColor.value);
}

function applyHiliteColor() {
  format("hiliteColor", hiliteColor.value);
}

function updateValue() {
  // Remove orphaned media remove buttons before saving
  Array.from(editor.value.querySelectorAll(".media-remove-btn")).forEach(
    (btn) => btn.remove()
  );
  currentValue.value = editor.value.innerHTML;
  updateActiveFormats();
}

function handlePaste(event) {
  event.preventDefault();
  
  // Get plain text or HTML from clipboard
  const clipboardData = event.clipboardData || window.clipboardData;
  const pastedData = clipboardData.getData('text/html') || clipboardData.getData('text');
  
  // Insert the pasted content
  document.execCommand('insertHTML', false, pastedData);
  updateValue();
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

  // Get the current selection
  const selection = window.getSelection();

  // If there's no selection, select the entire content
  if (!selection || selection.isCollapsed) {
    const range = document.createRange();
    range.selectNodeContents(editor.value);
    selection.removeAllRanges();
    selection.addRange(range);
  }

  // Remove all formatting
  document.execCommand("removeFormat", false, null);

  // Remove headings by converting to paragraphs
  const walker = document.createTreeWalker(
    editor.value,
    NodeFilter.SHOW_ELEMENT,
    {
      acceptNode: function (node) {
        return /^H[1-6]$/i.test(node.nodeName)
          ? NodeFilter.FILTER_ACCEPT
          : NodeFilter.FILTER_SKIP;
      },
    }
  );

  const headings = [];
  let node;
  while ((node = walker.nextNode())) {
    headings.push(node);
  }

  headings.forEach((heading) => {
    const p = document.createElement("p");
    p.innerHTML = heading.innerHTML;
    heading.parentNode.replaceChild(p, heading);
  });

  // Clear the selection
  selection.removeAllRanges();

  // Update the value
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
  
  // Add global mouse event listeners for drag functionality
  document.addEventListener("mousemove", handleGlobalMouseMove);
  document.addEventListener("mouseup", handleGlobalMouseUp);
});

onBeforeUnmount(() => {
  // Clean up global event listeners
  document.removeEventListener("mousemove", handleGlobalMouseMove);
  document.removeEventListener("mouseup", handleGlobalMouseUp);
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

// --- Click outside logic for color panels ---
function useClickOutside(refs, closeFn) {
  function handler(e) {
    if (refs.some((r) => r.value && r.value.contains(e.target))) return;
    closeFn();
  }
  onMounted(() => document.addEventListener("mousedown", handler));
  onBeforeUnmount(() => document.removeEventListener("mousedown", handler));
}

const textColorPanelRef = ref(null);
const hilitePanelRef = ref(null);
useClickOutside([textColorPanelRef], () => (showTextColorPanel.value = false));
useClickOutside([hilitePanelRef], () => (showHilitePanel.value = false));

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
</script>