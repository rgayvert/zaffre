import { znumber, zboolean, zstring, ZType, Atom, AtomOrClosure } from ":foundation";

//
// Options that are converted into HTML attributes.
//

export interface HTMLAttributeOptions {
  accept?: zstring;
  alt?: string;
  autocapitalize?: ZType<"none" | "off" | "sentences" | "on" | "words" | "chracters">;
  autocomplete?: zstring;
  autofocus?: zboolean;
  autocorrect?: zboolean;
  autoplay?: zboolean;
  cols?: znumber;
  controls?: zboolean;
  contentEditable?: ZType<zboolean | "plaintext-only">;
  disabled?: AtomOrClosure<boolean>;
  draggable?: zboolean;
  href?: zstring;
  inputMode?: ZType<"none" | "text" | "decimal" | "numeric" | "tel" | "search" | "email" | "url">;
  max?: znumber;
  maxLength?: znumber;
  min?: znumber;
  minLength?: znumber;
  multiple?: zboolean;
  onclick?: zstring;
  pattern?: zstring;
  placeholder?: zstring;
  readonly?: zboolean;
  referrerpolicy?: zstring;
  required?: zboolean;
  rows?: znumber;
  size?: znumber;
  spellcheck?: zboolean;
  step?: zstring;
  tabIndex?: znumber;
  target?: string;
  title?: zstring;
  type?: string;
  html_width?: znumber;
  html_height?: znumber;
}

export const htmlAttributeKeys = [
  "accept",
  "alt",
  "autocapitalize",
  "autocomplete",
  "autofocus",
  "autocorrect",
  "autoplay",
  "cols",
  "contentEditable",
  "controls",
  "disabled",
  "draggable",
  "href",
  "id",
  "inputMode",
  "max",
  "maxLength",
  "min",
  "minLength",
  "multiple",
  "onclick",
  "pattern",
  "placeholder",
  "readonly",
  "referrerpolicy",
  "required",
  "role",
  "rows",
  "size",
  "spellcheck",
  "step",
  "tabIndex",
  "target",
  "title",
  "type",
  "html_width",
  "html_height",
];
