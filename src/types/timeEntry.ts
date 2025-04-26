export interface TimeEntry {
  id: number;
  taskId: number;
  name: string;
  startedAt: string;
  stoppedAt: string | null;
}
