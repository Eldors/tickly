<script setup lang="ts">
import { Circle } from 'lucide-vue-next';
import { computed, PropType } from 'vue';

const props = defineProps({
  size: {
    type: Number as PropType<number>,
    default: 24,
  },
  duration: {
    type: Number as PropType<number>,
    default: 10,
  },
  strokeWidth: {
    type: Number as PropType<number>,
    default: 2,
  },
});

// lucide-vue-next Circle svg circle radius
const radius = 10;
// circle length
const circumference = computed(() => Math.floor(2 * Math.PI * radius));
const strokeDasharray = computed(() => `${circumference.value}px`);
const elementSize = computed(() => `${props.size}px`);
const animationDuration = computed(() => `${props.duration}s`);
</script>

<template>
  <Circle
    :size="props.size"
    :stroke-width="strokeWidth"
    class="countdown-icon"
  />
</template>

<style>
.countdown-icon.countdown-icon {
  width: v-bind(elementSize);
  height: v-bind(elementSize);
  transform: rotateY(-180deg) rotateZ(-90deg);
}

.countdown-icon circle {
  stroke-dasharray: v-bind(strokeDasharray);
  stroke-dashoffset: 0;
  animation: countdown v-bind(animationDuration) linear infinite forwards;
}

@keyframes countdown {
  from {
    stroke-dashoffset: 0;
  }
  to {
    stroke-dashoffset: v-bind(strokeDasharray);
  }
}
</style>
