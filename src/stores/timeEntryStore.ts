import { defineStore } from 'pinia';
import { computed, ComputedRef, Ref, ref } from 'vue';

import { getDifferenceInSeconds, transformTimeEntryListToHashMap } from '@/lib';
import { timeEntryRepository } from '@/repositories';
import { TimeEntry } from '@/types';

export const useTimeEntryStore = defineStore('time-entry-store', () => {
  const timeEntryList: Ref<TimeEntry[]> = ref([]);

  const activeTimeEntry: ComputedRef<TimeEntry | undefined> = computed(() =>
    timeEntryList.value.find((entry: TimeEntry) => entry.stoppedAt === null),
  );

  const totalTimeByTaskId: ComputedRef<{
    [key: string]: number;
  }> = computed(() => {
    if (!timeEntryList.value.length) return {};

    const totalDurationByTaskIdMap = timeEntryList.value.reduce(
      (acc: Map<string, number>, value: TimeEntry): Map<string, number> => {
        const key = value.taskId.toString();

        if (!value.stoppedAt) {
          return acc;
        }

        const currentEntryDuration = getDifferenceInSeconds(
          value.startedAt,
          value.stoppedAt,
        );
        let currentEntryTaskDuration = acc.get(key) ?? 0;

        currentEntryTaskDuration += currentEntryDuration ?? 0;
        acc.set(key, currentEntryTaskDuration);

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
      await timeEntryRepository.stopTimeEntry(activeTimeEntry.value.id);

      getTimeEntries();
    } catch {}
  }

  async function startTimeEntry(taskId: number) {
    try {
      await stopTimeEntry();

      await timeEntryRepository.startTimeEntry(taskId);

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
