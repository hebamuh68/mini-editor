import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import MiniEditor from './MiniEditor.vue'


describe('MiniEditor', () => {
  it('renders and updates value', async () => {
    const wrapper = mount(MiniEditor, {
      props: {
        modelValue: { en: '', ar: '' },
        label: 'Test Editor',
        required: true,
        placeholder: 'Type here...'
      }
    })
    expect(wrapper.text()).toContain('Test Editor')
    // Simulate input
    const editor = wrapper.find('[contenteditable]')
    await editor.setValue('Hello world!')
    // The value should update in the DOM
    expect(editor.element.innerHTML).toContain('Hello world!')
  })
}) 