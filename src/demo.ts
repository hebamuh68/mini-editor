import { createApp, ref, h } from 'vue'
import MiniEditor from './components/Common/MiniEditor.vue'
import './styles/main.css'

const App = {
  setup() {
    const content = ref('')
    return { content }
  },
  render() {
    return h('div', { class: 'p-8' }, [
      h('h1', { class: 'text-2xl font-bold mb-4' }, 'Mini Editor Demo'),
      h(MiniEditor, {
        modelValue: this.content,
        'onUpdate:modelValue': (value: string) => this.content = value,
        label: 'Editor',
        hint: 'This is a rich text editor',
        required: true,
        placeholder: 'Start typing...'
      }),
      h('div', { class: 'mt-4' }, [
        h('h2', { class: 'text-xl font-semibold mb-2' }, 'Preview:'),
        h('div', { 
          class: 'p-4 border rounded',
          innerHTML: this.content 
        })
      ])
    ])
  }
}

const app = createApp(App)
app.mount('#app') 