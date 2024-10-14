import { atom, Atom, zutil } from ":foundation";
import { BV, View, defineComponentBundle, mergeComponentOptions, restoreOptions } from ":core";
import { TextBox, TextBoxOptions } from "../Content";

//
// A LogBox is a simple text box useful for logging. Each time the entry is changed,
// it is appended to the contents rather than replacing it.
//

export interface LogBoxOptions extends TextBoxOptions {
  logContent?: Atom<string>;
}
defineComponentBundle<LogBoxOptions>("LogBox", "Text", {
  autoScrollToBottom: true,
});

export function LogBox(entry: Atom<string>, inOptions: BV<LogBoxOptions> = {}): View {
  const options = mergeComponentOptions("LogBox", inOptions);
  entry.options.alwaysFire = true;
  const logContent = options.logContent || atom("");

  function appendEntry(val: string): void {
    logContent.set(`${logContent.get()}${zutil.timeNow()}: ${val}<br>`);
  }
  entry.addAction((val) => appendEntry(val));

  return restoreOptions(TextBox(logContent, options));
}
