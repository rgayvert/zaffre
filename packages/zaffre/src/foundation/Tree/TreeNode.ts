import { DerivedAtom, LazyAtom, atom, derivedAtom, lazyAtom, toggleAtomValue } from "../Atom";
import { lazyinit } from "../Support";

//
// A TreeNode is a generic representation of a tree structure. A node has some associated data,
// and a function that creates an array of child nodes based on the data. The children are
// evaluated lazily, even in a static case (e.g., loremTree).
//
// The nodeArray property is the key for using this with a Tree component. This is a reactive list 
// that contains the nodes in the current expansion of the root node. 
//

type TreeNodePredicate<T> = (node: TreeNode<T>) => boolean;

export class TreeNode<T> {
  static nextNodeID = 1;
  childNodes: LazyAtom<TreeNode<T>[]>;
  parentNode?: TreeNode<T>;
  expanded = atom(false);
  nodeID: number;

  constructor(public data: T, public childFn: () => TreeNode<T>[]) {
    this.childNodes = lazyAtom(childFn, this.expanded);
    this.nodeID = TreeNode.nextNodeID++;
  }
  // TODO: just update the nodeArray (does nodeArray need to be a non-derived atom?)
  reload(): void {
    this.collapse();
    this.childNodes = lazyAtom(this.childFn, this.expanded);
  }

  @lazyinit get nodeArray(): DerivedAtom<TreeNode<T>[]> {
    return derivedAtom(() => [this, ...this.descendants()], { name: "nodeArray" });
  }
  @lazyinit get descendantArray(): DerivedAtom<TreeNode<T>[]> {
    this.expand();
    return derivedAtom(() => this.descendants(), { name: "descendantArray" });
  }
  get children(): TreeNode<T>[] {
    const kids = this.childNodes.get() || [];
    kids.forEach((kid) => kid.parentNode = this);
    return kids;
  }
  getChildrenWhetherExpandedOrNot(): TreeNode<T>[] {
    const kids = this.childNodes.getCachedValue() || [];
    kids.forEach((kid) => kid.parentNode = this);
    return kids;
  }
  hasChildren(): boolean {
    return this.isExpanded() ? this.childCount > 0 : this.childNodes.getCachedValue().length > 0;
  }
  descendants(): TreeNode<T>[] {
    return this.children.reduce((acc: TreeNode<T>[], cur) => [...acc, cur, ...cur.descendants()], []);
  }
  collapse(): void {
    this.expanded.set(false);
  }
  collapseAll(): void {
    this.expanded.set(false);
    this.children.forEach((child) => child.collapseAll());
  }
  expand(): void {
    this.expanded.set(true);
  }
  isExpanded(): boolean {
    return this.expanded.get();
  }
  isCollapsed(): boolean {
    return !this.isExpanded();
  }
  expandToLevel(level: number): void {
    if (level > this.level) {
      this.expand();
      this.children.forEach((child) => child.expandToLevel(level));
    }
  }
  expandTo(node: TreeNode<T>): void {
    node.fullPath().slice(0, -1).forEach((n) => n.expand());
  }
  toggle(): void {
    toggleAtomValue(this.expanded);
  }
  expandAll(): TreeNode<T> {
    this.expand();
    this.children.forEach((child) => child.expandAll());
    return this;
  }
  addChild(node: TreeNode<T>): void {
    node.parentNode = this;
    this.expand();
    this.children.push(node);
  }
  childIDs(): string[] {
    return this.children.map((c) => c.id);
  }
  toString(): string {
    return `<${this.id}:${(this.data as any).toString()}>`;
  }
  childAt(index: number): TreeNode<T> | undefined {
    this.expand();
    return this.children[index];
  }
  dfs(match: TreeNodePredicate<T>): TreeNode<T> | undefined {
    if (match(this)) {
      return this;
    } else {
      for (const node of this.children) {
        const found = node.dfs(match);
        if (found) {
          return found;
        }
      }
    }
    return undefined;
  }

  // breadth-first search to find child
  bfs(match: TreeNodePredicate<T>): TreeNode<T> | undefined {
    const queue: TreeNode<T>[] = [this];
    while (queue.length > 0) {
      const v = queue.shift()!;
      for (const w of v.getChildrenWhetherExpandedOrNot()) {
        if (match(w)) {
          return w;
        } else {
          queue.push(w);
        }
      }
    }
    return undefined;
  }


  nodeWithID(id: string): TreeNode<T> | undefined {
    return this.dfs((node) => node.id === id);
  }
  get level(): number {
    return this.parentNode ? this.parentNode.level + 1 : 0;
  }
  get depth(): number {
    const descendants = this.descendants();
    return descendants.length === 0 ? 0 : Math.max(...descendants.map((d) => d.level)) - this.level;
  }
  get siblingIndex(): number {
    const siblings = this.parentNode?.childNodes.get() || [];
    return Math.max(siblings.indexOf(this), 0);
  }
  get id(): string {
    return this.parentNode ? `${this.parentNode.id}.${this.siblingIndex}` : "0";
  }
  get childCount(): number {
    return this.childNodes.get()?.length || 0;
  }
  fullPath(): TreeNode<T>[] {
    return [...(this.parentNode ? this.parentNode.fullPath() : []), this];
  }

  map<S>(f: (t: TreeNode<T>) => TreeNode<S>): TreeNode<S> {
    return new TreeNode(f(this).data, () => this.children.map((c) => f(c)));
  }
}

