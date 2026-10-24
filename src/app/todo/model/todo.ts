export type TodoStatus = 'pending' | 'in-progress' | 'completed';

export interface Todo{
  id: number;
  name:string;
  content:string;
  status: TodoStatus;
}