import { ch, zfont, zcolor, zspace } from "zaffre";

export const helloRules = {
    "VStack": {
        alignItems: "center",
        padding: zspace.s6,
        minWidth: ch(65)
    },
    "TextLabel": {
        color: zcolor.primary,
        font: zfont.headline_medium,
    },
};
