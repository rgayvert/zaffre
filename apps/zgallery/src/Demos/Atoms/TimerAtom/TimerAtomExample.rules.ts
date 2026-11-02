import { zrounding, zspace, ch } from "zaffre";

export const rules = {
  "VStack": {
    gap: zspace.s4,
  },
  "HStack": {
    gap: zspace.s3,
  },
  "TextLabel": {
    padding: zspace.s2,
  },
  "Button": {
    width: ch(10),
    rounding: zrounding.pill,
    ripple: false,
  },
};
