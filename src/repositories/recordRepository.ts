import { db } from '@/db';
import { Record } from '@/types';

class RecordRepository {
  async findAll(): Promise<Record[]> {
    if (!db) {
      throw new Error('База данных не инициализирована');
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
      console.error('Ошибка получения задач:', error);
      throw error;
    }
  }

  async stopRecord(duration: number, id: number) {
    if (!db) {
      throw new Error('База данных не инициализирована');
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
      console.error('Ошибка получения задач:', error);
      throw error;
    }
  }

  async create(taskId: number, createdAt: string) {
    if (!db) {
      throw new Error('База данных не инициализирована');
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
      console.error('Failed to create record', error);
      throw error;
    }
  }
}

export const recordRepository = new RecordRepository();
