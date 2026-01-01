import { Component, OnInit, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { TaskItem } from '../../../domain/models/task-item.model';
import { TaskService } from '../../../application/tasks/task.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.html',
  imports: [DatePipe],
})
export class TaskList implements OnInit {
  tasks = signal<TaskItem[]>([]);

  constructor(private taskService: TaskService) {}

  ngOnInit() {
    this.loadTasks();
  }
  loadTasks() {
    this.taskService.getAll().subscribe((tasks) => {
      this.tasks.set(tasks);
    });
  }
}
