import dayjs from 'dayjs';
import { defineStore } from 'pinia';
import { computed, ComputedRef, Ref, ref } from 'vue';

import { transformTimeEntryListToHashMap } from '@/lib';
import { timeEntryRepository } from '@/repositories';
import { TimeEntry } from '@/types';

export const useTimeEntryStore = defineStore('time-entry-store', () => {
  const timeEntryList: Ref<TimeEntry[]> = ref([]);

  const activeTimeEntry: ComputedRef<TimeEntry | undefined> = computed(() =>
    timeEntryList.value.find((entry: TimeEntry) => entry.duration === null),
  );

  const totalTimeByTaskId: ComputedRef<{
    [key: string]: number;
  }> = computed(() => {
    if (!timeEntryList.value.length) return {};

    const totalDurationByTaskIdMap = timeEntryList.value.reduce(
      (acc: Map<string, number>, value: TimeEntry): Map<string, number> => {
        const key = value.taskId.toString();
        let duration = acc.get(key) ?? 0;

        duration += value.duration ?? 0;
        acc.set(key, duration);

        return acc;
      },
      new Map(),
    );

    return Object.fromEntries(totalDurationByTaskIdMap);
  });

  const mainViewTimeEntries: ComputedRef<
    Map<
      string,
      {
        list: TimeEntry[];
        duration: number;
      }
    >
  > = computed(() => {
    return transformTimeEntryListToHashMap(timeEntryList.value);
  });

  async function getTimeEntries() {
    try {
      timeEntryList.value = await timeEntryRepository.findAll();
    } catch {}
  }

  async function stopTimeEntry() {
    if (!activeTimeEntry.value) {
      return;
    }

    try {
      const duration = dayjs().diff(
        dayjs(activeTimeEntry.value.createdAt),
        's',
      );

      await timeEntryRepository.stopTimeEntry(
        duration,
        activeTimeEntry.value.id,
      );

      getTimeEntries();
    } catch {}
  }

  async function startTimeEntry(taskId: number) {
    try {
      await stopTimeEntry();

      await timeEntryRepository.create(taskId, dayjs().toISOString());

      getTimeEntries();
    } catch {}
  }

  return {
    timeEntryList,
    activeTimeEntry,
    totalTimeByTaskId,
    mainViewTimeEntries,
    stopTimeEntry,
    startTimeEntry,
    getTimeEntries,
  };
});
