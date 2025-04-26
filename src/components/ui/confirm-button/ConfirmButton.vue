<script setup lang="ts">
import { type PrimitiveProps } from 'reka-ui';
import { type HTMLAttributes, ref, watchEffect } from 'vue';

import type { ButtonVariants } from '@/components/ui/button';
import { Button } from '@/components/ui/button';
import { CountdownIcon } from '@/components/ui/countdown-icon';

interface Props extends PrimitiveProps {
  variant?: ButtonVariants['variant'];
  size?: ButtonVariants['size'];
  class?: HTMLAttributes['class'];
  text?: string;
  confirmText?: string;
  time?: number;
}

const props = withDefaults(defineProps<Props>(), {
  as: 'button',
  confirmText: 'Click again',
  time: 5,
});

const emits = defineEmits(['confirm']);

let timer: NodeJS.Timeout | null = null;
const isWaitConfirm = ref<boolean>(false);
const indicator = ref<number>(props.time);

const handleClick = () => {
  if (isWaitConfirm.value) {
    emits('confirm');
  }

  isWaitConfirm.value = !isWaitConfirm.value;
};

watchEffect(() => {
  if (isWaitConfirm.value) {
    if (!timer) {
      timer = setInterval(() => {
        indicator.value--;
      }, 1000);
    }
  } else {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }

    if (indicator.value === 0) {
      indicator.value = props.time;
    }
  }
});

// Отдельно отслеживаем изменения indicator
watchEffect(() => {
  if (indicator.value === 0) {
    isWaitConfirm.value = false;
    indicator.value = props.time;
  }
});
</script>

<template>
  <Button
    v-bind="props"
    @click="handleClick"
  >
    <slot
      v-if="isWaitConfirm"
      name="confirm"
    >
      <CountdownIcon
        :duration="time"
        class="mr-1"
      />
      {{ confirmText }}
    </slot>
    <slot v-else>
      {{ text }}
    </slot>
  </Button>
</template>
