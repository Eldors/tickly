import { db } from '@/db';
import {
  CREATE_TIME_ENTRY_ERROR,
  FETCH_TIME_ENTRIES_ERROR,
  STOP_TIME_ENTRY_ERROR,
} from '@/lib';
import { TimeEntry } from '@/types';

class TimeEntryRepository {
  async findAll(): Promise<TimeEntry[]> {
    try {
      const timeEntries = await db.select<TimeEntry[]>(
        `
          SELECT
            e.id,
            e.taskId,
            e.createdAt,
            e.duration,
            t.name
          FROM
            time_entries e
          JOIN
            tasks t ON t.id = e.taskId
          WHERE
            e.deleted = 0
            AND t.deleted = 0
        `,
      );

      return timeEntries ?? [];
    } catch (error) {
      console.error(FETCH_TIME_ENTRIES_ERROR, error);
      throw error;
    }
  }

  async stopTimeEntry(duration: number, id: number) {
    try {
      await db.execute(
        `
        UPDATE
          time_entries
        SET
          duration = $1
        WHERE
          id = $2
      `,
        [duration, id],
      );
    } catch (error) {
      console.error(STOP_TIME_ENTRY_ERROR, error);
      throw error;
    }
  }

  async create(taskId: number, createdAt: string) {
    try {
      await db.execute(
        `
          INSERT INTO
            time_entries (taskId, createdAt) 
          VALUES 
            ($1, $2)
        `,
        [taskId, createdAt],
      );
    } catch (error) {
      console.error(CREATE_TIME_ENTRY_ERROR, error);
      throw error;
    }
  }
}

export const timeEntryRepository = new TimeEntryRepository();
