import { TreeNode, View, core, SimpleTree, SoftGrid, loremTree } from "zaffre";
import { TreeOptions, atom, Atom, ch, em, KeyAndTitle } from "zaffre";
import { galleryTree } from "../../Model/GalleryRoutes";

export function BasicTreeExample(): View {
  const tree = loremTree.treeNode(5, 3, 2);
  const opts: TreeOptions = { 
    height: em(15), 
    width: ch(30), 
    alignItems: "stretch", 
    justifyContent: "start" 
  };
  const selection1: Atom<TreeNode<string> | undefined> = atom(undefined, {
    action: (item) => console.log("selection1: " + item),
  });
  const selection2: Atom<TreeNode<KeyAndTitle> | undefined> = atom(undefined, { action: (item) => console.log(item) });

  return SoftGrid({ justifyItems: "center", minColumnWidth: "40ch", rowGap: core.space.s5 }).append(
    SimpleTree(tree, selection1, (node) => node.data, { 
      ...opts, 
      showRoot: true, 
      initialExpansionLevel: 1 
    }),
    SimpleTree(galleryTree, selection2, (node) => node.data?.title || node.data?.key || "", {
      ...opts,
      iconSide: "right",
      paddingLeft: ch(1),
      showRoot: false,
    })
  );
}
