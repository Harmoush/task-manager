import { Component, effect, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TaskStatus } from '../../../domain/enums/task-status.enum';
import { TaskActions } from '../../../application/store/actions/task.actions';
import { selectTaskById } from '../../../application/store/selectors/task.selectors';

@Component({
  standalone: true,
  selector: 'task-edit',
  templateUrl: './task-edit.html',
  imports: [ReactiveFormsModule],
})
export class TaskEdit {
  [x: string]: any;
  private readonly store = inject(Store);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  TaskStatus = TaskStatus;

  readonly taskId = this.route.snapshot.paramMap.get('id')!;
  readonly task = this.store.selectSignal(selectTaskById(this.taskId));

  form = new FormGroup({
    title: new FormControl('', { nonNullable: true }),
    description: new FormControl<string | null>(null),
    dueDate: new FormControl<string | null>(null),
    status: new FormControl(TaskStatus.New, { nonNullable: true }),
  });

  constructor() {
    effect(() => {
      const t = this.task();
      if (!t) return;

      this.form.setValue({
        title: t.title,
        description: t.description ?? null,
        dueDate: this.toDateInputValue(t.dueDate) ?? null,
        status: t.status,
      });
    });
  }

  save() {
    if (this.form.invalid) return;

    const raw = this.form.getRawValue();

    this.store.dispatch(
      TaskActions.update({
        id: this.taskId,
        request: {
          title: raw.title,
          description: raw.description || undefined,
          dueDate: new Date(raw.dueDate!).toISOString() || undefined,
          status: raw.status,
        },
      })
    );

    this.router.navigate(['/tasks']);
  }

  private toDateInputValue(date: string | undefined): string | null {
    if (!date) return null;
    return date.split('T')[0]; // ✅ "2025-12-30"
  }
}
