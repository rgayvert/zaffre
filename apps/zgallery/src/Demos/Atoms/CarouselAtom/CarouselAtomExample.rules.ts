import { zborder, zrounding, zspace, CarouselAtom, zfont } from "zaffre";

export const rules = (model: CarouselAtom<string>) => ({
  "CarouselAtom1": {
    gap: zspace.s5,
  },
  "TextLabel": {
    font: zfont.body_large,
    border: zborder.thin,
    paddingInline: zspace.s4,
  },
  "Button": {
    rounding: zrounding.pill,
  },
  "left-button": {
    label: "<",
    action: () => model.previous(),
  },
  "right-button": {
    label: ">",
    action: () => model.next(),
  },
});
