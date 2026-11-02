import { Box, addClass, FixedSizeContainer } from "zaffre";
import { fixedSizeContainerExampleRules } from "./FixedSizeContainerExample.rules";

export const FixedSizeContainerExample = () => {
  const options = addClass({}, "fixed-size-container-top", fixedSizeContainerExampleRules);
  const child = Box({ cls: "fixed-size-child" });

  return FixedSizeContainer(options).append(child);
};
