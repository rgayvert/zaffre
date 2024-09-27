import { core, View, ch, colorToken, CenteredTextLabel, SegmentedTextButton, VStack, pct, Ensemble, routeAtom } from "zaffre";

// Add routing using an Ensemble view with a route atom. 

export function EnsembleRoutingExample(): View {
  const colors = ["red", "green", "blue"];
  const selectedColor = routeAtom("color", "red");

  function ColorBox(colorName: string): View {
    const color = colorToken({ cssName: colorName });
    return CenteredTextLabel(colorName, {
      width: pct(100),
      height: ch(12),
      background: color,
      color: core.color.white,
      opacity: 0.5
    });
  }

  return VStack().append(
    SegmentedTextButton(selectedColor, colors),
    Ensemble(selectedColor, (colorName) => ColorBox(colorName))
  );
}
