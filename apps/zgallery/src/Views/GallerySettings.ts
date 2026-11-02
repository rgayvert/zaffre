import { LogLevels, Form, dropDownButtonSpec, switchButtonSpec, FormField, pickList, addClass, simpleMenuItemList } from "zaffre";
import { SimpleSettings, FormModel } from "zaffre";
import { GalleryModel, galleryThemeNames } from "../Model";

//
// GallerySettings is a panel that allows various app settings to be modified, including
// default theme, fluid fonts, contrast level, and log level.
//
// TODO:
//  - generalize this to a Settings component that can be used in other window layouts
//

export const GallerySettings = (model: GalleryModel) => {
  const options = addClass({}, "GallerySettings");

  const ra = model.gallerySettings;
  const r = ra.get();
  const themeNameFieldAtom = ra.fieldAtom("themeName", r.themeName);
  const logLevelFieldAtom = ra.fieldAtom("logLevel", r.logLevel);
  const themeList = simpleMenuItemList(galleryThemeNames, themeNameFieldAtom);
  const logLevelList = simpleMenuItemList([...LogLevels], logLevelFieldAtom);

  const xx = dropDownButtonSpec("theme", themeNameFieldAtom, themeList)


  const fields = [
    dropDownButtonSpec("theme", themeNameFieldAtom, themeList).label("Theme"),
    switchButtonSpec("fluidFonts", ra.fieldAtom("fluidFonts", r.fluidFonts)).label("Fluid Fonts"),
    dropDownButtonSpec("logLevel", logLevelFieldAtom, logLevelList).label("Log Level"),
  ].map((vf) => vf.build());
  const formModel = new FormModel(model.gallerySettings, fields, { embedLabels: false });

  return SimpleSettings(model.settingsHidden, options).append(Form(formModel));
};

// return VStack({
//   background: zcolor.background,
//   hidden: model.settingsHidden,
//   effects: { hidden: transitions.slide("in&out", "right") },
//   alignItems: "stretch",
//   justifyContent: "start",
//   name: "Settings",
//   zIndex: 1,
//   position: "absolute",
//   right: px(0),
//   padding: zspace.s4,
//   //height: pct(100),
//   elevation: 5,
//   gap: em(0.5),
//   minWidth: ch(20),
// }).append(
//   HStack({ justifyContent: "end", background: zcolor.inherit }).append(
//     Button({
//       leadingIconURI: "icon.close",
//       background: zcolor.inherit,
//       border: zborder.none,
//       marginBottom: em(0.5),
//       action: () => model.settingsHidden.set(true),
//       font: zfont.label_medium,
//     })
//   ),

//   return SimpleSettings(model.settingsHidden).append(
//     HStack({ background: zcolor.inherit }).append(
//       TextLabel("Theme: ", labelOptions),
//       Spacer(1),
//       DropDownButton(model.currentThemeName, galleryThemeNames)
//     ),
//     HStack({ alignItems: "center", background: zcolor.inherit }).append(
//       TextLabel("Contrast: ", labelOptions),
//       Spacer(1),
//       DropDownButton(model.contrast, zutil.sequence(2, 16, 0.5).map((c) => zutil.printRoundedTo(c, 1)))
//     ),

//     HStack({ background: zcolor.inherit }).append(
//       TextLabel("Fluid Fonts:", labelOptions),
//       Spacer(1),
//       Switch(App.fluidFonts, { widthInEm: 3 })
//     ),
//     HStack({ background: zcolor.inherit }).append(
//       TextLabel("Log level:", labelOptions),
//       Spacer(1),
//       DropDownButton(model.logLevel, zlog.logLevels)
//     ),
//     Spacer(em(1)),
//     Button({
//       label: "Reset Data",
//       padding: zspace.s0,
//       background: zcolor.tertiaryContainer,
//       font: zfont.label_large,
//       rounding: zrounding.pill,
//       tooltip: "Set data for all demos to defaults",
//       action: () => model.resetData(),
//     })
//   );
// }
