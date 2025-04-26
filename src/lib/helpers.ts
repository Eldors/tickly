import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import { TimeEntry } from '@/types';

dayjs.extend(utc);

export function transformTimeEntryListToHashMap(
  timeEntries: TimeEntry[],
): Map<string, { list: TimeEntry[]; duration: number }> {
  return timeEntries.reduceRight(
    (
      map: Map<string, { list: TimeEntry[]; duration: number }>,
      entry: TimeEntry,
    ) => {
      const day = dayjs(entry.startedAt).local().format('YYYY-MM-DD');
      const currentDay = map.get(day);

      map.set(day, {
        list: [...(currentDay?.list ?? []), entry],
        duration:
          (currentDay?.duration ?? 0) +
          getDifferenceInSeconds(entry.startedAt, entry.stoppedAt),
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

export const getDifferenceInSeconds = (
  startedAt: string,
  stoppedAt: string | null,
) => {
  if (!stoppedAt) {
    return 0;
  }

  const start = dayjs(startedAt);
  const stop = dayjs(stoppedAt);

  return stop.diff(start, 'second');
};

export const getDurationInHoursAndMinutes = (
  startedAt: string,
  stoppedAt: string | null,
): string => {
  if (!stoppedAt) {
    return '00:00';
  }

  const start = dayjs(startedAt);
  const stop = dayjs(stoppedAt);

  const duration = stop.diff(start, 'second');

  return convertSecondsToHours(duration);
};
