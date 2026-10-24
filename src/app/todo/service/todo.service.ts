import { Injectable, computed, inject, signal } from '@angular/core';   
import { Todo, TodoStatus } from '../model/todo';                        
import { LoggerService } from '../../services/logger.service';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private loggerService = inject(LoggerService);


  #nextId = 1;
  #todos = signal<Todo[]>([]);

 
  readonly todos = this.#todos.asReadonly();

  readonly waitingTodos = this.#todosByStatus('pending');
  readonly inProgressTodos = this.#todosByStatus('in-progress');
  readonly doneTodos = this.#todosByStatus('completed');

 

  /**
   * Ajoute un todo, toujours avec le statut 'pending'
   *
   * @param name: string
   * @param content: string
   */
  addTodo(name: string, content: string): void {
    const todo: Todo = { id: this.#nextId++, name, content, status: 'pending' };
    this.#todos.update((todos) => [...todos, todo]);
  }

  /**
   * Change le statut d'un todo, ce qui le fait passer dans une autre liste
   *
   * @param id: number
   * @param status: TodoStatus
   */
  updateStatus(id: number, status: TodoStatus): void {
    this.#todos.update((todos) =>
      todos.map((todo) => (todo.id === id ? { ...todo, status } : todo))
    );
  }

  /**
   * Supprime un todo par son id
   *
   * @param id: number
   */
  deleteTodo(id: number): void {
    this.#todos.update((todos) => todos.filter((todo) => todo.id !== id));
  }

  /**
   * Logger la liste des todos
   */
  logTodos() {
    this.loggerService.logger(this.#todos()); 
  }


  #todosByStatus(status: TodoStatus) {
    return computed(() => this.#todos().filter((todo) => todo.status === status));
  }
}
