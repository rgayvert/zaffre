import { ArrayAtom, Atom, atom, arrayAtom, zboolean, zget } from "../Atom";
import { TableColumn, TableColumns } from "./TableColumn";

//
// A TableModel manages the rows and columns for a Table display. The rows are maintained as
// a reactive list of records of type R, and the columns as a reactive list of TableColumns.
// Each [row, column] cell of a table is modeled as a TableCell, and the list of all cells is
// made available for the Table to feed to into a Grid. 
//

export type SimpleTableModel<R> = TableModel<R>;
export function simpleTableModel<R>(rows: R[], columns: TableColumns<R>): SimpleTableModel<R> {
  return new TableModel(arrayAtom(rows), columns);
}

export type TableCellType = "data" | "header";

export class TableCell {
  constructor(public type: TableCellType) {}
}

export class TableDataCell<R, S> extends TableCell {
  value: Atom<S>;
  constructor(public row: R, public column: TableColumn<R, S>) {
    super("data");
    this.value = atom(column.value(row));
  }
}
export class TableHeaderCell<R, S> extends TableCell {
  constructor(public column: TableColumn<R, S>) {
    super("header");
  }
}

export function isDataCell<R>(cell: TableCell): cell is TableDataCell<R, unknown> {
  return cell.type === "data";
}
export function isHeaderCell<R>(cell: TableCell): cell is TableHeaderCell<R, unknown> {
  return cell.type === "header";
}

export interface TableModelOptions {
  selectableColumns?: zboolean;
}

export class TableModel<R> {
  selectedRow: Atom<R | undefined> = atom(undefined);
  selectedColumn: Atom<TableColumn<R, unknown> | undefined> = atom(undefined);
  rowIsSelected = true;
  cells!: ArrayAtom<TableCell>;
  updateAllOnChange = false;
  numRows = atom(0);
  numColumns = atom(0);

  constructor(public rows: ArrayAtom<R>, public columns: TableColumns<R>, public options: TableModelOptions = {}) {
    this.cells = arrayAtom([]);
    this.updateCells();
    this.rows.addAction(() => this.updateCells());
    this.selectedRow.addAction(() => this.rowSelectionChanged());
    this.selectedColumn.addAction(() => this.columnSelectionChanged());
    if (!(this.columns instanceof ArrayAtom)) {
      this.columns = arrayAtom(this.columns);
    }
  }

  // row & column selections are exclusive
  rowSelectionChanged(): void {
    if (!this.rowIsSelected) {
      this.selectedColumn.set(undefined);
    }
    this.rowIsSelected = true;
  }
  columnSelectionChanged(): void {
    if (this.rowIsSelected) {
      this.selectedRow.set(undefined);
    }
    this.rowIsSelected = false;
  }

  allCells(): TableCell[] {
    return [...this.createHeaderCells(), ...this.createAllDataCells()];
  }
  updateCells(): void {
    this.numRows.set(this.rows.length);
    this.cells.set(this.allCells());
  }
  setRows(newRows: ArrayAtom<R>): void {
    this.rows = newRows;
    this.updateCells();
    this.rows.addAction(() => this.updateCells());
    this.selectedRow.set(undefined);
  }
  createAllDataCells(): TableCell[] {
    return this.rows.map((row) => this.createDataCellsForRow(row)).flat();
  }
  createDataCellsForRow(row: R): TableCell[] {
    return this.columns.map((column) => new TableDataCell(row, column));
  }
  createHeaderCells(): TableCell[] {
    return this.columns.map((column) => new TableHeaderCell(column));
  }
  rowIndexOfCell(cell: TableDataCell<R, unknown>): number {
    return this.rows.indexOf(cell.row);
  }
  dataCells(): TableDataCell<R, unknown>[] {
    return <TableDataCell<R, unknown>[]>this.cells.filterWithGuard(isDataCell);
  }
  sortOnColumn(column: TableColumn<R, unknown>): void {
    const compareFn = column.compareFn;
    if (compareFn) {
      const sortFactor = column.sortDirection === "desc" ? -1 : 1;
      this.rows.sort((r1, r2) => sortFactor * compareFn(column.value(r1), column.value(r2)));
      column.sortDirection = column.sortDirection === "desc" ? "asc" : "desc";
      this.updateCells();
    }
  }
  cellIsSelected(cell: TableCell): boolean {
    if (isDataCell(cell)) {
      return cell.row === this.selectedRow.get() || cell.column === this.selectedColumn.get();
    } else {
      return isHeaderCell(cell) && cell.column === this.selectedColumn.get();
    }
  }
  get maySelectColumns(): boolean {
    return Boolean(zget(this.options.selectableColumns));
  }

  // Adding & deleting rows. When a row is added or removed, the data cells are updated.
  addRow(newRow: R, index: number): void {
    this.rows.insert(index, newRow);
  }
  addRowAfterSelection(rowData: R): void {
    const row = this.selectedRow.get();
    const index = row ? this.rows.indexOf(row) : this.rows.length;
    this.addRow(rowData, index + 1);
  }
  addRowAtEnd(rowData: R): void {
    this.addRow(rowData, this.rows.length);
  }
  deleteRowAtIndex(row: number): void {
    this.rows.deleteIndex(row);
    this.selectedRow.set(undefined);
  }
  delete(rowData: R): void {
    const index = this.rows.indexOf(rowData);
    if (index !== -1) {
      this.deleteRowAtIndex(index);
    }
  }
  selectedRowIndex(): number {
    const row = this.selectedRow.get();
    return row ? this.rows.indexOf(row) : -1;
  }
  deleteSelectedRow(): void {
    const index = this.selectedRowIndex();
    if (index !== -1) {
      this.deleteRowAtIndex(index);
      this.selectedRow.set(undefined);
    }
  }

  // column modification
  deleteSelectedColumn(): void {
    const column = this.selectedColumn.get();
    if (column && this.columns instanceof ArrayAtom) {
      this.columns.delete(column);
      this.updateCells();
    }
  }

  // Updating cells for one record
  updateRowWithRecord(record: R): void {
    this.dataCells().forEach((dataCell) => {
      if (dataCell.row === record) {
        dataCell.value.set(dataCell.column.value(record));
        dataCell.column.setter?.(record, dataCell.value.get());
      }
    });
  }

  updateCellValue<S>(cell: TableDataCell<R, S>, value: S): void {
    cell.column.setter?.(cell.row, value);
    cell.value.set(value);
    if (this.updateAllOnChange) {
      this.updateAllExcept(cell);
    }
  }

  // spreadsheet case (?? this is not the right model for a spreadsheet)
  //
  // TODO: figure out how to capture actual dependencies without making all of the
  // record values atoms
  //
  updateAllExcept<S>(except: TableDataCell<R, S>): void {
    this.dataCells().forEach((cell) => cell !== except && cell.value.fire());
  }
}
