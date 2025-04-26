<template>
  <ResizablePanelGroup
    id="demo-group-1"
    direction="horizontal"
  >
    <ResizablePanel
      id="demo-panel-1"
      :default-size="50"
      class="flex p-2 flex-col max-h-screen"
    >
      <ScrollArea class="h-screen">
        <TaskListToolbar @add-task-click="isTaskCreateDialogOpen = true" />
        <Separator
          class="mb-2"
          decorative
        />
        <TaskListWidget />
        <TaskCreateDialog v-model:open="isTaskCreateDialogOpen" />
      </ScrollArea>
    </ResizablePanel>
    <ResizableHandle id="demo-handle-1" />
    <ResizablePanel
      id="demo-panel-2"
      :default-size="50"
      class="p-2 max-h-screen"
    >
      <ScrollArea class="h-screen">
        <div
          v-for="[key, value] in timeEntryStore.mainViewTimeEntries"
          :key="key"
        >
          <div
            class="flex justify-between pl-2 pr-2 mb-1 sticky top-0 bg-background"
          >
            <div class="text-xl font-bold">
              {{ getTitleDate(key) }}
            </div>
            <div>
              {{ convertSecondsToHours(value.duration) }}
            </div>
          </div>
          <div
            v-for="(item, index) in value.list"
            :key="index"
            class="p-2 border rounded-md mb-2 flex items-center"
          >
            <div>
              <div class="text-sm">
                {{ getEndTime(item.stoppedAt) }}
              </div>
              <div class="text-sm text-gray-500">
                {{ getStartTime(item.startedAt) }}
              </div>
            </div>
            <Separator
              decorative
              orientation="vertical"
              class="ml-1 mr-1 h-auto bg-red-400"
            />
            <div class="flex justify-between w-full">
              <div class="text-base">
                {{ item.name }}
              </div>
              <div>
                {{
                  getDurationInHoursAndMinutes(item.startedAt, item.stoppedAt)
                }}
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </ResizablePanel>
  </ResizablePanelGroup>
</template>

<script setup lang="ts">
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { ref } from 'vue';

import TaskCreateDialog from './ui/TaskCreateDialog.vue';
import TaskListToolbar from './ui/TaskListToolbar.vue';
import TaskListWidget from './ui/TaskListWidget.vue';

import { useTimeEntryStore } from '@/stores/timeEntryStore.ts';

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

import { convertSecondsToHours, getDurationInHoursAndMinutes } from '@/lib';

dayjs.extend(utc);

const isTaskCreateDialogOpen = ref(false);

const timeEntryStore = useTimeEntryStore();

const getStartTime = (startedAt: string): string => {
  return dayjs(startedAt).local().format('HH:mm');
};

const getTitleDate = (date: string): string => {
  return dayjs(date).format('dddd, MMMM D');
};

const getEndTime = (stoppedAt: string | null) => {
  if (!stoppedAt) {
    return 'now';
  }

  return dayjs(stoppedAt).local().format('HH:mm');
};
</script>
