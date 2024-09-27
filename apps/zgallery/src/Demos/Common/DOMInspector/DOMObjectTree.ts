import { View, Atom, atom, zutil, SimpleTree, TreeNode} from "zaffre";
import { TreeOptions, BoxOptions } from "zaffre";
import { WrappedObject, wrapView } from "./WrappedObject";

function treeNodeFromWrappedObject(wrappedObject: WrappedObject): TreeNode<WrappedObject> {
    return new TreeNode(wrappedObject, () => wrappedObject.children().map((child) => treeNodeFromWrappedObject(child)));
  }
export function DOMObjectTree(selectedView: Atom<View>, inOptions: BoxOptions): View {
    const defaultOptions: TreeOptions = {
      initialExpansionLevel: 1,
    };
    const options: TreeOptions = zutil.mergeOptions(defaultOptions, inOptions);
    const selectedNode: Atom<TreeNode<WrappedObject> | undefined> = atom(undefined);
    const root = treeNodeFromWrappedObject(wrapView(selectedView.get()));
    return SimpleTree(root, selectedNode, (node) => node.data.name, options);
  }
