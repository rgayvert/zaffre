import { App, AppContext } from "zaffre";
import { Hello } from "./HelloView";

export class HelloApp extends App {
  constructor(context = AppContext.Web) {
    super(context);
    this.startWith(() => Hello(), context);
  }
}
