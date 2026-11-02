import { arrayAtom } from "zaffre";

export class HelloModel4 {
  counter = 3;
  values = arrayAtom([1, 2, 3]);
  addValue(): void {
    this.values.push(++this.counter);
  }
  removeValue(): void {
    this.values.pop();
  }
}
     