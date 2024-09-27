import { atom, transitions } from "zaffre";

export class HoverTransitionsModel {
  // map of some transitions using standard effects with fixed colors
  effects = new Map([
    ["Simple Cover", transitions.pullDownOverlay("in&out", "#44000000", "#44000025", 0.0, 0, "forwards")],
    ["Pull Down", transitions.pullDownOverlay("in&out", "#44000000", "#44000025", 0.3, 0, "forwards")],
    ["Grow Out", transitions.growOutOverlay("in&out", "#44000000", "#44000025", 0.3, 0, "forwards")],
    ["Grow Diagonal", transitions.diagonalOverlay("in&out", "#44000000", "#44000025", 0.3, 0, "forwards")],
    ]);
    
  effectNames = [...this.effects.keys()];
  selectedEffectName = atom("Simple Cover");
}