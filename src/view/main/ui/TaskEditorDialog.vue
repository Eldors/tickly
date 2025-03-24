<template>
  <Dialog
    :open="open"
    @update:open="$emit('update:open', $event)"
  >
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{{ title }}</DialogTitle>
      </DialogHeader>
      <div>
        <div class="grid w-full items-center gap-1.5">
          <Label for="name">Name</Label>
          <Input
            id="name"
            v-model="newTask.name"
            class="w-full"
            placeholder="Name"
          />
        </div>
        <div>
          <Label>Color</Label>
          <TailwindColorPicker v-model:initial-color="newTask.color" />
        </div>
      </div>
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
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { Button } from '@/components/ui/button';
import { PropType, reactive, watchEffect } from 'vue';
import { Task } from '@/types';
import TailwindColorPicker from './TailwindColorPicker.vue';
import ConfirmButton from '@/components/ui/confirm-button/ConfirmButton.vue';

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

watchEffect(() => {
  Object.assign(newTask, props.task);
});
</script>
