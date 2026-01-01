import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TaskItem } from '../../domain/models/task-item.model';
import { Observable } from 'rxjs';
import { TaskClient } from '../../application/tasks/task-client';

@Injectable({ providedIn: 'root' })
export class TaskHttpClient implements TaskClient {
  private apiUrl = 'https://localhost:5287/api/tasks';

  constructor(private http: HttpClient) {}

  getAll(): Observable<TaskItem[]> {
    return this.http.get<TaskItem[]>(this.apiUrl, {
      headers: { 'x-api-version': '1.0' },
    });
  }

  create(task: Partial<TaskItem>): Observable<TaskItem> {
    return this.http.post<TaskItem>(this.apiUrl, task, {
      headers: { 'x-api-version': '1.0' },
    });
  }

  update(task: TaskItem): Observable<TaskItem> {
    return this.http.put<TaskItem>(`${this.apiUrl}/${task.id}`, task, {
      headers: { 'x-api-version': '1.0' },
    });
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: { 'x-api-version': '1.0' },
    });
  }
}
