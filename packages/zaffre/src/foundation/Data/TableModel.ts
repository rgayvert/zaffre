import { ArrayAtom, Atom, atom, arrayAtom, zboolean, zget, BreakpointAtom, BasicAction } from "../Atom";
import { reactiveAction, performAction } from "../Atom";
import { Builder } from "../Util";
import { ColumnSortDirection, TableColumn, TableColumnBuilderList, TableColumnList } from "./TableColumn";

//
// A TableModel manages the rows and columns for a Table display. The rows are maintained as
// a reactive list of records of type R, and the columns as a reactive list of TableColumns.
// Each [row, column] cell of a table is modeled as a TableCell, and the list of all cells is
// made available for the Table to feed to into a Grid.
//

class RowIndexTableColumn<R extends {}> extends TableColumn<R, number> {
  model?: TableModel<R>;
}
const rowIndexColumn = <R extends {}>(model: TableModel<R>) => {
  return Builder(RowIndexTableColumn<R>)
    .type("number")
    .columnName("#")
    .title("#")
    .alignment("right")
    .valueFn((r) => model.indexOfRow(r));
};

export class RowSelectTableColumn<R extends {}> extends TableColumn<R, boolean> {
  model?: TableModel<R>;
}
const rowSelectColumn = <R extends {}>(model: TableModel<R>) => {
  return Builder(RowSelectTableColumn<R>)
    .type("checkbox")
    .alignment("center")
    .valueFn((r) => model.selectedRowIndexes.includes(model.indexOfRow(r)));
};

export const simpleTableModel = <R extends {}>(
  rows: R[],
  columns: TableColumnBuilderList<R>,
  options: TableModelOptions = {},
): TableModel<R> => {
  const model = new TableModel(arrayAtom(rows), columns, options);
  if (options.includeRowNumbers) {
    columns;
  }
  return model;
};

export type TableCellType = "data" | "header";

export class TableCell<R extends {}, S> {
  constructor(
    public type: TableCellType,
    public column: TableColumn<R, S>,
  ) {}
}

export class TableDataCell<R extends {}, S> extends TableCell<R, S> {
  value: Atom<S>;
  constructor(
    public row: R,
    column: TableColumn<R, S>,
  ) {
    super("data", column);

    this.value = atom(column.getValue(row));

    // set up a reaction in case the value is an atom
    const action = reactiveAction(() => this.value.set(this.column.getValue(this.row)));
    performAction(action);
  }
}

export type AnyTableCell<R extends {}> = TableCell<R, any>;
export type AnyTableDataCell<R extends {}> = TableDataCell<R, any>;
export type AnyTableHeaderCell<R extends {}> = TableHeaderCell<R, any>;
export type AnyTableColumn<R extends {}> = TableColumn<R, any>;

export class TableHeaderCell<R extends {}, S> extends TableCell<R, S> {
  constructor(public column: TableColumn<R, S>) {
    super("header", column);
  }
}

export const isDataCell = <R extends {}, S>(cell: TableCell<R, S>): cell is TableDataCell<R, S> => {
  return cell.type === "data";
};
export const isHeaderCell = <R extends {}, S>(cell: TableCell<R, S>): cell is TableHeaderCell<R, S> => {
  return cell.type === "header";
};

export interface TableModelOptions {
  sortable?: zboolean;
  editable?: zboolean;
  selectableColumns?: zboolean;
  selectableRows?: zboolean;
  includeHeader?: zboolean;
  defaultSortColumn?: string;
  defaultSortOrder?: ColumnSortDirection;
  doubleClickAction?: BasicAction;
  includeRowNumbers?: zboolean;
  includeRowSelectors?: zboolean;
}

export class TableModel<R extends {}> {
  selectedRow: Atom<R | undefined> = atom(undefined);
  selectedRowIndexes = arrayAtom<number>([]);
  selectedColumn: Atom<AnyTableColumn<R> | undefined> = atom(undefined);
  rowIsSelected = true;
  cells!: ArrayAtom<AnyTableCell<R>>;
  updateAllOnChange = false;
  numRows = atom(0);
  numColumns = atom(0);
  sortColumn: Atom<AnyTableColumn<R> | undefined> = atom(undefined);
  columns: ArrayAtom<AnyTableColumn<R>>;
  selectedHeaderColumn: Atom<AnyTableColumn<R> | undefined> = atom(undefined);
  breakpoints?: BreakpointAtom;

  constructor(
    public rows: ArrayAtom<R>,
    public inColumns: TableColumnBuilderList<R>,
    public options: TableModelOptions = {},
  ) {
    this.options.includeHeader ??= true;
    this.options.sortable ??= true;
    this.options.selectableRows ??= true;
    this.cells = arrayAtom<AnyTableCell<R>>([]);
    this.rows.addAction(() => this.updateCells());
    this.options.selectableRows && this.selectedRow.addAction(() => this.rowSelectionChanged());
    this.selectedColumn.addAction(() => this.columnSelectionChanged());
    const cols = inColumns.map((c) => c.build());
    this.columns = cols instanceof ArrayAtom ? cols : arrayAtom(cols);
    if (options.includeRowNumbers) {
      this.columns.insertFirst(rowIndexColumn(this).build());
    }
    if (options.includeRowSelectors) {
      this.columns.insertFirst(rowSelectColumn(this).build());
    }
    this.updateCells();

    if (options.defaultSortColumn) {
      const col = this.columns.find((col) => col.title === options.defaultSortColumn);
      this.sortColumn.set(col);
      if (col) {
        col.sortDirection = options.defaultSortOrder || "asc";
      }
    }
  }

  selectedRows(): R[] {
    return this.selectedRowIndexes.map((i) => this.rows.at(i-1)!).get();
  }
  toggleRow(row: R): void {
    const rowIndex = this.indexOfRow(row);
    const b = this.selectedRowIndexes.includes(rowIndex);
    if (b) {
      this.selectedRowIndexes.removeValue(rowIndex);
    } else {
      this.selectedRowIndexes.push(rowIndex);
    }
    console.log("selectedRowIndexes="+this.selectedRowIndexes.get());
  }

  toggleColumn(column: AnyTableColumn<R>): void {
    if (this.sortable) {
      this.sortOnColumn(column, true);
    }
    if (this.maySelectColumns) {
      this.selectedColumn.set(column);
    }
  }
  setColumns(columnBuilders: TableColumnBuilderList<R>): void {
    this.columns.set(columnBuilders.map((c) => c.build()));
  }
  get numVisibleColumns(): number {
    return this.columns.filter((column) => !column.hidden).length;
  }
  columnWithTitle(title: string): AnyTableColumn<R> | undefined {
    return this.columns.find((col) => col.title === title);
  }
  selectHeaderWithTitle(title: string): void {
    this.selectedHeaderColumn.set(this.columnWithTitle(title));
  }

  indexOfRow(row: R): number {
    return this.rows.indexOf(row) + 1;
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

  allCells(): AnyTableCell<R>[] {
    return this.includeHeader ? [...this.createHeaderCells(), ...this.createAllDataCells()] : this.createAllDataCells();
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
  createAllDataCells(): AnyTableDataCell<R>[] {
    return this.rows
      .get()
      .map((row) => this.createDataCellsForRow(row))
      .flat();
  }
  createDataCellsForRow(row: R): AnyTableDataCell<R>[] {
    return this.columns.get().map((column) => new TableDataCell(row, column));
  }
  createHeaderCells(): AnyTableHeaderCell<R>[] {
    return this.columns.get().map((column) => new TableHeaderCell(column));
  }
  rowIndexOfCell(cell: AnyTableDataCell<R>): number {
    return this.rows.indexOf(cell.row);
  }
  dataCells(): AnyTableDataCell<R>[] {
    return <AnyTableDataCell<R>[]>this.cells.filterWithGuard(isDataCell);
  }
  sortOnColumn(column: TableColumn<R, any>, toggle = false): void {
    const compareFn = column.compareFn;
    if (compareFn) {
      const sortFactor = column.sortDirection === "desc" ? -1 : 1;
      const fn = (r1: R, r2: R) => sortFactor * compareFn(column.getValue(r1), column.getValue(r2));
      this.rows.sortWith(fn, column.columnName, column.sortDirection || "asc");

      //this.rows.sort((r1, r2) => sortFactor * compareFn(column.getValue(r1), column.getValue(r2)));
      if (toggle) {
        column.toggleSortDirection();
      }
      this.updateCells();
    }
  }
  cellIsSelected(cell: AnyTableCell<R>): boolean {
    if (isDataCell(cell)) {
      return cell.row === this.selectedRow.get() || cell.column === this.selectedColumn.get();
    } else {
      return isHeaderCell(cell) && cell.column === this.selectedColumn.get();
    }
  }
  get maySelectColumns(): boolean {
    return Boolean(zget(this.options.selectableColumns));
  }
  get sortable(): boolean {
    return Boolean(zget(this.options.sortable));
  }
  get editable(): boolean {
    return Boolean(zget(this.options.editable));
  }
  get includeHeader(): boolean {
    return Boolean(zget(this.options.includeHeader));
  }

  // Adding & deleting rows. When a row is added or removed, the data cells are updated.

  addRowAndSort(newRow: R): void {
    this.addRowAtEnd(newRow);
    const sortCol = this.sortColumn.get();
    sortCol && this.sortOnColumn(sortCol);
    this.selectedRow.set(newRow);
  }
  addRowAndSortOnColumnWithTitle(newRow: R, title: string, direction: ColumnSortDirection): void {
    const column = this.columnWithTitle(title);
    if (column) {
      this.sortColumn.set(column);
      column.sortDirection = direction;
    }
    this.addRowAndSort(newRow);
  }
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
  updateColumns(columnBuilders: TableColumnBuilderList<R>): void {
    this.setColumns(columnBuilders);
    this.updateCells();
  }
  addColumn(col: AnyTableColumn<R>): void {
    this.columns.insertFirst(col);
    this.updateCells();
  }

  // Updating cells for one record
  updateRowWithRecord(record: R): void {
    this.dataCells().forEach((dataCell) => {
      if (dataCell.row === record) {
        dataCell.value.set(dataCell.column.getValue(record));
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
