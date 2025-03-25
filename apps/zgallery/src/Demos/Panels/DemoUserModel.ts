import { stringColumn, LocalTableStore, TableRecordList, TableColumns, TableModel, TableStore, TableColumnList } from "zaffre";
import { DemoUserRecord } from "./DemoUserRecord";

class UserDB {
  user: TableStore<DemoUserRecord>;
  constructor() {
    this.user = new LocalTableStore("demo_user", DemoUserRecord);
    this.addInitialRecord();
  }
  get allUsers(): TableRecordList<DemoUserRecord> {
    const list = this.user.createRecordList();
    this.user.getAll(list);
    return list;
  }
  addInitialRecord(): void {
    const list = this.user.createRecordList();
    list.addAction((records) => {
      if (records.length === 0) {
        const record = new DemoUserRecord(this.user, "Mr", "John", "Smith", "john@smith.com", "123456", "Admin");
        this.user.create(record);
      }
    });
    this.user.getAll(list);
  }
}

export class DemoUserModel {
  db = new UserDB();
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

  userTableModel: TableModel<DemoUserRecord>;

  constructor() {
    this.userTableModel = new TableModel(this.db.allUsers, this.columns);
  }

}
