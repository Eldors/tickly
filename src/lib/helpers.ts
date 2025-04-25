import dayjs from 'dayjs';

import { Record } from '@/types/index.js';

export function transformRecordListToHashMap(recordList: Record[]) {
  return recordList.reduceRight(
    (
      map: Map<string, { list: Record[]; duration: number }>,
      record: Record,
    ) => {
      const day = dayjs(record.createdAt).format('YYYY-MM-DD');
      const currentDay = map.get(day);

      map.set(day, {
        list: [...(currentDay?.list ?? []), record],
        totalDuration: (currentDay?.duration ?? 0) + (record.duration ?? 0),
      });

      return map;
    },
    new Map(),
  );
}

export const convertSecondsToHours = (seconds?: number) => {
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
