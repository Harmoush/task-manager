import { TaskStatus } from '../enums/task-status.enum';

export interface TaskItem {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  assignedUserId?: string;
  dueDate?: string;
  createdAt: string;
  updatedAt?: string;
  createdByUserId?: string;
}
