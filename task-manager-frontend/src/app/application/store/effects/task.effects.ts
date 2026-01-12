import { inject, Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, mergeMap, of, switchMap } from 'rxjs';
import { TASK_CLIENT } from '../../tasks/task-client';
import { TaskActions } from '../actions/task.actions';
import { TaskService } from '../../tasks/task.service';

@Injectable()
export class TaskEffects {
  private actions$ = inject(Actions);
  private taskService = inject(TaskService);

  loadTasks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.load),
      exhaustMap(({ page, pageSize, search, sortBy, ascending }) =>
        this.taskService.getAll(page, pageSize, search, sortBy, ascending).pipe(
          map((tasksPage) =>
            TaskActions.loadSuccess({ tasks: tasksPage.items, totalCount: tasksPage.totalCount })
          ),
          catchError((error) => of(TaskActions.loadFailure({ error })))
        )
      )
    )
  );

  createTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.create),
      mergeMap(({ request }) =>
        this.taskService.create(request).pipe(
          map((created) => TaskActions.createSuccess({ task: created })),
          catchError((error) => of(TaskActions.createFailure({ error })))
        )
      )
    )
  );

  updateTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.update),
      switchMap(({ id, request }) =>
        this.taskService.update(id, request).pipe(
          map((changes) => TaskActions.updateSuccess({ changes })),
          catchError((error) => of(TaskActions.updateFailure({ error })))
        )
      )
    )
  );

  deleteTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.delete),
      mergeMap(({ id }) =>
        this.taskService.delete(id).pipe(
          map(() => TaskActions.deleteSuccess({ id })),
          catchError((error) => of(TaskActions.deleteFailure({ error })))
        )
      )
    )
  );

  updateStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.updateStatus),
      switchMap(({ id, status }) =>
        this.taskService.update(id, { status }).pipe(
          map((changes) => TaskActions.updateSuccess({ changes })),
          catchError((error) => of(TaskActions.updateFailure({ error })))
        )
      )
    )
  );
}
