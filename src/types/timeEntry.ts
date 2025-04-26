export interface TimeEntry {
  id: number;
  taskId: number;
  createdAt: string;
  name: string;
  duration?: number; // in seconds
}
