import { Box, View, ch, core, gradientY } from "zaffre";

export function GradientYExample(): View {
    return Box({
        height: ch(20),
        width: ch(20),
        border: core.border.thin,
        background: gradientY(core.color.primary, core.color.yellow)
    });
}

