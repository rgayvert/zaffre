import { TextLabel, Sidebar, TextBox, lorem, Box } from "zaffre";
import { sidebarExampleRules } from "./SidebarExample.rules";

export const SidebarExample = () => {
  return Box({ rules: sidebarExampleRules, cls: "container" }).append(
    Sidebar().append(
      TextLabel(lorem.words(2)),
      TextBox(lorem.words(16))
    )
  );
}
 