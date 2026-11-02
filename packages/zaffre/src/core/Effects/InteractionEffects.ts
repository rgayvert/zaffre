import { FilterToken, css, css_color, dropShadowFilter, px } from "../Attributes";
import { AttributeEffect } from "./AttributeEffect";
import { EffectsBundle } from "./EffectsBundle";

//
// Standard effects to apply for different interaction states of a View.
//

export const dropShadowForElevation = (elevation = 0): FilterToken | undefined => {
  const shadow =
    elevation === 1
      ? { color: css("var(--color-primary)"), offsetX: px(2), offsetY: px(2), stdDev: px(2) }
      : elevation === 3
        ? { color: css("var(--color-primary)"), offsetX: px(3), offsetY: px(3), stdDev: px(3) }
        : elevation === 5
          ? { color: css("var(--color-primary)"), offsetX: px(5), offsetY: px(5), stdDev: px(4) }
          : undefined;
  return shadow ? dropShadowFilter(shadow.color, shadow.offsetX, shadow.offsetY, shadow.stdDev) : undefined;
};

export const textInteractionEffect = (name: string, opacity: number): AttributeEffect => {
  const attrs = {
    opacity: opacity,
    background: "var(--color-transparent)",
  };
  return new AttributeEffect(attrs, "in&out", { name: name, useOverlay: true });
}

export const interactionEffect = (name: string, elevation: number, opacity: number): AttributeEffect => {
  const attrs = {
    filter: dropShadowForElevation(elevation),
    opacity: opacity,
    background: name === "enabled" ? "var(--color-transparent)" : "var(--color-primary)",
  };
  return new AttributeEffect(attrs, "in&out", { name: name, useOverlay: true });
};

export const simpleInteractionEffect = (name: string, brightness: number, opacity: number): AttributeEffect => {
  const attrs = {
    filter: opacity === 0 ? "" : `brightness(${brightness || "100%"})`,
    opacity: opacity,
    background: name === "enabled" ? "var(--color-transparent)" : "var(--color-primary)",
  };
  return new AttributeEffect(attrs, "in&out", { name: name, useOverlay: true });
};
export const svgInteractionEffect = (name: string, elevation: number, opacity: number): AttributeEffect => {
  const attrs = {
    filter: dropShadowForElevation(elevation),
    opacity: opacity,
  };
  return new AttributeEffect(attrs, "in&out", { name: name });
};

// elevation + opacity on overlay
export const standardHTMLInteractionEffects = (): EffectsBundle => {
  return {
    enabled: interactionEffect("enabled", 0, 1.0),
    disabled: interactionEffect("disabled", 0, 0.1),
    hovered: interactionEffect("hovered", 5, 0.2),
    focused: interactionEffect("focused", 1, 0.25),
    pressed: interactionEffect("pressed", 1, 0.3),
    clicked: interactionEffect("clicked", 1, 0.2),
  };
};

// elevation + opacity on view
export const standardSVGInteractionEffects = (): EffectsBundle => {
  return {
    enabled: svgInteractionEffect("enabled", 0, 1.0),
    disabled: svgInteractionEffect("disabled", 0, 0.62),
    hovered: svgInteractionEffect("hovered", 5, 0.84),
    focused: svgInteractionEffect("focused", 1, 0.88),
    pressed: svgInteractionEffect("pressed", 1, 0.78),
    clicked: svgInteractionEffect("clicked", 1, 0.84),
  };
};

// brightness + opacity + background-color on overlay
export const simpleInteractionEffects = (): EffectsBundle => {
  return {
    enabled: simpleInteractionEffect("enabled", 0, 1.0),
    disabled: simpleInteractionEffect("disabled", 0, 0.5),
    hovered: simpleInteractionEffect("hovered", 0.2, 0.2),
    focused: simpleInteractionEffect("focused", 0.1, 0.25),
    moved: interactionEffect("hovered", 5, 0.2),
    pressed: simpleInteractionEffect("pressed", 0.1, 0.3),
    clicked: simpleInteractionEffect("clicked", 0.1, 0.2),
  };
};

export const attributeEffect = (name: string, color: css_color, opacity: number): AttributeEffect => {
  const attrs = {
    //filter: dropShadowForElevation(elevation),
    color: color,
    opacity: opacity,
  };
  return new AttributeEffect(attrs, "in&out", { useOverlay: false });
};

