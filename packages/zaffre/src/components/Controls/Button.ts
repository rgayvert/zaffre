import { zget, atom, zutil, BasicAction, zboolean, zstring, Atom, IBuilder, Builder } from ":foundation";
import { zborder, zrounding, zspace, standardHTMLInteractionEffects, View, addClass, css_color, afterOptionsMerged, ViewOptions } from ":core";
import { ch, addOptionEvents, handleEvents, lastFocusView } from ":core";
import { HStack, Spacer, StackOptions } from "../Layout";
import { Icon, TextLabel } from "../Content";

//
// All the parts in a Button act as a single unit. That is,
// interaction effects and clicks apply to the entire button, not to individual parts.
//
// TODO: are there cases where we want the icon to be activated separately, or is this a
// different component?
//

export interface ButtonOptions extends StackOptions {
  action?: BasicAction;
  preserveFocus?: zboolean;
  //ripple?: zboolean;
  label?: zstring;
  leadingIconURI?: zstring;
  leadingIconTransform?: zstring;
  trailingIconURI?: zstring;
  trailingIconTransform?: zstring;
  trailingText?: zstring; // TODO
  iconView?: View;
  collapsedToIcon?: Atom<boolean>;
  disabledOpacity?: number;
  disabledBackground?: css_color;
}

export const Button = (inOptions: ButtonOptions = {}) => {
  const options = addClass(inOptions, "Button");

  afterOptionsMerged(options, (view) => {
    const options = <ButtonOptions>view.options;
    options.disabled = atom(options.disabled || false);

    const isLabelOnly = () => !options.leadingIconURI && !options.trailingIconURI && !options.iconView;
    const isLeadingIconOnly = () => Boolean(options.leadingIconURI && !options.label && !options.trailingIconURI);
    const isPill = () => options.rounding === zrounding.pill;

    // all buttons should have a click action, although some may have an empty action (e.g., FileSelect)
    if (!options.action && !options.events?.click) {
      addOptionEvents(options, { click: (): void => undefined });
    } else if (options.action) {
      options.events ??= {};
      options.events.click ??= (evt: MouseEvent): void => handleClick(evt);
      options.events.mouseOver ??= (evt: MouseEvent): void => handleMouseOver(evt);
    }
    if (!options.border || options.border === zborder.none) {
      //options.rounding = undefined;
    }
    if (isPill()) {
      options.paddingInline = ch(1);
      options.padding = undefined;
    }
    if (isLeadingIconOnly()) {
      options.padding ??= zspace.s0;
    }
    if (isLabelOnly()) {
      options.alignItems = "center";
    }
    // support blank labels (without this a blank label will have zero height)
    if (options.label === "") {
      options.label = "&nbsp;";
    }

    // set up the interaction effects
    options.effects = zget(options.effects) || standardHTMLInteractionEffects();
    // if (zget(options.ripple)) {
    //   options.effects = {
    //     ...options.effects,
    //     "clicked": SVGEffect.ripple(),
    //   };
    // }

    // pointer move events are not sent properly for menu items in a drop-down button
    // in a dialog, but fortunately we can substitute mouse over
    const handleMouseOver = (evt: MouseEvent): void => {
      view.setInteractionState("hovered");
    };

    // restore the focus after a click if preserveFocus is set
    const handleClick = (evt: MouseEvent): void => {
      evt.preventDefault();
      handleEvents(options.action, evt);
      if (options.preserveFocus) {
        setTimeout(() => lastFocusView?.focus(), 10);
      }
    };
    const leadingIcon = options.leadingIconURI
      ? Icon(options.leadingIconURI, { cls: "Button.LeadingIcon", transform: options.leadingIconTransform })
      : options.iconView
        ? options.iconView
        : undefined;
    const trailingIcon = options.trailingIconURI ? Icon(options.trailingIconURI, { cls: "Button.TrailingIcon" }) : undefined;
    const label = !options.label
      ? undefined
      : TextLabel(options.label, {
          name: "Button.TextLabel",
          opacity: () => (zget(options.disabled) ? options.disabledOpacity || 0.5 : 1.0),
          selected: options.selected,
          selectionColor: options.selectionColor,
          selectionTextColor: options.selectionTextColor,
          hidden: () => options.collapsedToIcon?.get() || false,
        });

    const spacer = options.trailingIconURI ? Spacer(atom(() => (!leadingIcon || zutil.isBlank(zget(options.label) || "") ? 1 : 0))) : undefined;

    view.append(leadingIcon, label, spacer, trailingIcon);
  });
  return HStack(options);
};



interface ButtonField extends ButtonOptions {}
class ButtonField implements ButtonOptions {
  //constructor() {}
  createView(): View {
    return Button(this);
  }
}

export type ButtonSpec = IBuilder<ButtonField>;

export const buttonSpec = (): ButtonSpec => {
  return Builder(ButtonField);
};
