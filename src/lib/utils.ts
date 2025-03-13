import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { Record } from '@/types';

dayjs.extend(utc);

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function transformRecordListToHashMap(recordList: Record[]) {
  return recordList.reduceRight(
    (
      map: Map<string, { list: Record[]; duration: number }>,
      record: Record,
    ) => {
      const day = dayjs(record.createdAt).local().format('YYYY-MM-DD');
      const currentDay = map.get(day);

      map.set(day, {
        list: [...(currentDay?.list ?? []), record],
        duration: (currentDay?.duration ?? 0) + (record.duration ?? 0),
      });

      return map;
    },
    new Map(),
  );
}
