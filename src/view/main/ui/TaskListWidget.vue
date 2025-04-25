<template>
  <div ref="el">
    <TaskCard
      v-for="t in list"
      :key="t.id"
      :data-id="t.id"
      :active="t.id === recordStore.activeRecord?.taskId"
      :color="t.color ?? 'red'"
      :name="t.name"
      @start-record="recordStore.startRecord(t.id)"
      @stop-record="recordStore.stopRecord"
      @click="openDialog(t)"
    />
  </div>
  <TaskEditorDialog
    v-model:open="open"
    :task="task"
    @save="taskStore.updateTask"
    @delete="handleRemoveClick"
  />
</template>

<script setup lang="ts">
import { useSortable } from '@vueuse/integrations/useSortable.mjs';
import { SortableEvent } from 'sortablejs';
import { Ref, ref, useTemplateRef, shallowRef, watchEffect } from 'vue';

import TaskCard from './TaskCard.vue';
import TaskEditorDialog from './TaskEditorDialog.vue';

import { useRecordStore } from '@/stores/recordStore.ts';
import { useTaskStore } from '@/stores/taskStore.ts';

import { Task } from '@/types';

const taskStore = useTaskStore();
const recordStore = useRecordStore();
const open: Ref<boolean> = ref(false);
const task: Ref<Partial<Task> | null> = ref(null);
const el = useTemplateRef<HTMLElement>('el');
const list = shallowRef<Task[]>([]);

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

useSortable(el, list, {
  forceFallback: true,
  onEnd: (event: SortableEvent) => {
    const { item, oldIndex, newIndex } = event;

    if (oldIndex === newIndex) return;

    if (typeof oldIndex !== 'number' || typeof newIndex !== 'number') return;

    const id = Number(item.getAttribute('data-id'));

    if (!id || isNaN(id)) return;

    taskStore.updateTaskOrder(id, oldIndex, newIndex);
  },
});

watchEffect(() => {
  list.value = taskStore.taskList;
});
</script>

<style></style>
