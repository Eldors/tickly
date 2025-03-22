import { db } from '@/db';
import { Task } from '@/types';
import {
  CREATE_TASK_ERROR,
  DB_NOT_INITIALIZED,
  DELETE_TASK_ERROR,
  FETCH_TASKS_ERROR,
  TASK_NAME_REQUIRED,
  UPDATE_TASK_ERROR,
} from '@/lib';

export class TaskRepository {
  async findAll(): Promise<Task[]> {
    if (!db) {
      throw new Error(DB_NOT_INITIALIZED);
    }

    try {
      const tasks = await db.select<Task[]>(
        `
          SELECT 
            id,
            name,
            color
          FROM 
            tasks 
          WHERE 
            deleted = 0
        `,
      );

      return tasks ?? [];
    } catch (error) {
      console.error(FETCH_TASKS_ERROR, error);
      throw error;
    }
  }

  async create(task: Partial<Task>): Promise<void> {
    if (!db) {
      throw new Error(DB_NOT_INITIALIZED);
    }

    if (!task.name) {
      throw new Error(TASK_NAME_REQUIRED);
    }

    try {
      await db.execute(
        `
          INSERT INTO 
            tasks (name) 
          VALUES 
            ($1)
        `,
        [task.name],
      );
    } catch (error) {
      console.error(CREATE_TASK_ERROR, error);
      throw error;
    }
  }

  // Пометка задачи как удаленной
  async delete(id: number): Promise<void> {
    if (!db) {
      throw new Error(DB_NOT_INITIALIZED);
    }

    try {
      await db.execute(
        `
          UPDATE 
            tasks 
          SET 
            deleted = 1
          WHERE 
            id = $1
        `,
        [id],
      );
    } catch (error) {
      console.error(DELETE_TASK_ERROR, error);
      throw error;
    }
  }
}

export const taskRepository = new TaskRepository();
