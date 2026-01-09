import { Component, inject, OnInit, signal } from '@angular/core';
import { TaskService } from '../../../application/tasks/task.service';
import { TaskCard } from './task-card/task-card';
import { Store } from '@ngrx/store';
import { Router, RouterLink } from '@angular/router';
import {
  selectTasks,
  selectTasksLoading,
} from '../../../application/store/selectors/task.selectors';
import { TaskActions } from '../../../application/store/actions/task.actions';

@Component({
  standalone: true,
  selector: 'app-task-list',
  templateUrl: './task-list.html',
  imports: [TaskCard, RouterLink],
})
export class TaskList implements OnInit {
  private store = inject(Store);
  private router = inject(Router);

  tasks = this.store.selectSignal(selectTasks);
  loading = this.store.selectSignal(selectTasksLoading);

  constructor(private taskService: TaskService) {}

  ngOnInit() {
    this.store.dispatch(TaskActions.load({}));
  }

  onDelete(id: string) {
    this.store.dispatch(TaskActions.delete({ id }));
  }

  onEdited(id: string) {
    this.router.navigate(['/tasks/edit', id]);
  }
}
