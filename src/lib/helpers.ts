import dayjs from 'dayjs';

import { TimeEntry } from '@/types';

export function transformTimeEntryListToHashMap(timeEntries: TimeEntry[]) {
  return timeEntries.reduceRight(
    (
      map: Map<string, { list: TimeEntry[]; duration: number }>,
      entry: TimeEntry,
    ) => {
      const day = dayjs(entry.createdAt).format('YYYY-MM-DD');
      const currentDay = map.get(day);

      map.set(day, {
        list: [...(currentDay?.list ?? []), entry],
        duration: (currentDay?.duration ?? 0) + (entry.duration ?? 0),
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
