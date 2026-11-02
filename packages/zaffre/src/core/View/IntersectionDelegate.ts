import { atom, Atom, BasicAction, lazyinit, TAction, zget, znumber, zutil } from ":foundation";
import { getViewFromZaffreData, View } from "./View";

export class IntersectionDelegate {
  constructor(public view: View) {
    IntersectionDelegate.delegates.set(view, this);
  }

  // keep track of view-delegate pairs here to avoid a circular reference
  static delegates = new Map<View, IntersectionDelegate>();

  // There is a single global intersection observer for an application. 
  @lazyinit static get intersectionObserver(): IntersectionObserver {
    return new IntersectionObserver((entries: IntersectionObserverEntry[]) => {
      for (const entry of entries) {
        const view = getViewFromZaffreData(entry.target);
        view && IntersectionDelegate.delegates.get(view)?.intersectionState.set(entry.isIntersecting);
      }
    });
  }
  @lazyinit get intersectionState(): Atom<boolean> {
    IntersectionDelegate.intersectionObserver.observe(this.view.elt);
    return atom(false);
  }
  addIntersectionAction(action: TAction<boolean>): void {
    this.intersectionState.addAction(action);
  }
  addIntersectionTimer(interval: znumber, action: BasicAction): void {
    let timer: ReturnType<typeof setInterval> | undefined;
    const updateIntersectionTimer = (b: boolean): void => {
      if (timer && !b) {
        clearInterval(timer);
        timer = undefined;
      } else if (b && zget(interval)) {
        timer = setInterval(() => action(), zget(interval));
      }
    };
    if (interval instanceof Atom) {
      interval.addAction((val) => updateIntersectionTimer(val > 0));
    }
    this.addIntersectionAction(() => updateIntersectionTimer(this.intersectionState.get()));
  }
}
