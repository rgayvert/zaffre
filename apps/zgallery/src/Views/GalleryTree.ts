import { SimpleTree, SimpleTreeOptions, StackOptions, TextLabel, View, VStack } from "zaffre";
import { ch, flexToken, pct } from "zaffre";
import { core, defineComponentDefaults, mergeComponentDefaults } from "zaffre";
import { GalleryModel, galleryTree } from "../Model";

//
// GalleryTree: the demo navigation tree component.
//
// This is used in two forms: 
//   - a floating version, for a small window size; and
//   - a non-floating version, with an additional bottom label to show the app version number
//
// TODO: 
//   - generalize this for use in other windows
//

export interface GalleryTreeOptions extends StackOptions {
  includeInfo?: boolean;
}
defineComponentDefaults<GalleryTreeOptions>("GalleryTree", "Stack", {
  includeInfo: true,
});

export function GalleryTree(model: GalleryModel, inOptions: GalleryTreeOptions = {}): View {
  const options = mergeComponentDefaults("GalleryTree", inOptions);
  const infoText = options.includeInfo
    ? TextLabel(`${import.meta.env.VITE_VERSION}`, {
        width: pct(100),
        textPositionX: "center",
        font: core.font.label_medium,
        padding: core.space.s2,
        background: core.color.primaryContainer,
        tooltip: `${import.meta.env.VITE_BUILD_DATE}`,
      })
    : undefined;
  const treeOptions: SimpleTreeOptions = {
    font: core.font.title_medium,
    width: pct(100),
    flex: flexToken({ grow: 1 }),
    paddingLeft: core.space.s3,
    border: core.border.none,
    iconSide: "right",
    showRoot: false,
  };
  const treeContainerOptions: StackOptions = {
    ...options,
    height: pct(100),
    flex: flexToken({ grow: 0, shrink: 0, basis: ch(23) }),
    border: core.border.none,
    borderRight: core.border.medium,
    paddingTop: core.space.s3,
    overflowX: "hidden",
    overflowY: "auto",
    alignItems: "start",
  };

  return VStack(treeContainerOptions).append(
    SimpleTree(galleryTree, model.selectedDemo, (val) => val.data.title, treeOptions),
    infoText
  );
}
