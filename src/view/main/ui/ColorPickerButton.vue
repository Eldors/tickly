<template>
  <Button
    :class="[`bg-${color}-500 hover:bg-${color}-500`, { 'ring-2': active }]"
    class="w-full h-8 rounded-lg hover:ring-2 ring-current block text-dark dark:text-white"
  />
</template>

<script setup lang="ts">
import { PropType } from 'vue';

import { Button } from '@/components/ui/button';

defineProps({
  color: {
    type: String as PropType<string>,
    required: true,
  },
  active: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
});
</script>
