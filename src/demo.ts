import { createApp } from 'vue'
import { MiniEditor } from './index'
import './styles/editor.css'

const app = createApp({
  template: `
    <div style="max-width: 800px; margin: 2rem auto; padding: 0 1rem;">
      <h1 style="text-align: center; color: #333; margin-bottom: 2rem;">
        Mini Editor Demo - Enhanced Version 1.2.0
      </h1>
      
      <!-- Full Featured Editor -->
      <div style="margin-bottom: 3rem;">
        <h2>Full Featured Editor</h2>
        <MiniEditor 
          v-model="content1" 
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
        <div style="margin-top: 1rem;">
          <strong>Arabic Content:</strong>
          <pre style="background: #f5f5f5; padding: 1rem; border-radius: 4px; overflow-x: auto;">{{ content1.ar }}</pre>
        </div>
        <div style="margin-top: 1rem;">
          <strong>English Content:</strong>
          <pre style="background: #f5f5f5; padding: 1rem; border-radius: 4px; overflow-x: auto;">{{ content1.en }}</pre>
        </div>
      </div>

      <!-- Minimal Editor -->
      <div style="margin-bottom: 3rem;">
        <h2>Minimal Editor (Basic Formatting Only)</h2>
        <MiniEditor 
          v-model="content2" 
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
      </div>

      <!-- Text Only Editor -->
      <div style="margin-bottom: 3rem;">
        <h2>Text Only Editor (No Formatting)</h2>
        <MiniEditor 
          v-model="content3" 
          label="Text Only Editor" 
          placeholder="Plain text only..."
          :show-language-switcher="true"
          :show-text-color="false"
          :show-highlight="false"
          :show-bold="false"
          :show-italic="false"
          :show-underline="false"
          :show-strike="false"
          :show-bullet-list="false"
          :show-numbered-list="false"
          :show-align-right="false"
          :show-align-center="false"
          :show-align-left="false"
          :show-headings="false"
          :show-media="false"
          :show-undo="true"
          :show-redo="true"
          :show-clear-formatting="false"
          :show-preview="true"
        />
      </div>

      <!-- Custom Translations -->
      <div style="margin-bottom: 3rem;">
        <h2>Custom Translations</h2>
        <MiniEditor 
          v-model="content4" 
          label="Custom Translations" 
          placeholder="Editor with custom translations..."
          :translations="customTranslations"
          :show-language-switcher="true"
          :show-preview="true"
        />
      </div>
    </div>
  `,
  data() {
    return {
      content1: { ar: '', en: '' },
      content2: { ar: '', en: '' },
      content3: { ar: '', en: '' },
      content4: { ar: '', en: '' },
      customTranslations: {
        ar: {
          switchLanguage: "تغيير اللغة",
          textColor: "لون النص",
          highlight: "تظليل",
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
          switchLanguage: "Change Language",
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
      }
    }
  }
})

app.component('MiniEditor', MiniEditor)
app.mount('#app') 