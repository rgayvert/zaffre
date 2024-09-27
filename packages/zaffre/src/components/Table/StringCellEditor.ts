import { Atom, atom, TableDataCell, TableModel } from ":foundation";
import { core, pct, px, View } from ":core";
import { TextInput, TextInputOptions } from "../Inputs";

//
// A StringCellEditor is a TextInput configured to use for editing a data cell in a table.
//

export function StringCellEditor<R>(
  tableModel: TableModel<R>,
  dataCell: TableDataCell<R, string>,
  editedCell: Atom<TableDataCell<R, string> | undefined>
): View {
  // here's how the edited value is fed back to the table model
  const val = atom(dataCell.value, { action: (val: string) => tableModel.updateCellValue(dataCell, val) });
  const inputOptions: TextInputOptions = {
    setOnInput: false,
    textAlign: "center",
    position: "absolute",
    top: px(0),
    left: px(0),
    height: pct(100),
    width: pct(100),
    zIndex: 2,
    background: core.color.background,
    firstFocus: true,
    selectOnFocus: true,
    font: core.font.inherit,
    events: {
      keyBindings: {
        "Enter": () => editedCell.set(undefined),
      },
      blur: () => editedCell.set(undefined),
    },
  };
  return TextInput(val, inputOptions);
}
