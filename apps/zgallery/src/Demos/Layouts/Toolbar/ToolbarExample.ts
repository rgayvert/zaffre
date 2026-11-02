import { Box, SimpleAction, TToolbar } from "zaffre";
import { toolbarExampleRules } from "./ToolbarExample.rules";

const toolbarExampleKeys = ["bold", "italic", "unordered", "numbered", "quote"] as const;
type ToolbarExampleKey = (typeof toolbarExampleKeys)[number];

const icons: Record<ToolbarExampleKey, string> = {
  bold: "icon.bold",
  italic: "icon.italic",
  unordered: "icon.unordered-list",
  numbered: "icon.numbered-list",
  quote: "icon.quote",
};
const actions: Record<ToolbarExampleKey, SimpleAction> = {
  bold: () => console.log("bold"),
  italic: () => console.log("italic"),
  unordered: () => console.log("unordered"),
  numbered: () => console.log("numbered"),
  quote: () => console.log("quote"),
};

export const ToolbarExample = () => {
  return Box({ rules: toolbarExampleRules, cls: "container" }).append(TToolbar(icons, actions));
};
