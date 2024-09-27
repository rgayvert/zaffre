import { Atom, BasicTooltip, Button, TextLabel, TextLabelOptions, View, core } from "zaffre";

export function TooltipExample(): View {

  function CustomTooltipText(tip: Atom<string>): View {
    const options: TextLabelOptions = {
        color: core.color.red,
        font: core.font.body_medium,
      };
      return TextLabel(tip, options);
  }
  const tooltip = "There's always money in the banana stand";
  return Button({ label: "Button with custom tooltip", font: core.font.body_large, tooltip: tooltip }).append(
    BasicTooltip({ textCreator: CustomTooltipText })
  );
}
