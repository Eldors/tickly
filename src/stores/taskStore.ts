import { Ref, ref } from 'vue';
import { defineStore } from 'pinia';
import { taskRepository } from '@/repositories';
import { Task } from '@/types';

export const useTaskStore = defineStore('task-stores', () => {
  const taskList: Ref<Task[]> = ref([]);
  const isLoading: Ref<boolean> = ref(false);

  async function getTasks() {
    isLoading.value = true;

    try {
      taskList.value = await taskRepository.findAll();
    } catch (e) {
      console.log('Something went wrong', e);
    } finally {
      isLoading.value = false;
    }
  }

  async function setTask(task: Partial<Task>) {
    try {
      await taskRepository.create(task);

      getTasks();
    } catch (e) {
      console.log('Something went wrong', e);
    }
  }

  async function deleteTask(id: number) {
    try {
      await taskRepository.delete(id);

      getTasks();
    } catch (e) {
      console.log('Something went wrong', e);
    }
  }

  return {
    taskList,
    setTask,
    getTasks,
    deleteTask,
  };
});
