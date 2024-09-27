import { Sequelize, Model, DataTypes } from "sequelize";

export class ToDo extends Model {}

export function initToDo(sequelize: Sequelize): typeof ToDo {
  return ToDo.init(
    {
      recordID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      content: DataTypes.STRING,
      completed: DataTypes.BOOLEAN,
    },
    { sequelize, modelName: "todo" }
  );
}
