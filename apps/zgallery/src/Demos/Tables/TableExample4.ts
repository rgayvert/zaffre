import { Box, HStack, VStack, Button, loremTable, Table, TableOptions, zborder, zspace } from "zaffre";

export const TableExample4 = () => {
  const tableModel4 = loremTable.tableModel(5, 7);
  const tableOptions: TableOptions<any> = {
    selectableColumns: true,
  };
  const mayDeleteRow = () => {
    return Boolean(tableModel4.selectedRow.get() && tableModel4.rows.length > 1);
  };
  const mayDeleteColumn = () => {
    return Boolean(tableModel4.selectedColumn.get() && tableModel4.columns.length > 1);
  };
  const addRow = () => {
    tableModel4.addRowAfterSelection(loremTable.tableRow(tableModel4.columns.get()));
  };
  const deleteRow = () => {
    tableModel4.deleteSelectedRow();
  };
  const deleteColumn = () => {
    tableModel4.deleteSelectedColumn();
  };
  return HStack({ gap: zspace.s7 }).append(
    Box({ border: zborder.thin }).append(Table(tableModel4, tableOptions)),
    VStack({ gap: zspace.s5 }).append(
      Button({ label: "Add row", controlSize: "sm", action: () => addRow() }),
      Button({
        label: "Delete row",
        controlSize: "sm",
        action: () => deleteRow(),
        disabled: () => !mayDeleteRow(),
      }),
      Button({
        label: "Delete column",
        controlSize: "sm",
        action: () => deleteColumn(),
        disabled: () => !mayDeleteColumn(),
      })
    )
  );
};
