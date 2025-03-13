import { db } from '@/db';
import { Task } from '@/types';

export class TaskRepository {
  // Получение всех активных задач
  async findAll(): Promise<Task[]> {
    if (!db) {
      throw new Error('База данных не инициализирована');
    }

    try {
      const tasks = await db.select<Task[]>(
        `
          SELECT 
            * 
          FROM 
            tasks 
          WHERE 
            deleted = 0
        `,
      );

      return tasks ?? [];
    } catch (error) {
      console.error('Ошибка получения задач:', error);
      throw error;
    }
  }

  // Создание новой задачи
  async create(task: Partial<Task>): Promise<void> {
    if (!db) {
      throw new Error('База данных не инициализирована');
    }

    if (!task.name) {
      throw new Error('Имя задачи обязательно');
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
      console.error('Ошибка создания задачи:', error);
      throw error;
    }
  }

  // Пометка задачи как удаленной
  async delete(id: number): Promise<void> {
    if (!db) {
      throw new Error('База данных не инициализирована');
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
      console.error('Ошибка удаления задачи:', error);
      throw error;
    }
  }
}

export const taskRepository = new TaskRepository();
