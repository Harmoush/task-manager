import { InjectionToken } from '@angular/core';
import { TaskItem } from '../../domain/models/task-item.model';
import { Observable } from 'rxjs';
import { PaginatedTasks } from '../../domain/dtos/paginated-tasks';
import { UpdateTaskRequest } from '../../domain/dtos/update-task-request';

export interface TaskClient {
  getAll(params: {
    page: number;
    pageSize: number;
    search?: string;
    sortBy?: string;
    ascending?: boolean;
  }): Observable<PaginatedTasks>;
  create(task: Partial<TaskItem>): Observable<TaskItem>;
  update(id: string, request: Partial<UpdateTaskRequest>): Observable<TaskItem>;
  delete(id: string): Observable<void>;
}

export const TASK_CLIENT = new InjectionToken<TaskClient>('TASK_CLIENT');
