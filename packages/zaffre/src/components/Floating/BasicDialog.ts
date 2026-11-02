import { zstring, BasicAction, Atom, zboolean, atom } from ":foundation";
import { addClass, getBodyView, HTMLDelegate, place, View, ViewCreator, zfont, zspace } from ":core";
import { TextLabel } from "../Content";
import { DialogContainer, FloatingContainerOptions } from "../HTML";
import { HStack, StackOptions, VStack } from "../Layout";
import { Button } from "../Controls";
import { TextInput } from "../Inputs";
import { MenuItemList } from "./MenuItem";
import { LabelBox } from "../ControlGroups";
import { DropDownButton } from "./DropDownButton";

//
// An BasicDialog is a modal view which has a title, optional subtitle, and 1-3 buttons, and
// appears in the dialog layer, which provides a scrim background and modal behavior.
//

export interface BasicDialogOptions extends StackOptions {
  subtitle?: zstring;
  contentViewFn?: ViewCreator;
  acceptLabel?: zstring;
  rejectLabel?: zstring;
  cancelLabel?: zstring;
  acceptAction?: BasicAction;
  rejectAction?: BasicAction;
  cancelAction?: BasicAction;
  acceptDisabled?: Atom<boolean>;
  cancelDisabled?: Atom<boolean>;
  rejectDisabled?: Atom<boolean>;
  reverseButtons?: boolean;
}

export const BasicDialog = (hidden: Atom<boolean>, title: zstring, inOptions: BasicDialogOptions = {}) => {
  const options = addClass(inOptions, "BasicDialog");

  options.hidden = hidden;

  const DialogButton = (label: zstring, action?: BasicAction, disabled?: Atom<boolean>) => {
    return Button({
      cls: "BasicDialog.Button",
      label: label,
      disabled: disabled,
      action: () => {
        hidden.set(true);
        action?.();
      },
    });
  };

  const buttons = [];
  if (options.rejectLabel) {
    buttons.push(DialogButton(options.rejectLabel!, options.rejectAction, options.rejectDisabled));
  }
  if (options.cancelAction) {
    buttons.push(DialogButton(options.cancelLabel!, options.cancelAction, options.cancelDisabled));
  }
  buttons.push(DialogButton(options.acceptLabel!, options.acceptAction, options.acceptDisabled));
  if (options.reverseButtons) {
    buttons.reverse();
  }

  const titleLabel = title ? TextLabel(title, { cls: "BasicDialog.Title" }) : undefined;
  const subtitleLabel = TextLabel(options.subtitle || "", { cls: "BasicDialog.Subtitle" });

  const dialogOptions: FloatingContainerOptions = {
    hidden: hidden,
    clickThrough: false,
    placement: place.center,
  };

  const contentView = options.contentViewFn?.();

  return DialogContainer(dialogOptions).append(
    VStack(options).append(
      titleLabel,
      subtitleLabel,
      contentView,
      HStack({ cls: "BasicDialog.ButtonRow" }).append(...buttons),
    ),
  );
};

export type NoticeDialogOptions = Omit<YesNoDialogOptions, "rejectLabel" | "rejectAction">;

export const NoticeDialog = (hidden: Atom<boolean>, title: zstring, options: NoticeDialogOptions = {}) => {
  return BasicDialog(hidden, title, options);
};

export type YesNoDialogOptions = Omit<BasicDialogOptions, "cancelLabel" | "cancelAction">;

export const YesNoDialog = (hidden: Atom<boolean>, title: zstring, options: YesNoDialogOptions = {}) => {
  return BasicDialog(hidden, title, { ...options, reverseButtons: true });
};

export const YesNoCancelDialog = (hidden: Atom<boolean>, title: zstring, options: BasicDialogOptions = {}) => {
  return BasicDialog(hidden, title, options);
};

export interface PromptModel {
  label: zstring;
  value: Atom<string>;
}
export const PromptDialog = (model: PromptModel, hidden: Atom<boolean>, options: BasicDialogOptions = {}) => {
  options.contentViewFn = () => {
    return HStack({ gap: zspace.s3, margin: zspace.s3, marginBottom: zspace.s6 }).append(
      TextLabel(model.label, { font: zfont.body_medium.bold() }),
      TextInput(model.value, { firstFocus: true }),
    );
  };
  return BasicDialog(hidden, "", options);
};

export const DropDownDialog = <T>(
  label: string,
  menuItems: MenuItemList<T>,
  hidden: Atom<boolean>,
  options: BasicDialogOptions = {},
) => {
  options.contentViewFn = () => {
    return LabelBox(label, { paddingTop: zspace.s5, paddingBottom: zspace.s7 }).append(DropDownButton(menuItems));
  };
  return BasicDialog(hidden, "", options);
};

export type Dialog = (hidden: Atom<boolean>) => View;

export const showDialog = <T>(dialog: Dialog) => {
  const hidden = atom(true, {
    action: (b) => {
      b && view.remove();
    },
  });
  const view = dialog(hidden);
  getBodyView().append(view);
  hidden.set(false);
};
