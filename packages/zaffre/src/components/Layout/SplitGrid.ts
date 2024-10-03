import { zget, atom, zutil } from ":foundation";
import { View, css_cursor, CursorName, beforeAddedToDOM, BV } from ":core";
import { HTMLOptions, core, defineBaseOptions, mergeComponentOptions } from ":core";
import { Grid, GridOptions } from "./Grid";

//
// A SplitGrid is a grid with columns that can be dragged to resize.
//
// TODO: SplitGridResizer should be split out, and this component generalized to support
// resizing in either direction.
//

export interface SplitGridOptions extends GridOptions {
  rowMins?: number[];
  rowMaxes?: number[];
  columnMins?: number[];
  columnMaxes?: number[];
  threshold?: number;
}
defineBaseOptions<SplitGridOptions>("SplitGrid", "Grid", {
  rowMins: [1],
  rowMaxes: [1],
  columnMins: [1],
  columnMaxes: [1],
  threshold: 2,
  background: core.color.gray,
});

function setColumnMaxes(options: SplitGridOptions, maxes: number[]): void {
  options.columnMaxes = maxes;
  options.templateColumns = createSpec(options.columnMins || [1], options.columnMaxes || [1]);
}

function createSpec(mins: number[], maxes: number[]): string {
  return zutil
    .sequence(0, mins.length)
    .map((index) => `minmax(${mins[index]}px, ${maxes[index]}fr)`)
    .join(" ");
}

export function SplitGrid(inOptions: BV<SplitGridOptions> = {}): View {
  const options = mergeComponentOptions("SplitGrid", inOptions);

  options.templateRows = createSpec(options.rowMins || [1], options.rowMaxes || [1]);
  options.templateColumns = createSpec(options.columnMins || [1], options.columnMaxes || [1]);
  let resizer: SplitGridResizer;

  beforeAddedToDOM(options, (view: View): void => {
    resizer = new SplitGridResizer(view, options);
    view.addResizeAction(() => resizer.updateSizes());
    (<HTMLOptions>view.options).cursor = resizer.cursor;
  });

  options.afterAppendChild = (childView: View): void => {
    childView.addEventListener("mousemove", (event) => resizer.handleGridItemMouseMove(childView, <MouseEvent>event));
  };
  return Grid(options);
}

export class SplitGridResizer {
  columnWidths: number[] = [];
  rightEdges: number[] = [];
  overColumnDivider = atom(false);
  threshold: number;
  cursor: css_cursor = atom(() => this.currentCursor());
  inResize = false;
  lastX = 0;
  overDivider = false;

  constructor(protected grid: View, protected gridOptions: SplitGridOptions) {
    this.threshold = gridOptions.threshold!;
    grid.addEventListener("mousemove", (event: Event) => this.handleMouseMove(<MouseEvent>event));
    grid.addEventListener("mousedown", (event: Event) => this.handleMouseDown(<MouseEvent>event));
    grid.addEventListener("mouseup", (event: Event) => this.handleMouseUp(<MouseEvent>event));
  }

  // TODO: this looks old-school; can't we set up cursor with an atom?
  handleGridItemMouseMove(view: View, event: MouseEvent): void {
    const r = view.clientRect();
    if (event.offsetX < this.threshold || r.width - event.offsetX < this.threshold) {
      view.elt.style.cursor = "col-resize";
      this.overDivider = true;
    } else {
      view.elt.style.removeProperty("cursor");
      this.overDivider = false;
    }
  }

  currentCursor(): CursorName {
    return this.overColumnDivider.get() ? "col-resize" : "default";
  }

  handleMouseDown(event: MouseEvent): void {
    if (this.overDivider) {
      this.updateSizes();
      this.inResize = true;
      this.lastX = event.clientX - this.grid.clientRect().left;
    }
  }
  handleMouseUp(event: MouseEvent): void {
    if (this.inResize) {
      this.inResize = false;
      this.updateSizes();
    }
  }
  handleMouseMove(event: MouseEvent): void {
    if (!this.inResize) {
      // || !this.overDivider) {
      return;
    }
    event.preventDefault();
    const r = this.grid.clientRect();
    const x = event.clientX - r.left;
    if (this.inResize) {
      const dx = x - this.lastX;
      if (dx !== 0) {
        const col = this.rightEdges.findIndex((cx) => x < cx);
        const leftCol = col == 0 ? 0 : x - this.rightEdges[col - 1] < this.rightEdges[col] - x ? col - 1 : col;
        const rightCol = leftCol + 1;
        this.columnWidths[leftCol] += dx;
        this.columnWidths[rightCol] -= dx;
        this.grid.elt.style.gridTemplateColumns = this.columnWidths.map((w) => `${w}px`).join(" ");
        // changing the columns sometimes affects the width, so we reset it just in case
        this.grid.elt.style.width = `${r.width}px`;
        this.rightEdges = zutil.cumulativeSum(this.columnWidths);
      }
    } else {
      const edge = this.rightEdges.find((cx) => Math.abs(x - cx) < this.threshold);
      if (!edge || edge < this.rightEdges.length - 1) {
        this.overColumnDivider.set(Boolean(edge));
      }
    }
    this.lastX = x;
  }
  updateSizes(): void {
    if (!this.inResize) {
      if (this.columnWidths) {
        // update this.options.rowMaxes to match current ratios
        const maxW = Math.max(...this.columnWidths);
        setColumnMaxes(
          this.gridOptions,
          this.columnWidths.map((w) => w / maxW)
        );
        if (this.grid.elt.style.width) {
          this.grid.elt.style.gridTemplateColumns = zget(this.gridOptions.templateColumns)!;
          this.grid.elt.style.width = "";
        }
      }

      const cs = this.grid.computedStyle();
      this.columnWidths = cs.gridTemplateColumns.split(" ").map((w) => parseFloat(w));
      this.rightEdges = zutil.cumulativeSum(this.columnWidths);
    }
  }
}
