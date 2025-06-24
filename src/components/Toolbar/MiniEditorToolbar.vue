<template>
  <div class="flex relative flex-row flex-wrap gap-2 items-center mb-3">
    <!-- Language Switcher -->
    <button
      v-if="showLanguageSwitcher"
      @click="$emit('switchLanguage', currentLang === 'en' ? 'ar' : 'en')"
      :class="toolbarBtn('lang')"
      :title="translations[currentLang].switchLanguage"
      type="button"
    >
      <span class="text-xs text-gray-400">{{
        langConfig[currentLang].shortLabel
      }}</span>
      <Icon name="Lang" class="icon" />
    </button>

    <!-- Text color -->
    <button
      v-if="showTextColor"
      @click="$emit('toggleTextColor')"
      :class="toolbarBtn('foreColor')"
      :title="translations[currentLang].textColor"
      type="button"
    >
      <Icon name="TextColor" class="icon" />
    </button>

    <!-- Highlight color -->
    <button
      v-if="showHighlight"
      @click="$emit('toggleHighlight')"
      :class="toolbarBtn('hiliteColor')"
      :title="translations[currentLang].highlight"
      type="button"
    >
      <Icon name="Highlight" class="icon" />
    </button>

    <!-- Bold, Italic, Underline, Strike -->
    <button
      v-if="showBold"
      type="button"
      @click="$emit('format', 'bold')"
      :class="toolbarBtn('bold')"
      :title="translations[currentLang].bold"
    >
      <Icon name="Bold" class="icon" />
    </button>

    <button
      v-if="showItalic"
      type="button"
      @click="$emit('format', 'italic')"
      :class="toolbarBtn('italic')"
      :title="translations[currentLang].italic"
    >
      <Icon name="Italic" class="icon" />
    </button>

    <button
      v-if="showUnderline"
      type="button"
      @click="$emit('format', 'underline')"
      :class="toolbarBtn('underline')"
      :title="translations[currentLang].underline"
    >
      <Icon name="Underline" class="icon" />
    </button>

    <button
      v-if="showStrike"
      type="button"
      @click="$emit('format', 'strikeThrough')"
      :class="toolbarBtn('strikeThrough')"
      :title="translations[currentLang].strike"
    >
      <Icon name="Strikethrough" class="icon" />
    </button>

    <!-- Lists -->
    <button
      v-if="showBulletList"
      type="button"
      @click="$emit('format', 'insertUnorderedList')"
      :class="toolbarBtn()"
      :title="translations[currentLang].bulletList"
    >
      <Icon name="ListPoint" class="icon" />
    </button>

    <button
      v-if="showNumberedList"
      type="button"
      @click="$emit('format', 'insertOrderedList')"
      :class="toolbarBtn()"
      :title="translations[currentLang].numberedList"
    >
      <Icon name="ListNum" class="icon" />
    </button>

    <!-- Alignment -->
    <button
      v-if="showAlignRight"
      type="button"
      @click="$emit('format', 'justifyRight')"
      :class="toolbarBtn()"
      :title="translations[currentLang].alignRight"
    >
      <Icon name="AlignRight" class="icon" />
    </button>

    <button
      v-if="showAlignCenter"
      type="button"
      @click="$emit('format', 'justifyCenter')"
      :class="toolbarBtn()"
      :title="translations[currentLang].alignCenter"
    >
      <Icon name="AlignCenter" class="icon" />
    </button>

    <button
      v-if="showAlignLeft"
      type="button"
      @click="$emit('format', 'justifyLeft')"
      :class="toolbarBtn()"
      :title="translations[currentLang].alignLeft"
    >
      <Icon name="AlignLeft" class="icon" style="transform: scaleX(-1)" />
    </button>

    <!-- Headings -->
    <button
      v-if="showHeadings"
      type="button"
      @click="$emit('formatHeading', 1)"
      :class="toolbarBtn(null, isHeading(1))"
      :title="translations[currentLang].heading1"
    >
      <Icon name="H1" class="icon" />
    </button>

    <button
      v-if="showHeadings"
      type="button"
      @click="$emit('formatHeading', 2)"
      :class="toolbarBtn(null, isHeading(2))"
      :title="translations[currentLang].heading2"
    >
      <Icon name="H2" class="icon" />
    </button>

    <button
      v-if="showHeadings"
      type="button"
      @click="$emit('formatHeading', 3)"
      :class="toolbarBtn(null, isHeading(3))"
      :title="translations[currentLang].heading3"
    >
      <Icon name="H3" class="icon" />
    </button>

    <button
      v-if="showHeadings"
      type="button"
      @click="$emit('formatHeading', 4)"
      :class="toolbarBtn(null, isHeading(4))"
      :title="translations[currentLang].heading4"
    >
      <Icon name="H4" class="icon" />
    </button>

    <button
      v-if="showHeadings"
      type="button"
      @click="$emit('formatHeading', 5)"
      :class="toolbarBtn(null, isHeading(5))"
      :title="translations[currentLang].heading5"
    >
      <Icon name="H5" class="icon" />
    </button>

    <!-- Media Upload -->
    <button
      v-if="showMedia"
      type="button"
      class="toolbar-btn"
      :title="translations[currentLang].insertMedia"
      @click="$emit('insertMedia')"
    >
      <Icon name="Media" class="icon" />
    </button>

    <!-- Undo/Redo -->
    <button
      v-if="showUndo"
      type="button"
      @click="$emit('format', 'undo')"
      :class="toolbarBtn()"
      :title="translations[currentLang].undo"
    >
      <Icon name="Undo" class="icon" />
    </button>

    <button
      v-if="showRedo"
      type="button"
      @click="$emit('format', 'redo')"
      :class="toolbarBtn()"
      :title="translations[currentLang].redo"
    >
      <Icon name="Redo" class="icon" />
    </button>

    <!-- Clear Formatting -->
    <button
      v-if="showClearFormatting"
      type="button"
      @click="$emit('clearFormatting')"
      :class="toolbarBtn()"
      :title="translations[currentLang].clearFormatting"
      style="background-color: #ffc6c6"
    >
      <Icon name="Broom" class="icon" />
    </button>

    <!-- Preview Button -->
    <button
      v-if="showPreview"
      type="button"
      @click="$emit('preview')"
      :class="toolbarBtn()"
      title="Preview"
      style="background-color: #C6CDFF"
    >
      <Icon name="Preview" class="icon" />
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import Icon from '../icons/Icon.vue'

// Language configuration
const langConfig = {
  ar: { shortLabel: "ع", label: "العربية" },
  en: { shortLabel: "EN", label: "English" },
}

const props = defineProps({
  currentLang: {
    type: String,
    default: 'ar'
  },
  translations: {
    type: Object,
    required: true
  },
  // Toolbar customization props
  showLanguageSwitcher: { type: Boolean, default: true },
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
  // Active state tracking
  activeFormats: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits([
  'switchLanguage',
  'toggleTextColor',
  'toggleHighlight',
  'format',
  'formatHeading',
  'insertMedia',
  'clearFormatting',
  'preview'
])

function toolbarBtn(cmd = null, active = false) {
  return [
    "bg-gray-100 hover:bg-gray-200 border-none rounded-md p-1.5 transition-all duration-200 cursor-pointer flex items-center justify-center",
    active || (cmd && props.activeFormats[cmd]) ? "bg-indigo-500 text-white" : ""
  ].join(" ")
}

function isHeading(level) {
  return props.activeFormats[`heading${level}`] || false
}
</script> 