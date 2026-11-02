import { atom, CenteredText, SegmentedTextButton, VStack, Ensemble, HStack, EnsembleViewCreators, FixedEnsemble, zspace, pickList, Switch, Box, ToggleBox } from "zaffre";
import { ensembleExampleRules, toggleExampleRules } from "./EnsembleExample.rules";

const fixedColors = ["red", "green", "blue"] as const;
type FixedColorType = (typeof fixedColors)[number];

export const EnsembleExample = () => {
  const colorList = pickList(["red"], ["red", "green", "blue"]);
  
  const selectedFixedColor = atom<FixedColorType>("green");
  const creators: EnsembleViewCreators<FixedColorType> = {
    "red": () => CenteredText("red"),
    "green": () => CenteredText("green"),
    "blue": () => CenteredText("blue"),
  };
  const toggle = atom(false);

  const ColorBox = (colorName: string) => {
    return CenteredText(colorName);
  };
  const box1 = () => Box({ cls: "box1" });
  const box2 = () => Box({ cls: "box2" });

  return HStack({ gap: zspace.s7 }).append(
    VStack({ rules: ensembleExampleRules(colorList.lastSelection) }).append(
      SegmentedTextButton(colorList),
      Ensemble(colorList.lastSelection, (colorName) => ColorBox(colorName))
    ),
    VStack({ rules: ensembleExampleRules(selectedFixedColor) }).append(
      SegmentedTextButton(colorList),
      FixedEnsemble(selectedFixedColor, creators)
    ),
    VStack({ rules: toggleExampleRules }).append(
      Switch(toggle),
      ToggleBox(toggle, box1, box2)
    ),
    
  );
};
