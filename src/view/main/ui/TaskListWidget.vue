<template>
  <div
    v-for="t in taskStore.taskList"
    :key="t.id"
  >
    <div class="p-2 border rounded-md mb-2">
      <TaskCard
        :active="t.id === recordStore.activeRecord?.taskId"
        :name="t.name"
        @start-record="recordStore.startRecord(t.id)"
        @stop-record="recordStore.stopRecord"
      >
        <template #action-menu>
          <TaskDropdownMenu
            :task-id="t.id"
            :name="t.name"
            @remove-task="handleRemoveClick(t.id)"
          />
        </template>
      </TaskCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import TaskCard from '@/view/main/ui/TaskCard.vue';
import TaskDropdownMenu from '@/view/main/ui/TaskDropdownMenu.vue';
import { useTaskStore } from '@/stores/taskStore.ts';
import { useRecordStore } from '@/stores/recordStore.ts';

const taskStore = useTaskStore();
const recordStore = useRecordStore();

const handleRemoveClick = async (id: number) => {
  if (id === recordStore.activeRecord?.taskId) {
    await recordStore.stopRecord();
  }

  taskStore.deleteTask(id);
};

taskStore.getTasks();
recordStore.getRecords();
</script>

<style scoped></style>
