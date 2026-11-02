import { App, AppContext, zget, zstring } from "zaffre";
import { SolitaireGame } from ":cards";

export class SolitaireApp extends App {

  constructor(context = AppContext.Web) {
    super(context);
    this.startWith(() => SolitaireGame(), context);
  }
  createResourceMap() {
    const map = super.createResourceMap();
    const pat = /playing_card.(.*)/;
    map.addPattern(pat, (match) => `${this.resourceURL}/playing_cards/${match}.png`);
    return map;
  }
}
