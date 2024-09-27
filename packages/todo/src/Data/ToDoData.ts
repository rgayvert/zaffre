import { TableRecord, TableRecordList, TableStore } from "zaffre";

export enum RecordFilter { 
  All = "All",
  Active = "Active",
  Completed = "Completed",
}

export class ToDoRecord extends TableRecord {
  recordID = -1;
  constructor(store: TableStore<ToDoRecord>, public content = "", public completed = false) {
    super(store);
  }
}
export type ToDoRecordList = TableRecordList<ToDoRecord>;


