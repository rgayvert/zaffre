import { TodoController } from "../controllers";
import { Express } from "express";

export const initToDoRoutes = (app: Express, base: string) => {
  app.get(`${base}`, TodoController.getAllTodos);

  // Get a specific todo by ID
  app.get(`${base}/:id`, TodoController.getTodoByID);

  // Create a new todo
  app.post(`${base}/`, TodoController.createTodo);

  // Update a todo 
  app.put(`${base}/:id`, TodoController.updateTodo);

  // Delete a todo
  app.delete(`${base}/:id`, TodoController.deleteTodo);

  // Toggle todo completion status
  app.patch(`${base}/:id/toggle`, TodoController.toggleTodoComplete);
}
