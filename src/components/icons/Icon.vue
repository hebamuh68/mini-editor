<template>
  <component :is="iconComponent" class="w-4 h-4" />
</template>

<script setup>
import { computed } from 'vue'
import BoldIcon from './BoldIcon.vue'
import ItalicIcon from './ItalicIcon.vue'
import UpperLineIcon from './UpperLineIcon.vue'
import MiddleLineIcon from './MiddleLineIcon.vue'
import ListPointIcon from './ListPointIcon.vue'
import ListNumIcon from './ListNumIcon.vue'
import AlignRightIcon from './AlignRightIcon.vue'
import AlignCenterIcon from './AlignCenterIcon.vue'
import AlignLeftIcon from './AlignLeftIcon.vue'
import H1Icon from './H1Icon.vue'
import H2Icon from './H2Icon.vue'
import H3con from './H3con.vue'
import H4Icon from './H4Icon.vue'
import H5Icon from './H5Icon.vue'
import HighlightIcon from './HighlightIcon.vue'
import TextColorIcon from './TextColorIcon.vue'
import UndoIcon from './UndoIcon.vue'
import RedoIcon from './RedoIcon.vue'
import BroomIcon from './BroomIcon.vue'
import FallbackIcon from './FallbackIcon.vue'
import LangIcon from './LangIcon.vue'
import MediaIcon from './MediaIcon.vue'
import PreviewIcon from './PreviewIcon.vue'

const props = defineProps({
  name: {
    type: String,
    required: true
  }
})

const iconComponent = computed(() => {
  const iconMap = {
    Bold: BoldIcon,
    Italic: ItalicIcon,
    Underline: UpperLineIcon,
    Strikethrough: MiddleLineIcon,
    ListPoint: ListPointIcon,
    ListNum: ListNumIcon,
    AlignRight: AlignRightIcon,
    AlignCenter: AlignCenterIcon,
    AlignLeft: AlignLeftIcon,
    H1: H1Icon,
    H2: H2Icon,
    H3: H3con,
    H4: H4Icon,
    H5: H5Icon,
    Highlight: HighlightIcon,
    TextColor: TextColorIcon,
    Undo: UndoIcon,
    Redo: RedoIcon,
    Broom: BroomIcon,
    Info: FallbackIcon,
    Lang: LangIcon,
    Media: MediaIcon,
    Preview: PreviewIcon
  }
  
  return iconMap[props.name] || FallbackIcon
})
</script>

<style scoped>
.icon-consistent {
  width: 20px;
  height: 20px;
  display: inline-block;
  vertical-align: middle;
}
</style> 