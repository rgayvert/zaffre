import { ch } from ":attributes";
import { core } from ":theme";
import { defineOptionBundles } from ":view";

defineOptionBundles([
    ["vstack1", {
        padding: core.space.s6,
        maxWidth: ch(120),
    }],
    ["textinput1", {
        rounding: core.rounding.pill,
        border: core.border.thin,
        textAlign: "center",
        font: core.font.display_medium,
        placeholder: "Enter some text",
    }],
    ["textlabel1", {
        color: core.color.primary,
        font: core.font.headline_medium,
    }],
    ["vstack4", {
        gap: core.space.s5,
    }],
    ["hstack4a", {
        gap: core.space.s4, 
        padding: core.space.s4
    }],
    ["hstack4b", {
        gap: core.space.s5, 
    }],
    ["label4", {
        font: core.font.title_medium,
        border: core.border.thin,
        padding: core.space.s2,
    }],
    
]);
