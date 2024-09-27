import { toggleAtom, transitions } from "zaffre";

export class TransitionModel1 {
  // map of standard in&out transitions
  effects = new Map([
    ["Fade", transitions.fadeIn("in&out")],
    ["Grow", transitions.grow("in&out")],
    ["Slide", transitions.slide("in&out", "left")],
    ["Collapse", transitions.collapse("in&out")],
    ["Pop", transitions.pop("in&out")],
  ]);
  simpleTransitionNames = ["Fade", "Grow", "Slide", "Collapse"];

  effectsHidden = toggleAtom(true);
  toggleHidden(): void {
    this.effectsHidden.toggleAsync();
  }
}
