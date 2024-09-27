import { IndexedArrayAtom } from "../Atom";

//
// Base class for handling runtime exceptions, such as fetch errors. The
// list can be used in conjunction with Toast.
//
// Subclasses may extract more details from the exception when present
// (e.g., if TypeError, extract name and message)
// 

export class ExHandler {
  constructor(public list: IndexedArrayAtom<string>) {}

  push(msg: string, exception?: any): void {
    this.list.addValue(msg);
    console.log(msg);
  }
}
