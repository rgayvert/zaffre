import { Grid, GridOptions } from "../Layout";
import { FormModel } from "./FormModel";
import { addClass, addOptionEvents } from ":view";
import { Button, ButtonOptions } from "../Controls";
import { zborder, zcolor } from ":theme";
import { Atom, ValidationSchema } from ":foundation";

//
// A Form contains a Grid of FormFields.
//

export interface FormOptions extends GridOptions {
  schema?: ValidationSchema<any>;
  columnWidths?: number[];
  readOnly?: Atom<boolean>;
}

export const Form = <R extends {}>(formModel: FormModel<R>, inOptions: FormOptions = {}) => {
  const options = addClass(inOptions, "Form");
  options.tag = "form";
  options.model = formModel;

  options.onIntersectionVisible = (view) => {
    const fv = view.findDescendant((v) => (v.options as any).firstFocus);
    fv && setTimeout(() => fv.focus(), 500);
  };
  addOptionEvents(options, {
    keyDown: (evt) => evt.key === "Enter" && formModel.submitIfReady(),
  });
  return Grid(options).append(...formModel.allViews);
};

export const DefaultButton = <R extends {}>(formModel: FormModel<R>, options: ButtonOptions) => {
  const border = () => (formModel.submitDisabled.get() ? zborder.medium : zborder.thick.color(zcolor.primary));
  formModel.submitAction = options.action;
  return Button({ ...options, border, background: zcolor.primary, color: zcolor.white });
};
