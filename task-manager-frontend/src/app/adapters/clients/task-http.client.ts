import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TaskItem } from '../../domain/models/task-item.model';
import { Observable } from 'rxjs';
import { TaskClient } from '../../application/tasks/task-client';
import { environment } from '../../../environments/environment';
import { PaginatedTasks } from '../../domain/dtos/paginated-tasks';
@Injectable({ providedIn: 'root' })
export class TaskHttpClient implements TaskClient {
  private apiUrl = `${environment.apiUrl}/tasks`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<PaginatedTasks> {
    return this.http.get<PaginatedTasks>(this.apiUrl);
  }

  create(task: Partial<TaskItem>): Observable<TaskItem> {
    return this.http.post<TaskItem>(this.apiUrl, task);
  }

  update(task: TaskItem): Observable<TaskItem> {
    return this.http.put<TaskItem>(`${this.apiUrl}/${task.id}`, task);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
