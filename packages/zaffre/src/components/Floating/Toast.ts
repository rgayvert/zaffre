import { zstring, znumber, zget, BasicAction, IndexedArrayAtom } from ":foundation";
import { place, View, TransitionEffect, transitions, BV } from ":core";
import { core, defineBaseOptions, mergeComponentOptions } from ":core";
import { TextLabel } from "../Content";
import { Box, BoxOptions } from "../HTML";
import { StackOptions, ViewList, VStack } from "../Layout";

//
// Toast and ToastStack
//
// A Toast is a floating component that hides itself after some amount of time (default is 1500ms), and
// stacks up when multiple instances are created. A component that wants to use Toast must add a ToastStack,
// which is a VStack that contains a reactive list of Toast items. When a toast needs to be displayed, it
// is added to the list of toast items. ToastStacks will appear in the global ToastLayer.
//

export interface ToastOptions extends BoxOptions {
  initialDelay?: znumber;
  duration?: znumber;
  message?: zstring;
}
defineBaseOptions<ToastOptions>("Toast", "Box", {
  background: core.color.primaryContainer,
  rounding: core.rounding.r2,
  initialDelay: 0,
  duration: 1500,
  elevation: 5,
  effects: { mounted: transitions.fadeIn() },
});

function Toast(removalAction: BasicAction, message: string, inOptions: BV<ToastOptions> = {}): View {
  const options = mergeComponentOptions("Toast", inOptions);

  const delta = zget(options.initialDelay)! + zget(options.duration)!;
  setTimeout(removalAction, delta);

  return Box(options).append(
    TextLabel(message, {
      background: core.color.none,
      color: core.color.background.contrast,
      padding: core.space.s5,
      ...options,
    })
  );
}

export interface ToastStackOptions extends StackOptions {
  maxItems?: number;
  initialDelay?: number;
  duration?: number;
  mountEffect?: TransitionEffect;
  itemOptions?: ToastOptions;
}
defineBaseOptions<ToastStackOptions>("ToastStack", "VStack", {
  toastStack: true,
  background: core.color.transparent,
  placement: place.bottomRight,
  alignItems: "end",
  justifyContent: "end",
  pointerEvents: "none",
  position: "absolute",
  gap: core.space.s3,
  initialDelay: 0,
  duration: 2000,
  mountEffect: transitions.fadeIn("in&out"),
});

export function ToastStack(toastItems: IndexedArrayAtom<string>, inOptions: BV<ToastStackOptions> = {}): View {
  const options = mergeComponentOptions("ToastStack", inOptions);
  const itemOptions: ToastOptions = {
    initialDelay: options.initialDelay,
    duration: options.duration,
    effects: { mounted: options.mountEffect },
    ...options.itemOptions,
  };
  return VStack({ ...options }).append(
    ViewList(
      toastItems,
      (dataItem) => dataItem.index,
      (dataItem) => Toast(() => toastItems.delete(dataItem), dataItem.value, itemOptions)
    )
  );
}
