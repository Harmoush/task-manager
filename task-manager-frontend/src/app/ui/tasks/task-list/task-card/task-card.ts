import { DatePipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { TaskItem } from '../../../../domain/models/task-item.model';
import { TaskStatus } from '../../../../domain/enums/task-status.enum';
import { SlicePipe } from '@angular/common';

@Component({
  selector: 'app-task-card',
  imports: [DatePipe, SlicePipe],
  templateUrl: './task-card.html',
})
export class TaskCard {
  task = input.required<TaskItem>();
  deleted = output<string>();
  edited = output<string>();

  deleteTask(id: string) {
    this.deleted.emit(id);
  }
  editTask(id: string) {
    this.edited.emit(id);
  }
  get statusLabel() {
    switch (this.task().status) {
      case TaskStatus.New:
        return 'New';
      case TaskStatus.InProgress:
        return 'In Progress';
      case TaskStatus.Completed:
        return 'Done';
      case TaskStatus.Pending:
        return 'Pending';
      default:
        return 'Unknown';
    }
  }
}
