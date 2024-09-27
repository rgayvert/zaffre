
//
// Interfaces and functions dealing with regions inside of a CSS Grid.
//

export interface GridArea {
    r1: number;
    c1: number;
    r2: number;
    c2: number;
  }
  export function mergeGridAreas(ga1: GridArea, ga2: GridArea): GridArea {
    return gridArea(
      Math.min(ga1.r1, ga2.r1),
      Math.min(ga1.c1, ga2.c1),
      Math.max(ga1.r2, ga2.r2),
      Math.max(ga1.c2, ga2.c2)
    );
  }
  export function gridArea(r1: number, c1: number, r2: number, c2: number): GridArea {
    return { r1: Math.floor(r1), c1: Math.floor(c1), r2: Math.floor(r2), c2: Math.floor(c2) };
  }
  export function gridAreaToString(a: GridArea): string {
    return `${a.r1} / ${a.c1} / ${a.r2} / ${a.c2}`;
  }
  