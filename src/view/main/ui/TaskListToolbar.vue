<script setup lang="ts">
import { Plus } from 'lucide-vue-next';

import { Button } from '@/components/ui/button';

defineEmits(['add-task-click']);
</script>

<template>
  <header>
    <div class="flex items-center justify-between px-4 py-2">
      <h1 class="text-xl font-bold">Task List</h1>
      <Button @click="$emit('add-task-click')">
        <Plus />
        Add Task
      </Button>
    </div>
  </header>
</template>
