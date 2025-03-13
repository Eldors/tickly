import { defineStore } from 'pinia';
import { computed, ComputedRef, Ref, ref } from 'vue';
import dayjs from 'dayjs';
import { transformRecordListToHashMap } from '@/lib/utils.ts';
import { recordRepository } from '@/repositories/recordRepository.ts';
import { Record } from '@/types';

export const useRecordStore = defineStore('record-stores', () => {
  const recordList: Ref<Record[]> = ref([]);

  const activeRecord: ComputedRef<Record | undefined> = computed(() =>
    recordList.value.find((record: Record) => record.duration === null),
  );

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
    } finally {
    }
  }

  return {
    recordList,
    activeRecord,
    mainViewRecords,
    stopRecord,
    startRecord,
    getRecords,
  };
});
