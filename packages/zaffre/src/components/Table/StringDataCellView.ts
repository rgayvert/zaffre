import { Atom, atom, BasicAction, zboolean, TableDataCell, TableModel, TableCell, point2D, Point2D, condition } from ":foundation";
import { BV, Lazy, View, afterAddedToDOM, ch, core, defineComponentBundle, mergeComponentOptions, restoreOptions } from ":core";
import { CenterBox, CenterBoxOptions } from "../Layout";
import { TextLabelOptions, FormattedLabel } from "../Content";
import { StringCellEditor } from "./StringCellEditor";

//
// A StringDataCellView is a view that displays the contents of a data cell as a FormattedLabel,
// using the formatter associated with the cell.
//
// If the cell is editable, a StringCellEditor will also be created. This editor will become visible
// when the cell is double-clicked (the opacity become one when this cell is the edited cell).
//
//

export interface StringDataCellViewOptions extends TextLabelOptions {
  sortable?: zboolean;
  doubleClickAction?: BasicAction;
  editable?: boolean;
  onCellClicked?: (cell: TableCell, location: Point2D) => void;
}
// TODO: figure out why changing the font here can cause extra space at the bottom
// of each data cell
defineComponentBundle<StringDataCellViewOptions>("StringDataCellView", "TextLabel", {
  padding: core.space.s2,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  userSelect: "auto",
  //userSelect: "all",
  background: core.color.background,
  color: core.color.primary,
  emptyValue: "&nbsp;",
});

export function StringDataCellView<R>(
  tableModel: TableModel<R>,
  dataCell: TableDataCell<R, string>,
  editedCell: Atom<TableDataCell<R, string> | undefined>,
  inOptions: BV<StringDataCellViewOptions> = {}
): View {
  const options = mergeComponentOptions("StringDataCellView", inOptions);

  options.textAlign = dataCell.column.alignment;
  options.hidden = dataCell.column.hidden;
  if (dataCell.column.minWidth) {
    options.minWidth = ch(dataCell.column.minWidth);
  }
  options.selected = atom(() => tableModel.cellIsSelected(dataCell));
  options.events = {
    dblClick: () => options.doubleClickAction?.(), 
    click: (evt) => cellClicked(dataCell, point2D(evt.offsetX, evt.offsetY)),
  };
  options.opacity = atom(() => (editedCell.get() === dataCell ? 0.0 : 1.0));
  options.model = dataCell;

  options.scrollIntoViewWhen = condition(() => dataCell.row === tableModel.selectedRow.get());
  // afterAddedToDOM(options, (view: View) => tableModel.selectedRow.addAction((row) => {
  //   if (dataCell.row === row) {
  //     view.elt.scrollIntoView()
  //   }
  // })); 

  function cellClicked(cell: TableDataCell<R, string>, location: Point2D): void {
    tableModel.selectedRow.set(cell.row);
    options.onCellClicked?.(cell, location);
  }
  // If the table is editable, each cell has an editor that is created when needed.

  const dataCellView = FormattedLabel(dataCell.value, dataCell.column.formatter, options);

  if (options.editable) {
    const editor = Lazy(
      () => StringCellEditor(tableModel, dataCell, editedCell),
      atom(() => editedCell.get() === dataCell)
    );
    const containerOptions: CenterBoxOptions = {
      background: core.color.background,
      placeSelf: "stretch",
      overflow: "hidden",
      selected: atom(() => dataCell.row === tableModel.selectedRow.get()),
      selectionColor: core.color.secondaryContainer,
      events: {
        dblClick: () => editedCell.set(dataCell),
      },
    };
    return restoreOptions(CenterBox(containerOptions).append(dataCellView, editor));
  } else {
    return restoreOptions(dataCellView);
  }
}
