<template>
  <div class="grid grid-cols-5 grid-rows-2 pt-2 pb-2 gap-2">
    <div
      v-for="(color, index) in colors"
      :key="index"
    >
      <ColorPickerButton
        :color
        :active="color === initialColor"
        @click="$emit('update:initialColor', color)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType, ref, Ref } from 'vue';

import ColorPickerButton from './ColorPickerButton.vue';

defineProps({
  initialColor: {
    type: String as PropType<string>,
    default: 'red',
  },
});

defineEmits(['update:initialColor']);

const colors: Ref<string[]> = ref([
  'red',
  'orange',
  'yellow',
  'lime',
  'green',
  'blue',
  'purple',
  'pink',
  'gray',
  'stone',
]);
</script>
