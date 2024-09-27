import { View, core, Box, HStack, VStack, Button, atom, loremTable, Table, TableOptions } from "zaffre";

export function TableExample4(): View {
  const tableModel4 = loremTable.tableModel(5, 7);
  const tableOptions: TableOptions = {
    sortable: true,
    selectableColumns: true,
  };
  function mayDeleteRow(): boolean {
    return Boolean(tableModel4.selectedRow.get() && tableModel4.rows.length > 1);
  }
  function mayDeleteColumn(): boolean {
    return Boolean(tableModel4.selectedColumn.get() && tableModel4.columns.length > 1);
  }
  function addRow(): void {
    tableModel4.addRowAfterSelection(loremTable.tableRow(tableModel4.columns));
  }
  function deleteRow(): void {
    tableModel4.deleteSelectedRow();
  }
  function deleteColumn(): void {
    tableModel4.deleteSelectedColumn();
  }
  return HStack({ gap: core.space.s7 }).append(
    Box({ border: core.border.thin }).append(Table(tableModel4, tableOptions)),
    VStack({ gap: core.space.s5 }).append(
      Button({ label: "Add row", controlSize: "sm", action: () => addRow() }),
      Button({ label: "Delete row", controlSize: "sm", action: () => deleteRow(), disabled: atom(() => !mayDeleteRow()) }),
      Button({ label: "Delete column", controlSize: "sm", action: () => deleteColumn(), disabled: atom(() => !mayDeleteColumn()) })
    )
  );

}
