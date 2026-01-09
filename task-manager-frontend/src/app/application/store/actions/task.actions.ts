import { createActionGroup, props } from '@ngrx/store';
import { TaskItem } from '../../../domain/models/task-item.model';
import { CreateTaskRequest } from '../../../domain/dtos/create-task-request';
import { UpdateTaskRequest } from '../../../domain/dtos/update-task-request';

export const TaskActions = createActionGroup({
  source: 'Tasks',
  events: {
    Load: props<{ page?: number }>(),
    'Load Success': props<{ tasks: TaskItem[] }>(),
    'Load Failure': props<{ error: string }>(),

    Create: props<{ request: CreateTaskRequest }>(),
    'Create Success': props<{ task: TaskItem }>(),
    'Create Failure': props<{ error: string }>(),

    Delete: props<{ id: string }>(),
    'Delete Success': props<{ id: string }>(),
    'Delete Failure': props<{ error: string }>(),

    Update: props<{ id: string; request: UpdateTaskRequest }>(),
    'Update Success': props<{ changes: TaskItem }>(),
    'Update Failure': props<{ error: string }>(),
  },
});
