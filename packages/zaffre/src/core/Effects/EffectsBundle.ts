import { Effect } from "./Effect";

//
// Effects associated with interaction states
//
export interface InteractionEffectsBundle {
  enabled?: Effect;
  disabled?: Effect;
  hovered?: Effect;
  focused?: Effect;
  pressed?: Effect;
  clicked?: Effect;
}

//
// Effects that can be specified for a View
//
export interface EffectsBundle extends InteractionEffectsBundle {
  mounted?: Effect;
  hidden?: Effect;
  selected?: Effect;
  contentChanged?: Effect;
  dragged?: Effect;
  draggedOver?: Effect;
}
