import { core, View, VStack, pct, px, em, DropDownButton, Spacer, ch, zutil } from "zaffre";
import { transitions, TextLabelOptions, HStack } from "zaffre";
import { Button, TextLabel, Switch, App } from "zaffre";
import { GalleryModel, galleryThemeNames } from "../Model";

export function GallerySettings(model: GalleryModel): View {
  const textLabelOptions: TextLabelOptions = {
    background: core.color.inherit,
    font: core.font.body_medium,
    border: core.border.none,
  };
  return VStack({
    background: core.color.secondaryContainer,
    hidden: model.settingsHidden,
    effects: { hidden: transitions.slide("in&out", "right") },
    alignItems: "stretch",
    justifyContent: "start",
    name: "Settings",
    zIndex: 1,
    position: "absolute",
    right: px(0),
    padding: core.space.s4,
    height: pct(100), 
    elevation: 5,
    gap: em(0.5),
    minWidth: ch(20),
  }).append(
    HStack({ justifyContent: "end", background: core.color.inherit }).append(
      Button({
        leadingIconURI: "icon.close",
        background: core.color.inherit,
        border: core.border.none,
        action: () => model.settingsHidden.set(true),
        font: core.font.headline_medium,
      })
    ),
    HStack({ background: core.color.inherit }).append(
      TextLabel("Theme: ", textLabelOptions),
      Spacer(1),
      DropDownButton(model.currentThemeName, galleryThemeNames)
    ),
    HStack({ alignItems: "center", background: core.color.inherit }).append(
      TextLabel("Contrast: ", textLabelOptions),
      Spacer(1),
      DropDownButton(model.contrast, zutil.sequence(2, 16, 0.5).map((c) => zutil.printRoundedTo(c, 1)))
    ),

    HStack({ background: core.color.inherit }).append(TextLabel("Fluid Fonts:", textLabelOptions), Spacer(1), Switch(App.fluidFonts)),
    HStack({ background: core.color.inherit }).append(
      TextLabel("Log level:", textLabelOptions),
      Spacer(1),
      DropDownButton(model.logLevel, model.logLevels)
    ),
    Spacer(em(2)),
    Button({
      label: "Reset Data",
      padding: core.space.s0,
      background: core.color.tertiaryContainer,
      font: core.font.label_large,
      rounding: core.rounding.pill,
      tooltip: "Set data for all demos to defaults",
      action: () => model.resetData(),
    })
  );
}
