import { core, View, VStack, pct, vh, atom, ZWindow } from "zaffre";
import { flexToken, BasicTooltip, HStack } from "zaffre";
import { GalleryModel } from "../Model";
import { GallerySettings } from "./GallerySettings";
import { GalleryTopBar } from "./GalleryTopBar";
import { DemoPane } from "./DemoPane";
import { GalleryTree } from "./GalleryTree";

export function Gallery(): View {
  const model = new GalleryModel();

  return VStack({ padding: core.space.s0, height: vh(100), width: pct(100), name: "Gallery", model: model }).append(
    GalleryTopBar(model),
    HStack({
      flex: flexToken({ grow: 1 }),
      width: pct(100),
      padding: core.space.s0,
      alignItems: "stretch",
      overflow: "hidden",
    }).append(
      GalleryTree(model, { hidden: atom(() => ZWindow.instance.smallDisplay()) }),
      DemoPane(model),
      GallerySettings(model)
    ),
    BasicTooltip()
  );
}
