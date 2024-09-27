import { SimpleTree, SimpleTreeOptions, StackOptions, View, VStack } from "zaffre";
import { ch, flexToken, pct } from "zaffre";
import { core, defineComponentDefaults, mergeComponentDefaults } from "zaffre";
import { GalleryModel, galleryTree } from "../Model";

export interface GalleryTreeOptions extends StackOptions {}
defineComponentDefaults<GalleryTreeOptions>("GalleryTree", "Stack", {});

export function GalleryTree(model: GalleryModel, inOptions: GalleryTreeOptions = {}): View {
  const options = mergeComponentDefaults("GalleryTree", inOptions);

  const treeOptions: SimpleTreeOptions = {
    font: core.font.title_medium,
    width: pct(100),
    height: pct(100),
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
    paddingLeft: core.space.s3,
    paddingTop: core.space.s3,
    overflowX: "hidden",
    overflowY: "auto",
    alignItems: "start",
  };

  return VStack(treeContainerOptions).append(
    SimpleTree(galleryTree, model.selectedDemo, (val) => val.data.title, treeOptions)
  );
}
