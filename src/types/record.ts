export interface Record {
  recordId: number;
  taskId: number;
  createdAt: string;
  name: string;
  duration?: number; // in seconds
}
