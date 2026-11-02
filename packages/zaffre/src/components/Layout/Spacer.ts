import { isAtomOfType, zget, znumber } from ":foundation";
import { addClass, afterOptionsMerged, css_space, css_width, px, SpaceKey, View, zcolor, zspace, zspaceKeys } from ":core";
import { Box, BoxOptions } from "../HTML";
import { StackOptions } from "./Stack";

//
// A Spacer is a simple box that is intended for use inside a Stack. If the value provided is
// a space value (e.g., zspace.s2), it becomes a square with that size. If the value is a number
// it become a box with flexgrow, so it divides up the available space.
//

export interface SpacerOptions extends BoxOptions {
  grow?: znumber;
  space?: css_space;
}

type GrowOrSpace = css_space | znumber | string;

export const Spacer = (growOrSpace?: GrowOrSpace, inOptions: SpacerOptions = {}) => {
  const options = addClass(inOptions, "Spacer");

  afterOptionsMerged(options, (view) => {
    options.background = zcolor.transparent;
    const setSize = (sz: css_width) => {
      options.width = sz;
      options.height = sz;
    };

    if (typeof growOrSpace === "string" && zspaceKeys.includes(<SpaceKey>growOrSpace)) {
      setSize(zspace[<SpaceKey>growOrSpace]);
    } else if (typeof growOrSpace === "number" || isAtomOfType(growOrSpace, "number")) {
      setSize(zspace.s1);
      options.flexGrow = <znumber>growOrSpace;
    } else {
      setSize(<css_width>growOrSpace);
    }

    const parentOpts = <StackOptions>view.parent?.options;
    const parentIsHStack = zget(parentOpts.flexDirection)?.startsWith("row");
    const parentIsVStack = zget(parentOpts.flexDirection)?.startsWith("column");
    if (parentIsHStack) {
      options.height = px(1);
    }
    if (parentIsVStack) {
      options.width = px(1);
    }
  });

  return Box(options);
};
