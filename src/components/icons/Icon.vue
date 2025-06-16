<template>
  <component :is="iconComponent" v-bind="$attrs" class="icon-consistent" />
</template>

<script setup>
import { computed } from 'vue'
import BoldIcon from './BoldIcon.vue'
import ItalicIcon from './ItalicIcon.vue'
import UpperLineIcon from './UpperLineIcon.vue'
import MiddleLineIcon from './MiddleLineIcon.vue'
import ListPointIcon from './ListPointIcon.vue'
import ListNumIcon from './ListNumIcon.vue'
import AlignLeftIcon from './AlignLeftIcon.vue'
import AlignCenterIcon from './AlignCenterIcon.vue'
import AlignRightIcon from './AlignRightIcon.vue'
import H1Icon from './H1Icon.vue'
import H2Icon from './H2Icon.vue'
import H3con from './H3con.vue'
import H4Icon from './H4Icon.vue'
import H5Icon from './H5Icon.vue'
import MediaIcon from './MediaIcon.vue'
import UndoIcon from './UndoIcon.vue'
import RedoIcon from './RedoIcon.vue'
import BroomIcon from './BroomIcon.vue'
import TextColorIcon from './TextColorIcon.vue'
import HighlightIcon from './HighlightIcon.vue'

const props = defineProps({
  name: {
    type: String,
    required: true
  }
})

const icons = {
  Bold: BoldIcon,
  Italic: ItalicIcon,
  Underline: UpperLineIcon,
  Strikethrough: MiddleLineIcon,
  ListPoint: ListPointIcon,
  ListNum: ListNumIcon,
  AlignLeft: AlignLeftIcon,
  AlignCenter: AlignCenterIcon,
  AlignRight: AlignRightIcon,
  H1: H1Icon,
  H2: H2Icon,
  H3: H3con,
  H4: H4Icon,
  H5: H5Icon,
  Media: MediaIcon,
  Undo: UndoIcon,
  Redo: RedoIcon,
  Broom: BroomIcon,
  TextColor: TextColorIcon,
  Highlight: HighlightIcon,
}

const iconComponent = computed(() => icons[props.name] || null)
</script>

<style scoped>
.icon-consistent {
  width: 20px;
  height: 20px;
  display: inline-block;
  vertical-align: middle;
}
</style> 