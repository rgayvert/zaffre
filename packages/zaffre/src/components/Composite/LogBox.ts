import { atom, Atom, zutil } from ":foundation";
import { TextBox, TextBoxOptions } from "../Content";
import { addClass } from ":view";

//
// A LogBox is a simple text box useful for logging. Each time the entry is changed,
// it is appended to the contents rather than replacing it.
//

export interface LogBoxOptions extends TextBoxOptions {
  logContent?: Atom<string>;
}

export const LogBox = (entry: Atom<string>, inOptions: LogBoxOptions = {}) => {

  const logBoxOptions = addClass(inOptions, "LogBox");

  entry.options.alwaysFire = true;
  const logContent = logBoxOptions.logContent || atom("");

  const appendEntry = (val: string): void => {
    logContent.set(`${logContent.get()}${zutil.timeNow()}: ${val}<br>`);
  }
  entry.addAction((val) => appendEntry(val));

  return TextBox(logContent, logBoxOptions);
}
