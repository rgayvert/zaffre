import { AnyTableCell, Atom, atom, BasicAction, TableDataCell, TableModel, zboolean, zget, zutil } from ":foundation";
import { point2D, Point2D, condition } from ":foundation";
import { Lazy, addClass, ch, css_color, zcolor } from ":core";
import { CenterBox, CenterBoxOptions } from "../Layout";
import { FormattedText, LabelOptions } from "../Content";
import { StringCellEditor } from "./StringCellEditor";

//
// A StringDataCellView is a view that displays the contents of a data cell as a FormattedText,
// using the formatter associated with the cell.
//
// If the cell is editable, a StringCellEditor will also be created. This editor will become visible
// when the cell is double-clicked (the opacity become one when this cell is the edited cell).
//
//

// TODO: figure out why changing the font here can cause extra space at the bottom
// of each data cell

export interface StringDataCellViewOptions extends LabelOptions {
  sortable?: zboolean;
  doubleClickAction?: BasicAction;
  editable?: boolean;
  onCellClicked?: (cell: AnyTableCell<any>, location: Point2D) => void;
  cellColor?: (cell: AnyTableCell<any>) => css_color;
  cellSelectionTextColor?: (cell: AnyTableCell<any>) => css_color;
}


export const StringDataCellView = <R extends {}>(
  tableModel: TableModel<R>,
  dataCell: TableDataCell<R, string>,
  editedCell: Atom<TableDataCell<R, string> | undefined>,
  inOptions: StringDataCellViewOptions = {}
) => {
  const options = addClass(inOptions, "StringDataCellView");
  options.model = tableModel;
  options.doubleClickAction ||= tableModel.options.doubleClickAction;
  options.textAlign = dataCell.column.alignment;
  options.hidden = dataCell.column.hidden;
  if (dataCell.column.minWidth) {
    options.minWidth = ch(dataCell.column.minWidth);
  }
  options.selected = atom(() => tableModel.cellIsSelected(dataCell));
  options.events = {
    dblClick: () => options.doubleClickAction?.(),
    click: (evt: MouseEvent) => cellClicked(dataCell, point2D(evt.offsetX, evt.offsetY)),
  };
  options.opacity = atom(() => (editedCell.get() === dataCell ? 0.0 : 1.0));
  options.model = dataCell;

  options.background = atom(() =>
    dataCell.row === tableModel.selectedRow.get() ? zcolor.secondaryContainer : zcolor.background
  );

  options.scrollIntoViewWhen = condition(() => dataCell.row === tableModel.selectedRow.get());

  const cellClicked = (cell: TableDataCell<R, string>, location: Point2D): void => {
    tableModel.options.selectableRows && tableModel.selectedRow.set(cell.row);
    //options.onCellClicked?.(cell, location);
    if (zutil.touchEventsSupported()) {
      tableModel.options.doubleClickAction?.();
    }
  };
  // If the table is editable, each cell has an editor that is created when needed.

  const dataCellView = FormattedText(() => zget(dataCell.value), dataCell.column.formatter, options);

  if (options.editable) {
    const editor = Lazy(
      () => StringCellEditor(tableModel, dataCell, editedCell),
      atom(() => editedCell.get() === dataCell)
    );
    const containerOptions: CenterBoxOptions = {
      background: zcolor.background,
      placeSelf: "stretch",
      overflow: "hidden",
      selected: () => dataCell.row === tableModel.selectedRow.get(),
      selectionColor: options.selectionColor || zcolor.secondaryContainer,
      events: {
        dblClick: () => editedCell.set(dataCell),
      },
    };
    dataCellView.append(editor);
    return CenterBox(containerOptions).append(dataCellView);
  } else {
    return dataCellView;
  }
};
