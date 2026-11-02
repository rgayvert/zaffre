import { pct, IFrame } from "zaffre";

export const IFrameExample = () => {
  return IFrame("url.sample-website", { width: pct(90), aspectRatio: 2.0 }); 
}
