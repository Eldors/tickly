<script setup lang="ts">
import TailwindColorPicker from './TailwindColorPicker.vue';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { Task } from '@/types';

interface Props {
  task: Partial<Task>;
}

const { task } = defineProps<Props>();

defineEmits(['update:task']);
</script>

<template>
  <div>
    <div class="grid w-full items-center gap-1.5 mb-3">
      <Label for="name">Name</Label>
      <Input
        id="name"
        :model-value="task.name"
        class="w-full"
        placeholder="Name"
        @update:model-value="$emit('update:task', { ...task, name: $event })"
      />
    </div>
    <div class="grid w-full items-center gap-1.5">
      <Label>Color</Label>
      <TailwindColorPicker
        :initial-color="task.color"
        @update:initial-color="$emit('update:task', { ...task, color: $event })"
      />
    </div>
  </div>
</template>

<style></style>
