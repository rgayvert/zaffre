import { TEntity, TEntityList } from "zaffre";

export enum RecordFilter {
  All = "All",
  Active = "Active",
  Completed = "Completed",
}

export interface ToDoItem {
  content: string;
  completed: boolean; 
}

export class ToDoItem extends TEntity {
  constructor(data?: Partial<ToDoItem>) {
    super(data);
  }
  defaultValues(): Partial<ToDoItem> {
    return {
      content: "",
      completed: false,
    };
  }
  toString(): string {
    return `ToDoitem[${this.id}]`;
  }
}

export type ToDoItemList = TEntityList<ToDoItem>;

