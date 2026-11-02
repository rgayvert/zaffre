import { Request, Response } from "express";
import { todoRepository, InsertTodo, UpdateTodo } from "../db";

export const TodoController = {
  /**
   * Get all todos
   */
  async getAllTodos(req: Request, res: Response) {
    try {
      console.log("*** getAllTodos");
      const todos = await todoRepository.findAll();
      return res.status(200).json(todos);
    } catch (error) {
      console.error("Error fetching todos:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  /**
   * Get a todo by ID
   */
  async getTodoByID(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      console.log("*** getTodoById: "+id);

      const todo = await todoRepository.findByID(id);
      if (!todo) {
        return res.status(404).json({ message: "Todo not found" });
      }
      return res.status(200).json(todo);
    } catch (error) {
      console.error("Error fetching todo:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  /**
   * Create a new todo
   */
  async createTodo(req: Request, res: Response) {
    try {
      const { content } = req.body;
      const todoData: InsertTodo = {
        content,
      };
      console.log("*** createTodo: "+JSON.stringify(todoData));

      const newTodo = await todoRepository.create(todoData);
      return res.status(201).json(newTodo);
    } catch (error) {
      console.error("Error creating todo:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  /**
   * Update a todo
   */
  async updateTodo(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      console.log("*** updateTodo: "+JSON.stringify(req.body));

      const todo = await todoRepository.findByID(id);
      if (!todo) {
        console.log("*** updateTodo: not found: "+id);
        return res.status(404).json({ message: "Todo not found" });
      }

      const { content, completed } = req.body;
      const updateData: UpdateTodo = {
        updatedAt: new Date()
      };

      if (content !== undefined) updateData.content = content;
      if (completed !== undefined) updateData.completed = completed;

      const updatedTodo = await todoRepository.update(id, updateData);
      return res.status(200).json(updatedTodo);
    } catch (error) {
      console.error("Error updating todo:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  /**
   * Delete a todo
   */
  async deleteTodo(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      console.log("*** deleteTodo: "+id);
      const todo = await todoRepository.findByID(id);

      if (!todo) {
        return res.status(404).json({ message: "Todo not found" });
      }
      await todoRepository.delete(id);
      return res.status(204).send();
    } catch (error) {
      console.error("Error deleting todo:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  /**
   * Toggle todo completion status
   */
  async toggleTodoComplete(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      console.log("*** toggleTodoComplete: "+id);
      const todo = await todoRepository.findByID(id);
      if (!todo) {
        return res.status(404).json({ message: "Todo not found" });
      }

      const updatedTodo = await todoRepository.toggleComplete(id);
      return res.status(200).json(updatedTodo);
    } catch (error) {
      console.error("Error toggling todo completion:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },
};
