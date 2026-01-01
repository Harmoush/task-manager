import { Injectable, Inject } from '@angular/core';
import { TASK_CLIENT, TaskClient } from './task-client';
import { TaskItem } from '../../domain/models/task-item.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TaskService {
  constructor(@Inject(TASK_CLIENT) private taskRepo: TaskClient) {}

  getAll(): Observable<TaskItem[]> {
    return this.taskRepo.getAll();
  }

  create(task: Partial<TaskItem>): Observable<TaskItem> {
    // Place for business validation before passing to adapter
    return this.taskRepo.create(task);
  }

  update(task: TaskItem): Observable<TaskItem> {
    return this.taskRepo.update(task);
  }

  delete(id: string): Observable<void> {
    return this.taskRepo.delete(id);
  }
}
