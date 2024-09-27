import { zget, zboolean, atom } from ":foundation";
import { ch, View, addOptionEvents, standardHTMLInteractionEffects, SVGEffect } from ":core";
import { MouseAction, handleEvents, core, defineComponentDefaults, mergeComponentDefaults } from ":core";
import { LabelWithIcons, LabelWithIconsOptions } from "./LabelWithIcons";

//
// A Button is implemented as a LabelWithIcons where all the parts act as a single unit. That is,
// interaction effects and clicks apply to the entire button, not to individual parts.
//
// TODO: are there cases where we want the icon to be activated separately, or is this a
// different component?
//

export interface ButtonOptions extends LabelWithIconsOptions {
  /** the click action */
  action?: MouseAction;
  /** after click, whether to return focus to previous element with focus */
  preserveFocus?: zboolean;
  /** show a ripple effect */
  ripple?: zboolean;
}
defineComponentDefaults<ButtonOptions>("Button", "LabelWithIcons", {
  ripple: false,
  preserveFocus: true,
  border: core.border.thin,
  padding: core.space.s1,
  rounding: core.rounding.r2,
  role: "button",
});

export function Button(inOptions: ButtonOptions = {}): View {
  const options = mergeComponentDefaults("Button", inOptions);

  function isLabelOnly(): boolean {
    return !options.leadingIconURI && !options.trailingIconURI;
  }
  function isIconOnly(): boolean {
    return Boolean(options.leadingIconURI && !options.label && !options.trailingIconURI);
  }
  function isPill(): boolean {
    return options.rounding === core.rounding.pill;
  }

  // all buttons should have a click actor, although some may have an empty action (e.g., FileSelect)
  if (!options.action && !options.events?.click) {
    addOptionEvents(options, { click: (): void => undefined });
  } else if (options.action) {
    options.events ??= {};
    options.events.click ??= (evt: MouseEvent): void => handleClick(evt);
  }
  if (!options.border || options.border === core.border.none) {
    options.rounding = undefined;
  }
  if (isPill()) {
    options.paddingInline = ch(1);
    options.padding = undefined;
  }
  if (isIconOnly()) {
    options.padding = core.space.s0;
  }
  options.labelOptions = {
    ...options.labelOptions,
    color: options.color,
    paddingInline: core.space.s2,
    textPositionX: isLabelOnly() ? "center" : "start",
    font: core.font.inherit,
    opacity: atom(() => (options.disabled?.get() ? 0.6 : 1.0)),
  };

  // set up the interaction effects
  options.effects = zget(options.effects) || standardHTMLInteractionEffects();
  if (zget(options.ripple)) {
    options.effects = {
      ...options.effects,
      "clicked": SVGEffect.ripple(),
    };
  }

  // restore the focus after a click if preserveFocus is set
  function handleClick(evt: MouseEvent): void {
    evt.preventDefault();
    handleEvents(options.action, evt);
    if (options.preserveFocus) {
      setTimeout(() => View.lastFocus?.focus(), 10);
    }
  }

  return LabelWithIcons(options);
}
