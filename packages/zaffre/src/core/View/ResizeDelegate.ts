import { atom, Atom, BasicAction, BreakpointAtom, lazyinit } from ":foundation";
import { getViewFromZaffreData, View } from "./View";
import { windowWidth } from ":uifoundation";

export class ResizeDelegate {
  constructor(public view: View) {
    ResizeDelegate.delegates.set(view, this);
  }

  static delegates = new Map<View, ResizeDelegate>();

  // There is a single global intersection observer for an application.
  @lazyinit static get resizeObserver(): ResizeObserver {
    return new ResizeObserver((entries: ResizeObserverEntry[]) => {
      for (const entry of entries) {
        if (entry.contentBoxSize) {
          // Firefox implements `contentBoxSize` as a single content rect, rather than an array
          const contentBoxSize = Array.isArray(entry.contentBoxSize) ? entry.contentBoxSize[0] : entry.contentBoxSize;
          const view = getViewFromZaffreData(entry.target);
          view && ResizeDelegate.delegates.get(view)?.resizeState.set(contentBoxSize);
        }
      }
    });
  }

  @lazyinit get resizeState(): Atom<ResizeObserverSize | undefined> {
    ResizeDelegate.resizeObserver.observe(this.view.elt);
    return atom(undefined);
  }
  addResizeAction(action: BasicAction): void {
    this.resizeState.addAction(action);
  }
  disableResizeObserver(): void {
    ResizeDelegate.resizeObserver.unobserve(this.view.elt);
  }
  enableResizeObserver(): void {
    ResizeDelegate.resizeObserver.observe(this.view.elt);
  }
  disableResizeObserverWhile(fn: () => void): void {
    this.disableResizeObserver();
    fn();
    setTimeout(() => this.enableResizeObserver(), 100);
  }

  addBreakpoints(breakpoints: BreakpointAtom): void {
    this.addResizeAction(() => this.checkBreakpoints(breakpoints));
  }
  checkBreakpoints(breakpoints: BreakpointAtom): void {
    breakpoints.set(windowWidth());
  }

}
