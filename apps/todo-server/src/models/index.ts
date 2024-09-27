import { Sequelize } from "sequelize";
import { initToDo, ToDo } from "./todo.model";

export interface ToDoDB {
  sequelize: Sequelize;
  todo: typeof ToDo;
}
export function initSequelize(): ToDoDB {
  const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "./todo.db",
  });

  const db: ToDoDB = {
    sequelize: sequelize,
    todo: initToDo(sequelize),
  };

  sequelize.sync();
  return db;
}
