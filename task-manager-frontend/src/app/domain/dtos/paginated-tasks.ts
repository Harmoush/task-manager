import { TaskItem } from '../models/task-item.model';

export interface PaginatedTasks {
  items: TaskItem[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}
