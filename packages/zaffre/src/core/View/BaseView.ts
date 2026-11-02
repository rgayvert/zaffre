import {
  Rect2D,
  Size2D,
  size2D,
  zget,
  Atom,
  atom,
  arrayAtom,
  ArrayAtom,
  isClosure,
  zset,
  getBlobURL,
  resolveURI,
  uriIsResource,
  getURITextContents,
} from ":foundation";
import { rect2D, point2D, Point2D, zlog, zutil, lazyinit, znumber } from ":foundation";
import { ZType, zstring, BasicAction, TAction, reactiveAction, ReactiveAction, SanitizeService } from ":foundation";
import { ZWindow, placementOffsetAndSize } from ":uifoundation";
import { Attributes, AttrBundle, ITheme, ZStyleSheet, ZStyle } from ":attributes";
import { InteractionState } from ":effect";
import { EventAction, Events, Listener, EventType, handleEvents } from ":events";
import { GenericEventHandlerOptions, MouseHandlerOptions, InputHandlerOptions } from ":events";
import { EventsKey, isEventActionsKey, Handler } from ":events";
import { ViewAction, ViewOptions, ZElement, View, OptionRules, isViewSpec, IViewSpec, ViewCreator } from "./View";
import { setLastFocusView } from "./View";
import { getViewFromZaffreData, getDefaultTheme, getRootView, getBodyView } from "./View";
import { VList } from "./VList";
import { ViewDelegate } from "./ViewDelegate";
import { EventDelegate } from "./EventDelegate";
import { HotKeyDelegate } from "./HotKeyDelegate";
import { EffectDelegate } from "./EffectDelegate";
import { IntersectionDelegate } from "./IntersectionDelegate";
import { ResizeDelegate } from "./ResizeDelegate";
import { getElementHeightWithoutPadding } from "../../foundation/Support/DOM";

//
// A View is the primary object in the Zaffre UI. All components create a View, and component
// options are translated into View properties. A View will have either an HTMLDelegate or an
// SVGDelegate, which handles the behavioral differences between HTML and SVG.
//
// TODO:
//  - can we move observers & handlers into delegates?
//  - should be have more interfaces like AttrTarget to limit how much clients need to see
//

export type ViewLike = View | (() => View | undefined) | VList<any> | LazyView | IViewSpec | undefined;

/**
 * view with the event listener
 */
export const viewWithEventListener = (evt: Event): View | undefined => {
  return BaseView.getViewFromEventCurrentTarget(evt);
};
/**
 * view that triggered the event
 */
export const viewThatTriggeredEvent = (evt: Event): View | undefined => {
  return BaseView.getViewFromEventTarget(evt);
};

export const setInnerHTML = (view: View, s: string): void => {
  view.elt.innerHTML = SanitizeService.defaultInstance.clean(s);
};

// export const mergeOptions = <T extends ViewOptions>(oldOpts: T, newOpts: T): T => {
//   return zutil.mergeOptions(oldOpts, newOpts);
// };

//
// Add the given events into the current event options. If there is an existing handler,
// add to it or convert to an array (an EventActions is either a single callback or an
// array of callbacks).
// TODO: make Typescript happy without all this casting
//
export const addOptionEvents = (options: ViewOptions, events: Events): void => {
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
};

export const beforeAddedToDOM = (options: ViewOptions, action: ViewAction): void => {
  options.beforeAddedToDOM ??= [];
  options.beforeAddedToDOM.push(action);
};
export const afterAddedToDOM = (options: ViewOptions, action: ViewAction): void => {
  options.afterAddedToDOM ??= [];
  options.afterAddedToDOM.push(action);
};
// export const afterOptionsMerged = (options: ViewOptions, action: ViewAction): void => {
//   afterOptionsMerged ??= [];
//   afterOptionsMerged.push(action);
// };

/**
 * Base class for UI components. A View is responsible for creating and managing a single HTMLElement.
 * The underlying element is typically a div, but other tags are also supported.
 */
export class BaseView implements View {
  // each view has a unique id; id values start at 1, so 0 is an invalid id
  private static _nextViewID = 1;
  private nextViewID(): number {
    return BaseView._nextViewID++;
  }

  static getViewFromEventCurrentTarget(evt: Event): View | undefined {
    return getViewFromZaffreData(<Element>evt.currentTarget);
  }
  static getViewFromEventTarget(evt: Event): View | undefined {
    return getViewFromZaffreData(<Element>evt.target);
  }

  public undo(): void {
    this.options.onUndo?.();
  }
  public redo(): void {
    this.options.onRedo?.();
  }
  public children = arrayAtom<View>([]);
  public childSequence = arrayAtom<ViewLike>([]);
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
      () => this.renderContent(),
    );
  }
  @lazyinit get applyStyleAction(): ReactiveAction {
    return reactiveAction(() => this.applyStyle());
  }

  // get model(): unknown {
  //   return this.options.model;
  // }

  // Delegate methods

  createElement(tagName: string): ZElement {
    return this.delegate.createElement(tagName);
  }

  offsetLeft(): number {
    return this.delegate.offsetLeft();
  }
  offsetTop(): number {
    return this.delegate.offsetTop();
  }

  setCSSClass(clsName: string): void {
    return this.delegate.setCSSClass(clsName);
  }

  tagName(): string {
    return this.options.tag || "div";
  }
  createOverlay?: () => View;
  get overlay(): View {
    return this.createOverlay?.() || this;
  }

  //

  public setOffset(pt: Point2D): void {
    this.elt.style.left = `${pt.x}px`;
    this.elt.style.top = `${pt.y}px`;
  }

  ////////////////////////////////////////////////////////////////////////////////////

  //routePoint?: RouteAtom<string>;
  // fullRoutePath(): string {
  //   const base = this.parent?.fullRoutePath() || "";
  //   const routePointName = this.routePoint?.name || "";
  //   const routePointValue = this.routePoint?.get() || "";
  //   return zutil.joinPathComponents(base, routePointName, routePointValue);
  // }
  // routePath(): string {
  //   const base = this.parent?.routePath() || "";
  //   //const routePointName = this.routePoint?.name || "";
  //   //const routePointValue = this.routePoint?.get() || "";

  //   //zlog.info("routePath=" + zutil.joinPathComponents(base, routePointName));
  //   //return zutil.joinPathComponents(base, routePointValue);
  //   return "";
  // }

  ////////////////////////////////////////////////////////////////////////////////////

  @lazyinit get attributeBundle(): AttrBundle {
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

  ////////////////////////////////////////////////////////////////////////////////////

  private setZaffreData(): void {
    (this.elt as any)["data-zaffre"] = this;
  }

  constructor(
    public delegate: ViewDelegate,
    public options: ViewOptions = {},
  ) {
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

  childAt(index: number): View | undefined {
    return this.children.at(index);
  }

  // for floating views, we need to keep track of the original (non-floating) parent
  // in order to make use of scoped options
  _nonFloatingParent?: View;
  set nonFloatingParent(view) {
    this._nonFloatingParent = view;
  }
  get nonFloatingParent(): View | undefined {
    if (this.parent?.options.toastStack) {
      return this.parent.nonFloatingParent;
    }
    if (this.parent?.isFloating()) {
      return this.parent?._nonFloatingParent;
    }
    return this._nonFloatingParent || this.parent;
  }

  @lazyinit get floatingChildren(): ArrayAtom<View> {
    return arrayAtom<View>([]);
  }
  floatingAncestor(): View | undefined {
    return this.parent?.isFloating() ? this.parent : this.parent?.floatingAncestor();
  }
  hasFloatingAncestor(): boolean {
    return Boolean(this.floatingAncestor());
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
  isToastStack(): boolean {
    return Boolean(this.options.toastStack);
  }

  // ensure the value of selected is an atom
  getSelected(): Atom<boolean> {
    const selected = atom(this.options.selected || false);
    this.options.selected = selected;
    return selected;
  }
  // ensure the value of hidden is an atom
  getHidden(): Atom<boolean> {
    const hidden = atom(this.options.hidden || false);
    this.options.hidden = hidden;
    return hidden;
  }
  hide(): void {
    if (this.options.hideFn) {
      this.options.hideFn();
    } else {
      zset(this.options.hidden, true);
    }
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
      const hidden = this.getHidden();
      hidden.addAction(() => this.setHiddenState(zget(hidden)));
      if (this.options.sharedState) {
        hidden.addAction((val) => this.options.sharedState?.hidden?.set(val));
      }
    }
    if (this.options.selected) {
      const selected = this.getSelected();
      selected.addAction(() => this.setSelectedState(zget(this.options.selected)!));
      selected.addAction(() => this.afterSelect());
      if (this.options.onSelect) {
        selected.addAction((b) => b && this.options.onSelect!(this));
      }
    }
    if (this.options.mounted) {
      const mounted = this.options.mounted;
      mounted.addAction(() => this.setMountedState(zget(mounted)));
    }
    if (this.options.disabled) {
      this.options.disabled = atom(this.options.disabled);
      this.setInteractionState(zget(this.options.disabled) ? "disabled" : "enabled");
      this.options.disabled.addAction(() => this.setInteractionState(zget(this.options.disabled) ? "disabled" : "enabled"));
    }
    if (this.options.onIntersectionVisible) {
      this.addIntersectionAction((visible) => visible && this.options.onIntersectionVisible!(this));
    }
    if (this.options.onIntersectionHidden) {
      this.addIntersectionAction((visible) => !visible && this.options.onIntersectionHidden!(this));
    }
    if (this.options.onResize) {
      this.addResizeAction(() => this.options.onResize!(this));
    }
    if (this.options.breakpoints) {
      this.resizeDelegate.addBreakpoints(this.options.breakpoints!);
    }

    if (this.options.tooltip) {
      this.addTooltipHandler();
    }
    if (this.options.clickAction) {
      this.addOptionEvents({ click: (evt) => handleEvents(this.options.clickAction, evt) });
    }
  }

  // TODO: this is a workaround for the case where a disabled view is hidden, and then made visible;
  // without this, the view will be disabled but appear to be enabled
  reapplyOverlayIfDisabled(): void {
    if (this.interactionState.get() === "disabled") {
      this.interactionState.set("enabled");
      this.interactionState.set("disabled");
    }
  }

  @lazyinit get eventDelegate(): EventDelegate {
    return new EventDelegate(this);
  }
  @lazyinit get hotKeyDelegate(): HotKeyDelegate {
    return new HotKeyDelegate(this);
  }
  @lazyinit get effectDelegate(): EffectDelegate {
    return new EffectDelegate(this);
  }

  addHotKeyListener(view: View): void {
    this.hotKeyDelegate?.addHotKeyListener(view);
  }
  removeHotKeyListener(view: View): void {
    this.hotKeyDelegate?.removeHotKeyListener(view);
  }

  initialize(): void {
    this.eventDelegate.initializeEvents();
    this.effectDelegate.initializeEffects(this.options.effects || {});

    this.initializeHandlers();
    this.initializeAnimations();

    // add scrollIntoViewAndSelectWhen

    if (this.options.scrollIntoViewWhen) {
      this.options.scrollIntoViewWhen.addAction(() => this.scrollIntoViewIfNeeded());
    }
    if (this.options.scrollToTopWhen) {
      this.options.scrollToTopWhen.addAction(() => this.scrollToTop());
    }
    if (this.options.takeFocusWhen) {
      this.options.takeFocusWhen.addAction((b) => {
        if (b) {
          this.focus();
          this.options.takeFocusWhen?.set(false);
        }
      });
    }
  }

  initialized = false;

  beforeAddedToDOM(): void {
    this.options.beforeAddedToDOM?.toReversed().forEach((a) => a(this));
    this.delegate.beforeAddedToDOM();
  }

  afterAddedToDOM(): void {
    // TODO: search up DOM for a styleCache with this component name (e.g., grid cells)
    // if (this.options.componentName) {
    //   // add the component name to the class list if not present
    //   // if (!this.options.classList || !this.options.classList.includes(this.options.componentName)) {
    //   //   this.options.classList = [this.options.componentName, ...(this.options.classList || [])];
    //   // }
    // }
    // if (!this.options.name && this.options.classList?.[0] !== this.options.componentName) {
    //   this.options.name = this.options.classList?.[0];
    // }

    this.applyRules();

    this.options.afterOptionsMerged?.forEach((f) => f(this));
    //this.options.onMount?.(this);

    this.adjustOptions();

    if (!this.initialized) {
      // TODO: do we ever run the risk on initializing twice?
      this.initialize();
      this.initialized = true;
    }
    this.attributeBundle.apply();

    this.delegate.afterAddedToDOM();
    this.options.afterAddedToDOM?.toReversed().forEach((a) => a(this));

    this.applyStyleAction.perform();
    this.setMountedState(true);
    this.interactionState.set("enabled");
    this.options.afterMount?.(this);
  }
  initializeAnimations(): void {
    this.options.animations?.forEach((a) => a.setTarget(this));
  }
  animate(keyframes: Keyframe[] | PropertyIndexedKeyframes | null, options?: number | KeyframeAnimationOptions | undefined): Animation {
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
    return zutil.getMapValue(this.iStates, state, () => atom(() => this.currentInteractionState === state, { name: state }));
  }

  addHandler(handler: Handler<unknown>): void {
    this.handlers.push(handler);
  }
  // these 3 are needed for TextArea
  addGenericHandler(options: GenericEventHandlerOptions): void {
    this.eventDelegate?.addGenericHandler(options);
  }
  addMouseHandler(options: MouseHandlerOptions): void {
    this.eventDelegate?.addMouseHandler(options);
  }
  addInputHandler(options: InputHandlerOptions): void {
    this.eventDelegate?.addInputHandler(options);
  }

  @lazyinit get handlers(): Handler<any>[] {
    return [];
  }

  initializeHandlers(): void {
    this.options.handlers?.forEach((handler) => this.handlers.push(handler));
    this.handlers.forEach((handler) => handler.setTarget(this));
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
      zlog.info("cancelRunningAnimations: " + e);
    }
  }
  waitForAnimationsToFinish(fn?: BasicAction): void {
    Promise.all(
      this.animatingView()
        .allAnimations()
        .filter((animation) => animation.playState === "running")
        .map((animation) => animation.finished),
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
    //zlog.info(`### ${this} setInteractionState: ${state} (was ${this.currentInteractionState})`);
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
      this.reapplyOverlayIfDisabled();
    }
    this.interactionState.set("enabled");
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

  @lazyinit get intersectionDelegate(): IntersectionDelegate {
    return new IntersectionDelegate(this);
  }
  addIntersectionAction(action: TAction<boolean>): void {
    this.intersectionDelegate.addIntersectionAction(action);
  }
  addIntersectionTimer(interval: znumber, action: BasicAction): void {
    this.intersectionDelegate.addIntersectionTimer(interval, action);
  }

  @lazyinit get resizeDelegate(): ResizeDelegate {
    return new ResizeDelegate(this);
  }
  addResizeAction(action: BasicAction): void {
    this.resizeDelegate.addResizeAction(action);
  }
  disableResizeObserverWhile(fn: () => void): void {
    this.resizeDelegate.disableResizeObserverWhile(fn);
  }

  @lazyinit get mutationState(): Atom<boolean> {
    BaseView.mutationObserver.observe(this.elt, { childList: true, subtree: true });
    return atom(false, { alwaysFire: true });
  }
  @lazyinit static get mutationObserver(): MutationObserver {
    return new MutationObserver((records, observer) => {
      for (const record of records) {
        const observedElt = (<Element>record.target).closest("[mutation-observed]");
        const observedView = getViewFromZaffreData(observedElt);
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
  public heightWithoutPadding(): number {
    return getElementHeightWithoutPadding(<HTMLElement>this.elt);
  }

  private _theme?: ITheme;
  public get theme(): ITheme {
    if (this === this.parent) {
      throw Error("invalid parent view");
    }
    return this._theme ? this._theme : this.parent ? this.parent.theme : getDefaultTheme()!;
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
    // TODO
    //return zget(this.options.disabled) || this.currentInteractionState === "disabled";
    return zget(this.disabled.get()) || this.currentInteractionState === "disabled";
  }
  public isEnabled(): boolean {
    return !this.isDisabled();
  }
  @lazyinit get disabled(): Atom<boolean> {
    if (isClosure(this.options.disabled)) {
      this.options.disabled = atom(this.options.disabled);
    } else if (!(this.options.disabled instanceof Atom)) {
      this.options.disabled = atom(false);
    }
    return this.options.disabled; //   ?? atom(false);
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
    return this.floatingChildren.find((child) => child.componentName === "Tooltip") || this.parent?.tooltipView;
  }
  addTooltipHandler(): void {
    this.interactionState.addAction(() => {
      const tip = zget(this.options.tooltip);
      tip && this.tooltipView?.options.onTooltip?.(this.tooltipView, this, tip, this.isHovered());
    });
  }

  /////////////////////

  _referenceView?: View | undefined;
  get referenceView(): View {
    return this._referenceView || this.parent || getBodyView();
  }
  set referenceView(view: View | undefined) {
    if (this._referenceView) {
      // TODO
      //view?.referencedViews.
    }
    this._referenceView = view;
    view?.addReferencedView(this);
  }
  referencedViews?: View[];
  addReferencedView(view: View): void {
    view.referencedViews ??= [];
    view.referencedViews.push(view);
  }

  place(): void {
    // hide until we've been placed
    this.elt.style.opacity = "0";
    setTimeout(() => this.placeNow(), 50);
  }
  placeNow(): void {
    const placement = zget(this.options.placement);

    const { offset, size, minSize } = placementOffsetAndSize(this.clientRect(), this.referenceView.clientRect(), placement);
    let finalOffset = offset;

    if (this.parent && this.parent !== this.referenceView) {
      finalOffset = offset.add(this.referenceView.clientRect().origin);
    }
    const r = rect2D(finalOffset.x, finalOffset.y, this.width, this.height);

    // keep it onscreen
    if (this.isFloating()) {
      // TODO: this moves menus down and right
      const box = r.constrainWithin(ZWindow.instance.screenRect2D).insetBy(1);
      this.setOffset(box.origin);
    } else {
      this.setOffset(finalOffset);
    }
    // TODO: this isn't right for a drop-down menu
    if (size.width) {
      this.setWidth(size.width);
    }
    if (size.height) {
      this.setHeight(size.width);
    }
    if (minSize.width) {
      this.elt.style.minWidth = `${minSize.width}px`;
    }
    if (minSize.height) {
      this.elt.style.minHeight = `${minSize.height}px`;
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
    return this.options.classList?.[0] || this.constructor.name;
  }

  public baseStyleName(): string {
    return `${zutil.kebabize(this.componentName)}_v_${this.viewID}`;
  }
  public styleName(): string {
    const extra = this.options.extraClasses ? ` ${this.options.extraClasses}` : "";
    return `${this.vClassName}${extra}${zget(this.options.hidden) ? " hidden" : ""}`;
  }
  // private capitalizePart(p: string): string {
  //   return p === "svg" ? "SVG" : p === "html" ? "HTML" : zutil.capitalizeFirstLetter(p);
  // }
  // zname is unique and includes component name or constructor name, so we always have some idea of the kind of view
  public get zname(): string {
    return this.baseStyleName();
    // const firstPart = this.componentName
    //   .split("-")
    //   .slice(-1)
    //   .map((p) => this.capitalizePart(p))
    //   .join("");

    // return firstPart + (this.options.name ? ":" + this.options.name : "") + `_${this.viewID}`;
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

  protected afterRender(): void {
    // hook for subclasses
  }

  rendered = false;

  public render(): void {
    if (!this.rendered) {
      this.children.forEach((child) => this.renderChild(child));
      this.viewLists?.forEach((viewList) => viewList.composeSubviews(this));
      if (this.options.onApplyContent) {
        this.applyContentAction.perform();
      }
      this.rendered = true;
    }
  }

  renderChild(childView: View): void {
    let child = childView;
    if (!child.rendered) {
      child.setParent(this);
      child.beforeAddedToDOM();
      //child.render();
      this.addChildToDOM(child);
      child.afterAddedToDOM();

      child.render();
    }
  }

  childNames(): string[] {
    return this.children.map((v) => v.zname).get();
  }
  hasVisibleChild(): boolean {
    return this.children.some((v) => !v.isHidden());
  }

  addChildToDOM(childView: View): void {
    this.elt.append(childView.elt);
    this.options.afterAddChildToDOM?.(this, childView);
  }

  public appendAndRender(...childViews: (View | undefined)[]): void {
    childViews.forEach((child) => {
      child && this.appendChild?.(child);
      child && this.renderChild(child);
    });
  }

  @lazyinit get visibleChildID(): Atom<number> {
    return atom(-1);
  }
  @lazyinit get selectedChildID(): Atom<number> {
    return atom(-1);
  }

  appendChild!: (child: View) => void;

  viewLists?: Set<VList<any>>;
  public appendViewList<T>(viewList: VList<T>): void {
    this.viewLists ??= new Set<VList<T>>();
    this.viewLists.add(viewList);
  }

  appendLazyView(lazyView: LazyView): void {
    lazyView.parentView = this;
  }

  containerChild?: View;
  appendContainerChild(view: View): View {
    this.containerChild = view;
    this.appendChild(view);
    return this;
  }

  public prepend(child: View): void {
    this.children.insertFirst(child);
    child.setParent(this);
  }

  public appendAfterMounted(view: View): View {
    afterAddedToDOM(this.options, () => this.append(view));
    return this;
  }

  public append<T>(...views: ViewLike[]): View {
    if (this.containerChild) {
      this.containerChild.append(...views);
      return this;
    } else {
      views.forEach((viewLike) => {
        if (viewLike instanceof BaseView) {
          this.appendChild(viewLike);
          this.childSequence.push(viewLike);
        } else if (viewLike instanceof VList) {
          this.appendViewList(viewLike);
        } else if (viewLike instanceof LazyView) {
          this.appendLazyView(viewLike);
        } else if (typeof viewLike === "function") {
          this.append(viewLike());
        } else if (isViewSpec(viewLike)) {
          this.append(viewLike.createView());
          this.childSequence.push(viewLike);
        }
      });
    }
    return this;
  }

  replaceChild(oldChild: View, newChild: View): void {
    const idx = this.children.indexOf(oldChild);
    if (idx !== -1) {
      oldChild.elt.replaceWith(newChild.elt);
      this.children.get()[idx] = newChild;
    }
    // TODO
    //oldChild.referencedViews?.forEach((v) => v.referenceView = newChild);
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
    return this.elt.parentElement ? Rect2D.fromDOMRect(this.elt.parentElement.getBoundingClientRect()) : Rect2D.emptyRect;
  }
  public scrollBy(x: number, y: number): void {
    this.elt.scrollBy(x, y);
  }

  public focus(preventScroll?: boolean): void {
    setTimeout(() => this.elt.focus({ preventScroll }), 200);
    setLastFocusView(this);
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
    return nextSibling ? getViewFromZaffreData(nextSibling) : undefined;
  }
  private previousSibling(): Element | null {
    return this.elt.previousElementSibling;
  }
  public previousSiblingView(): View | undefined {
    const previousSibling = this.previousSibling();
    return previousSibling ? getViewFromZaffreData(previousSibling) : undefined;
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
    return (this.previousLocation ? this.previousLocation.subtract(this.clientRect().origin) : point2D(0, 0)).asTranslation();
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
  // TODO: we need to decide which is the right way to do this: does child remove
  // itself, or does parent remove child?  Coming here from remove() is redundant.
  public removeChild(c: View): void {
    try {
      this.elt.removeChild(c.elt);
    } catch {
      //console.log(`Error removing child ${c.zname} from ${this.zname}`);
    }
    //this.children.delete(c);

    // TODO: we need to remove the child from this view's list of children, but
    // something in ViewList seems to need it

    //this.children.deleteSilently(c);

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
    return this.elt.scrollWidth > this.elt.clientWidth + 1 ? this : this.parent ? this.parent.hScrollParent() : undefined;
  }
  public vScrollParent(): View | undefined {
    return this.elt.scrollHeight > this.elt.clientHeight + 1 ? this : this.parent ? this.parent.vScrollParent() : undefined;
  }

  public scrollToTop(): void {
    const scrollParent = this.vScrollParent();
    if (this.height === 0 || !scrollParent) {
      return;
    }
    const r = this.clientRect();
    const pr = scrollParent.clientRect();
    scrollParent.elt.scrollBy(0, r.y - pr.y);
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
      this._extentAtom ??= atom(size2D(r.width, r.height));
    }
    this._extentAtom ??= atom(size2D(0, 0));
    return this._extentAtom;
  }
  rectInParent(): Rect2D {
    return this.clientRect().translatedBy(this.parentClientRect2D().origin.negated());
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

  // get rootRules(): OptionRules {
  //   return rootRules;
  // }

  matchesPart(part: string): boolean {
    return Boolean(this.options.classList?.includes(part));
  }
  isContainedIn(part: string): boolean {
    const parent = <BaseView>this.nonFloatingParent;
    return parent ? parent.matchesPart(part) || parent.isContainedIn(part) : false;
  }
  ancestorMatchingPart(part: string): View | undefined {
    const v = <BaseView>this.nonFloatingParent;
    return v ? (v.matchesPart(part) ? v : v.ancestorMatchingPart(part)) : undefined;
  }
  matchesRuleSelector(selector: string, cls: string): boolean {
    const parts = selector.split(">");
    if (parts.length === 1) {
      return selector === cls;
    }
    if (parts.at(-1) !== cls) {
      return false;
    }
    // terminal part matches; now see if the rest of the selector matches our hierarchy
    // find an ancestor that matches the next part
    const ancestor = this.ancestorMatchingPart(parts.at(-2)!);
    if (ancestor) {
      const remainingPath = parts.slice(0, -1).join(">");
      for (const c of ancestor.options.classList || []) {
        if (ancestor.matchesRuleSelector(remainingPath, c)) {
          return true;
        }
      }
    }
    return false;
  }

  matchingSelectors(rules: OptionRules, cls: string): string[] {
    const selectors = Object.keys(rules).filter((selector) => this.matchesRuleSelector(selector, cls));
    return selectors.sort((a, b) => zutil.countOccurrences(b, ">") - zutil.countOccurrences(a, ">"));
  }

  applyRulesFrom(cls: string, view: View): void {
    if (this.options.traceOptions) {
      console.log("applyRulesFrom: cls=" + cls + ", view=" + view);
    }
    const rules = view.options.rules;
    if (rules) {
      this.matchingSelectors(rules, cls).forEach((selector) => mergeOptions(this.options, rules[selector], this.zname, `${view.zname}(${selector})`));
    }
    let nextView = view.nonFloatingParent;
    if (this.options.traceOptions) {
      console.log("applyRulesFrom: nextView=" + nextView + ", parent=" + view.parent);
    }
    if (!nextView && view !== this.rootView()) {
      nextView = this.rootView();
    }
    nextView && this.applyRulesFrom(cls, nextView);
  }

  applyRules(): void {
    const classes = [...(this.options.classList || [])];
    if (this.options.name && !classes.includes(this.options.name)) {
      classes.unshift(this.options.name);
    }
    if (this.options.traceOptions) {
      console.log("applyRules: " + this.zname + ", nonFloatingParent=" + this.nonFloatingParent + ", classes=" + classes);
    }
    classes.forEach((cls) => this.applyRulesFrom(cls, this));
  }

  // debug support for situation where space tokens are not registered properly
  fixTokens(): void {
    //this.theme.registerToken(zspace.s4);
    //this.theme.registerToken(zspace.s6);
    //this.theme.registerToken(zspace.s8);
  }

  ancestors(): View[] {
    return ancestors(this);
  }
  ancestorNames(): string[] {
    return ancestors(this).map((a) => a.zname);
  }

  mergeOptions(options: ViewOptions): void {
    mergeOptions(this.options, options);
  }
}

//////////////////////////////////////////////////////////////

const ancestors = (view: View | undefined): View[] => {
  return !view || view === getBodyView() ? [] : [view, ...ancestors(view.nonFloatingParent)];
};

export const mergeOptions = (options: any, newOpts: any, vname = "", aname = "") => {
  if (newOpts) {
    for (const k2 in newOpts) {
      if (options[k2] === undefined) {
        options[k2] = newOpts[k2];
        if (options.traceOptions) {
          zlog.info(`${vname} gets ${k2} from ${aname}`);
        }
      }
    }
  }
};

//////////////////////////////////////////////////////////////

// TODO: LazyView is not used

export interface LazyViewOptions {
  unmountWhenHidden?: boolean;
}

export class LazyView {
  view?: View;
  parentView?: View;

  constructor(
    public viewCreator: ViewCreator,
    public show: Atom<boolean>,
    options: LazyViewOptions,
  ) {
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

export const Lazy = (viewCreator: ViewCreator, show: Atom<boolean>, options: LazyViewOptions = {}): LazyView => {
  return new LazyView(viewCreator, show, options);
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const loadSourceBlob = async (uri: zstring, view: View, attr = "src") => {
  const blobURL = await getBlobURL(resolveURI(uri));
  view.elt.setAttribute(attr, blobURL);
  view.elt.onload = () => URL.revokeObjectURL(blobURL);
};

export const loadSourceContent = async (uri: zstring, view: View, attr = "src") => {
  if (zget(uri)) {
    if (uriIsResource(uri)) {
      loadSourceBlob(uri, view);
    } else {
      view.elt.setAttribute("src", resolveURI(uri));
    }
  }
};

export const loadInnerHTML = async (uri: zstring, view: View) => {
  const text = await getURITextContents(resolveURI(uri));
  setInnerHTML(view, text);
};
