import { atom, transitions } from "zaffre";

export class TransitionModel2 {
  effects = new Map([
    ["Fade", transitions.fadeIn("in&out")],
    ["Grow", transitions.grow("in&out")],
    ["Slide", transitions.slide("in&out", "left")],
    ["Collapse", transitions.collapse("in&out")],
    ["Pop", transitions.pop("in&out")],
  ]);
  textTransitionNames = ["Fade", "Grow", "Slide", "Collapse"];

  textLabel = atom("Old text");
  toggleText(): void {
    this.textLabel.set(
      this.textLabel.get().startsWith("Old") ? "New text" : "Old text"
    );
  }
}
