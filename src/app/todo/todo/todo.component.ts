import { Component, ChangeDetectionStrategy, Signal, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Todo, TodoStatus } from '../model/todo';
import { TodoService } from '../service/todo.service';

interface TodoColumn {
  title: string;
  status: TodoStatus;
  color: string;
  todos: Signal<Todo[]>;
}

@Component({
    selector: 'app-todo',
    templateUrl: './todo.component.html',
    styleUrls: ['./todo.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [FormsModule]
})
export class TodoComponent {
  private todoService = inject(TodoService);

  name = signal('');
  content = signal('');
  canAdd = computed(() => !!this.name().trim() && !!this.content().trim());

  readonly columns: TodoColumn[] = [
    { title: 'Waiting', status: 'pending', color: 'secondary', todos: this.todoService.waitingTodos },
    { title: 'In Progress Todos', status: 'in-progress', color: 'warning', todos: this.todoService.inProgressTodos },
    { title: 'Done Todos', status: 'completed', color: 'success', todos: this.todoService.doneTodos },
  ];

  addTodo() {
    this.todoService.addTodo(this.name(), this.content());
    this.name.set('');
    this.content.set('');
  }

  updateStatus(todo: Todo, status: TodoStatus) {
    this.todoService.updateStatus(todo.id, status);
  }

  deleteTodo(todo: Todo) {
    this.todoService.deleteTodo(todo.id);
  }
}
