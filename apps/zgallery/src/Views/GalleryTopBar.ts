import { atom, Spacer, pct, em, transitions, DialogContainer, pickList, px, simpleMenuItemList } from "zaffre";
import { zcolor, zborder, zfont, zspace, MenuButton } from "zaffre";
import { point2D, calcSub, ch, baseURL, LabelOptions, HStack, Button } from "zaffre";
import { I18n, ZWindow, Theme, FloatingContainer } from "zaffre";
import { GalleryModel } from "../Model";
import { GalleryTree } from "./GalleryTree";
import { GallerySettings } from "./GallerySettings";

//
// The GalleryTopBar extends across the top of the window, and contains a set of buttons.
// At small window size, the buttons collapse to a single menu which has a floating gallery tree.
//
// TODO:
//  - implement this using a Toolbar component
//

export const GalleryTopBar = (model: GalleryModel) => {
  // hide the floating menu if the selection is a leaf node with a topic
  const floatingTreeHidden = atom(true);
  model.selectedDemo.addAction(() => {
    if (model.selectedDemoHasTopicOrInfo()) {
      floatingTreeHidden.set(true);
    }
  });
  const selectedI18n = atom(I18n.currentInstance.localeName.get());
  const i18nList = simpleMenuItemList(I18n.supportedLocaleNames(), selectedI18n );

  const FloatingGalleryTree = () => {
    return FloatingContainer({
      width: ch(20),
      height: calcSub("100%", "2em"),
      placement: { referencePt: "xstart-yend", viewPt: "xstart-ystart", offset: point2D(-40, 5) },
      background: zcolor.background,
      hidden: floatingTreeHidden,
      hideOnWindowResize: true,
      paddingLeft: ch(1),
      overflow: "auto",
      effects: { hidden: transitions.slide("in&out", "left") },
      name: "FloatingGalleryTree",
    }).append(GalleryTree(model, { includeInfo: false, hidden: floatingTreeHidden }));
  };

  const buttonOptions: LabelOptions = {
    background: zcolor.primaryContainer,
    font: zfont.headline_medium,
    border: zborder.none,
  };

  return HStack({
    position: "sticky",
    top: px(0),
    zIndex: 1000,
    alignItems: "center",
    justifyContent: "start",
    height: em(2.7),
    width: pct(100),
    padding: zspace.s2,
    background: zcolor.primaryContainer,
  }).append(
    Button({
      ...buttonOptions,
      leadingIconURI: "icon.home",
      action: () => location.assign(`${baseURL()}/`),
      transform: "scale(0.8)",
      color: zcolor.primary,
      tooltip: "Home page",
      font: zfont.headline_medium,
    }),
    Button({
      ...buttonOptions,
      leadingIconURI: "icon.show-menu",
      hidden: () => !ZWindow.instance.smallDisplay(),
      action: () => floatingTreeHidden.set(false),
      tooltip: "Demo menu",
    }).append(FloatingGalleryTree()),
    Spacer(1),
    Button({
      ...buttonOptions,
      leadingIconURI: () => (Theme.default.inDarkMode() ? "icon.dark-mode" : "icon.light-mode"),
      action: () => model.toggleColorMode(),
      transform: "scale(0.8)",
      tooltip: "Toggle color mode",
    }),
    MenuButton(i18nList, {
      ...buttonOptions,
      leadingIconURI: "icon.language",
      tooltip: "Switch language",
    }),
    Button({
      ...buttonOptions,
      color: zcolor.red,
      leadingIconURI: "icon.settings",
      action: () => model.settingsHidden.set(false),
      tooltip: "Settings",
    }).append(
      DialogContainer({
        hidden: model.settingsHidden,
        placement: { referencePt: "xend-ystart", viewPt: "xend-ystart" },
        dismissOnEscape: true,
        dismissOnOutsideClick: true,
        clickThrough: true,
      }).append(GallerySettings(model))
    )
  );
};
