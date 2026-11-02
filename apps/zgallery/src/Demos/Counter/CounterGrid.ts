import { addClass, Grid, Page  } from "zaffre";
import { Counter } from "./Counter";
import { counterModel } from "./CounterModel";

export const CounterGrid = () => {
  const options = addClass({}, "CounterGrid");
  return Page(options).append(
    Grid().append(
      Counter(counterModel("c1"), { cls: "counter1" }),
      Counter(counterModel("c2", 10, 30, 20), { cls: "counter2" }),
      Counter(counterModel("c3", 20, 60, 30), { cls: "counter3" }),
      Counter(counterModel("c4", -9, 9, 0), { cls: "counter4" })
    )
  );
}
