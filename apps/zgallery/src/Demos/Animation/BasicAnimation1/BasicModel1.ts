import { BasicAnimation, toggleAtom } from "zaffre";

export class BasicModel1 {
  keyFrames = [
    { transform: "rotate(0)", color: "#000" },
    { color: "#431236", offset: 0.3 },
    { transform: "rotate(360deg)", color: "#000" },
  ];
  options = {
    duration: 3000,
    iterations: Infinity,
  };
  running = toggleAtom(true, { action: () => this.runningChanged() });
  animation = new BasicAnimation(this.keyFrames, this.options, this.running);

  runningChanged(): void {
    console.log("running: "+this.running.get());
  }
}
