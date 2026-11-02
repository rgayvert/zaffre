import { HStack, Button, TextInput, StackOptions, addClass } from "zaffre";
import { ToDoModel } from "../Model";

export interface ToDoInputRowOptions extends StackOptions {}

export const ToDoInputRow = (model: ToDoModel, inOptions: ToDoInputRowOptions = {}) => {
  const options = addClass(inOptions, "ToDoInputRow", );
  return HStack(options).append(Button(), TextInput(model.newText));
};
