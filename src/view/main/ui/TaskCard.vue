<template>
  <div
    class="flex flex-row gap-2 p-2 items-center task-card ring-current cursor-pointer border rounded-md mb-2"
    :class="{ [taskBgColorVariants[color]]: active }"
  >
    <Button
      v-if="active"
      class="rounded-full task-card__play-button"
      :class="playButtonBgColorVariants[color]"
      size="icon"
      @click.stop="$emit('stop-record')"
    >
      <Square stroke-width="3" />
    </Button>
    <Button
      v-else
      class="rounded-full task-card__play-button text-primary-foreground hover:text-primary-foreground"
      :class="playButtonBgColorVariants[color]"
      size="icon"
      @click.stop="$emit('start-record')"
    >
      <!--      :class="bgPlayButtonColor[color]"-->
      <Play fill="#fff" />
    </Button>
    {{ name }}
    <div class="ml-auto flex">
      {{ convertSecondsToHours(totalDuration) }}
      <ChevronRight class="task-card__chevron" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ChevronRight, Play, Square } from 'lucide-vue-next';
import { PropType, reactive } from 'vue';

import { Button } from '@/components/ui/button';

import { convertSecondsToHours } from '@/lib';

defineProps({
  name: {
    type: String as PropType<string>,
    required: true,
  },
  color: {
    type: String as PropType<string>,
    required: true,
  },
  active: {
    type: Boolean as PropType<boolean>,
    required: true,
  },
  totalDuration: {
    type: Number as PropType<number>,
    default: null,
  },
});

defineEmits(['start-record', 'stop-record']);

const taskBgColorVariants: Record<string, string> = reactive({
  red: 'bg-red-50',
  orange: 'bg-orange-50',
  yellow: 'bg-yellow-50',
  lime: 'bg-lime-50',
  green: 'bg-green-50',
  blue: 'bg-blue-50',
  purple: 'bg-purple-50',
  pink: 'bg-pink-50',
  gray: 'bg-gray-50',
  stone: 'bg-stone-50',
});

const playButtonBgColorVariants = reactive<Record<string, string>>({
  red: 'bg-red-500 hover:bg-red-600 hover:bg-red-600',
  orange: 'bg-orange-500 hover:bg-orange-600 hover:bg-orange-600',
  yellow: 'bg-yellow-500 hover:bg-yellow-600 hover:bg-yellow-600',
  lime: 'bg-lime-500 hover:bg-lime-600 hover:bg-lime-600',
  green: 'bg-green-500 hover:bg-green-600 hover:bg-green-600',
  blue: 'bg-blue-500 hover:bg-blue-600 hover:bg-blue-600',
  purple: 'bg-purple-500 hover:bg-purple-600 hover:bg-purple-600',
  pink: 'bg-pink-500 hover:bg-pink-600 hover:bg-pink-600',
  gray: 'bg-gray-500 hover:bg-gray-600 hover:bg-gray-600',
  stone: 'bg-stone-500 hover:bg-stone-600 hover:bg-stone-600',
});
</script>

<style>
.task-card:hover .task-card__chevron {
  display: block;
}

.task-card__chevron {
  display: none;
  margin-left: auto;
}
</style>
