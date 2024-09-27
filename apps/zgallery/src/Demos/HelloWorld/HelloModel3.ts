import { LocalData, atom, px } from "zaffre";

export class HelloModel3 {
  data = LocalData.instance;
  text = this.data.addAtom("helloText", "Hello World");
  textLength = atom(() => this.currentText.length);
  textLengthString = atom(() => this.currentText.length.toString());
  get currentText(): string {
    return this.text.get();
  }
}