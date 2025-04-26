<template>
  <div ref="el">
    <TaskCard
      v-for="t in list"
      :key="t.id"
      :data-id="t.id"
      :active="t.id === timeEntryStore.activeTimeEntry?.taskId"
      :color="t.color ?? 'red'"
      :name="t.name"
      :total-duration="timeEntryStore.totalTimeByTaskId[t.id.toString()]"
      @start-time-entry="timeEntryStore.startTimeEntry(t.id)"
      @stop-time-entry="timeEntryStore.stopTimeEntry"
      @click="openDialog(t)"
    />
  </div>
  <TaskEditDialog
    v-model:open="open"
    :task="task"
    @save="taskStore.updateTask"
    @delete="handleRemoveClick"
  />
</template>

<script setup lang="ts">
import { useSortable } from '@vueuse/integrations/useSortable.mjs';
import { SortableEvent } from 'sortablejs';
import { Ref, ref, shallowRef, useTemplateRef, watchEffect } from 'vue';

import TaskCard from './TaskCard.vue';
import TaskEditDialog from './TaskEditDialog.vue';

import { useTaskStore } from '@/stores';
import { useTimeEntryStore } from '@/stores';
import { Task } from '@/types';

const taskStore = useTaskStore();
const timeEntryStore = useTimeEntryStore();
const open: Ref<boolean> = ref(false);
const task: Ref<Partial<Task> | null> = ref(null);
const el = useTemplateRef<HTMLElement>('el');
const list = shallowRef<Task[]>([]);

const handleRemoveClick = async (id: number) => {
  if (id === timeEntryStore.activeTimeEntry?.taskId) {
    await timeEntryStore.stopTimeEntry();
  }

  await taskStore.deleteTask(id);

  task.value = null;
};

const openDialog = (t: Task) => {
  task.value = t;
  open.value = true;
};

taskStore.getTasks();
timeEntryStore.getTimeEntries();

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
