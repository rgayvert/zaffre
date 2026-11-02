import { atom, ch, downloadText, zborder, zfont, zspace } from "zaffre";
import { ButtonsWithIconsModel } from "./ButtonsWithIconsModel";

export const buttonsWithIconsExampleRules = (model: ButtonsWithIconsModel) => ({
  "container": {
    gap: zspace.s6,
    font: zfont.body_medium,
  },
  "Button": {
    //padding: zspace.s2,
  },
  "TextLabel": {
    padding: zspace.s2,
    font: zfont.body_small,
    //minWidth: ch(12),
  },
  "button1": {
    border: zborder.none,
    leadingIconURI: model.iconName,
    action: () => model.result.set("(icon)"),
    paddingBlock: zspace.s1,
  },
  "button2": {
    leadingIconURI: model.iconName,
    label: "Shop",
    action: () => model.result.set("(icon-left)"),
  },
  "button3": {
    trailingIconURI: model.iconName,
    label: "Shop",
    action: () => model.result.set("(icon-right)"),
  },
  "button4": {
    gap: zspace.s3,
    leadingIconURI: model.iconName,
    label: () => (model.storeOpen.get() ? "Open" : "Closed"),
    trailingIconURI: () => (model.storeOpen.get() ? "icon.done" : "icon.close"),
    action: () => {
      model.storeOpen.toggle();
      model.result.set(`(${model.storeOpen.get() ? "open" : "closed"})`);
    },
  },
  "button5": {
    leadingIconURI: "icon.download",
    border: zborder.none,
    controlSize: "xl",
    action: () => downloadText("Hey, now", "file.txt"),
  },
});
