import { core, View, TextLabel, Box } from "zaffre";

// This is a simple example which displays a text label.
// In this case the text to show is passed in as a literal string, and
// the styling is passed in the options argument.
export function HelloWorld0(): View {
  return Box({
    name: "outerBox",
    border: core.border.thin,
    padding: core.space.s5,
    background: core.color.secondaryContainer,
  }).append(
    TextLabel("Hello World", {
      name: "label",
      background: core.color.primaryContainer,
      color: core.color.primary, // primary color in the current theme
      font: core.font.display_medium, // a large font
    })
  );
}
