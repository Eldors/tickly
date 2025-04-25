<template>
  <Dialog
    :open="open"
    @update:open="$emit('update:open', $event)"
  >
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{{ title }}</DialogTitle>
      </DialogHeader>
      <TaskEditForm
        :task="newTask"
        @update:task="handleUpdateTask"
      />
      <DialogFooter>
        <ConfirmButton
          variant="destructive"
          class="mr-auto"
          @confirm="handleRemoveClick"
        >
          Delete
        </ConfirmButton>
        <Button @click="handleSaveClick">Save changes</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { PropType, reactive, watchEffect } from 'vue';

import TaskEditForm from './TaskEditForm.vue';

import { Button } from '@/components/ui/button';
import { ConfirmButton } from '@/components/ui/confirm-button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { Task } from '@/types';

const props = defineProps({
  title: {
    type: String as PropType<string>,
    default: 'Edit Task',
  },
  open: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
  task: {
    type: [Object, null] as PropType<Partial<Task> | null>,
    default: () => ({}),
  },
});

const emits = defineEmits(['update:open', 'save', 'delete']);

const newTask: Partial<Task> = reactive({
  ...props.task,
});

const closeDialog = () => emits('update:open', false);

const handleSaveClick = () => {
  emits('save', newTask);
  closeDialog();
};

const handleRemoveClick = () => {
  emits('delete', props.task?.id);
  closeDialog();
};

const handleUpdateTask = (event: Partial<Task>) => {
  Object.assign(newTask, event);
};

watchEffect(() => {
  Object.assign(newTask, props.task);
});
</script>
