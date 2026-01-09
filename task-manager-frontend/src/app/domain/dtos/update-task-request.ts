import { TaskStatus } from '../enums/task-status.enum';

export interface UpdateTaskRequest {
  title: string;
  description?: string;
  dueDate?: string | null;
  status: TaskStatus;
}
