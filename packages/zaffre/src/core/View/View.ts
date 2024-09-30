import { Rect2D, Size2D, Sz2D, zget, Atom, atom, arrayAtom, ArrayAtom } from ":foundation";
import { rect2D, point2D, Point2D, RouteAtom, zlog, zutil, lazyinit, znumber, zboolean } from ":foundation";
import { ZType, zstring, BasicAction, TAction, reactiveAction, ReactiveAction, SanitizeService } from ":foundation";
import { PlacementOption, ZWindow, placementOffsetAndSize } from ":uifoundation";
import { Attributes, AttrTarget, AttrBundle, ITheme, ZStyleSheet, ZStyle } from ":attributes";
import { AnimationSpec, AnimationTarget, EffectTarget, EffectsBundle, InteractionState, isInteractionState } from ":effect";
import { EventAction, Events, Listener, ListenerTarget, EventType, MouseAction, handleEvents } from ":events";
import { EventsKey, isEventActionsKey, GenericEventHandlerOptions, InputHandlerOptions } from ":events";
import { DropHandlerOptions, PointerHandlerOptions, ClipboardHandlerOptions, Handler } from ":events";
import { pointerHandler, clipboardHandler, mouseHandler, focusHandler } from ":events";
import { wheelHandler, genericEventHandler, keyHandler, dragHandler } from ":events";
import { dropHandler, inputHandler, selectedHandler, MouseHandler, PointerHandler } from ":events";
import { contentChangedHandler, mountedHandler, hiddenHandler, interactionHandler } from ":events";
import { FocusHandlerOptions, KeyHandlerOptions, MouseHandlerOptions, WheelHandlerOptions } from ":events";
import { DragHandlerOptions } from ":events";

//
// A View is the primary object in the Zaffre UI. All components create a View, and component
// options are translated into View properties. A View will have either an HTMLDelegate or an 
// SVGDelegate, which handles the behavioral differences between HTML and SVG. 
//
// TODO:
//  - refactor this monster module; nontrivial, since there are so many dependencies among View, VList & ViewDelegate
//  - can we move observers into delegates?
//  - should be have more interfaces like AttrTarget to limit how much clients need to see
// 

export type ViewCreator = (options?: ViewOptions) => View;
export type ViewAction = (view: View) => void;
export type ChildAction = (view: View, child: View) => void;
export type ImportFn<T> = () => Promise<{ default: T }>;
export type ResolveResourceFn = (key: zstring) => string;
export type TooltipAction = (tooltipView: View, referenceView: View, text: string, show: boolean) => void;
export type ComponentDefaultsMap = Map<string, ViewOptions>;

export type ZElement = HTMLElement | SVGElement;

export interface SharedViewState {
  hidden?: Atom<boolean>;
  hovered?: Atom<boolean>;
}

export interface LocalDefaults {
  [key: string]: any;
}

export interface ViewOptionsRecord {
  name?: string;
  id?: string;
  theme?: ZType<ITheme>;
  tag?: string;
  componentName?: string;
  extraClasses?: string;
  extraVars?: [string, string][];

  resources?: Map<string, string>;
  disabled?: Atom<boolean>;

  hidden?: Atom<boolean>;
  selected?: Atom<boolean>;
  mounted?: Atom<boolean>;

  floating?: boolean;
  toastStack?: boolean;
  elevation?: znumber;
  sharedState?: SharedViewState;
  needsPointerEvents?: zboolean;

  events?: Events;
  //capture?: Events;
  clickAction?: MouseAction;

  model?: unknown; // for debugging

  onIntersectionVisible?: ViewAction;
  onResize?: ViewAction;
  onSelect?: ViewAction;
  onGetContent?: () => string;
  onApplyContent?: ViewAction;
  beforeAddedToDOM?: ViewAction[];
  afterAddedToDOM?: ViewAction[];
  afterAppendChild?: ChildAction;
  afterAddChildToDOM?: ChildAction;
  afterRemoveChild?: ChildAction;
  afterRender?: ViewAction;
  onTooltip?: TooltipAction;
  afterMount?: ViewAction;

  retainOnRemove?: zboolean;
  onUndo?: BasicAction;
  onRedo?: BasicAction;

  origin?: ZType<Point2D>;
  extent?: ZType<Size2D>;
  fitToParent?: zboolean;
  scaleToParent?: zboolean;
  animations?: AnimationSpec[];

  effects?: EffectsBundle;
  actors?: Handler<unknown>[];

  tooltip?: zstring;
  tooltipPlacement?: PlacementOption;

  placement?: PlacementOption;
  tabIndex?: znumber;
  isDialog?: boolean;

  resolveResource?: ResolveResourceFn;

  styleKeys?: string[];
  view?: View;
  role?: string;

  componentDefaults?: ComponentDefaultsMap;
  localDefaults?: LocalDefaults;
}

export type ViewOptions = Partial<ViewOptionsRecord>;

/**
 * view with the event listener
 */
export function viewWithEventListener(evt: Event): View | undefined {
  return View.getViewFromEventCurrentTarget(evt);
}
/**
 * view that triggered the event
 */
export function viewThatTriggeredEvent(evt: Event): View | undefined {
  return View.getViewFromEventTarget(evt);
}

export function setInnerHTML(view: View, s: string): void {
  view.elt.innerHTML = SanitizeService.defaultInstance.clean(s);
}

//
// Add the given events into the current event options. If there is an existing handler,
// add to it or convert to an array (an EventActions is either a single callback or an
// array of callbacks).
// TODO: make Typescript happy without all this casting
//
export function addOptionEvents(options: ViewOptions, events: Events): void {
  options.events ??= {};
  const currentEvents = options.events;
  const currentKeys = Object.keys(currentEvents) as EventsKey[];
  (Object.keys(events) as EventsKey[]).forEach((key) => {
    const newVal = events[key];
    if (currentKeys.includes(key) && isEventActionsKey(key)) {
      const existingVal = currentEvents[key];
      if (Array.isArray(existingVal)) {
        (existingVal as any[]).push(newVal);
      } else {
        (options.events as any)[key] = [currentEvents[key], events[key]];
      }
    } else {
      (options.events as any)[key] = events[key];
    }
  });
}

export function beforeAddedToDOM(options: ViewOptions, action: ViewAction): void {
  options.beforeAddedToDOM ??= [];
  options.beforeAddedToDOM.push(action);
}
export function afterAddedToDOM(options: ViewOptions, action: ViewAction): void {
  options.afterAddedToDOM ??= [];
  options.afterAddedToDOM.push(action);
}
/**
 * Base class for UI components. A View is responsible for creating and managing a single HTMLElement.
 * The underlying element is typically a div, but other tags are also supported.
 */
export class View implements AttrTarget, ListenerTarget, AnimationTarget, EffectTarget {
  // each view has a unique id; id values start at 1, so 0 is an invalid id
  private static _nextViewID = 1;
  private nextViewID(): number {
    return View._nextViewID++;
  }

  static bodyView: View;
  static rootView: View;
  static lastFocus: View;

  public resolveResource(name: zstring): string {
    return (
      this.options.resolveResource?.(name) || this.parent?.resolveResource(name) || View.rootView.resolveResource(name)
    );
  }

  public static defaultTheme: ITheme;
  public static themeStack: ITheme[] = [];
  public static pushTheme(theme: ITheme): void {
    this.themeStack.push(theme);
  }
  public static popTheme(): ITheme | undefined {
    return this.themeStack.pop();
  }

  public static get activeView(): View | undefined {
    return this.getViewFromZaffreData(document.activeElement);
  }
  public undo(): void {
    this.options.onUndo?.();
  }
  public redo(): void {
    this.options.onRedo?.();
  }
  public children = arrayAtom<View>([]);
  public elt: ZElement;
  public viewID = this.nextViewID();

  private _parent?: Atom<View | undefined>;
  public get parent(): View | undefined {
    return this._parent?.get();
  }
  public setParent(v: View | undefined): void {
    this._parent ??= atom(v);
    this._parent.set(v);
  }

  @lazyinit get applyContentAction(): ReactiveAction {
    return reactiveAction(
      () => this.applyContent(),
      () => this.renderContent()
    );
  }
  @lazyinit get applyStyleAction(): ReactiveAction {
    return reactiveAction(() => this.applyStyle());
  }

  // Delegate methods

  createElement(tagName: string): ZElement {
    return this.delegate.createElement(tagName);
  }
  tagName(): string {
    return this.delegate.tagName();
  }
  offsetLeft(): number {
    return this.delegate.offsetLeft();
  }
  offsetTop(): number {
    return this.delegate.offsetTop();
  }
  get overlay(): View {
    return this.delegate.overlay;
  }
  setCSSClass(clsName: string): void {
    return this.delegate.setCSSClass(clsName);
  }

  //

  public setOffset(pt: Point2D): void {
    this.elt.style.left = `${pt.x}px`;
    this.elt.style.top = `${pt.y}px`;
  }

  ////////////////////////////////////////////////////////////////////////////////////

  routePoint?: RouteAtom;
  findEnsembleWithRoutePoint(routeName: string): View | undefined {
    return this.findDescendant((v) => v.routePoint?.name === routeName);
  }
  findParentWithRoutePoint(): View | undefined {
    return this.parent?.routePoint ? this.parent : this.parent?.findParentWithRoutePoint();
  }
  findRoutePath(): string {
    return (this.parent?.findRoutePath() || "") + (this.routePoint?.pathComponent() || "");
  }

  ////////////////////////////////////////////////////////////////////////////////////

  @lazyinit public get attributeBundle(): AttrBundle {
    return new AttrBundle(this);
  }

  public htmlAttributes(): Attributes {
    return this.delegate.htmlAttributes();
  }
  public htmlAttributeSummary(): string {
    return this.delegate.htmlAttributeSummary();
  }
  public cssAttributes(): Attributes {
    return this.delegate.cssAttributes();
  }
  public svgAttributes(): Attributes {
    return this.delegate.svgAttributes();
  }
  public svgAttributeSummary(): string {
    return this.delegate.svgAttributeSummary();
  }

  domDepth(): number {
    return this.parent ? this.parent.domDepth() + 1 : 0;
  }

  ////////////////////////////////////////////////////////////////////////////////////

  private setZaffreData(): void {
    (this.elt as any)["data-zaffre"] = this;
  }
  static getViewFromZaffreData(elt: Element | null): View | undefined {
    return (elt as any)["data-zaffre"];
  }
  static getViewFromEventCurrentTarget(evt: Event): View | undefined {
    return this.getViewFromZaffreData(<Element>evt.currentTarget);
  }
  static getViewFromEventTarget(evt: Event): View | undefined {
    return this.getViewFromZaffreData(<Element>evt.target);
  }

  constructor(public delegate: ViewDelegate, public options: ViewOptions = {}) {
    delegate.view = this;
    if (this.options.id === "_root") {
      this.elt = document.documentElement;
      this.setZaffreData();
    } else if (this.options.id === "_body") {
      this.elt = document.body;
      this.setZaffreData();
    } else {
      this.elt = this.createElement(this.tagName());
    }
    // stash this instance in the DOM for debugging and recovering views from DOM elements
    this.setZaffreData();
  }

  @lazyinit get floatingChildren(): ArrayAtom<View> {
    return arrayAtom<View>([]);
  }
  isFloating(): boolean {
    return Boolean(this.options.floating);
  }
  floatingCount(): number {
    return (this.parent?.floatingCount() || 0) + (this.isFloating() ? 1 : 0);
  }
  isDialog(): boolean {
    return Boolean(this.options.isDialog);
  }

  adjustOptions(): void {
    this.delegate.adjustOptions();
    if (this.options.theme) {
      // note: we don't keep theme as an atom, but we allow an atom to be passed in options
      this.setTheme(zget(this.options.theme));
      if (this.options.theme instanceof Atom) {
        this.options.theme.addAction((theme) => this.setTheme(theme));
      }
    }
    if (this.options.sharedState) {
      this.iState("hovered").addAction((val) => this.options.sharedState?.hovered?.set(val));
    }
    if (this.options.hidden) {
      const hidden = this.options.hidden;
      hidden.addAction(() => this.setHiddenState(zget(hidden)));
      if (this.options.sharedState) {
        hidden.addAction((val) => this.options.sharedState?.hidden?.set(val));
      }
    }
    if (this.options.selected) {
      this.options.selected.addAction(() => this.setSelectedState(zget(this.options.selected)!));
      this.options.selected.addAction(() => this.afterSelect());
    }
    if (this.options.mounted) {
      const mounted = this.options.mounted;
      mounted.addAction(() => this.setMountedState(zget(mounted)));
    }
    if (this.options.disabled) {
      this.setInteractionState(zget(this.options.disabled) ? "disabled" : "enabled");
      this.options.disabled.addAction(() =>
        this.setInteractionState(zget(this.options.disabled) ? "disabled" : "enabled")
      );
    }
    if (this.options.onIntersectionVisible) {
      this.addIntersectionAction(() => this.options.onIntersectionVisible!(this));
    }
    if (this.options.onResize) {
      this.addResizeAction(() => this.options.onResize!(this));
    }
    if (this.options.onSelect) {
      this.options.selected?.addAction((b) => b && this.options.onSelect!(this));
    }
    if (this.options.tooltip) {
      this.addTooltipHandler();
    }
    if (this.options.clickAction) {
      this.addOptionEvents({ click: (evt) => handleEvents(this.options.clickAction, evt) });
    }
  }
  initialize(): void {
    this.initializeEvents(this.options.events || {});
    this.initializeEffects(this.options.effects || {});
    this.initializeHandlers();
    this.initializeAnimations();
  }

  initialized = false;

  beforeAddedToDOM(): void {
    this.options.beforeAddedToDOM?.toReversed().forEach((a) => a(this));
    if (!this.initialized) {
      this.adjustOptions();
      this.initialize();
      this.initialized = true;
    }
    this.delegate.afterAddedToDOM();
  }

  afterAddedToDOM(): void {
    this.delegate.afterAddedToDOM();

    this.options.afterAddedToDOM?.toReversed().forEach((a) => a(this));
    this.attributeBundle.apply();
    this.applyStyleAction.perform();
    this.setMountedState(true);
    this.options.afterMount?.(this);
  }

  initializeAnimations(): void {
    this.options.animations?.forEach((a) => a.setTarget(this));
  }
  animate(
    keyframes: Keyframe[] | PropertyIndexedKeyframes | null,
    options?: number | KeyframeAnimationOptions | undefined
  ): Animation {
    return this.elt.animate(keyframes, options);
  }

  allAnimations(): Animation[] {
    let answer = this.elt.getAnimations();
    this.children.forEach((child) => (answer = [...answer, ...child.allAnimations()]));
    return answer;
  }

  @lazyinit get iStates(): Map<InteractionState, Atom<boolean>> {
    return new Map<InteractionState, Atom<boolean>>();
  }
  iState(state: InteractionState): Atom<boolean> {
    return zutil.getMapValue(this.iStates, state, () =>
      atom(() => this.currentInteractionState === state, { name: state })
    );
  }

  needsPointerEvents(): boolean {
    const evts = this.options.events;
    return (
      Boolean(zget(this.options.tooltip)) ||
      zget(this.options.needsPointerEvents) ||
      Boolean(
        evts?.pointerMove ||
          evts?.pointerDown ||
          evts?.pointerUp ||
          evts?.pointerOver ||
          evts?.pointerLeave ||
          this.options.sharedState?.hovered
      )
    );
  }

  @lazyinit get actors(): Handler<any>[] {
    return [];
  }
  initializeEvents(evts: Events): void {
    if (
      evts.click ||
      evts.dblClick ||
      evts.mouseDown ||
      evts.mouseUp ||
      evts.mouseOver ||
      evts.mouseMove ||
      evts.contextMenu
    ) {
      this.addMouseHandler({
        click: evts.click,
        dblclick: evts.dblClick,
        mousedown: evts.mouseDown,
        mouseup: evts.mouseUp,
        mouseover: evts.mouseOver,
        mousemove: evts.mouseMove,
        contextmenu: evts.contextMenu,
      });
    }

    (evts.blur || evts.focus) && this.addFocusHandler({ blur: evts.blur, focus: evts.focus });
    evts.wheel && this.addWheelHandler({ wheel: evts.wheel });

    if (evts.keyDown || evts.keyUp || evts.keyBindings) {
      this.options.tabIndex = 0;
      this.addKeyHandler({ keydown: evts.keyDown, keyup: evts.keyUp, keyBindings: evts.keyBindings });
    }
    evts.drag && this.addDragHandler(evts.drag);
    evts.drop && this.actors.push(dropHandler(evts.drop));

    if (this.needsPointerEvents() && !this.actors.some((a) => a instanceof PointerHandler)) {
      this.addPointerHandler({
        pointerdown: evts.pointerDown,
        pointerup: evts.pointerUp,
        pointerover: evts.pointerOver,
        pointerleave: evts.pointerLeave,
        pointermove: evts.pointerMove,
      });
    }
    evts.input && this.addInputHandler({ input: evts.input });
    evts.change && this.addGenericHandler({ change: evts.change });
    evts.select && this.addGenericHandler({ select: evts.select });

    if (evts.cut || evts.copy || evts.paste) {
      this.addClipboardHandler({ cut: evts.cut, copy: evts.copy, paste: evts.paste });
    }
  }

  addHandler(actor: Handler<unknown>): void {
    this.actors.push(actor);
  }
  addDragHandler(options: DragHandlerOptions): void {
    this.addHandler(dragHandler(options));
  }
  addDropHandler(options: DropHandlerOptions): void {
    this.addHandler(dropHandler(options));
  }
  addFocusHandler(options: FocusHandlerOptions): void {
    this.addHandler(focusHandler(options));
  }
  addWheelHandler(options: WheelHandlerOptions): void {
    this.addHandler(wheelHandler(options));
  }
  addGenericHandler(options: GenericEventHandlerOptions): void {
    this.addHandler(genericEventHandler(options));
  }
  addInputHandler(options: InputHandlerOptions): void {
    this.addHandler(inputHandler(options));
  }
  addKeyHandler(options: KeyHandlerOptions): void {
    this.addHandler(keyHandler(options));
  }
  addMouseHandler(options: MouseHandlerOptions): void {
    this.addHandler(mouseHandler(options));
  }
  addPointerHandler(options: PointerHandlerOptions): void {
    this.addHandler(pointerHandler(options));
  }
  addClipboardHandler(options: ClipboardHandlerOptions): void {
    this.addHandler(clipboardHandler(options));
  }
  handlesClickEvent(): boolean {
    return Boolean(this.options.events?.click);
  }

  initializeEffects(effects: EffectsBundle): void {
    const interactionKeys = Object.keys(effects).filter((key) => isInteractionState(key));
    if (interactionKeys.length > 0) {
      this.actors.push(interactionHandler(zutil.pick(effects, interactionKeys)));
    }
    if (interactionKeys.includes("clicked")) {
      if (!this.actors.some((a) => a instanceof MouseHandler)) {
        this.actors.push(mouseHandler({ click: (): void => undefined }));
      }
    }
    if (effects.contentChanged) {
      this.actors.push(contentChangedHandler(effects.contentChanged));
    }
    if (effects.hidden) {
      this.actors.push(hiddenHandler(effects.hidden));
    }
    if (effects.mounted) {
      this.actors.push(mountedHandler(effects.mounted));
    }
    if (effects.selected) {
      this.actors.push(selectedHandler(effects.selected));
    }
  }
  initializeHandlers(): void {
    this.options.actors?.forEach((actor) => this.actors.push(actor));
    this.actors.forEach((actor) => actor.setTarget(this));
    this.delegate.initializeHandlers();
  }

  animatingView(): View {
    return this;
  }

  cancelRunningAnimations(): void {
    try {
      this.animatingView()
        .allAnimations()
        .filter((animation) => animation.playState === "running")
        .forEach((animation) => animation.cancel());
    } catch (e) {
      console.log("cancelRunningAnimations: " + e);
    }
  }
  waitForAnimationsToFinish(fn?: BasicAction): void {
    Promise.all(
      this.animatingView()
        .allAnimations()
        .filter((animation) => animation.playState === "running")
        .map((animation) => animation.finished)
    )
      .catch((err) => zlog.trace(err))
      .then(() => (fn ? fn() : undefined));
  }

  // interaction init is lazy since not all views are interactive
  @lazyinit public get interactionState(): Atom<InteractionState> {
    return atom("enabled");
  }

  public get currentInteractionState(): InteractionState {
    return this.interactionState.get();
  }

  public addStateAction(state: InteractionState, action: BasicAction): void {
    this.interactionState.addAction((val) => val === state && action());
  }

  // TODO: handle focus/blur

  setInteractionState(state: InteractionState, action?: BasicAction): void {
    zlog.debug(`### ${this} setInteractionState: ${state} (was ${this.currentInteractionState})`);
    if (state !== this.currentInteractionState) {
      // TODO: canceling results in an abort on a ripple
      //this.cancelRunningAnimations();
      this.waitForAnimationsToFinish(() => {
        // ensure that the out animation is performed first (TODO: generalize this)
        this.interactionState.moveDerivedAtomFirst(this.currentInteractionState);

        this.interactionState.set(state);
        this.waitForAnimationsToFinish(action);
      });
    }
  }

  @lazyinit public get mountedState(): Atom<boolean> {
    return atom(this.options.mounted || false);
  }
  setMountedState(mounted: boolean, action?: BasicAction): void {
    this.mountedState.set(mounted);
    this.waitForAnimationsToFinish(action);
  }

  @lazyinit public get hiddenState(): Atom<boolean> {
    return atom(this.options.hidden || false);
  }
  hasHiddenEffect(): boolean {
    return Boolean(this.options.effects?.hidden);
  }
  async setHiddenState(hidden: boolean): Promise<void> {
    if (hidden) {
      if (!this.hasHiddenEffect()) {
        this.cancelRunningAnimations();
      }
      this.waitForAnimationsToFinish(() => this.elt.classList.add("hidden"));
    } else {
      this.elt.classList.remove("hidden");
    }
  }

  @lazyinit public get selectedState(): Atom<boolean> {
    return atom(this.options.selected || false);
  }
  afterSelect(): void {
    // hook for subclasses
  }
  setSelectedState(selected: boolean): void {
    this.selectedState.set(selected);
    if (selected) {
      this.focus(); // TODO: we should do this only if view usesFocus
    } else {
      this.blur();
    }
  }

  @lazyinit get contentChangedState(): Atom<boolean> {
    return atom(false);
  }

  setContentChangedState(set: boolean, action?: BasicAction): void {
    this.contentChangedState.set(set);
    if (!set) {
      this.waitForAnimationsToFinish(action);
    }
  }

  /////////////////////////  /////////////////////////  /////////////////////////

  @lazyinit static get intersectionObserver(): IntersectionObserver {
    return new IntersectionObserver((entries: IntersectionObserverEntry[]) => {
      for (const entry of entries) {
        const view = View.getViewFromZaffreData(entry.target);
        view?.intersectionState.set(entry.isIntersecting);
      }
    });
  }
  @lazyinit get intersectionState(): Atom<boolean> {
    View.intersectionObserver.observe(this.elt);
    return atom(false);
  }
  addIntersectionAction(action: TAction<boolean>): void {
    this.intersectionState.addAction(action);
  }

  addIntersectionTimer(interval: znumber, action: BasicAction): void {
    let timer: ReturnType<typeof setInterval> | undefined;
    function updateIntersectionTimer(b: boolean): void {
      if (timer && !b) {
        clearInterval(timer);
        timer = undefined;
      } else if (b && zget(interval)) {
        timer = setInterval(() => action(), zget(interval));
      }
    }
    if (interval instanceof Atom) {
      interval.addAction((val) => updateIntersectionTimer(val > 0));
    }
    this.addIntersectionAction(() => updateIntersectionTimer(this.intersectionState.get()));
  }

  @lazyinit static get resizeObserver(): ResizeObserver {
    return new ResizeObserver((entries: ResizeObserverEntry[]) => {
      for (const entry of entries) {
        if (entry.contentBoxSize) {
          // Firefox implements `contentBoxSize` as a single content rect, rather than an array
          const contentBoxSize = Array.isArray(entry.contentBoxSize) ? entry.contentBoxSize[0] : entry.contentBoxSize;
          const view = View.getViewFromZaffreData(entry.target);
          view?.resizeState.set(contentBoxSize);
        }
      }
    });
  }

  @lazyinit get resizeState(): Atom<ResizeObserverSize | undefined> {
    View.resizeObserver.observe(this.elt);
    return atom(undefined);
  }

  addResizeAction(action: BasicAction): void {
    this.resizeState.addAction(action);
  }

  disableResizeObserver(): void {
    View.resizeObserver.unobserve(this.elt);
  }
  enableResizeObserver(): void {
    View.resizeObserver.observe(this.elt);
  }
  disableResizeObserverWhile(fn: () => void): void {
    this.disableResizeObserver();
    fn();
    setTimeout(() => this.enableResizeObserver(), 100);
  }

  @lazyinit get mutationState(): Atom<boolean> {
    View.mutationObserver.observe(this.elt, { childList: true, subtree: true });
    return atom(false, { alwaysFire: true });
  }
  @lazyinit static get mutationObserver(): MutationObserver {
    return new MutationObserver((records, observer) => {
      for (const record of records) {
        const observedElt = (<Element>record.target).closest("[mutation-observed]");
        const observedView = View.getViewFromZaffreData(observedElt);
        observedView?.mutationState.set(true);
      }
    });
  }
  addMutationAction(action: BasicAction): void {
    this.elt.setAttribute("mutation-observed", "");
    this.mutationState.addAction(action);
  }

  public get width(): number {
    return this.clientRect().width;
  }
  public get height(): number {
    return this.clientRect().height;
  }

  private _theme?: ITheme;
  public get theme(): ITheme {
    if (this === this.parent) {
      throw Error("invalid parent view");
    }
    return this._theme ? this._theme : this.parent ? this.parent.theme : View.defaultTheme;
  }
  public setTheme(theme: ITheme): void {
    this._theme = theme;
    theme.setTarget(this);
  }

  public release(): void {
    this.setParent(undefined);
    this.children.forEach((c) => c.release());
  }

  /**
   * Coordinates
   */
  eventPoint(event: MouseEvent): Point2D {
    return point2D(event.clientX, event.clientY);
  }
  eventViewPoint(event: MouseEvent): Point2D {
    const clientRect = this.clientRect();
    return point2D(event.clientX - clientRect.left, event.clientY - clientRect.top);
  }
  emToPx(em: string): number {
    const fs = this.getStylePropertyValue("font-size");
    return parseFloat(em) * parseFloat(fs);
  }
  getStylePropertyValue(property: string): string {
    return this.computedStyle().getPropertyValue(zutil.kebabize(property));
  }
  computedStyle(): CSSStyleDeclaration {
    return getComputedStyle(this.elt);
  }
  indexInParent(): number {
    return this.parent ? this.parent.children.indexOf(this) : -1;
  }

  /*
   * Events
   */

  addOptionEvents(events: Events): void {
    this.options.events ??= {};
    addOptionEvents(this.options, events);
  }

  @lazyinit public get enabled(): Atom<boolean> {
    return atom(() => this.isEnabled());
  }

  @lazyinit public get listeners(): Map<EventType, Listener<Event>> {
    return new Map<EventType, Listener<Event>>();
  }
  addListenerAction<E extends Event>(type: EventType, action: EventAction<E>): void {
    const listener = zutil.getMapValue(this.listeners, type, () => new Listener<E>(this, type));
    listener.currentEvent.addAction((evt) => evt && action(<E>evt));
  }

  click(evt?: Event): void {
    // hook for subclasses
  }

  _clickPoint?: Point2D;
  get clickPoint(): Point2D | undefined {
    return this._clickPoint || this.parent?.clickPoint;
  }
  set clickPoint(pt: Point2D | undefined) {
    this._clickPoint = pt;
  }
  setClickPointFromEvent(event: MouseEvent): void {
    this.clickPoint = this.eventPoint(event);
  }

  /** Interaction states */

  public disable(): void {
    this.setInteractionState("disabled");
  }
  public enable(): void {
    this.setInteractionState("enabled");
  }
  public elevation(): number {
    return zget(this.options.elevation) || 0;
  }
  public isDisabled(): boolean {
    return zget(this.options.disabled) || this.currentInteractionState === "disabled";
  }
  public isEnabled(): boolean {
    return !this.isDisabled();
  }
  @lazyinit get disabled(): Atom<boolean> {
    return this.options.disabled ?? atom(false);
  }
  public isHovered(): boolean {
    return this.isEnabled() && this.currentInteractionState === "hovered";
  }
  public isFocused(): boolean {
    return this.isEnabled() && this.currentInteractionState === "focused";
  }
  public isPressed(): boolean {
    return this.isEnabled() && this.currentInteractionState === "pressed";
  }
  public isDragged(): boolean {
    zlog.debug("isDragged: " + this.currentInteractionState);
    return this.isEnabled() && this.currentInteractionState === "dragged";
  }
  public isDraggedOver(): boolean {
    return this.isEnabled() && this.currentInteractionState === "draggedOver";
  }

  /////////////////////

  get tooltipView(): View | undefined {
    return this.floatingChildren.find((child) => child.options.name === "Tooltip") || this.parent?.tooltipView;
  }
  addTooltipHandler(): void {
    this.interactionState.addAction(() => {
      const tip = zget(this.options.tooltip, "");
      tip && this.tooltipView?.options.onTooltip?.(this.tooltipView, this, tip, this.isHovered());
    });
  }

  /////////////////////

  _referenceView?: View | undefined;
  get referenceView(): View {
    return this._referenceView || this.parent || View.bodyView;
  }
  set referenceView(view: View | undefined) {
    this._referenceView = view;
  }
  place(): void {
    // hide until we've been placed
    this.elt.style.opacity = "0";
    setTimeout(() => this.placeNow(), 50);
  }
  placeNow(): void {
    const placement = zget(this.options.placement);

    const { offset, size } = placementOffsetAndSize(this.clientRect(), this.referenceView.clientRect(), placement);
    let finalOffset = offset;

    if (this.parent && this.parent !== this.referenceView) {
      finalOffset = offset.add(this.referenceView.clientRect().origin);
    }
    const r = rect2D(finalOffset.x, finalOffset.y, this.width, this.height);

    // keep it onscreen
    if (this.parent?.isFloating()) {
      const box = r.constrainWithin(ZWindow.instance.screenRect2D.insetBy(12));
      this.setOffset(box.origin);
    } else {
      this.setOffset(finalOffset);
    }
    if (size.width) {
      this.setWidth(size.width);
    }
    if (size.height) {
      this.setHeight(size.width);
    }

    // now show it
    this.elt.style.opacity = "1";
  }

  /*
   * Styles
   */

  addStyleRule(selector: string, attributes: string): void {
    ZStyleSheet.default.addRule("." + this.styleName() + selector, attributes);
  }
  cssID(): string {
    return `v_${this.viewID}`;
  }

  _vClassName?: string;
  get vClassName(): string {
    return (this._vClassName ??= this.baseStyleName());
  }
  public setVClassName(clsName: string): void {
    this._vClassName = clsName;
  }

  get componentName(): string {
    return this.options.componentName || "";
  }
  public baseStyleName(): string {
    return `${zutil.kebabize(this.componentName || this.constructor.name)}_v_${this.viewID}`;
  }
  public styleName(): string {
    const extra = this.options.extraClasses ? ` ${this.options.extraClasses}` : "";
    return `${this.vClassName}${extra}${zget(this.options.hidden) ? " hidden" : ""}`;
  }
  private capitalizePart(p: string): string {
    return p === "svg" ? "SVG" : p === "html" ? "HTML" : zutil.capitalizeFirstLetter(p);
  }
  // zname is unique and includes component name or constructor name, so we always have some idea of the kind of view
  public get zname(): string {
    const firstPart = (this.componentName || this.constructor.name)
      .split("-")
      .slice(-1)
      .map((p) => this.capitalizePart(p))
      .join("");

    return firstPart + (this.options.name ? ":" + this.options.name : "") + `_${this.viewID}`;
  }
  public get viewName(): string {
    return this.options.name || this.componentName;
  }
  public get url(): string {
    return `url(#${this.zname})`;
  }

  protected applyStyle(): void {
    this.setAttribute("zname", this.zname);
    this.setCSSClass(this.styleName());
    this.addExtraVars();
  }
  public style(): ZStyle | undefined {
    return ZStyle.named(this.baseStyleName());
  }
  protected addExtraVars(): void {
    this.options.extraVars?.forEach(([key, value]) => this.elt.style.setProperty(key, value, "important"));
  }

  private addPx(val: number | string): string {
    return typeof val === "number" ? `${val}px` : val;
  }
  public setHeight(h: number | string): void {
    this.elt.style.height = this.addPx(h);
  }
  public setMinHeight(h: number | string): void {
    this.elt.style.minHeight = this.addPx(h);
  }
  public setWidth(w: number | string): void {
    this.elt.style.width = this.addPx(w);
  }
  public setMinWidth(w: number | string): void {
    this.elt.style.minWidth = this.addPx(w);
  }
  public setPosition(x: number, y: number): void {
    this.elt.style.left = this.addPx(x);
    this.elt.style.top = this.addPx(y);
  }
  isSelected(): boolean {
    return zget(this.options.selected) || false;
  }
  isHidden(): boolean {
    return Boolean(zget(this.options.hidden));
  }
  isVisible(): boolean {
    return !this.isHidden();
  }
  setProperty(key: string, value: string, priority = ""): void {
    if (value) {
      this.elt.style.setProperty(key, value, priority);
    } else {
      this.elt.style.removeProperty(key);
    }
  }
  getProperty(key: string): string {
    return this.elt.style.getPropertyValue(key);
  }

  rootView(): View {
    return this.parent ? this.parent.rootView() : this;
  }

  /*
   *  Rendering
   */

  // TODO: clean up the lifecycle methods; in particular, beforeAddedToDOM() is called inconsistently;
  // sometimes it's called after the child has been added

  getContent(): zstring {
    return this.options.onGetContent?.() || "";
  }
  hasContent(): boolean {
    return Boolean(this.options.onApplyContent);
  }
  protected applyContent(): void {
    if (this.hasContent()) {
      this.options.onApplyContent?.(this);
    }
  }
  protected renderContent(): void {
    this.setContentChangedState(false, () => {
      this.applyContent();
      this.setContentChangedState(true);
    });
  }

  protected applyLayout(): void {
    // hook for subclasses
  }

  protected afterRender(): void {
    // hook for subclasses
  }

  rendered = false;

  public render(): void {
    if (!this.rendered) {
      // no parent yet, so make the view theme available on a stack
      //View.pushTheme(this.theme);
      //View.pushResources(this.resources);

      this.applyLayout();

      this.children.forEach((child) => this.renderChild(child));
      this.viewLists?.forEach((viewList) => viewList.composeSubviews(this));

      if (this.options.onApplyContent) {
        this.applyContentAction.perform();
      }
      //View.popTheme();
      //View.popResources();
      this.rendered = true;
    }
  }

  //
  renderChild(childView: View): void {
    let child = childView;
    if (!child.rendered) {
      child.beforeAddedToDOM();
      child.render();
      this.addChildToDOM(child);
      child.afterAddedToDOM();
    }
  }

  childNames(): string[] {
    return this.children.map((v) => v.zname);
  }
  hasVisibleChild(): boolean {
    return this.children.some((v) => !v.isHidden());
  }

  addChildToDOM(childView: View): void {
    this.elt.append(childView.elt);
    this.options.afterAddChildToDOM?.(this, childView);
  }

  public appendAndRender(childView: View): void {
    this.appendChild(childView);
    this.renderChild(childView);
  }

  @lazyinit get visibleChildID(): Atom<number> {
    return atom(-1);
  }
  @lazyinit get selectedChildID(): Atom<number> {
    return atom(-1);
  }

  appendChild(child: View): void {
    this.delegate.appendChild(child);
  }

  viewLists?: Set<VList<any>>;
  public appendViewList<T>(viewList: VList<T>): void {
    this.viewLists ??= new Set<VList<T>>();
    this.viewLists.add(viewList);
  }
  appendLazyView(lazyView: LazyView): void {
    lazyView.parentView = this;
  }

  // NOTE: this should be called only from within applyLayout() or from appendAndMount()
  public append<T>(...views: (View | VList<T> | LazyView | undefined)[]): View {
    views.forEach((view) => {
      if (view instanceof View) {
        this.appendChild(view);
      } else if (view instanceof VList) {
        this.appendViewList(view);
      } else if (view instanceof LazyView) {
        this.appendLazyView(view);
      }
    });
    return this;
  }

  replaceChild(oldChild: View, newChild: View): void {
    const idx = this.children.indexOf(oldChild);
    if (idx !== -1) {
      oldChild.elt.replaceWith(newChild.elt);
      this.children.get()[idx] = newChild;
    }
  }

  /*
   * DOM methods
   */

  public isFirstChild(): boolean {
    return this.elt.parentElement?.firstElementChild === this.elt;
  }
  public isLastChild(): boolean {
    return this.elt.parentElement?.lastElementChild === this.elt;
  }

  public setFocusable(b: boolean): void {
    this.elt.tabIndex = b ? 0 : -1;
  }
  public addEventListener(type: string, listener: EventListenerOrEventListenerObject, capture = false): void {
    if (listener) {
      this.elt.addEventListener(type, listener, capture);
    }
  }
  public removeEventListener(type: string, listener: EventListenerOrEventListenerObject): void {
    if (listener) {
      this.elt.removeEventListener(type, listener);
    }
  }
  public aspectRatio(): number {
    const r = this.clientRect();
    return r.width / r.height;
  }
  public clientRect(): Rect2D {
    return Rect2D.fromDOMRect(this.elt.getBoundingClientRect());
  }
  public parentClientRect2D(): Rect2D {
    return this.elt.parentElement
      ? Rect2D.fromDOMRect(this.elt.parentElement.getBoundingClientRect())
      : Rect2D.emptyRect;
  }
  public scrollBy(x: number, y: number): void {
    this.elt.scrollBy(x, y);
  }

  public focus(preventScroll?: boolean): void {
    setTimeout(() => this.elt.focus({ preventScroll }), 200);
    View.lastFocus = this;
  }
  public blur(): void {
    setTimeout(() => this.elt.blur(), 200);
  }
  public hasFocus(): boolean {
    return this.elt === document.activeElement;
  }

  public isActiveView(): boolean {
    return document.activeElement === this.elt;
  }

  public moveAfter(view: View): void {
    if (view) {
      this.elt.parentNode?.insertBefore(this.elt, view.elt.nextElementSibling);
    }
  }
  public moveBefore(view: View): void {
    if (view) {
      this.elt.parentNode?.insertBefore(this.elt, view.elt);
    }
  }
  public moveAfterNextSibling(): void {
    if (this.elt.nextElementSibling) {
      this.elt.parentNode?.insertBefore(this.elt.nextElementSibling, this.elt);
    }
  }
  public moveBeforePreviousSibling(): void {
    if (this.elt.previousElementSibling) {
      this.elt.parentNode?.insertBefore(this.elt, this.elt.previousElementSibling);
    }
  }
  private nextSibling(): Element | null {
    return this.elt.nextElementSibling;
  }
  public nextSiblingView(): View | undefined {
    const nextSibling = this.nextSibling();
    return nextSibling ? View.getViewFromZaffreData(nextSibling) : undefined;
  }
  private previousSibling(): Element | null {
    return this.elt.previousElementSibling;
  }
  public previousSiblingView(): View | undefined {
    const previousSibling = this.previousSibling();
    return previousSibling ? View.getViewFromZaffreData(previousSibling) : undefined;
  }
  public removeAttribute(attrName: string): void {
    this.elt.removeAttribute(attrName);
  }
  public attach(): void {
    this.parent?.addChildToDOM(this);
    this.parent?.addChild(this);
    this.setMountedState(true);
  }
  public detach(): void {
    this.setMountedState(false, () => {
      this.elt.remove();
      this.parent?.removeChild(this);
    });
  }

  public previousLocation?: Point2D;
  public translationFromPreviousLocation(): string {
    return (
      this.previousLocation ? this.previousLocation.subtract(this.clientRect().origin) : point2D(0, 0)
    ).asTranslation();
  }
  public distanceFromPreviousLocation(): number {
    return this.previousLocation ? this.previousLocation.distanceTo(this.clientRect().origin) : 0;
  }

  public remove(): void {
    this.previousLocation = this.clientRect().origin;
    if (!zget(this.options.retainOnRemove)) {
      this.setMountedState(false, () => {
        this.elt.remove();
        this.parent?.removeChild(this);
        this.release();
      });
    }
  }
  public removeChild(c: View): void {
    try {
      this.elt.removeChild(c.elt);
    } catch {
      //
    }
    this.children.filter((child) => child !== c);
    this.options.afterRemoveChild?.(this, c);
  }
  public addChild(child: View): void {
    if (!this.children.includes(child)) {
      this.children.push(child);
    }
    child.setParent(this);
  }
  // breadth-first search to find child
  public findDescendant(predicate: (view: View) => boolean): View | undefined {
    const queue: View[] = [this];
    while (queue.length > 0) {
      const v = queue.shift()!;
      for (const w of v.children.get()) {
        if (predicate(w)) {
          return w;
        } else {
          queue.push(w);
        }
      }
    }
    return undefined;
  }
  public hScrollParent(): View | undefined {
    return this.elt.scrollWidth > this.elt.clientWidth + 1
      ? this
      : this.parent
      ? this.parent.hScrollParent()
      : undefined;
  }
  public vScrollParent(): View | undefined {
    return this.elt.scrollHeight > this.elt.clientHeight + 1
      ? this
      : this.parent
      ? this.parent.vScrollParent()
      : undefined;
  }
  public scrollIntoViewIfNeeded(offset = 20): void {
    const scrollParent = this.vScrollParent();
    if (this.height === 0 || !scrollParent) {
      return;
    }
    const pr = scrollParent.clientRect();
    const r = this.clientRect().translatedBy(pr.origin.negated());
    if (r.bottom > pr.height) {
      // make the bottom visible
      scrollParent.scrollBy(0, r.bottom - pr.height + offset);
    }
    const rr = this.clientRect().translatedBy(pr.origin.negated());
    if (rr.top < 0) {
      // make the top visible
      scrollParent.scrollBy(0, rr.top - offset);
    }
  }
  public scrollIntoViewDelayed(delay = 10): void {
    setTimeout(() => this.scrollIntoViewIfNeeded(), delay);
  }
  public setAttribute(attrName: string, value: string): void {
    if (value) {
      this.elt.setAttribute(attrName, value);
    } else {
      this.elt.removeAttribute(attrName);
    }
  }
  public setAttributes(attrs: Map<string, string>): void {
    [...attrs.keys()].forEach((key) => this.elt.setAttribute(key, <string>attrs.get(key)));
  }
  public setTextContent(text: string): void {
    this.elt.textContent = text;
  }
  public getTextContent(): string {
    return this.elt.textContent || "";
  }

  // origin is used for elements with absolute position
  protected _originAtom?: Atom<Point2D>;
  protected get originAtom(): Atom<Point2D> {
    if (!this._originAtom) {
      const r = this.clientRect().translatedBy(this.parentClientRect2D().origin.negated());
      this._originAtom ??= atom(point2D(r.left, r.top));
    }
    return this._originAtom;
  }
  protected _extentAtom?: Atom<Size2D>;
  protected get extentAtom(): Atom<Size2D> {
    if (!this._extentAtom) {
      const r = this.clientRect().translatedBy(this.parentClientRect2D().origin.negated());
      this._extentAtom ??= atom(Sz2D(r.width, r.height));
    }
    this._extentAtom ??= atom(Sz2D(0, 0));
    return this._extentAtom;
  }
  public setExtent(extent: ZType<Size2D>): void {
    if (extent instanceof Atom) {
      this._extentAtom = extent;
    }
    this.extent = zget(extent);
  }
  public get origin(): Point2D {
    return zget(this.originAtom);
  }
  public set origin(location: Point2D) {
    this.originAtom.set(location);
    this.elt.style.left = isNaN(location.x) ? "" : `${location.x}px`;
    this.elt.style.top = isNaN(location.y) ? "" : `${location.y}px`;
  }
  public get extent(): Size2D {
    return zget(this.extentAtom);
  }
  public set extent(size: Size2D) {
    this.extentAtom.set(size);
    this.elt.style.width = isNaN(size.width) ? "" : `${size.width}px`;
    this.elt.style.height = isNaN(size.height) ? "" : `${size.height}px`;
  }

  public get corner(): Point2D {
    return point2D(this.offsetLeft(), this.offsetTop()).add(this.clientRect().extent);
  }

  toString(): string {
    return `${this.constructor.name}[id=${this.viewID}${this.options.name ? `,name=${this.options.name}` : ""}]`;
  }
}

export type ChildModifier<T> = (child: View, index: number, parent: View, data: T) => void;
export type ChildCreator<T> = (item: T, index: number) => View;
export type ChildDataIDFn<T> = (item: T, index: number) => any;

export interface VListOptions<T> {
  childModifiers?: ChildModifier<T>[];
  afterRender?: ViewAction;
  onInit?: ViewAction;
  onResize?: ViewAction;
}

export class VList<T> {
  constructor(
    public data: ZType<Iterable<T>>,
    public childDataID: ChildDataIDFn<T>,
    protected childCreator: ChildCreator<T>,
    protected options: VListOptions<T> = {}
  ) {
    if (data instanceof Atom) {
      data.addAction(() => this.render());
    }
  }

  private view!: View;
  private newSubviews = new Set<View>();
  private currentSubviews: View[] = [];

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
    const data = [...zget(this.data)];
    const newChildIDs = data.map((childData, index) => this.childDataID(childData, index));
    return [...this.currentSubviews].filter((v) => !newChildIDs.find((id) => id === v.options.id));
  }

  render(): void {
    // give removed subviews a chance to animate their departure
    this.subviewsToRemove().forEach((v) => {
      zlog.debug("unmounted " + v.options.id);
      v.setMountedState(false);
    });

    this.view.waitForAnimationsToFinish(() => {
      this.compose();
      this.newSubviews.forEach((subview) => {
        subview.setParent(this.view);
        subview.render();
        subview.afterAddedToDOM();
      });
      this.currentSubviews.forEach((subview) => subview.attributeBundle.apply());
    });

    this.options.afterRender?.(this.view);
  }

  public compose(): void {
    const data = [...zget(this.data)];
    const newChildIDs = data.map((childData, index) => this.childDataID(childData, index));
    // remove subviews with no match
    [...this.currentSubviews].forEach((v) => {
      if (!newChildIDs.includes(v.options.id)) {
        v.remove();
        zlog.debug("removed " + v.options.id + " from " + this.view.options.name);
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
        nextSubviews[index] = existingSubview;
      } else {
        const newChild = this.childCreator(childData, index);
        newChild.options.id = id;
        this.options.childModifiers?.forEach((modifier) => modifier(newChild, index, this.view, childData));
        nextSubviews[index] = newChild;
        this.newSubviews.add(newChild);
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

//////////////////////////////////////////////////////////////

export interface LazyViewOptions {
  unmountWhenHidden?: boolean;
}

export class LazyView {
  view?: View;
  parentView?: View;

  constructor(public viewCreator: ViewCreator, public show: Atom<boolean>, options: LazyViewOptions) {
    show.addAction((b) => b && !this.view && this.create());
    if (options.unmountWhenHidden) {
      show.addAction((b) => !b && this.unmount());
    }
  }
  create(): void {
    this.view = this.viewCreator();
    this.view.options.hidden = atom(() => !this.show.get());
    this.parentView?.appendAndRender(this.view);
  }
  unmount(): void {
    this.view?.remove();
    this.view = undefined;
  }
}

export function Lazy(viewCreator: ViewCreator, show: Atom<boolean>, options: LazyViewOptions = {}): LazyView {
  return new LazyView(viewCreator, show, options);
}

//////////////////////////////////////////////////////////////

export abstract class ViewDelegate {
  view!: View;

  constructor() {}

  get options(): ViewOptions {
    return this.view.options;
  }
  abstract createElement(tagName: string): ZElement;
  abstract tagName(): string;
  abstract offsetLeft(): number;
  abstract offsetTop(): number;
  abstract get overlay(): View;
  abstract setCSSClass(clsName: string): void;
  abstract defaultInteractionEffects(): EffectsBundle;

  beforeAddedToDOM(): void {}
  afterAddedToDOM(): void {}
  initializeHandlers(): void {}
  appendChild(childView: View): void {
    this.view.addChild(childView);
    this.options.afterAppendChild?.(this.view, childView);
  }
  adjustOptions(): void {}

  htmlAttributes(): Attributes {
    return {};
  }
  htmlAttributeSummary(): string {
    return "";
  }
  cssAttributes(): Attributes {
    return {};
  }
  svgAttributes(): Attributes {
    return {};
  }
  svgAttributeSummary(): string {
    return "";
  }
}
