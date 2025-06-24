# Mini Editor - Enhanced Rich Text Editor

A powerful, modular Vue 3 rich text editor with comprehensive translation support, customizable toolbar, preview functionality, and enhanced media handling.

## ✨ Features

### 🎨 **Core Features**
- **Rich Text Editing**: Bold, italic, underline, strikethrough
- **Text Formatting**: Headings (H1-H5), text color, highlight colors
- **Lists & Alignment**: Bullet lists, numbered lists, text alignment
- **Multilingual Support**: Arabic and English with RTL/LTR switching
- **Media Support**: Images, videos, audio with size controls
- **HTML Paste**: Paste HTML code directly into the editor
- **Preview Mode**: Preview content in a popup modal
- **Undo/Redo**: Full undo/redo functionality
- **Clear Formatting**: Remove all formatting with one click

### 🔧 **Modular Architecture**
- **Separate Toolbar Component**: Customizable toolbar with show/hide options
- **Preview Component**: Standalone preview modal
- **Media Uploader**: Enhanced media upload with multiple tabs
- **Unified Icon System**: Centralized icon management
- **CSS Separation**: All styles moved to external CSS file

### 🎛️ **Toolbar Customization**
Control which buttons appear in the toolbar:

```vue
<MiniEditor
  :show-bold="true"
  :show-italic="true"
  :show-underline="false"
  :show-headings="true"
  :show-media="true"
  :show-preview="true"
  :show-language-switcher="true"
  :show-text-color="true"
  :show-highlight="true"
  :show-bullet-list="true"
  :show-numbered-list="true"
  :show-align-right="true"
  :show-align-center="true"
  :show-align-left="true"
  :show-undo="true"
  :show-redo="true"
  :show-clear-formatting="true"
/>
```

### 📱 **Enhanced Media Upload**
- **File Upload**: Drag & drop or click to upload
- **URL Input**: Paste media URLs directly
- **HTML Paste**: Paste HTML code for custom media
- **Size Controls**: Adjust width/height with presets
- **Preview**: See media before inserting
- **Multiple Formats**: Images, videos, audio files

### 🌐 **Translation System**
- **Built-in Translations**: Arabic and English
- **Custom Translations**: Override any translation
- **Exportable Utilities**: Use translation functions in your app
- **RTL/LTR Support**: Automatic direction switching

## 📦 Installation

```bash
npm install @hebamuh28/mini-editor
# or
yarn add @hebamuh28/mini-editor
# or
pnpm add @hebamuh28/mini-editor
```

## 🚀 Quick Start

```vue
<template>
  <div>
    <MiniEditor 
      v-model="content" 
      label="My Editor"
      placeholder="Start typing..."
    />
    <pre>{{ content }}</pre>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { MiniEditor } from '@hebamuh28/mini-editor'

const content = ref({ ar: '', en: '' })
</script>
```

## 📖 Advanced Usage

### Full Featured Editor

```vue
<MiniEditor 
  v-model="content" 
  label="Full Featured Editor"
  placeholder="Start typing here..."
  :show-language-switcher="true"
  :show-text-color="true"
  :show-highlight="true"
  :show-bold="true"
  :show-italic="true"
  :show-underline="true"
  :show-strike="true"
  :show-bullet-list="true"
  :show-numbered-list="true"
  :show-align-right="true"
  :show-align-center="true"
  :show-align-left="true"
  :show-headings="true"
  :show-media="true"
  :show-undo="true"
  :show-redo="true"
  :show-clear-formatting="true"
  :show-preview="true"
/>
```

### Minimal Editor

```vue
<MiniEditor 
  v-model="content" 
  label="Minimal Editor"
  placeholder="Basic formatting only..."
  :show-language-switcher="false"
  :show-text-color="false"
  :show-highlight="false"
  :show-bold="true"
  :show-italic="true"
  :show-underline="false"
  :show-strike="false"
  :show-bullet-list="true"
  :show-numbered-list="true"
  :show-align-right="false"
  :show-align-center="false"
  :show-align-left="false"
  :show-headings="false"
  :show-media="false"
  :show-undo="true"
  :show-redo="true"
  :show-clear-formatting="false"
  :show-preview="false"
/>
```

### Custom Translations

```vue
<template>
  <MiniEditor 
    v-model="content" 
    label="Custom Translations"
    :translations="customTranslations"
  />
</template>

<script setup>
import { ref } from 'vue'
import { MiniEditor } from '@hebamuh28/mini-editor'

const content = ref({ ar: '', en: '' })

const customTranslations = {
  ar: {
    switchLanguage: "تغيير اللغة",
    textColor: "لون النص",
    highlight: "تظليل",
    bold: "عريض",
    italic: "مائل",
    // ... more translations
  },
  en: {
    switchLanguage: "Change Language",
    textColor: "Text Color",
    highlight: "Highlight",
    bold: "Bold",
    italic: "Italic",
    // ... more translations
  }
}
</script>
```

### Using Translation Utilities

```javascript
import { 
  defaultTranslations, 
  mergeTranslations, 
  getTranslation,
  langConfig 
} from '@hebamuh28/mini-editor'

// Merge custom translations with defaults
const customTranslations = mergeTranslations(defaultTranslations, {
  ar: { bold: "عريض جداً" },
  en: { bold: "Very Bold" }
})

// Get specific translation
const boldText = getTranslation('bold', 'ar', customTranslations)

// Language configuration
console.log(langConfig.ar.label) // "العربية"
```

## 🎨 Styling

The editor uses Tailwind CSS classes and custom CSS. All styles are in `editor.css`:

```css
/* Custom styles */
.editor-area {
  min-height: 120px;
  max-height: 260px;
  padding: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #f9fafb;
  font-family: "Tajawal", sans-serif;
}

.toolbar-btn {
  background: #f3f4f6;
  border: none;
  border-radius: 6px;
  padding: 5px 7px;
  transition: background 0.2s;
}
```

## 📋 Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `Object` | Required | Content object with `ar` and `en` keys |
| `label` | `String` | - | Editor label |
| `hint` | `String` | - | Help text shown with info icon |
| `required` | `Boolean` | `false` | Show required indicator |
| `placeholder` | `String` | - | Placeholder text |
| `translations` | `Object` | Built-in | Custom translations |
| `showLanguageSwitcher` | `Boolean` | `true` | Show language switcher |
| `defaultLanguage` | `'ar' \| 'en'` | `'ar'` | Default language |
| `showTextColor` | `Boolean` | `true` | Show text color button |
| `showHighlight` | `Boolean` | `true` | Show highlight button |
| `showBold` | `Boolean` | `true` | Show bold button |
| `showItalic` | `Boolean` | `true` | Show italic button |
| `showUnderline` | `Boolean` | `true` | Show underline button |
| `showStrike` | `Boolean` | `true` | Show strikethrough button |
| `showBulletList` | `Boolean` | `true` | Show bullet list button |
| `showNumberedList` | `Boolean` | `true` | Show numbered list button |
| `showAlignRight` | `Boolean` | `true` | Show align right button |
| `showAlignCenter` | `Boolean` | `true` | Show align center button |
| `showAlignLeft` | `Boolean` | `true` | Show align left button |
| `showHeadings` | `Boolean` | `true` | Show heading buttons |
| `showMedia` | `Boolean` | `true` | Show media upload button |
| `showUndo` | `Boolean` | `true` | Show undo button |
| `showRedo` | `Boolean` | `true` | Show redo button |
| `showClearFormatting` | `Boolean` | `true` | Show clear formatting button |
| `showPreview` | `Boolean` | `true` | Show preview button |

## 🎯 Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `Object` | Content updated |
| `languageChange` | `String` | Language switched |

## 🏗️ Architecture

### Components
- **MiniEditor.vue**: Main editor component
- **MiniEditorToolbar.vue**: Customizable toolbar
- **MiniEditorPreview.vue**: Preview modal
- **MediaUploader.vue**: Enhanced media upload
- **Icon.vue**: Unified icon system

### Utilities
- **translations.ts**: Translation management
- **editor.css**: All editor styles
- **types/index.ts**: TypeScript definitions

## 🔧 Development

```bash
# Install dependencies
pnpm install

# Run development server
pnpm run dev

# Build for production
pnpm run build

# Run tests
pnpm run test

# Publish package
pnpm publish
```

## 📄 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

If you have any questions or need help, please open an issue on GitHub.

---

**Version**: 1.2.0  
**Size**: 91.71 kB (gzipped)  
**Dependencies**: Vue 3, Tailwind CSS  
**Browser Support**: Modern browsers with ES6+ support


