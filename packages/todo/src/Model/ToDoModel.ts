import { atom, Atom, zget, indexedArrayAtom, ExHandler, pickList } from "zaffre";
import { ToDoItem, RecordFilter, ToDoItemList, ToDoDB, ToDoItemRepository } from "../Data";
import { LocalDataToDoItemRepository, FetchToDoItemRepository } from "../Data";


export class ToDoModel {
  static localRepository(): ToDoItemRepository {
    return new LocalDataToDoItemRepository("todo", (data) => new ToDoItem(data));
  }
  static remoteURL(): string {
    return import.meta.env["VITE_TODO_REMOTE"];
  }
  static fetchRepository(): ToDoItemRepository {
    return new FetchToDoItemRepository(this.remoteURL(), (data) => new ToDoItem(data), "same-origin");
  }
  static defaultDB(): ToDoDB {
    return { items: this.localRepository() }
  }

  newText = atom("", { action: (text: string) => this.createNewText(text) });
  filterNames = [RecordFilter.All, RecordFilter.Active, RecordFilter.Completed];
  filterList = pickList([RecordFilter.All], this.filterNames);
  count: Atom<string>;
  activeCount = atom(0);
  filteredRecords: Atom<ToDoItem[]>;
  completedCount: Atom<number>;
  records: ToDoItemList;
  toastItems = indexedArrayAtom<string>([], { maxLength: 1 });
  ex = new ExHandler(this.toastItems);

  constructor(public db: ToDoDB = ToDoModel.defaultDB()) {
    this.records = db.items.createList();
    this.records.addAction(() => this.adjustCompletedCount());
    this.count = atom(() => this.countText());
    this.filteredRecords = atom(() => this.getFilteredRecords());
    this.completedCount = atom(0);
    this.adjustCompletedCount();
    this.setDb(db);
  }
  setDb(db: ToDoDB): void {
    this.db = db;
    this.newText.set("");
    this.records.clear();
    this.db.items.getAll(this.records);
  }
  // we need to keep a non-derived count of completed records, because record.completed is not reactive,
  // and the records don't change when completion changes
  adjustCompletedCount(): void {
    this.completedCount.set(this.records.count((r) => r.completed));
  }

  changeDb(dbName: string): void {
    this.setDb({ items: dbName === "Local" ? ToDoModel.localRepository() : ToDoModel.fetchRepository() });
  }
  itemMatchesCurrentFilter(record: ToDoItem): boolean {
    const filter = this.filterList.lastSelection.get();
    return (
      filter === RecordFilter.All ||
      (record.completed && filter === RecordFilter.Completed) ||
      (!record.completed && filter === RecordFilter.Active)
    );
  }
  getFilteredRecords(): ToDoItem[] {
    return this.records.filter((item) => this.itemMatchesCurrentFilter(item));
  }
  countText(): string {
    const count = this.getFilteredRecords().length;
    return `${count} item${count === 1 ? "" : "s"} left`;
  }
  createNewText(content: string): void {
    if (content.trim()) { 
      const todoItem = new ToDoItem({ content: content, completed: false });
      this.db.items.create(todoItem);
      this.records.push(todoItem);
      // note: we got here from a change to newText, so we need to spin off another change
      setTimeout(() => this.newText.set(""), 0);
    }
  }
  toggleAllItems(): void {
    const newVal = this.completedCount.get() < this.records.length;
    this.records.forEach((record) => (record.completed = newVal));
  }
  clearCompletedItems(): void {
    this.records.deleteAll(...this.records.filter((record) => record.completed));
  }
  itemCount(): number {
    return this.records.length;
  }
  deleteRecord(record: ToDoItem): void {
    this.records.delete(record);
    this.db.items.delete(record);
  }
  updateRecord(record: ToDoItem): void {
    console.log("updateRecord");
  }

}
