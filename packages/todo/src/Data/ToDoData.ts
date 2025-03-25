import { TableRecord, TableRecordList, TableStore, uniqueRecordID } from "zaffre";

export enum RecordFilter { 
  All = "All",
  Active = "Active",
  Completed = "Completed",
}

export class ToDoRecord extends TableRecord {
  recordID = uniqueRecordID();
  persistentFields(): string[] {
    return ["content", "completed"];
  }

  constructor(store: TableStore<ToDoRecord>, public content = "", public completed = false) {
    super(store);
  }
}
export type ToDoRecordList = TableRecordList<ToDoRecord>;


