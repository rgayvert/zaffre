import { Box, ch, gradientX, zborder, zcolor } from "zaffre";

export const GradientXExample = () => {
    return Box({
        height: ch(20),
        width: ch(20),
        border: zborder.thin,
        background: gradientX(zcolor.primary, zcolor.tertiaryContainer)
    });
}

