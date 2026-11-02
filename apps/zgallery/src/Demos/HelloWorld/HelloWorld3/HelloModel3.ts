import { LocalData, atom, rect2D } from "zaffre";

export class HelloModel3 {
  data = LocalData.instance;
  text = this.data.addAtom("helloText", "Hello World");
  textLength = atom(() => this.currentText.length);
  textLengthString = atom(() => this.currentText.length.toString());
  radius = atom(() => this.textLength.get() * 1.2 );
  svgBounds = atom(() => rect2D(0, 0, this.radius.get() + 50, this.radius.get() + 50));
  get currentText(): string {
    return this.text.get();
  }
  center = atom(() => this.svgBounds.get().center);
}