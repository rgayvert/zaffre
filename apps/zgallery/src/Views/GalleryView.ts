import { VStack, pct, vh, atom, ZWindow, zspace } from "zaffre";
import { flexToken, Tooltip, HStack } from "zaffre";
import { GalleryModel } from "../Model";
import { GalleryTopBar } from "./GalleryTopBar";
import { DemoPane } from "./DemoPane";
import { GalleryTree } from "./GalleryTree";

//
// The top-level layout of the Gallery window contains a top toolbar, navigation tree, and
// demo ensemble. 
//

export const Gallery = () => {
  const model = new GalleryModel();

  return VStack({ height: vh(100), width: pct(100), name: "Gallery", model: model }).append(
    GalleryTopBar(model),
    HStack({
      flex: flexToken({ grow: 1 }),
      width: pct(100),
      padding: zspace.s0,
      alignItems: "stretch",
      overflow: "hidden",
    }).append(
      GalleryTree(model, { includeInfo: true, hidden: () => ZWindow.instance.smallDisplay() }),
      DemoPane(model),
    ),
    Tooltip()
  );
}
