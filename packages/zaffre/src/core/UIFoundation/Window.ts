import { lazyinit, atom, Point2D, point2D, rect2D, Rect2D, Size2D, Sz2D } from ":foundation";
import { BasicAction, BreakpointAtom, Atom, breakpointAtom } from ":foundation";

//
// There is one instance of ZWindow, which corresponds to the application window. This instance
// provides reactive values for the window size and width.
//

export function windowWidth(): number {
  return ZWindow.instance.windowWidth;
}
export function windowHeight(): number {
  return ZWindow.instance.windowHeight;
}
 
export class ZWindow { 
  @lazyinit public static get instance(): ZWindow {
    return new ZWindow();
  }
  @lazyinit static get windowSize(): Atom<Size2D> {
    return this.instance.windowSize;
  }
  @lazyinit static get windowWidth(): Atom<number> {
    return atom(() => this.instance.windowWidth);
  }
  @lazyinit static get windowHeight(): Atom<number> {
    return atom(() => this.instance.windowHeight);
  }
  static fractionOfSize(fraction: number): string {
    const sz = this.windowSize.get();
    return `${Math.min(sz.width, sz.height) * fraction}px`;
  }
  static get cursorPoint(): Point2D {
    return this.instance._cursorPoint;
  }

  private windowAspectRatio = breakpointAtom([1.0], window.innerWidth / Math.max(window.innerHeight, 1));
  private windowSize = atom(Sz2D(window.innerWidth, window.innerHeight));

  get screenRect2D(): Rect2D {
    return rect2D(0, 0, this.windowWidth, this.windowHeight);
  }
  get windowWidth(): number {
    return this.windowSize.get().width;
  }
  get windowHeight(): number {
    return this.windowSize.get().height;
  }

  public windowWidthBreakpoints = [600, 1200];
  public windowWidthBreakpoint: BreakpointAtom;

  public setWindowWidthBreakpoints([small, medium]: [number, number]): void {
    this.windowWidthBreakpoints = [small, medium];
  }

  // TODO: remove this limitation of 3 sizes
  
  smallDisplay(): boolean {
    return this.windowWidthBreakpoint.index() === 0;
  }
  mediumDisplay(): boolean {
    return this.windowWidthBreakpoint.index() === 1;
  }
  largeDisplay(): boolean {
    return this.windowWidthBreakpoint.index() === 2;
  }

  break<T>(small: T, medium: T, large: T): T {
    return this.smallDisplay() ? small : this.mediumDisplay() ? medium : large;
  }

  public addWindowResizeAction(action: BasicAction): void {
    this.windowSize.addAction(action);
  }

  private loadActions = new Set<BasicAction>();
  public addLoadAction(action: BasicAction): void {
    this.loadActions.add(action);
  }
  public removeLoadAction(action: BasicAction): void {
    this.loadActions.delete(action);
  }

  constructor() {
    this.windowWidthBreakpoint = breakpointAtom(this.windowWidthBreakpoints, window.innerWidth);
    window.addEventListener("resize", () => this.handleWindowResize());
    window.addEventListener("load", () => this.handleWindowLoad());
    window.addEventListener("keydown", (event) => this.handleKeyDown(event));
    window.addEventListener("mousemove", (event) => this.handleMouseMove(event));
  }

  private handleWindowResize(): void {
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.windowWidthBreakpoint.set(width);
    this.windowAspectRatio.set(width / Math.max(height, 1));
    this.windowSize.set(Sz2D(width, height));

  }
  private handleWindowLoad(): void {
    this.loadActions.forEach((action) => action()); 
  }
  private _cursorPoint = point2D(0, 0);
  private handleMouseMove(event: MouseEvent): void {
    this._cursorPoint.x = event.clientX;
    this._cursorPoint.y = event.clientY;
  }
  // TODO: this is intended to prevent scrolling on a space key
  handleKeyDown(event: KeyboardEvent): void {
    if (event.key == " " && event.target == document.body) {
      //event.preventDefault();
    }
  }

  public static isPortrait(): boolean {
    return this.instance.windowAspectRatio.index() === 0;
  }
  public static isLandscape(): boolean {
    return this.instance.windowAspectRatio.index() === 1;
  }
}
