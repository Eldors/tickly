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
            e.task_id AS taskId,
            e.started_at AS startedAt,
            e.stopped_at AS stoppedAt,
            t.name
          FROM
            time_entries e
          JOIN
            tasks t ON t.id = e.task_id
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

  async stopTimeEntry(id: number) {
    try {
      await db.execute(
        `
          UPDATE
            time_entries
          SET
            stopped_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
          WHERE
            id = $1
      `,
        [id],
      );
    } catch (error) {
      console.error(STOP_TIME_ENTRY_ERROR, error);
      throw error;
    }
  }

  async startTimeEntry(taskId: number) {
    try {
      await db.execute(
        `
          INSERT INTO 
            time_entries (task_id, started_at)
          SELECT
            $1,
            strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
          FROM 
            tasks
          WHERE 
            id = $1 AND deleted = 0;
        `,
        [taskId],
      );
    } catch (error) {
      console.error(CREATE_TIME_ENTRY_ERROR, error);
      throw error;
    }
  }
}

export const timeEntryRepository = new TimeEntryRepository();
