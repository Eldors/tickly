<template>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Remove Task</DialogTitle>
      <DialogDescription>
        Are you sure you want to delete
        <template v-if="!!selectedTask">
          {{ selectedTask.name }}
        </template>
        ?
      </DialogDescription>
    </DialogHeader>
    <DialogFooter class="justify-start">
      <DialogClose as-child>
        <Button
          type="button"
          @click="$emit('close')"
        >
          Close
        </Button>
      </DialogClose>
      <DialogClose
        as-child
        variant="secondary"
      >
        <Button
          variant="secondary"
          type="button"
          @click="$emit('submit')"
        >
          Remove
        </Button>
      </DialogClose>
    </DialogFooter>
  </DialogContent>
</template>

<script setup lang="ts">
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { type Task } from '@/types';

interface Props {
  selectedTask?: Task;
}

const { selectedTask = () => ({}) } = defineProps<Props>();

defineEmits(['close', 'submit']);
</script>
