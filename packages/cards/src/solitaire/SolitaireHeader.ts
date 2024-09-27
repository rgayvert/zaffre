import { Box, HStack, Spacer, TextButton } from "zaffre";
import { TextLabel, VStack, View, core, em } from "zaffre";
import { SolitaireModel } from "./SolitaireModel";

export function SolitaireHeader(model: SolitaireModel): View {
  return VStack({ padding: core.space.s3, alignItems: "center" }).append(
    HStack({ padding: core.space.s3 }).append(
      TextLabel(model.highScoreString, { font: core.font.title_medium }),
      Spacer(core.space.s4),
      TextLabel(model.lowTimeString, { font: core.font.title_medium }),
      Spacer(core.space.s6),
      TextLabel(model.scoreString, { font: core.font.title_medium }),
      Spacer(core.space.s4),
      TextLabel(model.elapsedTime, { font: core.font.title_medium }),
      Box({ width: em(3) }),
      TextButton("New Game", { padding: core.space.s0, font: core.font.title_medium, action: () => model.newGame() })
    )
  );
}
