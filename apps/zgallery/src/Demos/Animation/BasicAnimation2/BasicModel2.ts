import { BasicAnimation } from "zaffre";

export class BasicModel2 {
  newspaperSpinning = [
    { transform: "rotate(0) scale(1)" },
    { transform: "rotate(360deg) scale(0)" },
  ];
  newspaperTiming = {
    duration: 2000,
    iterations: 1,
  };
  newspaperAnimation = new BasicAnimation(this.newspaperSpinning, this.newspaperTiming);

  runNewspaperAnimation(): void {
    this.newspaperAnimation.running.set(true);
  }
}
