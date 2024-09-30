import { znumber, zboolean, zstring, ZType, Atom } from ":foundation";

//
// Options that are converted into HTML attributes.
//

export interface HTMLAttributeOptions {
    accept?: zstring;
    autoCapitalize?: ZType<"none" | "off" | "sentences" | "on" | "words" | "chracters">;
    autocomplete?: zstring;
    autoCorrect?: zboolean;
    cols?: znumber;
    controls?: zboolean;
    contentEditable?: ZType<zboolean | "plaintext-only">;
    disabled?: Atom<boolean>;
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
    readOnly?: zboolean;
    referrerpolicy?: zstring;
    required?: zboolean;
    rows?: znumber;
    size?: znumber;
    spellCheck?: zboolean;
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
    "autoCapitalize",
    "autocomplete",
    "autoCorrect",
    "cols",
    "contentEditable",
    "controls",
    "disabled",
    "draggable",
    "href",
    "inputMode",
    "max",
    "maxLength",
    "min",
    "minLength",
    "multiple",
    "onclick",
    "pattern",
    "placeholder",
    "readOnly",
    "referrerpolicy",
    "required",
    "role",
    "rows",
    "size",
    "spellCheck",
    "step",
    "tabIndex",
    "target",
    "title",
    "type",
    "html_width",
    "html_height",
  ];
  