import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { selectTasksLoading } from '../../../application/store/selectors/task.selectors';
import { TaskActions } from '../../../application/store/actions/task.actions';

@Component({
  standalone: true,
  selector: 'app-task-create',
  imports: [ReactiveFormsModule],
  templateUrl: './task-create.html',
})
export class TaskCreate {
  private store = inject(Store);
  private router = inject(Router);

  loading = this.store.selectSignal(selectTasksLoading);

  form = new FormGroup({
    title: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    description: new FormControl(''),
    dueDate: new FormControl(''),
  });

  submit() {
    if (this.form.invalid) return;

    const raw = this.form.getRawValue();

    this.store.dispatch(
      TaskActions.create({
        request: {
          title: raw.title,
          description: raw.description || undefined,
          dueDate: raw.dueDate || undefined,
        },
      })
    );

    this.router.navigate(['/tasks']);
  }
}
