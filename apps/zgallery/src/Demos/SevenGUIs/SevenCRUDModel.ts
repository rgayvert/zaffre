import { atom, Atom, arrayAtom, ArrayAtom, pickList } from "zaffre";

interface Name {
  first: string;
  last: string;
}
export class SevenCRUDModel {
  initialRecords: Name[] = [
    { last: "Mustermann", first: "Max" },
    { last: "Tisch", first: "Roman" },
    { last: "Emil", first: "Hans" },
  ];
  filter = atom("");
  allRecords = arrayAtom<Name>(this.initialRecords, { action: () => this.listChanged() });
  filteredRecords = arrayAtom<Name>([]);

  constructor() {
    this.listChanged();
    this.filteredRecords = this.allRecords.deriveArray((names: Name[]) => names
      .filter((n) => n.last.toLowerCase().startsWith(this.filter.get().toLowerCase()))
      .sort((r1, r2) => this.formatRecord(r1).localeCompare(this.formatRecord(r2))));
  }

  recordList = pickList([], this.filteredRecords, {
    labelFn: (name) => name && this.formatRecord(name) || ""
  });
  selectedRecord(): Name | undefined {
    return this.recordList.selectedValue();
  }

  first = atom("");
  last = atom("");

  clearSelectedRecord(): void {
    this.recordList.clearSelection();
    this.first.set("");
    this.last.set("");
  }
  listChanged(): void {
    const sel = this.selectedRecord();
    if (sel && !this.filteredRecords.get().includes(sel)) {
      this.clearSelectedRecord();
    }
  }
  formatRecord(record: Name): string {
    return `${record.last}, ${record.first}`;
  }
  recordSelected(record: Name): void {
    if (record) {
      this.first.set(record.first);
      this.last.set(record.last);
    }
  }
  readyToCreate(): boolean {
    return Boolean(this.first.get() && this.last.get());
  }
  readyToUpdate(): boolean {
    return Boolean(this.selectedRecord());
  }
  readyToDelete(): boolean {
    return Boolean(this.selectedRecord());
  }
  createRecord(): void {
    const record = { first: this.first.get(), last: this.last.get() };
    this.allRecords.push(record);
    this.recordList.select(record);
  }
  updateRecord(): void {
    const record = { first: this.first.get(), last: this.last.get() };
    this.deleteRecord();
    this.allRecords.push(record);
  }
  deleteRecord(): void {
    const record = this.selectedRecord();
    record && this.allRecords.delete(record);
    this.clearSelectedRecord();
  }
}
