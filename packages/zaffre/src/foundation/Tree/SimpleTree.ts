import { TreeNode } from "./TreeNode";

export class SimpleNode<T> {
    constructor(public data: T, public children: SimpleNode<T>[] = []){}
    add(...nodes: SimpleNode<T>[]): SimpleNode<T> {
        this.children.push(...nodes);
        return this;
    }
}
export const treeFromSimpleNode = <T>(tree: SimpleNode<T>): TreeNode<T> => {
  return new TreeNode(tree.data, () => tree.children.map((child) => treeFromSimpleNode(child)));
}

export const simpleNode = <T>(data: T) => {
    return new SimpleNode(data); 
}         