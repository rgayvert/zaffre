import { Atom, Tooltip, Button, TextLabel, LabelOptions, zcolor, zfont } from "zaffre";

export const TooltipExample = () => {

  const CustomTooltipText = (tip: Atom<string>) => {
    const options: LabelOptions = {
        color: zcolor.red,
        font: zfont.body_medium,
      };
      return TextLabel(tip, options);
  }
  const tooltip = "There's always money in the banana stand";
  return Button({ label: "Button with custom tooltip", tooltip: tooltip }).append(
    Tooltip({ textCreator: CustomTooltipText })
  );
}
