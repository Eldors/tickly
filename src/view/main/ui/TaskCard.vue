<template>
  <div class="flex flex-row gap-2 items-center">
    <Button
      v-if="active"
      variant="default"
      class="rounded-full"
      size="icon"
      @click="$emit('stop-record')"
    >
      <StopIcon class="w-6 h-6" />
    </Button>
    <Button
      v-else
      variant="ghost"
      class="rounded-full"
      size="icon"
      @click="$emit('start-record')"
    >
      <PlayIcon class="w-6 h-6" />
    </Button>
    {{ name }}
    <slot name="action-menu" />
  </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue';
import { PlayIcon, StopIcon } from '@radix-icons/vue';
import { Button } from '@/components/ui/button';

defineProps({
  name: {
    type: String as PropType<string>,
    required: true,
  },
  active: {
    type: Boolean as PropType<boolean>,
    required: true,
  },
});

defineEmits(['start-record', 'stop-record']);
</script>

<style scoped></style>
