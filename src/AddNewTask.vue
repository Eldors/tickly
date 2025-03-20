<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Task } from '@/types';
import { reactive } from 'vue';
import { useTaskStore } from '@/stores/taskStore.ts';

const { setTask } = useTaskStore();

const initialState: Partial<Task> = {
  name: '',
};

const newTask: Partial<Task> = reactive({ ...initialState });

const handleSaveClick = async () => {
  if (!newTask.name) {
    return;
  }

  await setTask(newTask);

  Object.assign(newTask, initialState);
};
  // test
</script>

<template>
  <div class="flex justify-center items-center mb-2">
    <Input
      v-model="newTask.name"
      class="mr-2"
      type="text"
      @keyup.enter="handleSaveClick"
    />
    <Button @click="handleSaveClick">Save</Button>
  </div>
</template>
