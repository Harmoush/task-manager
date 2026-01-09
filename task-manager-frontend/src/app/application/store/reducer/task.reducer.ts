import { createReducer, on } from '@ngrx/store';
import { initialTaskState } from '../models/task.state';
import { TaskActions } from '../actions/task.actions';

export const taskReducer = createReducer(
  initialTaskState,

  on(TaskActions.load, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(TaskActions.loadSuccess, (state, { tasks }) => ({
    ...state,
    loading: false,
    items: tasks,
  })),

  on(TaskActions.loadFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(TaskActions.create, (state) => ({ ...state, loading: true, error: null })),

  on(TaskActions.createSuccess, (state, { task }) => ({
    ...state,
    loading: false,
    items: [task, ...state.items],
  })),

  on(TaskActions.createFailure, (state, { error }) => ({ ...state, loading: false, error })),

  on(TaskActions.update, (state) => ({ ...state, loading: true, error: null })),

  on(TaskActions.updateSuccess, (state, { changes }) => ({
    ...state,
    items: state.items.map((t) => (t.id === changes.id ? changes : t)),
  })),

  on(TaskActions.updateFailure, (state, { error }) => ({ ...state, loading: false, error })),

  on(TaskActions.delete, (state) => ({ ...state, loading: true, error: null })),

  on(TaskActions.deleteSuccess, (state, { id }) => ({
    ...state,
    loading: false,
    items: state.items.filter((t) => t.id !== id),
  })),

  on(TaskActions.deleteFailure, (state, { error }) => ({ ...state, loading: false, error }))
);
