import { Component, effect, inject, signal } from '@angular/core';
import { MatPaginatorIntl, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { Store } from '@ngrx/store';
import { Router, RouterLink } from '@angular/router';
import {
  selectTasks,
  selectTasksLoading,
  selectTasksTotalCount,
} from '../../../application/store/selectors/task.selectors';
import { TaskActions } from '../../../application/store/actions/task.actions';
import { CommonModule, DatePipe } from '@angular/common';
import { TaskItem } from '../../../domain/models/task-item.model';
import { TaskService } from '../../../application/tasks/task.service';
import { PaginatedTasks } from '../../../domain/dtos/paginated-tasks';
import { MatButtonModule } from '@angular/material/button';

@Component({
  standalone: true,
  selector: 'app-task-list',
  templateUrl: './task-list.html',
  imports: [
    RouterLink,
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
  ],
})
export class TaskList {
  private store = inject(Store);
  private router = inject(Router);

  // signals
  tasks = this.store.selectSignal(selectTasks);
  totalCount = this.store.selectSignal(selectTasksTotalCount);
  pageNumber = signal(1);
  pageSize = signal(10);
  sortField = signal<string | null>(null);
  sortDirection = signal<'asc' | 'desc'>('asc');
  filter = signal('');

  displayedColumns: string[] = ['title', 'description', 'status', 'actions'];

  constructor() {
    this.loadTasks();
  }

  loadTasks() {
    this.store.dispatch(
      TaskActions.load({
        page: this.pageNumber(),
        pageSize: this.pageSize(),
        sortBy: this.sortField()!,
        ascending: this.sortDirection() === 'asc',
        search: this.filter(),
      })
    );
  }

  onPageChange(event: PageEvent) {
    this.pageNumber.set(event.pageIndex + 1);
    this.pageSize.set(event.pageSize);
    this.loadTasks();
  }

  onSortChange(sort: Sort) {
    if (!sort.active) return;

    this.sortField.set(sort.active);
    this.sortDirection.set(sort.direction || 'asc');
    this.loadTasks();
  }

  onFilterChange(search: string) {
    this.filter.set(search);
    this.pageNumber.set(1); // reset page when filtering
    this.loadTasks();
  }

  onDelete(id: string) {
    this.store.dispatch(TaskActions.delete({ id }));
  }

  onEdited(id: string) {
    this.router.navigate(['/tasks/edit', id]);
  }

  // private store = inject(Store);
  // private router = inject(Router);

  // math = Math;

  // tasks = this.store.selectSignal(selectTasks);
  // loading = this.store.selectSignal(selectTasksLoading);

  // page = signal(1);
  // pageSize = signal(10);
  // totalCount = signal(0);

  // constructor() {
  //   effect(() => {
  //     this.store.dispatch(
  //       TaskActions.load({
  //         page: this.page(),
  //         pageSize: this.pageSize(),
  //       })
  //     );
  //   });
  // }

  // onDelete(id: string) {
  //   this.store.dispatch(TaskActions.delete({ id }));
  // }

  // onEdited(id: string) {
  //   this.router.navigate(['/tasks/edit', id]);
  // }

  // nextPage() {
  //   const maxPage = Math.ceil(this.totalCount() / this.pageSize());
  //   if (this.page() < maxPage) this.page.update((p) => p + 1);
  // }

  // prevPage() {
  //   if (this.page() > 1) this.page.update((p) => p - 1);
  // }
}
