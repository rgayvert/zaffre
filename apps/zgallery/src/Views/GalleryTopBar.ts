import { core, View, atom, Spacer, pct, em, place, transitions, point2D, calcSub, ch, baseURL } from "zaffre";
import { Floating, SimpleMenu, TextLabelOptions, HStack, Button, I18n, ZWindow, Theme } from "zaffre";
import { GalleryModel } from "../Model";
import { GalleryTree } from "./GalleryTree";

export function GalleryTopBar(model: GalleryModel): View {
  function FloatingGalleryTree(): View {
    return Floating(GalleryTree(model, { hidden: model.floatingTreeHidden }), {
      background: core.color.background,
      hidden: model.floatingTreeHidden,
      paddingLeft: ch(1),
      width: ch(20),
      height: calcSub("100%", "2em"),
      overflow: "auto",
      effects: { hidden: transitions.slide("in&out", "left") },
      placement: { referencePt: "xstart-yend", viewPt: "xstart-ystart", offset: point2D(-40, 5) },
      componentName: "FloatingGalleryTree",
    });
  }

  const localeMenu = Floating(
    SimpleMenu(I18n.currentInstance.localeName, I18n.supportedLocaleNames(), (val) => val, {
      font: core.font.label_medium,
      placement: place.bottom,
    })
  );
  const buttonOptions: TextLabelOptions = {
    background: core.color.primaryContainer,
    font: core.font.headline_medium,
    border: core.border.none,
  };

  return HStack({
    name: "topNavBar",
    alignItems: "center",
    justifyContent: "start",
    height: em(2.7),
    width: pct(100),
    padding: core.space.s2,
    background: core.color.primaryContainer,
  }).append(
    Button({
      ...buttonOptions,
      leadingIconURI: "icon.home",
      action: () => location.assign(baseURL()),
      transform: "scale(0.8)",
      color: core.color.primary,
      //tooltip: "Home page",
      tooltip: `${import.meta.env.VITE_BUILD_DATE}`,
      font: core.font.headline_medium,
    }),
    Button({
      ...buttonOptions,
      leadingIconURI: "icon.show-menu",
      hidden: atom(() => !ZWindow.instance.smallDisplay()),
      action: () => model.floatingTreeHidden.set(false),
      tooltip: "Demo menu",
    //}),
    }).append(FloatingGalleryTree()),
    Spacer(1),
    Button({
      ...buttonOptions,
      leadingIconURI: atom(() => (Theme.default.inDarkMode() ? "icon.dark-mode" : "icon.light-mode")),
      action: () => model.toggleColorMode(),
      transform: "scale(0.8)",
      tooltip: "Toggle color mode",
    }),
    Button({
      ...buttonOptions,
      leadingIconURI: "icon.language",
      tooltip: "Switch language",
    }).append(localeMenu),
    Button({
      ...buttonOptions,
      leadingIconURI: "icon.settings",
      action: () => model.settingsHidden.set(false),
      tooltip: "Settings",
    })
  );
}
