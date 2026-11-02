import { Atom } from ":foundation";
import { addClass } from ":view";
import { HStack, StackOptions, VStack } from "../Layout";
import { Button } from "../Controls";

//
// SimpleSettings is stack container that slides in from the right, with
// a close button.
//

export interface SimpleSettingsOptions extends StackOptions {}


export const SimpleSettings = (hidden: Atom<boolean>, inOptions: SimpleSettingsOptions = {}) => {
  const options = addClass(inOptions, "SimpleSettings");
  options.hidden = hidden;

  return VStack(options).append(
    HStack({ cls: "SimpleSettings.Bar"}).append(
      Button({
        cls: "SimpleSettings.Button",
        action: () => hidden.set(true),
      })
    )
  );
};
