import { Atom } from ":foundation";
import { core, View, ColorToken } from ":core";
import { TextButton, ButtonOptions } from "../Controls";
import { SegmentedButton, SegmentedOptions } from "./SegmentedButton";

//
// A SegmentedButton that uses simple text buttons, with no backgound or border.
//

export function SegmentedTextButton(selectedValue: Atom<string>, values: string[], options: SegmentedOptions = {}): View {
  
  function SegmentTextButton(options: ButtonOptions): View {
    return TextButton(options.label || "", {
      ...options,
      selectionTextColor: core.color.red,
      selectionColor: <ColorToken>options.background,
    });
  }

  return SegmentedButton(selectedValue, values, { 
    ...options,
    background: core.color.none,
    buttonBackground: core.color.none,
    border: core.border.none,
    borderRadius: core.rounding.none,
    buttonComponent: SegmentTextButton,
    componentName: "SegmentedTextButton",
  });
}
