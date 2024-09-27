import { View, core, TextLabel, asyncAtom } from "zaffre";

function getGMT(): Promise<string> {
  return new Promise((resolve, _reject) =>
    resolve(`GMT: ${new Date().toLocaleTimeString("en-GB", { timeZone: "UTC" })}`)
  );
}
export function AsyncAtomExample(): View {
  const gmt = asyncAtom(() => getGMT(), "", 1000);

  return TextLabel(gmt, {
    font: core.font.headline_medium,
  });
}
