import { Atom, atom, zget, zboolean, zstring } from ":foundation";
import { CalcToken, tmult, View, HTMLOptions, defineComponentDefaults, mergeComponentDefaults } from ":core";
import { Grid, GridOptions } from "./Grid";

//
// A ZStack contains a list of views that are placed on top of each other, with
// an optional offset (e.g., a pile of playing cards). This is done by added all of
// the views to a 1x1 grid with the same grid area.
// 
// TODO: come up with a clean encapsulation of stacking contexts.
//

export interface ZStackOptions extends GridOptions {
  items?: Atom<View[]>;
  offsetX?: zstring;
  offsetY?: zstring;
  hasBaseView?: zboolean;
}
defineComponentDefaults<ZStackOptions>("ZStack", "Grid", {
  offsetX: "0",
  offsetY: "0",
});

export function ZStack(inOptions: ZStackOptions = {}): View {
  const options = mergeComponentDefaults("ZStack", inOptions);

  function yOffsetOfSubview(view: View, defaultIndex: number): CalcToken | undefined {
    let index = view.indexInParent();
    if (index < 0) {
      index = defaultIndex;
    }

    const opts = <ZStackOptions>view.parent?.options;
    const yOffset = opts?.offsetY || "0";

    return options.hasBaseView && index > 1 ? tmult(zget(yOffset), index - 1) : undefined;
  }

  // TODO
  options.afterAppendChild = (_view: View, child: View): void => {
    const childOptions = <HTMLOptions>child.options;
    childOptions.gridArea = "1/1";
    childOptions.top ??= atom(() => yOffsetOfSubview(child, child.indexInParent()));
  };

  return Grid(options);
}
