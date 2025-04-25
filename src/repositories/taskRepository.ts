import { QueryResult } from '@tauri-apps/plugin-sql';

import { db } from '@/db';
import {
  CREATE_TASK_ERROR,
  DB_NOT_INITIALIZED,
  DELETE_TASK_ERROR,
  FETCH_TASKS_ERROR,
  TASK_NAME_REQUIRED,
  UPDATE_TASK_ERROR,
  UPDATE_TASK_ORDER_ERROR,
} from '@/lib';
import { Task } from '@/types';

export class TaskRepository {
  async findAll(): Promise<Task[]> {
    try {
      const tasks = await db.select<Task[]>(
        `
          SELECT 
            t.id,
            t.name,
            t.color
          FROM 
            tasks t
          LEFT JOIN 
            task_order o ON t.id = o.task_id
          WHERE 
            t.deleted = 0
          ORDER BY 
            o.position
        `,
      );
      console.log('tasks =>', tasks);
      return tasks ?? [];
    } catch (error) {
      console.error(FETCH_TASKS_ERROR, error);
      throw error;
    }
  }

  async create(task: Partial<Task>): Promise<void> {
    if (!task.name) {
      throw new Error(TASK_NAME_REQUIRED);
    }

    let newTaskId;

    try {
      const { lastInsertId }: QueryResult = await db.execute(
        `
            INSERT INTO 
              tasks (name, color) 
            VALUES 
              ($1, $2)
          `,
        [task.name, task.color],
      );

      newTaskId = lastInsertId;

      await db.execute(
        `
          INSERT INTO
            task_order (task_id, position)
          VALUES
            ($1, (SELECT ifnull(MAX(position), 0) + 1 FROM task_order))
        `,
        [newTaskId],
      );
    } catch (error) {
      if (newTaskId) {
        await db.execute(
          `
            DELETE FROM 
              tasks 
            WHERE 
              id = $1
          `,
          [newTaskId],
        );
      }
      console.error(CREATE_TASK_ERROR, error);
      throw error;
    }
  }

  async update(task: Partial<Task>) {
    if (!db) {
      throw new Error(DB_NOT_INITIALIZED);
    }

    if (!task.name) {
      throw new Error(TASK_NAME_REQUIRED);
    }

    try {
      await db.execute(
        `
          UPDATE 
            tasks 
          SET 
            name = $2,
            color = $3 
          WHERE 
            id = $1
        `,
        [task.id, task.name, task.color],
      );
    } catch (error) {
      console.error(UPDATE_TASK_ERROR, error);
      throw error;
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await db.execute(
        `
          UPDATE 
            tasks 
          SET 
            deleted = 1
          WHERE 
            id = $1;
        
          UPDATE
            task_order
          SET
            position = position - 1
          WHERE
            position > (SELECT position FROM task_order WHERE task_id = $1);
        
          DELETE FROM
            task_order
          WHERE 
            task_id = $1;
        `,
        [id],
      );
    } catch (error) {
      console.error(DELETE_TASK_ERROR, error);
      throw error;
    }
  }

  async updateOrder(
    taskId: number,
    oldPosition: number,
    newPosition: number,
  ): Promise<void> {
    try {
      let query;

      if (oldPosition < newPosition) {
        query = `
            UPDATE
                task_order
            SET
                position = position - 1
            WHERE
                position > $1 AND position <= $2;
        `;
      } else {
        query = `
            UPDATE
                task_order
            SET
                position = position + 1
            WHERE
                position < $1 AND position >= $2;
        `;
      }

      await db.execute(
        `
            ${query}

            UPDATE
              task_order
            SET
              position = $2
            WHERE
              task_id = $3;
          `,
        [oldPosition, newPosition, taskId],
      );
    } catch (error) {
      console.error(UPDATE_TASK_ORDER_ERROR, error);
      throw error;
    }
  }
}

export const taskRepository = new TaskRepository();
