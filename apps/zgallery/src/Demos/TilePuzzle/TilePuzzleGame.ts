import { Atom, Ensemble, HStack, LabelBox, Page, SimpleDropDownButton } from "zaffre";
import { Spacer, VStack, View, atom, ch, core, pct, zutil } from "zaffre";
import { GridTilePuzzle } from "./GridTilePuzzle";
import { BoxTilePuzzle } from "./BoxTilePuzzle";

export function TilePuzzleGame(): View {
  const sizeChoices = zutil.sequence(3, 4).map((n) => `${n} x ${n}`);
  const size = atom("4");
  const typeChoices = ["Box", "Grid"];
  const type = atom("Box");
  const sizeAndType = atom(() => `${size.get()}-${type.get()}`);
  const menuOptions = { font: core.font.title_medium, padding: core.space.s2, rounding: core.rounding.pill };
  const labelOptions = { font: core.font.title_medium };

  function TilePuzzle(key: string): View {
    const [sz, type] = key.split("-");
    const size = parseInt(sz);
    return type === "Box" ? BoxTilePuzzle(size) : GridTilePuzzle(size);
  }
  function MenuWithLabel(label: string, selection: Atom<string>, choices: string[]): View {
    return LabelBox(label, labelOptions).append(SimpleDropDownButton(selection, choices, menuOptions));
  }
  return Page({ maxWidth: ch(100), width: pct(90) }).append(
    VStack({ width: pct(100), alignItems: "center" }).append(
      HStack({ gap: core.space.s4 }).append(
        MenuWithLabel("Size:", size, sizeChoices),
        MenuWithLabel("Type:", type, typeChoices)
      ),
      Spacer(core.space.s5),
      Ensemble(sizeAndType, (key) => TilePuzzle(key))
    )
  );
}
