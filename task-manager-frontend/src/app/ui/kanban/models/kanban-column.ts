import { TaskStatus } from '../../../domain/enums/task-status.enum';

export interface KanbanColumn {
  status: TaskStatus;
  title: string;
  color?: string;
}

export const KANBAN_COLUMNS: KanbanColumn[] = [
  { status: TaskStatus.New, title: 'To DO' },
  { status: TaskStatus.InProgress, title: 'In Progress' },
  { status: TaskStatus.OnHold, title: 'On Hold' },
  { status: TaskStatus.Completed, title: 'Done' },
];
