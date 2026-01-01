import { InjectionToken } from '@angular/core';
import { TaskItem } from '../../domain/models/task-item.model';
import { Observable } from 'rxjs';

export interface TaskClient {
  getAll(): Observable<TaskItem[]>;
  create(task: Partial<TaskItem>): Observable<TaskItem>;
  update(task: TaskItem): Observable<TaskItem>;
  delete(id: string): Observable<void>;
}

export const TASK_CLIENT = new InjectionToken<TaskClient>('TASK_CLIENT');
