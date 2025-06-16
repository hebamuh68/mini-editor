[![CI](https://github.com/heba28/mini-editor/actions/workflows/ci.yml/badge.svg)](https://github.com/heba28/mini-editor/actions)

# Mini Editor

A lightweight rich text editor component for Vue 3 applications.

## Features

- Rich text formatting (bold, italic, underline, strikethrough)
- Text alignment
- Lists (ordered and unordered)
- Headings (H1-H5)
- Text color and highlight color
- Media upload support
- Undo/Redo functionality
- RTL support
- Multilingual support (English/Arabic)
- Tailwind CSS styling

## Installation

```bash
npm install mini-editor
# or
yarn add mini-editor
# or
pnpm add mini-editor
```

## Usage

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
import { MiniEditor } from 'mini-editor'

const content = ref('')
</script>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| modelValue | String | '' | The content of the editor |
| label | String | '' | Label text for the editor |
| hint | String | '' | Helpful hint text shown on hover |
| required | Boolean | false | Whether the editor is required |
| placeholder | String | '' | Placeholder text when editor is empty |

## Events

| Event | Description |
|-------|-------------|
| update:modelValue | Emitted when the content changes |
| blur | Emitted when the editor loses focus |

## License

MIT 

## Contributing

Contributions are welcome! Please open issues or pull requests for bugs, features, or improvements.

1. Fork the repository
2. Create a new branch for your feature or fix
3. Make your changes and add tests if possible
4. Run the linter and tests
5. Open a pull request

## Changelog

See [CHANGELOG.md](./CHANGELOG.md) for release notes and version history.

## Testing

To run tests (after they are added):

```bash
npm run test
``` 
