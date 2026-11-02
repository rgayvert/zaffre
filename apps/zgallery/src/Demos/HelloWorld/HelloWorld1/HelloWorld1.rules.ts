import { ch, space, zcolor, zutil, atom, StackOptions, Atom } from "zaffre";

// export interface HW1 extends StackOptions {}
// export class HW1 {
//   text = atom("Hello World");
//   constructor() {
//     this.style = "container";
//     this.rules = hw1rules(this);
//   }
// }

// export const hw1rules = (spec: HW1) => ({
//   "container": {
//     maxWidth: ch(120),
//     gap: space.s4,
//   },
//   "container>TextLabel": {
//     color: zcolor.green,
//     opacity: () => zutil.clamp(spec.text.get().length / 20, 0, 1),
//   },
// });


export const hw1rules = (text: Atom<string>) => ({
  "container": {
    maxWidth: ch(120),
    gap: space.s4,
  },
  "TextLabel": {
    color: zcolor.green,
    opacity: () => zutil.clamp(text.get().length / 20, 0, 1),
  },
});
