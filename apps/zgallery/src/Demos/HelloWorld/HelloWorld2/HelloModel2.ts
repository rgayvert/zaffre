import { LocalData, toggleAtom } from "zaffre";

export class HelloModel2 {
  text = LocalData.instance.addAtom("helloText2", "Hello Again");
  setOnInput = toggleAtom(true);
  disabled = toggleAtom(false);
  reset(): void {
    this.text.set("Hello Again");
  }
}
