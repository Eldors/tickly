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
        <!--      <Button-->
        <!--        class="m-2"-->
        <!--        @click="clearState"-->
        <!--        >ClearState</Button-->
        <!--      >-->
        <AddNewTask />
        <Separator
          class="mb-2"
          decorative
        />
        <TaskListWidget />
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
          v-for="[key, value] in recordStore.mainViewRecords"
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
                {{ getEndTime(item.createdAt, item.duration) }}
              </div>
              <div class="text-sm text-gray-500">
                {{ getStartTime(item.createdAt) }}
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
                {{ convertSecondsToHours(item.duration) }}
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </ResizablePanel>
  </ResizablePanelGroup>
</template>

<script setup lang="ts">
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { Separator } from '@/components/ui/separator';
import AddNewTask from '@/AddNewTask.vue';
import dayjs from 'dayjs';
import TaskListWidget from '@/view/main/ui/TaskListWidget.vue';
import { useRecordStore } from '@/stores/recordStore.ts';

import utc from 'dayjs/plugin/utc';
import { ScrollArea } from '@/components/ui/scroll-area';

dayjs.extend(utc);

const recordStore = useRecordStore();

const getStartTime = (createdAt: string): string => {
  return dayjs(createdAt).local().format('HH:mm');
};

const getTitleDate = (date: string): string => {
  return dayjs(date).format('dddd, MMMM D');
};

const getEndTime = (
  createdAt: string,
  duration: number | undefined,
): string => {
  return typeof duration === 'number'
    ? dayjs(createdAt).local().add(duration, 's').format('HH:mm')
    : 'now';
};

const convertSecondsToHours = (seconds?: number) => {
  if (!seconds) {
    return '00:00';
  }

  const minutes = seconds / 60;
  const hours = minutes / 60;
  return (
    ('0' + `${Math.floor(hours)}`).slice(-2) +
    ':' +
    ('0' + `${Math.floor(minutes % 60)}`).slice(-2)
  );
};
</script>
