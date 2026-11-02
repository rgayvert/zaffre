import { HStack, Button, place, CounterAtom, TextLabel, zcolor, zborder, zspace, zfont, pickList, Atom } from "zaffre";
import { Spacer, SegmentedTextButton } from "zaffre";
import {pct } from "zaffre";
import { GallerySection } from "../GalleryTypes";

const HeaderButtons = (viewKey: Atom<string>, resetCounter: CounterAtom) => {
  const tooltips = ["Show Demo", "Show Notes", "Show source files"];
  const viewLabels = ["Demo", "Notes", "Source"];
  const viewKeys = viewLabels.map((v) => v.toLowerCase());
  const viewList = pickList([viewKey.get()], viewKeys, { labels: viewLabels });
  viewList.lastSelection.addAction((v) => v && viewKey.set(v));

  const reset = () => {
    resetCounter.increment();
    viewKey.set("demo");
  }

  return HStack({ background: zcolor.inherit }).append(
    SegmentedTextButton(viewList, {
      labels: viewLabels,
      selectionColor: zcolor.secondaryContainer,
      tooltips: tooltips,
      tooltipPlacement: place.bottom,
    }),
    Spacer("s4"),
    Button({
      leadingIconURI: "icon.reset",
      action: () => reset(),
      tooltip: "Reset Demo",
      tooltipPlacement: place.bottom,
      border: zborder.none,
    }),
    Spacer("s4")
  );
}

export const DemoBoxHeader = (section: GallerySection, viewKey: Atom<string>, resetCounter: CounterAtom) => {
  return HStack({
    width: pct(100),
    justifyContent: "start",
    font: zfont.body_medium,
    paddingLeft: zspace.s1,
    background: zcolor.secondaryContainer,
    border: zborder.none,
    borderBottom: zborder.thin.color(zcolor.gray.opacity(0.25)),
    name: "DemoHeader",
  }).append(
    TextLabel(section.title, {
      font: zfont.body_medium,
      color: zcolor.primary,
      background: zcolor.secondaryContainer,
    }),
    Spacer(1),
    HeaderButtons(viewKey, resetCounter)
  );
}
