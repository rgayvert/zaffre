import { atom, Atom, zget, LocalTableStore, TableStore, indexedArrayAtom, ExHandler, FetchTableStore } from "zaffre";
import { ToDoRecord, RecordFilter, ToDoRecordList } from "../Data";

export class ToDoModel {

  static defaultStore(): TableStore<ToDoRecord> {
    return new LocalTableStore("todo", ToDoRecord);  
  }

  newText = atom("", { action: (text: string) => this.createNewText(text) });
  filterNames = [RecordFilter.All, RecordFilter.Active, RecordFilter.Completed];
  currentFilterName = atom(RecordFilter.All);
  count: Atom<string>;
  activeCount = atom(0);
  filteredRecords: Atom<ToDoRecord[]>;
  completedCount: Atom<number>;
  records: ToDoRecordList;
  toastItems = indexedArrayAtom<string>([], { maxLength: 1 });
  ex = new ExHandler(this.toastItems);

  constructor(public store: TableStore<ToDoRecord> = ToDoModel.defaultStore()) { 
    this.records = store.createRecordList();
    this.count = atom(() => this.countText());
    this.filteredRecords = atom(() => this.getFilteredRecords());
    this.completedCount = atom(0);
    this.records.addAll();
    this.adjustCompletedCount();
  }
  setStore(store: TableStore<ToDoRecord>): void {
    this.store = store;
    this.records = store.createRecordList();
    this.records.addAll();
  }
  // we need to keep a non-derived count of completed records, because record.completed is not reactive,
  // and the records don't change when completion changes
  adjustCompletedCount(): void {
    this.completedCount.set(this.records.count((record) => record.completed));
  }
  remoteStore(): string {
    return import.meta.env["VITE_TODO_REMOTE"];
  }
  changeStore(storeName: string): void {
    this.setStore(
      storeName === "Local"
        ? new LocalTableStore("todo", ToDoRecord)
        : new FetchTableStore(this.remoteStore(), ToDoRecord, this.ex)
    );
  }
  itemMatchesCurrentFilter(record: ToDoRecord): boolean {
    const filter = this.currentFilterName.get();
    return (
      filter === RecordFilter.All ||
      (zget(record.completed) && filter === RecordFilter.Completed) ||
      (!zget(record.completed) && filter === RecordFilter.Active)
    );
  }
  getFilteredRecords(): ToDoRecord[] {
    return this.records.filter((item) => this.itemMatchesCurrentFilter(item));
  }
  countText(): string {
    const count = this.getFilteredRecords().length;
    return `${count} item${count === 1 ? "" : "s"} left`;
  }
  createNewText(content: string): void {
    if (content.trim()) {
      this.records.add(new ToDoRecord(this.store, content)); 
      this.newText.set("");
    }
  }
  toggleAllItems(): void { 
    const newVal = this.completedCount.get() < this.records.length;
    this.records.forEach((record) => record.completed = newVal);
  }
  clearCompletedItems(): void {
    this.records.deleteAll(...this.records.filter((record) => record.completed));
  }
  itemCount(): number {
    return this.records.length;
  }
  deleteRecord(record: ToDoRecord): void {
    this.records.delete(record);
    record.delete();
  }
}
