import { atom, Sz2D, zget, zset, zstring, ZType } from ":foundation";
import { View, core } from ":core";
import { Button, ButtonOptions } from "../Controls";
import { Floating } from "../HTML";
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
  initialValue?: string;
}
export function DropDownButton(
  selectedValue: zstring,
  choices: ZType<string[]>,
  options: DropDownButtonOptions = {}
): View {
  zset(selectedValue, options.initialValue || zget(selectedValue) || zget(choices)[0]);

  const buttonOptions: ButtonOptions = {
    ...options,
    rounding: core.rounding.r0,
    padding: core.space.s0,
    label: atom(() => title(zget(selectedValue))),
    justifyContent: "end",
    trailingIconURI: "icon.chevron-down",
    componentName: "DropDownButton",
  };
  const menuOptions: MenuOptions = {
    placement: {
      referencePt: "xcenter-yend",
      viewPt: "xcenter-ystart",
      sizeFn: (refSize) => Sz2D(refSize.width, 0),
    },
    font: options.font,
    rounding: core.rounding.r0,
  };
  function title(s: string): string {
    return s === "" ? "&nbsp;" : s;
  }
  return Button(buttonOptions).append(Floating(SimpleMenu(selectedValue, choices, (s) => title(s), menuOptions)));
}
