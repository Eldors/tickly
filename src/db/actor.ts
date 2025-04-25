import Database, { QueryResult } from '@tauri-apps/plugin-sql';

import { DB_NOT_INITIALIZED, DB_OPERATION_ERROR } from '@/lib';

class Actor {
  #queue: Array<() => Promise<any>> = [];
  #processing: boolean = false;
  #db: Database | null = null;
  isInit: boolean = false;

  async initDatabase() {
    if (this.#db) return;

    try {
      this.#db = await Database.load('sqlite:app.db');
      this.isInit = true;
    } catch (error) {
      console.error(DB_NOT_INITIALIZED, error);
      throw error;
    }
  }

  async execute(sql: string, params?: any[]): Promise<QueryResult> {
    try {
      if (!this.#db) {
        await this.initDatabase();
      }
    } catch (e) {
      return Promise.reject(e);
    }

    return this.enqueue(() => this.#db!.execute(sql, params));
  }

  async select<T>(query: string, bindValues?: unknown[]): Promise<T> {
    try {
      if (!this.#db) {
        await this.initDatabase();
      }
    } catch (e) {
      return Promise.reject(e);
    }

    return this.enqueue(() => this.#db!.select<T>(query, bindValues));
  }

  async enqueue<T>(operation: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.#queue.push(async () => {
        try {
          const result = await operation();
          resolve(result);
          return result;
        } catch (error) {
          reject(error);
          throw error;
        }
      });

      if (!this.#processing) {
        this.#processQueue();
      }
    });
  }

  async #processQueue() {
    if (this.#queue.length === 0) {
      this.#processing = false;

      return;
    }

    this.#processing = true;
    const operation: () => Promise<any> = this.#queue.shift()!;

    try {
      await operation();
    } catch (e) {
      console.error(DB_OPERATION_ERROR, e);
    }

    await this.#processQueue();
  }
}

export const dbActor = new Actor();
