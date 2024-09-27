import { atom, Atom, zutil } from ":foundation";
import { View, defineComponentDefaults, mergeComponentDefaults } from ":core";
import { TextBox, TextBoxOptions } from "../Content";

//
// A LogBox is a simple text box useful for logging. Each time the entry is changed,
// it is appended to the contents rather than replacing it.
//

export interface LogBoxOptions extends TextBoxOptions {
  logContent?: Atom<string>;
}
defineComponentDefaults<LogBoxOptions>("LogBox", "Text", {
  autoScrollToBottom: true,
});

export function LogBox(entry: Atom<string>, inOptions: LogBoxOptions = {}): View {
  const options = mergeComponentDefaults("LogBox", inOptions);
  entry.options.alwaysFire = true;
  const logContent = options.logContent || atom("");

  function appendEntry(val: string): void {
    logContent.set(`${logContent.get()}${zutil.timeNow()}: ${val}<br>`);
  }
  entry.addAction((val) => appendEntry(val));

  return TextBox(logContent, options);
}
