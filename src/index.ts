import MiniEditor from './components/Common/MiniEditor.vue'
import './styles/main.css'

// Export the main component
export { MiniEditor }

// Export types
export type { MiniEditorProps, ColorState, LangConfig } from './types'

// Export translation utilities
export {
  defaultTranslations,
  langConfig,
  mergeTranslations,
  getTranslation,
  type TranslationConfig,
  type Translations
} from './utils/translations'

export default MiniEditor 