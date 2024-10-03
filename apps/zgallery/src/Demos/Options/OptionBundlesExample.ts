import { View, HStack, Box } from "zaffre";
import "./OptionBundles";

export function OptionBundlesExample(): View {
  function BlueBox(): View {
    return Box(["small-box", "blue-box"]);
  }
  function GreenCircle(): View {
    return Box(["small-box", "green-circle"]);
  }
  return HStack("medium-gap").append(
    BlueBox(),
    GreenCircle(),
  );
}
