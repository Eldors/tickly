<template>
  <TaskCard
    v-for="t in taskStore.taskList"
    :key="t.id"
    :active="t.id === recordStore.activeRecord?.taskId"
    :color="t.color ?? 'red'"
    :name="t.name"
    @start-record="recordStore.startRecord(t.id)"
    @stop-record="recordStore.stopRecord"
    @click="openDialog(t)"
  />
  <TaskEditorDialog
    v-model:open="open"
    :task="task"
    @save="taskStore.updateTask"
    @delete="handleRemoveClick"
  />
</template>

<script setup lang="ts">
import { Ref, ref } from 'vue';
import { useTaskStore } from '@/stores/taskStore.ts';
import { useRecordStore } from '@/stores/recordStore.ts';
import { Task } from '@/types';
import TaskCard from './TaskCard.vue';
import TaskEditorDialog from './TaskEditorDialog.vue';

const taskStore = useTaskStore();
const recordStore = useRecordStore();
const open: Ref<boolean> = ref(false);
const task: Ref<Partial<Task> | null> = ref(null);

const handleRemoveClick = async (id: number) => {
  if (id === recordStore.activeRecord?.taskId) {
    await recordStore.stopRecord();
  }

  await taskStore.deleteTask(id);

  task.value = null;
};

const openDialog = (t: Task) => {
  task.value = t;
  open.value = true;
};

taskStore.getTasks();
recordStore.getRecords();
</script>

<style></style>
