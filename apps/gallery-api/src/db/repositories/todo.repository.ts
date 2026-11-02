import { eq, desc } from "drizzle-orm";
import { db } from "../config";
import { todos, Todo, InsertTodo, UpdateTodo } from "../schema";


type ToDoList = {
  records: Todo[]
}


export class TodoRepository {
  /**
   * Create a new todo
   */
  async create(todo: InsertTodo): Promise<Todo> {
    const [createdTodo] = await db.insert(todos).values(todo).returning();
    return createdTodo;
  }

  /**
   * Get all todos for a specific user 
   */
  async findAll(): Promise<ToDoList> {
    console.log("*** TodoRepository.findAll");
    return {
      records: await db.select().from(todos).orderBy(desc(todos.createdAt))
    }
  }

  /**
   * Get a todo by id
   */
  async findByID(id: number): Promise<Todo | undefined> {
    const [todo] = await db.select().from(todos).where(eq(todos.id, id));
    return todo;
  }

  /**
   * Update a todo
   */
  async update(id: number, data: UpdateTodo): Promise<Todo | undefined> {
    const [updatedTodo] = await db
      .update(todos)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(todos.id, id))
      .returning();
    return updatedTodo;
  }

  /**
   * Delete a todo
   */
  async delete(id: number): Promise<boolean> {
    const [deletedTodo] = await db.delete(todos).where(eq(todos.id, id)).returning();
    return !!deletedTodo;
  }

  /**
   * Toggle todo completion status
   */
  async toggleComplete(id: number): Promise<Todo | undefined> {
    const todo = await this.findByID(id);
    if (!todo) return undefined;
    
    return this.update(id, { completed: !todo.completed });
  }
}
