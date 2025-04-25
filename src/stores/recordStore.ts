import dayjs from 'dayjs';
import { defineStore } from 'pinia';
import { computed, ComputedRef, Ref, ref } from 'vue';

import { transformRecordListToHashMap } from '@/lib/helpers.ts';

import { recordRepository } from '@/repositories/recordRepository.ts';
import { Record } from '@/types';

export const useRecordStore = defineStore('record-stores', () => {
  const recordList: Ref<Record[]> = ref([]);

  const activeRecord: ComputedRef<Record | undefined> = computed(() =>
    recordList.value.find((record: Record) => record.duration === null),
  );

  const totalTimeByTaskId: ComputedRef<{
    [key: string]: number;
  }> = computed(() => {
    if (!recordList.value.length) return {};

    const totalDurationByTaskIdMap = recordList.value.reduce(
      (acc: Map<string, number>, value: Record): Map<string, number> => {
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

  const mainViewRecords: ComputedRef<
    Map<
      string,
      {
        list: Record[];
        duration: number;
      }
    >
  > = computed(() => {
    return transformRecordListToHashMap(recordList.value);
  });

  async function getRecords() {
    try {
      recordList.value = await recordRepository.findAll();
    } catch (error) {
      console.error('Ошибка при получении записей:', error);
    }
  }

  async function stopRecord() {
    if (!activeRecord.value) {
      return;
    }

    try {
      const duration = dayjs().diff(dayjs(activeRecord.value.createdAt), 's');

      await recordRepository.stopRecord(duration, activeRecord.value.recordId);

      getRecords();
    } catch (error) {
      console.error('Failed to delete record', error);
    }
  }

  async function startRecord(taskId: number) {
    try {
      await stopRecord();

      await recordRepository.create(taskId, dayjs().toISOString());

      getRecords();
    } catch (error) {
      console.error('Failed to start record', error);
    }
  }

  return {
    recordList,
    activeRecord,
    totalTimeByTaskId,
    mainViewRecords,
    stopRecord,
    startRecord,
    getRecords,
  };
});
