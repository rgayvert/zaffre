import { App, AppContext, AppOptions } from "zaffre";
import { ToDo } from ":todo";
 
const todoOptions: AppOptions = {
  googleFonts: ["Roboto Serif", "Material+Symbols+Outlined", "Material+Icons"],
};

export class ToDoApp extends App {
  constructor(context = AppContext.Web) {
    super(context, todoOptions);
    this.startWith(() => ToDo(), context);
  } 
} 