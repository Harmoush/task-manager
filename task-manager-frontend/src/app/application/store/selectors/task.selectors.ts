import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TaskState } from '../models/task.state';

export const selectTaskState = createFeatureSelector<TaskState>('tasks');

export const selectTasks = createSelector(selectTaskState, (state) => state.items);

export const selectTasksLoading = createSelector(selectTaskState, (state) => state.loading);

export const selectTasksError = createSelector(selectTaskState, (state) => state.error);

export const selectTaskById = (id: string) =>
  createSelector(selectTasks, (tasks) => tasks.find((t) => t.id === id));
