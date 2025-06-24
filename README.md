# @hebamuh28/mini-editor

A lightweight, feature-rich rich text editor component for Vue 3 applications with comprehensive translation support.

---

## ✨ Features

- Rich text formatting (bold, italic, underline, strikethrough)
- Text alignment and headings (H1-H5)
- Lists (ordered and unordered)
- Text color and highlight color with advanced color picker
- Media upload support (images, video, audio)
- Undo/Redo functionality
- **RTL and multilingual support (Arabic/English)**
- **Comprehensive translation system**
- **Language switching with UI**
- Tailwind CSS styling
- **Exportable translation utilities**

---

## 📦 Installation

```bash
# With npm
npm install @hebamuh28/mini-editor

# With pnpm
pnpm add @hebamuh28/mini-editor

# With yarn
yarn add @hebamuh28/mini-editor
```

---

## 🚀 Basic Usage

```vue
<template>
  <MiniEditor
    v-model="content"
    :label="'Editor Label'"
    :hint="'Helpful hint text'"
    :required="true"
    :placeholder="'Start typing...'"
  />
</template>

<script setup>
import { ref } from 'vue'
import { MiniEditor } from '@hebamuh28/mini-editor'

const content = ref({
  ar: '',
  en: ''
})
</script>
```

---

## 🌍 Advanced Translation Usage

### Custom Translations

```vue
<template>
  <MiniEditor
    v-model="content"
    :translations="customTranslations"
    :show-language-switcher="true"
    :default-language="'ar'"
  />
</template>

<script setup>
import { ref } from 'vue'
import { MiniEditor, mergeTranslations } from '@hebamuh28/mini-editor'

const content = ref({
  ar: 'مرحبا بالعالم',
  en: 'Hello World'
})

// Custom translations
const customTranslations = mergeTranslations({
  ar: {
    bold: 'عريض جدا',
    italic: 'مائل جدا'
  },
  en: {
    bold: 'Very Bold',
    italic: 'Very Italic'
  }
})
</script>
```

### Using Translation Utilities

```javascript
import { 
  defaultTranslations, 
  getTranslation, 
  mergeTranslations 
} from '@hebamuh28/mini-editor'

// Get a specific translation
const boldText = getTranslation(defaultTranslations, 'ar', 'bold')
// Returns: "عريض"

// Merge custom translations
const customTranslations = mergeTranslations({
  ar: { bold: 'عريض جدا' }
})
```

---

## ⚙️ Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `Object` | `{}` | Content object with language keys |
| `label` | `String` | `''` | Label text for the editor |
| `hint` | `String` | `''` | Helpful hint text shown on hover |
| `required` | `Boolean` | `false` | Whether the editor is required |
| `placeholder` | `String` | `''` | Placeholder text when empty |
| `translations` | `Object` | `defaultTranslations` | Custom translations |
| `showLanguageSwitcher` | `Boolean` | `true` | Show language switcher button |
| `defaultLanguage` | `'ar' \| 'en'` | `'ar'` | Default language |

---

## 🔔 Events

| Event | Description |
|-------|-------------|
| `update:modelValue` | Emitted when content changes |
| `languageChange` | Emitted when language is switched |

---

## 🧪 Testing

To run tests locally:

```bash
pnpm run test
# or
npm run test
```

---

## 🤝 Contributing

Contributions are welcome! Please open issues or pull requests for bugs, features, or improvements.

1. Fork the repository
2. Create a new branch for your feature or fix
3. Make your changes and add tests if possible
4. Run the linter and tests
5. Open a pull request

---

## 📜 License

MIT

---

## 📓 Changelog

See [CHANGELOG.md](./CHANGELOG.md) for release notes and version history. 


