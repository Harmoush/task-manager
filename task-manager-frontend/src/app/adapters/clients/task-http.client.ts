import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TaskItem } from '../../domain/models/task-item.model';
import { Observable } from 'rxjs';
import { TaskClient } from '../../application/tasks/task-client';
import { environment } from '../../../environments/environment';
import { PaginatedTasks } from '../../domain/dtos/paginated-tasks';
import { UpdateTaskRequest } from '../../domain/dtos/update-task-request';
@Injectable({ providedIn: 'root' })
export class TaskHttpClient implements TaskClient {
  private apiUrl = `${environment.apiUrl}/tasks`;

  constructor(private http: HttpClient) {}

  getAll(params: {
    page: number;
    pageSize: number;
    search?: string;
    sortBy?: string;
    ascending?: boolean;
  }): Observable<PaginatedTasks> {
    return this.http.get<PaginatedTasks>(this.apiUrl, { params: params });
  }

  create(task: Partial<TaskItem>): Observable<TaskItem> {
    return this.http.post<TaskItem>(this.apiUrl, task);
  }

  update(id: string, request: Partial<UpdateTaskRequest>): Observable<TaskItem> {
    return this.http.put<TaskItem>(`${this.apiUrl}/${id}`, request);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
