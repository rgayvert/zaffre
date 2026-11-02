import { Atom, atom, lazyinit, zget, znumber, zutil } from ":foundation";
import { Attributes, ColorToken, css, css_color, css_rounding, pct } from ":attributes";
import { getBodyView, getRootView, View, setBodyView, setRootView, rootRules, addClass } from ":view";
import { zcolor, zfont } from ":theme";
import { place } from ":uifoundation";
import { BaseView, ViewDelegate, ViewOptions, beforeAddedToDOM } from ":view";
import { dropShadowForElevation, EffectsBundle, standardHTMLInteractionEffects } from ":effect";
import { DragHandler } from ":events";
import { CSSAttributeOptions, cssOptionKeyList, htmlAttributeKeys, HTMLAttributeOptions } from "../CoreOptions";

//
// Base support for HTML views. This includes the HTMLDelegate class, the low-level HTML component,
// the HTMLBody component, the ViewOverlay component, and components for the floating, dialog and
// toast layers.
//

// sizes use a factor of 1.15
export const controlSizes = ["xs", "sm", "med", "lg", "xl", "xxl"] as const;
export const controlSizeFactors = [0.75, 0.87, 1.0, 1.15, 1.32, 1.52];
export type ControlSize = (typeof controlSizes)[number];

export interface HTMLOptions extends ViewOptions, HTMLAttributeOptions, CSSAttributeOptions {
  rounding?: css_rounding;
  selectionColor?: css_color;
  selectionTextColor?: css_color;
  maintainMinHeight?: boolean;
  scale?: znumber;
  controlSize?: ControlSize;
}

export const isHTMLView = (view: View): boolean => {
  return view.delegate instanceof HTMLDelegate;
};

export class HTMLDelegate extends ViewDelegate {
  private static _rootView: View;
  private static _bodyView: View;
  public static baseView: View;

  public static get rootView(): View {
    if (!this._rootView) {
      const delegate = new HTMLDelegate();
      const root = new BaseView(delegate, { id: "_root" });
      this._rootView = root;
      delegate.setView(root);
      setRootView(root);
      this._bodyView = HTMLBody();
      this._bodyView.setParent(root);
      setBodyView(this._bodyView);
      root.children.push(this._bodyView);
      root.options.rules = rootRules;

      // wait until setBaseView() to set the body style
    }
    return this._rootView;
  }

  view!: View;
  setView(view: View): void {
    this.view = view;
  }
  public static get bodyView(): View {
    return this._bodyView;
  }
  public static setBaseView(view: View): void {
    this.baseView = view;
    this.bodyView.afterAddedToDOM();
    this.bodyView.appendAndRender(view);
  }
  @lazyinit static get floatingLayer(): View {
    return FloatingLayer();
  }
  @lazyinit static get dialogLayer(): View {
    return DialogLayer();
  }
  @lazyinit static get toastLayer(): View {
    return ToastLayer();
  }

  get options(): HTMLOptions {
    return this.view.options;
  }
  get htmlElt(): HTMLElement {
    return <HTMLElement>this.view.elt;
  }
  createElement(tagName: string): HTMLElement {
    return document.createElement(tagName);
  }

  offsetLeft(): number {
    return this.htmlElt.offsetLeft;
  }
  offsetTop(): number {
    return this.htmlElt.offsetTop;
  }
  setCSSClass(clsName: string): void {
    this.htmlElt.className = clsName;
  }

  _overlay?: View;
  get overlay(): View {
    if (!this._overlay) {
      this._overlay = ViewOverlay();
      this.view.appendAndRender(this._overlay);
    }
    if (!this._overlay.elt.parentElement) {
      this._overlay.attach();
    }
    return this._overlay;
  }

  public defaultInteractionEffects(): EffectsBundle {
    return standardHTMLInteractionEffects();
  }

  afterAddedToDOM(): void {
    if (this.options.placement) {
      if (this.options.placement instanceof Atom) {
        this.options.placement.addAction(() => this.view.place());
      }
      this.view.addResizeAction(() => this.view.place());
      this.view.addIntersectionAction(() => this.view.place());
    }
  }
  // TODO: this may set zIndex too early (doesn't work with defaults)
  beforeAddedToDOM(): void {
    //this.options.zIndex ??= this.view.floatingCount();
  }
  initializeHandlers(): void {
    // TODO: what if we need draggable to be an atom?
    this.options.draggable = this.view.handlers?.some((h) => h instanceof DragHandler);
  }

  // Note: nonFloatingParent is needed for scoped options.

  appendChild(childView: View): void {
    if (childView.isFloating() && this.view !== HTMLDelegate.floatingLayer) {
      childView.referenceView = this.view;
      childView.nonFloatingParent = this.view;
      HTMLDelegate.floatingLayer.appendAndRender(childView);
      this.view.floatingChildren.push(childView.children.at(0)!);
    } else if (childView.isDialog() && this.view !== HTMLDelegate.dialogLayer) {
      childView.nonFloatingParent = this.view;
      HTMLDelegate.dialogLayer.appendAndRender(childView);
    } else if (childView.options.toastStack && this.view !== HTMLDelegate.toastLayer) {
      childView.nonFloatingParent = this.view;
      childView.referenceView = this.view;
      HTMLDelegate.toastLayer.appendAndRender(childView);
    } else {
      this.view.addChild(childView);
      this.options.afterAppendChild?.(this.view, childView);
    }
  }
  adjustOptions(): void {
    const opts = this.options;
    if (opts.elevation) {
      opts.filter = atom(() => dropShadowForElevation(zget(opts.elevation)));
    }
    opts.borderRadius ??= opts.rounding;
    if (opts.resize) {
      // overflow needs to be set to something other than 'visible' for resize to have an effect
      opts.overflow ??= "auto";
    }
    if (opts.scale) {
      opts.transform = `scale(${zget(opts.scale)})`;
    }
    if (opts.controlSize) {
      opts.fontSize = pct(100 * controlSizeFactors[controlSizes.indexOf(opts.controlSize)]);
    }
  }
  extractHTMLAttributes(options: HTMLOptions): Attributes {
    // convert numbers to strings
    const validOptions = Object.entries(options)
      .filter(([key, value]) => value !== undefined && htmlAttributeKeys.includes(key))
      .map(([key, value]) => [key, typeof value === "number" ? value.toString() : value]);
    return Object.fromEntries(validOptions);
  }
  public htmlAttributes(): Attributes {
    const attrs = this.extractHTMLAttributes(this.options);
    // put zname first for debugging
    const { zname, ...rest } = attrs;
    return { zname, ...rest };
  }

  public htmlAttributeSummary(): string {
    let summary = "";
    Object.entries(this.htmlAttributes()).forEach(([key, value]) => {
      if (value !== undefined) {
        summary += `  ${key}: ${value}\n`;
      }
    });
    return summary ? "\nhtml properties:\n" + summary : "";
  }

  extractCSSAttributes(options: ViewOptions | CSSAttributeOptions): Attributes {
    const validOptions = Object.entries(options).filter(
      ([key, value]) => (value === 0 || value) && cssOptionKeyList.includes(key),
    );
    return Object.fromEntries(validOptions);
  }

  // TODO: why is selection given this special treatment??
  selectionAttributes(): Attributes {
    let color = this.options.color;
    let background = this.options.background;
    const selColor = this.options.selectionColor;

    const textColor = this.options.selectionTextColor;
    if (textColor) {
      color = atom(() => (this.view.isSelected() ? zget(textColor) : zget(this.options.color!)));
    } else if (this.options.selected && color && selColor instanceof ColorToken) {
      color = atom(() => (this.view.isSelected() ? selColor.contrast : zget(this.options.color!)));
    }
    if (this.options.selected && background && selColor) {
      background = atom(() => (this.view.isSelected() ? zget(selColor) : zget(this.options.background!)));
    }
    return { color, background };
  }

  public cssAttributes(): Attributes {
    return { ...this.extractCSSAttributes(this.options), ...this.selectionAttributes() };
  }
}

////////////////////////////////////////////////////////////////////////////////////////////

export const HTML = (inOptions: HTMLOptions = {}) => {
  const options = addClass(inOptions, "HTML");

  // setting up the delegate is a bit messy because we want to avoid circular references
  // between the view and the delegate (the abstract class ViewDelegate knows nothing about View)
  const delegate = new HTMLDelegate();
  const view = new BaseView(delegate, options);
  delegate.setView(view);
  view.createOverlay = () => delegate.overlay;
  view.appendChild = (child: View) => delegate.appendChild(child);
  return view;
};

////////////////////////////////////////////////////////////////////////////////////////////

const HTMLBody = () => {
  const options: HTMLOptions = {
    id: "_body",
    background: zcolor.background,
    position: "relative",
    font: zfont.body_medium,
    paddingTop: zutil.isIOS() ? css("env(titlebar-area-height)") : css("env(safe-area-inset-top)"),
    paddingRight: css("env(safe-area-inset-right)"),
    paddingBottom: css("env(safe-area-inset-bottom)"),
    paddingLeft: css("env(safe-area-inset-left)"),

    afterAppendChild(view: View, _child: View): void {
      const transparentViews = view.children.filter(
        (v) => v.options.id === "_floatingLayer" || v.options.id === "_dialogLayer",
      );
      const otherViews = view.children.filter((v) => !transparentViews.includes(v));
      view.children.set([...otherViews, ...transparentViews]);
      adjustMobileTop(view);
    },
  };
  beforeAddedToDOM(options, (view): void => {
    view.setParent(getRootView());
  });

  const adjustMobileTop = (view: View): void => {
    if (zutil.isIOS()) {
      const top = view.clientRect().top;
      if (zutil.isIOS() && top < 0) {
        view.elt.style.top = `${-top}px`;
        console.log(`body top now ${view.clientRect().top}`);
      }
    }
  };

  return HTML(options);
};

////////////////////////////////////////////////////////////////////////////////////////////

interface ViewOverlayOptions extends HTMLOptions {}

export const ViewOverlay = (inOptions: ViewOverlayOptions = {}) => {
  const options = addClass(inOptions, "ViewOverlay");

  // TODO: this should be set when overlay is created (add 1 to view z-index)
  options.zIndex = 1;

  return HTML(options);
};

////////////////////////////////////////////////////////////////////////////////////////////

const FloatingLayer = (inOptions: HTMLOptions = {}) => {
  const options = addClass(inOptions, "FloatingLayer");

  options.zIndex = 99;
  options.id = "_floatingLayer";
  options.afterAppendChild = (_view: View, childView: View): void => {
    (<HTMLOptions>childView.options).position = "absolute";
  };
  const layer = HTML(options);
  getBodyView().appendAndRender(layer);
  return layer;
};

////////////////////////////////////////////////////////////////////////////////////////////

// TODO: this should inherit from FloatingLayer (or BaseFloatingLayer)

const DialogLayer = (inOptions: HTMLOptions = {}) => {
  const options = addClass(inOptions, "DialogLayer");

  options.zIndex = 98;
  options.id = "_dialogLayer";
  options.afterAppendChild = (view: View, childView: View): void => {
    const options = <HTMLOptions>childView.options;
    options.position = "absolute";
    options.placement ??= place.center;
  };
  beforeAddedToDOM(options, (view): void => {
    const options = <HTMLOptions>view.options;
    options.background = atom(() => (view.hasVisibleChild() ? zcolor.scrim.opacity(0.2) : zcolor.transparent));
  });

  const layer = HTML(options);
  getBodyView().appendAndRender(layer);
  return layer;
};

////////////////////////////////////////////////////////////////////////////////////////////

// TODO: this should inherit from FloatingLayer (or BaseFloatingLayer)

const ToastLayer = (inOptions: HTMLOptions = {}) => {
  const options = addClass(inOptions, "ToastLayer");

  options.zIndex = 100;
  options.id = "_toastLayer";
  const layer = HTML(options);
  getBodyView().appendAndRender(layer);
  return layer;
};
