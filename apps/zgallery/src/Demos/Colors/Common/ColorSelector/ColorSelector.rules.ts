import { zborder, zcolor, em, borderToken } from "zaffre";
import { ColorSelectorModel } from "./ColorSelectorModel";

// feedback for hex input
const validBorder = zborder.thin;
const invalidBorder = borderToken({ color: zcolor.error, width: em(0.1) });

export const rules = (model: ColorSelectorModel) => ({
  "ColorSelector>TextInput": {
    border: () => (model.hexIsValid.get() ? validBorder : invalidBorder),
    valid: model.hexIsValid,
  },
  "ColorSelector_ColorBox": {
    clickAction: () => model.pickTrigger.set(true),
    background: model.colorToken,
  },
  "ColorSelector_InvalidLabel": {
    visibility: () => (model.hexIsValid.get() ? "hidden" : "visible"),
  },
});
