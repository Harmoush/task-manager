import { Component, OnInit, signal } from '@angular/core';
import { TaskItem } from '../../../domain/models/task-item.model';
import { TaskService } from '../../../application/tasks/task.service';
import { TaskCard } from './task-card/task-card';
import { tap } from 'rxjs';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.html',
  imports: [TaskCard],
})
export class TaskList implements OnInit {
  tasks = signal<TaskItem[]>([]);

  constructor(private taskService: TaskService) {}

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    this.taskService.getAll().subscribe({
      next: (response) => {
        console.log('Full response:', response); // log everything
        console.log('Tasks items:', response.items); // log the array
        this.tasks.set(response.items ?? []); // set only the array
      },
      error: (err) => {
        console.error('Error loading tasks:', err);
        this.tasks.set([]);
      },
    });
  }

  onDelete(id: string) {
    this.tasks.update((tasks) => tasks.filter((task) => task.id !== id));
  }
}
