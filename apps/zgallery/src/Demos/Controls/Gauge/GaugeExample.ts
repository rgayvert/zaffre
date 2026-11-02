import { Gauge, HStack, Meter, Switch, VStack, zspace } from "zaffre";
import { gaugeExampleRules } from "./GaugeExample.rules";
import { GaugeExampleModel } from "./GaugeExampleModel";

export const GaugeExample = () => {
  const model = new GaugeExampleModel();

  return VStack({ gap: zspace.s5 }).append(
    HStack({ rules: gaugeExampleRules, gap: zspace.s5 }).append(
      // fixed gauge
      Gauge(60, { cls: "fixed" }),
      // progress bar
      Gauge(model.percent2, { cls: "progress" }),
      Switch(model.running),
    ),
    Meter(24),
  );
};
