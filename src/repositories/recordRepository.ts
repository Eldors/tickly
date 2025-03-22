import { db } from '@/db';
import { Record } from '@/types';
import {
  CREATE_RECORD_ERROR,
  DB_NOT_INITIALIZED,
  FETCH_RECORDS_ERROR,
  STOP_RECORD_ERROR,
} from '@/lib';

class RecordRepository {
  async findAll(): Promise<Record[]> {
    if (!db) {
      throw new Error(DB_NOT_INITIALIZED);
    }

    try {
      const records = await db.select<Record[]>(
        `
          SELECT
            r.id AS recordId,
            r.taskId,
            r.createdAt,
            r.duration,
            t.name
          FROM
            records r
          INNER JOIN
            tasks t ON t.id = r.taskId
          WHERE
            r.deleted = 0
            AND t.deleted = 0
        `,
      );

      return records ?? [];
    } catch (error) {
      console.error(FETCH_RECORDS_ERROR, error);
      throw error;
    }
  }

  async stopRecord(duration: number, id: number) {
    if (!db) {
      throw new Error(DB_NOT_INITIALIZED);
    }

    try {
      await db.execute(
        `
        UPDATE
          records
        SET
          duration = $1
        WHERE
          id = $2
      `,
        [duration, id],
      );
    } catch (error) {
      console.error(STOP_RECORD_ERROR, error);
      throw error;
    }
  }

  async create(taskId: number, createdAt: string) {
    if (!db) {
      throw new Error(DB_NOT_INITIALIZED);
    }

    try {
      await db.execute(
        `
          INSERT INTO
            records (taskId, createdAt) 
          VALUES 
            ($1, $2)
        `,
        [taskId, createdAt],
      );
    } catch (error) {
      console.error(CREATE_RECORD_ERROR, error);
      throw error;
    }
  }
}

export const recordRepository = new RecordRepository();
