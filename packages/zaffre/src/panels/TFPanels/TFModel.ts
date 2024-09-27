import { Atom, atom, ClassConstructor, tableRecordEditor } from ":foundation";
import { TableRecord, TableStore, TableModel, RecordEditor, updateEditorFromRecord } from ":foundation";

//
// A TFModel is the model for a TableFormView. It controls the switching between the two views (currentView). It also
// contains the table model used by the table, and handles editing of the current record.
//

export class TFModel<R extends TableRecord> {
  editor: RecordEditor<R>;
  currentView = atom("table");
  validationOn = atom(false);
  editedRecord: Atom<R>;

  constructor(public recordClass: ClassConstructor<R>, public store: TableStore<R>, public tableModel: TableModel<R>) {
    this.editedRecord = atom(new recordClass(this.store));
    this.editor = tableRecordEditor(this.editedRecord.get());
  }
  get selectedRecord(): R | undefined {
    return this.tableModel.selectedRow.get();
  }
  newRecord(): void {
    this.editRecord(new this.recordClass(this.store), false);
  }
  editSelectedRecord(): void {
    const record = this.selectedRecord;
    if (record) {
      this.editRecord(record, true);
    }
  }
  editRecord(record: R, validationOn: boolean): void {
    this.editedRecord.set(record);
    updateEditorFromRecord(this.editor, record);
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
      if (this.selectionIsPersisted()) {
        record.update();
        this.tableModel.updateRowWithRecord(record);
      } else {
        record.create();
        this.tableModel.addRowAtEnd(record);
      }
      this.setMode("table");
    }
  }
}
