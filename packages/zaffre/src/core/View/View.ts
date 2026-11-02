import { ArrayAtom, Atom, AtomOrClosure, BasicAction, BreakpointAtom, Point2D, Rect2D, ZType } from ":foundation";
import { TAction, zboolean, znumber, zpoint2D, zsize2D, zstring } from ":foundation";
import { AttrBundle, Attributes, AttrTarget, ITheme, ztheme } from ":attributes";
import { Events, GenericEventHandlerOptions, Handler, HandlerTarget, ListenerTarget } from ":events";
import { InputHandlerOptions, MouseAction, MouseHandlerOptions } from ":events";
import { BasicAnimation, AnimationTarget, EffectsBundle, EffectTarget } from ":effect";
import { PlacementOption } from ":uifoundation";
import { ViewDelegate } from "./ViewDelegate";


// type ValueModel<T> = ZType<T> | { value: ZType<T> }
// type SimpleComponent = (classOrOptions: string | ViewOptions) => View;
// type ValueComponent<T> = (value: ValueModel<T>, options: ViewOptions) => View;
// type ModelComponent<T extends {}> = (model: T, options: ViewOptions) => View;

export type ViewAction = (view: View) => void;
export type ChildAction = (view: View, child: View) => void;
//export type ResolveResourceFn = (key: zstring) => string;
export type TooltipAction = (tooltipView: View, referenceView: View, text: string, show: boolean) => void;
export type ZElement = HTMLElement | SVGElement;

export type ChildModifier<T> = (child: View, index: number, parent: View, data: T) => void;
export type ChildCreator<T> = (item: T, index: number) => View;
export type ChildDataIDFn<T> = (item: T, index: number) => any;

export type ViewCreator = (options?: ViewOptions) => View;

// TODO: Attributes => ViewOptions
export type OptionRules = {
  [key: string]: Attributes;
};

//export const rootRuleKeys = new Set<string>();
export const rootRules: OptionRules = {};
// export const addRootRules = (key: string, rules: OptionRules) => {
//   if (!rootRuleKeys.has(key)) {
//     Object.assign(rootRules, { ...rootRules, ...rules });
//   }
// };
export const addRootDefaults = (rules: OptionRules) => {
    Object.assign(rootRules, { ...rootRules, ...rules });
};

export interface SharedViewState {
  hidden?: Atom<boolean>;
  hovered?: Atom<boolean>;
}

export let lastFocusView: View;
export const setLastFocusView = (v: View): void => {
  lastFocusView = v;
};
export const getViewFromZaffreData = (elt: Element | null): View | undefined => {
  return (elt as any)["data-zaffre"];
};

let rootView: View;
export const getRootView = () => {
  return rootView;
};
export const setRootView = (v: View): void => {
  rootView = v;
};
let bodyView: View;
export const getBodyView = () => {
  return bodyView;
};
export const setBodyView = (v: View): void => {
  bodyView = v;
};

let defaultTheme: ITheme;
export const getDefaultTheme = (): ITheme | undefined => {
  return defaultTheme;
};
export const setDefaultTheme = (theme: ITheme): void => {
  defaultTheme = theme;
};

const themeStack: ITheme[] = [];
export const pushTheme = (theme: ITheme): void => {
  themeStack.push(theme);
};
export const getCurrentTheme = (): ITheme => {
  return themeStack.at(-1) || defaultTheme;
};
export const popTheme = (): ITheme | undefined => {
  return themeStack.pop();
};

export type IViewSpec = { createView: () => View };

export const isViewSpec = (obj: any): obj is IViewSpec => {
  return obj && typeof obj.createView === "function";
};

export const getActiveView = (): View | undefined => {
  return getViewFromZaffreData(document.activeElement);
};

export const afterOptionsMerged = (options: ViewOptions, action: ViewAction): void => {
  options.afterOptionsMerged ??= [];
  options.afterOptionsMerged.push(action);
};

export interface View extends AnimationTarget, AttrTarget, EffectTarget, HandlerTarget, ListenerTarget {
  addChild(child: View): void;
  addChildToDOM(child: View): void;
  addEventListener(type: string, listener: EventListenerOrEventListenerObject, capture?: boolean): void;
  addGenericHandler(options: GenericEventHandlerOptions): void;
  addHandler(handler: Handler<unknown>): void;
  addHotKeyListener(view: View): void;
  addInputHandler(options: InputHandlerOptions): void;
  addIntersectionAction(action: TAction<boolean>): void;
  addIntersectionTimer(interval: znumber, action: BasicAction): void;
  addMouseHandler(options: MouseHandlerOptions): void;
  addMutationAction(action: BasicAction): void;
  addReferencedView(view: View): void;
  addResizeAction(action: BasicAction): void;
  afterAddedToDOM(): void;
  allAnimations(): Animation[];
  ancestors(): View[];
  append(...views: any[]): View;
  appendAfterMounted(view: View): View;
  appendAndRender(view: View): void;
  appendChild(child: View): void;
  appendContainerChild(view: View): View;
  attach(): void;
  attributeBundle: AttrBundle;
  beforeAddedToDOM(): void;
  children: ArrayAtom<View>;
  //classList: string[];
  componentName: string;
  clickPoint: Point2D | undefined;
  clientRect(): Rect2D;
  //componentPath(): string;
  computedStyle(): CSSStyleDeclaration;
  containerChild?: View;
  delegate: ViewDelegate;
  detach(): void;
  disableResizeObserverWhile(fn: () => void): void;
  //domDepth(): number;
  elt: ZElement;
  findDescendant(predicate: (view: View) => boolean): View | undefined;
  floatingAncestor(): View | undefined;
  floatingChildren: ArrayAtom<View>;
  floatingCount(): number;
  focus(preventScroll?: boolean): void;
  //fullRoutePath(): string;
  get theme(): ITheme;
  //getContent(): zstring;
  getHidden(): Atom<boolean>;
  getSelected(): Atom<boolean>;
  handlers: Handler<any>[];
  hasContent(): boolean;
  hasFloatingAncestor(): boolean;
  hasVisibleChild(): boolean;
  heightWithoutPadding(): number;
  hScrollParent(): View | undefined;
  hide(): void;
  htmlAttributeSummary(): string;
  indexInParent(): number;
  //intersectionState: Atom<boolean>;
  isActiveView(): boolean;
  isDialog(): boolean;
  isEnabled(): boolean;
  isFloating(): boolean;
  isHidden(): boolean;
  isSelected(): boolean;
  matchesRuleSelector(selector: string, cls: string): boolean;
  mergeOptions(options: ViewOptions): void;
  mutationState: Atom<boolean>;
  nonFloatingParent?: View;
  _nonFloatingParent?: View;
  options: ViewOptions;
  overlay: View;
  parent: View | undefined;
  parentClientRect2D(): Rect2D;
  place(): void;
  prepend(child: View): void;
  rectInParent(): Rect2D;
  referenceView: View;
  referencedViews?: View[];
  release(): void;
  remove(): void;
  removeChild(child: View): void;
  removeHotKeyListener(view: View): void;
  render(): void;
  renderChild(childView: View): void;
  rendered: boolean;
  replaceChild(oldChild: View, newChild: View): void;
  //resizeState: Atom<ResizeObserverSize | undefined>;
  //resolveURI(name: zstring): string;
  rootView(): View;
  //routePath(): string;
  //routePoint?: RouteAtom<string>;
  scrollBy(x: number, y: number): void;
  scrollIntoViewIfNeeded(offset?: number): void;
  setHeight(h: number | string): void;
  setMinHeight(h: number | string): void;
  setMountedState(mounted: boolean, action?: BasicAction): void;
  //setNonFloatingParent(view): void;
  setOffset(pt: Point2D): void;
  setParent(v: View | undefined): void;
  setTheme(theme: ITheme): void;
  setWidth(w: number | string): void;
  svgAttributeSummary(): string;
  tooltipView: View | undefined;
  viewID: number;
  vScrollParent(): View | undefined;
  waitForAnimationsToFinish(fn?: BasicAction): void;
  width: number;
  zname: string;
}

export interface ViewOptionsRecord {
  name: string;
  id: string;
  tag: string;
  componentName: string;
  extraClasses: string;
  extraVars: [string, string][];
  classList: string[];
  cls: string;

  theme: ztheme;
  resources: Map<string, string>;    //xx
  disabled: AtomOrClosure<boolean>;
  hidden: ZType<boolean>;
  hideFn: () => void;                //xx
  selected: ZType<boolean>;
  mounted: Atom<boolean>;

  floating: boolean;                 //xx
  toastStack: boolean;               //xx
  elevation: znumber;
  sharedState: SharedViewState;      //??
  needsPointerEvents: zboolean;
  hasContainerChild: boolean;        //xx

  events: Events;
  //capture?: Events;
  clickAction: MouseAction;
  hotKeys: Map<string, BasicAction>;
  breakpoints: BreakpointAtom;       // => resize 

  model: unknown; // for debugging

  // life cycle
  onIntersectionHidden: ViewAction;
  onIntersectionVisible: ViewAction;
  //onMount: ViewAction;
  onResize: ViewAction;
  onSelect: ViewAction;
  onApplyContent: ViewAction;
  beforeAddedToDOM: ViewAction[];
  afterAddedToDOM: ViewAction[];
  afterAppendChild: ChildAction;
  afterAddChildToDOM: ChildAction;
  afterRemoveChild: ChildAction;
  afterRender: ViewAction;
  onTooltip: TooltipAction;
  afterMount: ViewAction;

  retainOnRemove: zboolean;
  onUndo: BasicAction;
  onRedo: BasicAction;

  // position  & size
  origin: zpoint2D;
  extent: zsize2D;
  fitToParent: zboolean;
  scaleToParent: zboolean;

  animations: BasicAnimation[];
  effects: EffectsBundle;
  handlers: Handler<unknown>[];

  tooltip: zstring;
  tooltipPlacement: PlacementOption;

  placement: PlacementOption;
  tabIndex: znumber;  // needed for focus
  isDialog: boolean;                     //?? needed with Portal?
  scrollIntoViewWhen: Atom<boolean>;
  scrollToTopWhen: Atom<boolean>;        //xx
  takeFocusWhen: Atom<boolean>;

  //resolveURI: ResolveResourceFn;

  styleKeys: string[];
  view: View;
  role: string;

  rules: OptionRules;

  afterOptionsMerged: ViewAction[];
  traceOptions: zboolean;
}

export interface ViewOptions extends Partial<ViewOptionsRecord> {}

// export class ViewOptions {
//   constructor(data?: Partial<ViewOptions>) {
//     Object.assign(this, data);
//   }

// }

// export const opts = (options: ViewOptions) => {
//   return options instanceof ViewOptions ? options : new ViewOptions(options);
// }
