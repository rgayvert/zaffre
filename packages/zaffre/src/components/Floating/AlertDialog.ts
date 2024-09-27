import { zstring, BasicAction, Atom, } from ":foundation";
import { place, transitions, View , core, defineComponentDefaults, mergeComponentDefaults } from ":core";
import { TextLabel } from "../Content";
import { BoxOptions, Floating } from "../HTML";
import { HStack, VStack } from "../Layout";
import { Button } from "../Controls";

//
// An AlertDialog is a modal view which has a title, optional subtitle, and 1-3 buttons, and
// appears in the dialog layer, which provides a scrim background and modal behavior.
//

export interface AlertDialogOptions extends BoxOptions {
  subtitle?: zstring;
  acceptLabel?: zstring;
  rejectLabel?: zstring;
  cancelLabel?: zstring;
  rejectAction?: BasicAction;
  cancelAction?: BasicAction;
}
defineComponentDefaults<AlertDialogOptions>("AlertDialog", "VStack", {
  acceptLabel: "OK",
  rejectLabel: "No",
  cancelLabel: "Cancel",
  background: core.color.background,
  color: core.color.primary,
  pointerEvents: "auto",
  rounding: core.rounding.r2,
  border: core.border.medium,
  padding: core.space.s4,
  elevation: 5,
  effects: { mounted: transitions.fadeIn() },
  placement: place.center,
  isDialog: true,
});

export function AlertDialog(hidden: Atom<boolean>, title: zstring, defaultAction?: BasicAction, inOptions: AlertDialogOptions = {}): View {
  const options = mergeComponentDefaults("AlertDialog", inOptions);

  options.hidden = hidden;

  function ActionButton(label: zstring, action?: BasicAction): View {
    return Button({
      label: label,
      color: core.color.primary,
      background: core.color.primaryContainer,
      rounding: core.rounding.pill,
      action: () => {
        hidden.set(true);
        action?.();
      },
    });
  }
  const buttons = [ActionButton(options.acceptLabel!, defaultAction)];
  if (options.rejectLabel) {
    buttons.push(ActionButton(options.rejectLabel!, options.rejectAction));
  }
  if (options.cancelAction) {
    buttons.push(ActionButton(options.cancelLabel!, options.cancelAction));
  }

  const titleLabel = TextLabel(title, {
    background: core.color.none,
    font: core.font.title_medium.bold(),
    color: core.color.primary,
    padding: core.space.s5,
  });
  let subtitleLabel;
  if (options.subtitle) {
    subtitleLabel = TextLabel(title, {
      background: core.color.none,
      font: core.font.body_medium,
      color: core.color.darkgray,
      padding: core.space.s5,
    });
  }
  return Floating(VStack(options).append(
    titleLabel, 
    subtitleLabel, 
    HStack({ gap: core.space.s5, background: core.color.background }).append(
      ...buttons
    )));
}
