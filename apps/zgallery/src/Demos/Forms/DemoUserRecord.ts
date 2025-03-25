import { TableRecord, TableRecordList, TableStore, uniqueRecordID } from "zaffre";

export const DemoUserRoles = ["", "User", "Admin"] as const;
export type DemoUserRole = typeof DemoUserRoles[number];

export const DemoUserTitles = ["", "Mr", "Mrs", "Miss", "Ms"] as const;
export type DemoUserTitle = typeof DemoUserTitles[number];

export class DemoUserRecord extends TableRecord {
  persistentFields(): string[] {
    return ["title", "firstName", "lastName", "email", "password", "role"];
  }
  recordID = uniqueRecordID();
  constructor(
    store: TableStore<DemoUserRecord> | undefined,
    public title = "",
    public firstName = "",
    public lastName = "",
    public email = "",
    public password = "",
    public role = ""
  ) {
    super(store);
  }
  get name(): string {
    return [this.title, this.firstName, this.lastName].filter((v) => v).join(" ");
  }
}

export type DemoUserRecordList = TableRecordList<DemoUserRecord>;
