import { BasicAction, zstring } from ":foundation";
import { FormModel } from "./FormModel";
import { HStack, Spacer, StackOptions } from "../Layout";
import { Button } from "../Controls";
import { addClass } from ":view";
import { zspace } from ":theme";

export interface FormToolbarOptions<R> extends StackOptions {
  submitLabel?: zstring;
  submitAction?: BasicAction;
  resetLabel?: zstring;
  deleteLabel?: string;
  deleteAction?: BasicAction;
  mayDelete?: (record: R) => boolean;
}

export const FormToolbar = <R extends {}>(formModel: FormModel<R>, inOptions: FormToolbarOptions<R> = {}) => {
  const options = addClass(inOptions, "FormToolbar");
  options.model = formModel;

  const deleteButton = () => {
    return !options.deleteLabel ? undefined : Button({
      label: options.deleteLabel,
      action: options.deleteAction,
      disabled: () => !options.mayDelete?.(formModel.record.get()),
    })
  }

  return HStack(options).append(
    Button({
      label: options.resetLabel || "Reset",
      action: () => formModel.reset(),
      disabled: formModel.resetDisabled,
    }),
    Button({
      label: options.submitLabel || "Submit",
      action: options.submitAction,
      disabled: formModel.submitDisabled,
    }),
    Spacer(zspace.s5),
    deleteButton()
  );
};
