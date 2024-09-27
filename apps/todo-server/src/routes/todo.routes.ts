import { Express } from "express";
import { ToDoDB } from "../models";

export function initToDoRoutes(app: Express, db: ToDoDB): void {
  console.log("initToDoRoutes: app="+app+", db="+db);
  // getAll()
  app.post("/todo-api/all", async (req, res) => {
    console.log("get: getAll");
    const todos = await db.todo.findAll();
    res.json(todos);
  });
  // get(id)
  app.get("/todo-api/:id", async (req, res) => {
    console.log("get: get");
    const todo = await db.todo.findByPk(req.params.id);
    res.json(todo);
  });
  // create(record)
  app.post("/todo-api", async (req, res) => {
    console.log("post: create");
    const todo = await db.todo.create(req.body);
    res.json(todo);
  });
  // update(record)
  app.put("/todo-api/:id", async (req, res) => {
    console.log("put: update");
    const todo = await db.todo.findByPk(req.params.id);
    if (todo) {
      await todo.update(req.body);
      res.json(todo);
    } else {
      res.status(404).json({ message: "ToDo not found" });
    }
  });
  // delete(id)
  app.delete("/todo-api/:id", async (req, res) => {
    console.log("delete: delete");
    const todo = await db.todo.findByPk(req.params.id);
    if (todo) {
      await todo.destroy();
      res.json({ message: "ToDo deleted" });
    } else {
      res.status(404).json({ message: "ToDo not found" });
    }
  });
}
