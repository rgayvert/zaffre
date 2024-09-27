import { atom, Atom, arrayAtom } from "zaffre";

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
  allRecords = arrayAtom<Name>(this.initialRecords);
  filteredRecords = atom(
    () =>
      this.allRecords
        .filter((n) => n.last.toLowerCase().startsWith(this.filter.get().toLowerCase()))
        .sort((r1, r2) => this.formatRecord(r1).localeCompare(this.formatRecord(r2))),
    { action: () => this.listChanged() }
  );

  selectedRecord: Atom<Name | undefined> = atom(undefined, { action: (record) => this.recordSelected(record) });
  first = atom("");
  last = atom("");

  clearSelectedRecord(): void {
    this.selectedRecord.set(undefined);
    this.first.set("");
    this.last.set("");
  }
  listChanged(): void {
    const sel = this.selectedRecord.get();
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
    return Boolean(this.selectedRecord.get());
  }
  readyToDelete(): boolean {
    return Boolean(this.selectedRecord.get());
  }
  createRecord(): void {
    const record = { first: this.first.get(), last: this.last.get() };
    this.allRecords.push(record);
    this.selectedRecord.set(record);
  }
  updateRecord(): void {
    const record = { first: this.first.get(), last: this.last.get() };
    this.deleteRecord();
    this.allRecords.push(record);
  }
  deleteRecord(): void {
    const record = this.selectedRecord.get();
    record && this.allRecords.delete(record);
    this.clearSelectedRecord();
  }
}
