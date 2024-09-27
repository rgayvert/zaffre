import { View, TextBox, HStack, Button, place, RouteAtom, CounterAtom } from "zaffre";
import { Spacer, SegmentedTextButton } from "zaffre";
import { core, pct } from "zaffre";
import { GallerySection } from "../GalleryTypes";

function HeaderButtons(viewKey: RouteAtom, resetCounter: CounterAtom): View {
  const tooltips = ["Show Demo", "Show Notes", "Show source files", "Show DOM"];
  const viewLabels = ["Demo", "Notes", "Source", "DOM"];
  const viewKeys = viewLabels.map((v) => v.toLowerCase());

  function reset(): void {
    resetCounter.increment();
    viewKey.set("demo");
  }

  return HStack({ background: core.color.inherit }).append(
    SegmentedTextButton(viewKey, viewKeys, {
      labels: viewLabels,
      selectionColor: core.color.secondaryContainer,
      tooltips: tooltips,
      tooltipPlacement: place.bottom,
    }),
    Spacer(core.space.s4),
    Button({
      leadingIconURI: "icon.reset",
      action: () => reset(),
      tooltip: "Reset Demo",
      tooltipPlacement: place.bottom,
      border: core.border.none,
    }),
    Spacer(core.space.s4)
  );
}

export function DemoBoxHeader(section: GallerySection, viewKey: RouteAtom, resetCounter: CounterAtom): View {
  return HStack({
    width: pct(100),
    justifyContent: "start",
    paddingLeft: core.space.s1,
    background: core.color.secondaryContainer,
    border: core.border.none,
    borderBottom: core.border.thin.color(core.color.gray.opacity(0.25)),
    name: "DemoHeader",
  }).append(
    TextBox(section.title, {
      color: core.color.secondaryContainer.contrast,
      background: core.color.secondaryContainer,
    }),
    Spacer(1),
    HeaderButtons(viewKey, resetCounter)
  );
}
