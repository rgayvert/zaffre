import { View, pct, IFrame } from "zaffre";

export function IFrameExample(): View {
  return IFrame("url.sample-website", { width: pct(90), aspectRatio: 2.0 }); 
}
