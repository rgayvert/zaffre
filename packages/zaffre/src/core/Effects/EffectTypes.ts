
//
// Names for the various effect types
//

export const InteractionStateValues = ["disabled", "enabled", "hovered", "focused", "pressed", "clicked", "dragged", "draggedOver"] as const;

export type InteractionState = (typeof InteractionStateValues)[number];

export const EffectTypeValues = [...InteractionStateValues, "mounted", "hidden", "content", "selected"];
export type EffectType = (typeof EffectTypeValues)[number];

export function isInteractionState(s: string): s is InteractionState {
    return InteractionStateValues.includes(s as InteractionState);
}
export function isEffectType(s: string): s is EffectType {
    return EffectTypeValues.includes(s);
}

