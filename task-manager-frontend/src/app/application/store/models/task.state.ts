import { TaskItem } from '../../../domain/models/task-item.model';

export interface TaskState {
  items: TaskItem[];
  loading: boolean;
  error: string | null;
  totalCount: number;
}

export const initialTaskState: TaskState = {
  items: [],
  loading: false,
  error: null,
  totalCount: 0,
};
