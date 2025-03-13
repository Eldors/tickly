import Database from '@tauri-apps/plugin-sql';
import { ref } from 'vue';

let db: Database | null = null;
const isInit = ref(false);

export const initDatabase = async () => {
  if (db) return;

  try {
    db = await Database.load('sqlite:app.db');

    isInit.value = true;
  } catch (error) {
    console.error('Error loading database', error);
  }
};

export { isInit, db };
