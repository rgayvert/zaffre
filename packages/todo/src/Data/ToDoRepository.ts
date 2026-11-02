import { Repository, NoOpResponseFn, LocalDataRepository, FetchRepository } from "zaffre";
import { ToDoItem } from "./ToDoItem";


export interface ToDoItemRepository extends Repository<ToDoItem> {
   toggleComplete(todo: ToDoItem): Promise<boolean | null>;
} 

export class LocalDataToDoItemRepository extends LocalDataRepository<ToDoItem> implements ToDoItemRepository  {
  async toggleComplete(todo: ToDoItem) {
    todo.completed = !todo.completed;
    this.save(todo);
    return true;
  }
}

export class FetchToDoItemRepository extends FetchRepository<ToDoItem> implements ToDoItemRepository {
  async toggleComplete(todo: ToDoItem) {
    return this.sendPatchRequest(`${this.baseURL}/${todo.id}/toggle`, "", NoOpResponseFn);
  }
}

export interface ToDoDB {
  items: ToDoItemRepository;
}
