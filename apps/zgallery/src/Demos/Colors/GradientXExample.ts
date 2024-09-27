import { Box, View, ch, core, gradientX } from "zaffre";

export function GradientXExample(): View {
    return Box({
        height: ch(20),
        width: ch(20),
        border: core.border.thin,
        background: gradientX(core.color.primary, core.color.tertiaryContainer)
    });
}

