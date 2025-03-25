import { FormFieldSpecFn } from ":components";
import { Atom, atom, ClassConstructor } from ":foundation";
import { TableRecord, TableStore, TableModel } from ":foundation";

//
// A TFModel is the model for a TableFormEnsemble. It controls the switching between the two views (currentView). It also
// contains the table model used by the table, and handles editing of the current record.
//

export class TFModel<R extends TableRecord> {
  currentView = atom("table");
  validationOn = atom(false);
  editedRecord: Atom<R>;
  editedRecordID: Atom<string>;

  constructor(
    public recordClass: ClassConstructor<R>,
    public store: TableStore<R>,
    public tableModel: TableModel<R>,
    public fields: FormFieldSpecFn<R>,
    public title: string
  ) {
    this.editedRecord = atom(new recordClass(this.store));
    this.editedRecordID = atom(() => this.editedRecord.get().recordID.toString());
  }
  get selectedRecord(): R | undefined {
    return this.tableModel.selectedRow.get();
  }
  newRecord(): void {
    const record = new this.recordClass(this.store);
    //this.options.afterCreateRecord?.(record);
    this.editRecord(record, false);
  }
  editSelectedRecord(): void {
    const record = this.selectedRecord;
    if (record) {
      this.editRecord(record, true);
    }
  }
  editRecord(record: R, validationOn: boolean): void {
    this.editedRecord.set(record);
    this.validationOn.set(validationOn);
    this.currentView.set("form");
  }
  deleteRecord(): void {
    const record = this.selectedRecord;
    if (record) {
      this.tableModel.delete(record);
      this.store.delete(record);
    }
  }
  hasSelection(): boolean {
    return Boolean(this.selectedRecord);
  }
  selectionIsPersisted(): boolean {
    return Boolean(this.selectedRecord?.isPersisted());
  }
  editedRecordIsPersisted(): boolean {
    return Boolean(this.editedRecord.get()?.isPersisted());
  }
  setMode(mode: "table" | "form"): void {
    this.currentView.set(mode);
  }
  cancelEdit(): void {
    this.setMode("table");
  }
  submitRecord(): void {
    const record = this.editedRecord.get();
    if (record) {
      if (record.isPersisted()) {
        record.update();
        this.tableModel.updateRowWithRecord(record);
      } else {
        record.create();
        this.tableModel.addRowAndSort(record);
      }
      this.setMode("table");
    }
  }
}
