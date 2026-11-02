import { App, TextLabel, VStack, customFont } from "zaffre";

export const CustomFontsExample = () => {
  // Register a couple of google fonts
  App.instance.useGoogleFont("Sofia", "Roboto Serif");
  return VStack({ alignItems: "start" }).append(
    TextLabel("Sofia 32pt", { font: customFont({ name: "Sofia", size: 32 })}),
    TextLabel("Sofia 16pt", { font: customFont({ name: "Sofia", size: 16 })}),
    TextLabel("Roboto Serif 32pt", { font: customFont({ name: "Roboto Serif", size: 32 }) }),
    TextLabel("Roboto Serif 16pt", { font: customFont({ name: "Roboto Serif", size: 16 }) })
  );
}
