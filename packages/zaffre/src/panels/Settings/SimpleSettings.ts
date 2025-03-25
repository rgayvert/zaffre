import { core, View, VStack, pct, px, em, Spacer, ch, zutil, SimpleDropDownButton } from "zaffre";
import { transitions, TextLabelOptions, HStack } from "zaffre";
import { Button, TextLabel, Switch, App } from "zaffre";
import { SettingsModel } from "./SimpleSettingsModel";

//
// SimpleSettings is a two-column grid that slides in from the right. Label/Control pairs
// may be appended to this panel.
//

export function SimpleSettings(model: SettingsModel): View {
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
        font: core.font.title_large,
      })
    ),
  )
}
