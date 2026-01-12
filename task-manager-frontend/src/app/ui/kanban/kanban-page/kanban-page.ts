import { Component, computed, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  selectTasks,
  selectTasksLoading,
} from '../../../application/store/selectors/task.selectors';
import { KANBAN_COLUMNS } from '../models/kanban-column';
import { KanbanColumn } from '../kanban-column/kanban-column';
import { Router, RouterLink } from '@angular/router';
import { TaskActions } from '../../../application/store/actions/task.actions';
import { TaskStatus } from '../../../domain/enums/task-status.enum';

@Component({
  standalone: true,
  selector: 'app-kanban-page',
  templateUrl: './kanban-page.html',
  imports: [KanbanColumn, RouterLink],
})
export class KanbanPage implements OnInit {
  private store = inject(Store);
  private router = inject(Router);

  tasks = this.store.selectSignal(selectTasks);
  loading = this.store.selectSignal(selectTasksLoading);

  ngOnInit() {
    this.store.dispatch(TaskActions.load({}));
  }

  columns = KANBAN_COLUMNS;

  tasksByStatus = computed(() =>
    this.columns.map((col) => ({
      ...col,
      tasks: this.tasks().filter((t) => t.status === col.status),
    }))
  );

  onDelete(id: string) {
    this.store.dispatch(TaskActions.delete({ id }));
  }

  onEdited(id: string) {
    this.router.navigate(['/tasks/edit', id]);
  }

  onStatusChanged(event: { taskId: string; status: TaskStatus }) {
    console.log('Page DROP', event);
    this.store.dispatch(
      TaskActions.updateStatus({
        id: event.taskId,
        status: event.status,
      })
    );
  }
}
