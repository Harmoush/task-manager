import { Component, inject, input, output } from '@angular/core';
import { TaskItem } from '../../../domain/models/task-item.model';
import { TaskCard } from '../../shared/task-card/task-card';
import { TaskStatus } from '../../../domain/enums/task-status.enum';
import { CdkDragDrop, CdkDropList, CdkDrag } from '@angular/cdk/drag-drop';
import { KANBAN_COLUMNS } from '../models/kanban-column';
@Component({
  standalone: true,
  selector: 'app-kanban-column',
  templateUrl: './kanban-column.html',
  imports: [TaskCard, CdkDropList, CdkDrag],
})
export class KanbanColumn {
  title = input.required<string>();
  status = input.required<TaskStatus>();
  tasks = input.required<TaskItem[]>();

  connectedTo = KANBAN_COLUMNS.map((c) => c.status);

  deleted = output<string>();
  edited = output<string>();
  statusChanged = output<{ taskId: string; status: TaskStatus }>();

  deleteTask(id: string) {
    this.deleted.emit(id);
  }

  editTask(id: string) {
    this.edited.emit(id);
  }

  onDrop(event: CdkDragDrop<TaskItem[]>) {
    console.log('Column DROP', event);
    debugger;
    const task = event.item.data as TaskItem;

    const targetStatus = this.status();

    if (!targetStatus) return;

    if (task.status === targetStatus) {
      return; // no-op
    }

    this.statusChanged.emit({
      taskId: task.id,
      status: this.status()!,
    });
  }
}
