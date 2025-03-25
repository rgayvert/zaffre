import { Atom, atom, Sz2D, zget, zset, zstring, ZType } from ":foundation";
import { View, addOptionEvents, core, em, px } from ":core";
import { Button, ButtonOptions } from "../Controls";
import { Floating, FloatingOptions } from "../HTML";
import { MenuOptions, SimpleMenu } from "./Menu";

//
// A DropDownMenu is a button with an associated menu that will appear when the
// button is clicked, and hide when a selection is made. By default, the title will
// be the value of the current selection. A client of this view will send in a
// selectedValue to which an action has been attached, which will act as the callback.
//
// TODO:
//  - allow title to be fixed
//
export interface DropDownButtonOptions extends ButtonOptions {
  //initialValue?: string;
}
export function DropDownButton<T>(
  selectedValue: Atom<T>,
  choices: ZType<Iterable<T>>,
  titleFn: (t: T) => string,
  initialValue?: T,
  options: DropDownButtonOptions = {}
): View {
  zset(selectedValue, initialValue || zget(selectedValue)); //  || Array.from(zget(choices))[0]);
  options.model ??= [choices, selectedValue];
  options.alignItems = "stretch";
  options.tabIndex = 0;
  addOptionEvents(options, {
    focus: () => {},
    blur: () => {},
  });

  const buttonOptions: ButtonOptions = {
    rounding: core.rounding.none,
    padding: core.space.s0,
    label: atom(() => titleFn(zget(selectedValue))),
    justifyContent: "start",
    textLabelOptions: {
      padding: px(0),
    },
    trailingIconURI: "icon.chevron-down",
    trailingIconOptions: {
      marginTop: em(0.25),
    },
    componentName: "DropDownButton",
    ...options,
  };
  const menuOptions: MenuOptions = {
    //paddingInline: em(0.5),
    placement: {
      referencePt: "xcenter-yend",
      viewPt: "xcenter-ystart",
      sizeFn: (refSize) => Sz2D(refSize.width, 0),
    },
    font: options.font,
    rounding: core.rounding.none,
  };
  const floatingOptions: FloatingOptions = {
    toggleOnReferenceEnter: true,
    //maxHeight: px(600),
    //overflowY: "auto",
  }

  return Button(buttonOptions).append(Floating(SimpleMenu(selectedValue, choices, (s) => titleFn(s), menuOptions), floatingOptions));
}

export interface SimpleDropDownButtonOptions extends DropDownButtonOptions {
  initialValue?: string;
}
export function SimpleDropDownButton(  
  selectedValue: Atom<string>,
  choices: string[],
  options: SimpleDropDownButtonOptions = {}
): View {
  function simpleTitle(s: string): string {
    return s === "" ? "&nbsp;" : s;
  }
  return DropDownButton(selectedValue, choices, simpleTitle, options.initialValue, options);
}
