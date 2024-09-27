import { App, AppContext, zget, zstring } from "zaffre";
import { SolitaireGame } from ":cards";

export class SolitaireApp extends App {
  public resolveResource(name: zstring): string {
    const [type, fileName] = zget(name).split(".");
    return type === "playing_card" ? `${this.assetBase()}/${type}/${fileName}.png` : super.resolveResource(name);
  }
  constructor(context = AppContext.Web) {
    super(context);
    this.startWith(() => SolitaireGame(), context);
  }
}
