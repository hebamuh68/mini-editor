export interface MiniEditorProps {
  modelValue?: string
  label?: string
  hint?: string
  required?: boolean
  placeholder?: string
}

export interface ColorState {
  hue: number
  saturation: number
  lightness: number
}

export interface LangConfig {
  [key: string]: {
    shortLabel: string
    fullLabel: string
  }
} 