<script setup lang="ts">
import { reactive } from 'vue';

import TaskEditForm from './TaskEditForm.vue';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { useTaskStore } from '@/stores';
import { Task } from '@/types';

defineProps<{ open: boolean }>();

const emits = defineEmits(['update:open']);

const defaultState = {
  name: '',
  color: 'red',
};

const newTask: Partial<Task> = reactive({ ...defaultState });

const taskStore = useTaskStore();

const handleUpdateTask = (event: Partial<Task>) => {
  Object.assign(newTask, event);
};

const handleSaveClick = () => {
  if (!newTask.name) {
    return;
  }

  taskStore.setTask(newTask).then(() => {
    Object.assign(newTask, defaultState);
    emits('update:open', false);
  });
};
</script>

<template>
  <Dialog
    :open="open"
    @update:open="$emit('update:open', $event)"
  >
    <DialogContent>
      <DialogHeader>
        <DialogTitle>New Task</DialogTitle>
      </DialogHeader>
      <TaskEditForm
        :task="newTask"
        @update:task="handleUpdateTask"
      />
      <DialogFooter>
        <Button @click="handleSaveClick">Create Task</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
