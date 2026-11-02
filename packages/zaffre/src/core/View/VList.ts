import { Atom, BasicAction, SetAtom, zget, zlog, ZType } from ":foundation";
import { ViewAction, View, ChildModifier, ChildDataIDFn, ChildCreator } from "./View";

// export type ChildModifier<T> = (child: View, index: number, parent: View, data: T) => void;
// export type ChildCreator<T> = (item: T, index: number) => View;
// export type ChildDataIDFn<T> = (item: T, index: number) => any;

export interface VListOptions<T> {
  childModifiers?: ChildModifier<T>[];
  afterRender?: ViewAction;
  onInit?: ViewAction;
  onResize?: ViewAction;
  noCache?: boolean;
  debug?: boolean;
}

export class VList<T> {
  constructor(
    public data: ZType<Iterable<T>>,
    public childDataID: ChildDataIDFn<T>,
    protected childCreator: ChildCreator<T>,
    protected options: VListOptions<T> = {},
  ) {
    if (data instanceof Atom) {
      data.addAction(() => this.render());
    }
  }

  private view!: View;
  private newSubviews = new Set<View>();
  private currentSubviews: View[] = [];

  debug(msg: string): void {
    this.options.debug && console.log(msg);
  }
  addChildModifier(modifier: ChildModifier<T>): void {
    this.options.childModifiers ??= [];
    this.options.childModifiers.push(modifier);
  }

  public composeSubviews(view: View): void {
    this.view = view;
    this.options.onInit?.(view);
    if (this.options.onResize) {
      this.view.addResizeAction(() => this.options.onResize!(this.view));
    }
    this.render();
  }

  waitForSubviewAnimationsToFinish(subviews: View[], fn: BasicAction): void {
    const subviewAnimations = subviews
      .map((child) => child.elt?.getAnimations() || [])
      .reduce((prev, cur) => [...prev, ...cur], []);
    if (subviewAnimations.length === 0) {
      fn();
    } else {
      Promise.all(subviewAnimations.map((animation) => animation.finished)).then(() => fn());
    }
  }

  subviewsToRemove(): View[] {
    if (this.options.noCache) {
      return this.currentSubviews;
    } else {
      const data = [...zget(this.data)];
      const newChildIDs = data.map((childData, index) => this.childDataID(childData, index));
      return [...this.currentSubviews].filter((v) => !newChildIDs.find((id) => id === v.options.id));
    }
  }

  render(): void {
    this.debug(`vlist.render: removing ${this.subviewsToRemove().length}, adding ${this.newSubviews.size}`);

    // give removed subviews a chance to animate their departure
    this.subviewsToRemove().forEach((v) => {
      this.debug("vlist.render: unmounted " + v.zname);
      v.setMountedState(false);
    });

    // TODO: there are some deferred cases (e.g., Toolbar) where the view has not been set
    if (this.view) {
      this.view.waitForAnimationsToFinish(() => {
        this.compose();
        this.newSubviews.forEach((subview) => {
          subview.setParent(this.view);
          subview.afterAddedToDOM();
          subview.render();
          this.debug("vlist.render: added " + subview.zname);
        });
        this.currentSubviews.forEach((subview) => subview.attributeBundle.apply());
      });

      this.options.afterRender?.(this.view);
    }
  }

  public compose(): void {
    const data = [...zget(this.data)];
    const newChildIDs = data.map((childData, index) => this.childDataID(childData, index));
    // remove subviews with no match
    [...this.currentSubviews].forEach((v) => {
      if (this.options.noCache || !newChildIDs.includes(v.options.id)) {
        v.remove();
        this.debug("vlist.compose: removed " + v.options.id + " from " + this.view.options.name);
        this.currentSubviews = this.currentSubviews.filter((elt) => elt !== v);
      }
    });
    // create new subviews
    this.newSubviews = new Set<View>();
    const nextSubviews = Array(data.length);
    data.forEach((childData, index) => {
      const id = this.childDataID(childData, index);
      const existingSubview = this.currentSubviews.find((v) => v.options.id === id);
      if (existingSubview) {
        this.debug("vlist.compose: reusing " + existingSubview.zname);
        nextSubviews[index] = existingSubview;
      } else {
        const newChild = this.childCreator(childData, index);
        if (!newChild || !newChild.options) {
          console.log("VList: nullish child");
        } else {
          newChild.options.id = id;
          this.options.childModifiers?.forEach((modifier) => modifier(newChild, index, this.view, childData));
          nextSubviews[index] = newChild;
          this.newSubviews.add(newChild);
          this.debug("vlist.compose: added " + newChild.zname);
        }
      }
    });

    // some of the "new" subviews may have already existed, and are being moved, so
    // there might be animations in progress
    this.waitForSubviewAnimationsToFinish(nextSubviews, () => {
      // clear out children and insert new ones in the new order
      this.currentSubviews.forEach((subview) => {
        this.view.removeChild(subview);
      });
      nextSubviews.forEach((subview, index) => {
        if (this.newSubviews.has(subview)) {
          subview.beforeAddedToDOM();
          this.view.appendChild(subview);
        }
        this.view.addChildToDOM(subview);
        subview.setParent(this.view);
      });
      this.currentSubviews = nextSubviews;
      this.view.children.set(nextSubviews);
    });
  }
}
