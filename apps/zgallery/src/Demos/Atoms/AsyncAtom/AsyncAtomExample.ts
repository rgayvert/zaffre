import { TextLabel, asyncAtom } from "zaffre";

const getGMT = (): Promise<string> => {
  return new Promise((resolve, _reject) =>
    resolve(`GMT: ${new Date().toLocaleTimeString("en-GB", { timeZone: "UTC" })}`)
  );
}
export const AsyncAtomExample = () => {
  const gmt = asyncAtom(() => getGMT(), "", 1000);
  return TextLabel(gmt);
}
