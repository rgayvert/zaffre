import { sql } from "drizzle-orm";
import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

export const todos = sqliteTable("todos", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  content: text("content", { length: 255 }).notNull(), 
  completed: integer("completed", { mode: "boolean"}).default(false),
  createdAt: integer("created_at", { mode: "timestamp"}).notNull().default(sql`(strftime('%s', 'now'))`),
  updatedAt: integer("updated_at", { mode: "timestamp"}).notNull().default(sql`(strftime('%s', 'now'))`),
  deletedAt: integer("deleted_at", { mode: "timestamp"}),
});


export type Todo = typeof todos.$inferSelect;
export type InsertTodo = typeof todos.$inferInsert;
export type UpdateTodo = Partial<InsertTodo>;
