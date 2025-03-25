import { stringColumn, LocalTableStore, TableRecordList, TableColumns, TableModel, arrayAtom, TableColumnList } from "zaffre";
import { DemoUserRecord } from "./DemoUserRecord";

export class DemoUserModel {
  store = new LocalTableStore("demo_user", DemoUserRecord);
  columns = [
    stringColumn({
      title: "Name",
      value: (r) => r.name,
      alignment: "left",
    }),
    stringColumn({
      title: "Email",
      value: (r) => r.email,
      alignment: "left",
    }),
    stringColumn({
      title: "Role",
      value: (r) => r.role,
      alignment: "left", 
    }),
  ] as TableColumnList<DemoUserRecord>;

  get allUsers(): TableRecordList<DemoUserRecord> {
    return this.store.getAllRecords();
  }
  addInitialRecord(): void {
    const list = this.store.createRecordList();
    list.addAction((records) => {
      if (records.length === 0) {
        const record = new DemoUserRecord(this.store, "Mr", "John", "Smith", "john@smith.com", "123456", "Admin");
        this.store.create(record);
      }
    });
    this.store.getAll(list);
  }

  userTableModel: TableModel<DemoUserRecord>;

  constructor() {
    this.addInitialRecord();
    this.userTableModel = new TableModel(this.allUsers, this.columns);
  }

}
