export interface CreateTaskRequest {
  title: string;
  description?: string;
  dueDate?: string;
  assignedUserId?: string;
}
