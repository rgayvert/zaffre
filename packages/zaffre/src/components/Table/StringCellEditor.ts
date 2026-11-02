import { Atom, atom, TableDataCell, TableModel } from ":foundation";
import { TextInput, TextInputOptions } from "../Inputs";
import { addClass } from ":view";

//
// A StringCellEditor is a TextInput configured to use for editing a data cell in a table.
//

export interface StringCellEditorOptions extends TextInputOptions {}


export const StringCellEditor = <R extends {}>(
  tableModel: TableModel<R>,
  dataCell: TableDataCell<R, string>,
  editedCell: Atom<TableDataCell<R, string> | undefined>,
  inOptions: StringCellEditorOptions = {}
) => {
  const options = addClass(inOptions, "StringCellEditor");
  options.model = tableModel;

  // here's how the edited value is fed back to the table model
  const textValue = atom(dataCell.value, { action: (val: string) => tableModel.updateCellValue(dataCell, val) });
  options.events = {
    keyBindings: {
      "Enter": () => editedCell.set(undefined),
    },
    blur: () => editedCell.set(undefined),
  };
  return TextInput(textValue, options);
};
