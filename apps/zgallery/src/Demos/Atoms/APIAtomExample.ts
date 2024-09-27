import { View, core, apiAtom, TextLabel } from "zaffre";
import { WeatherModel } from "./WeatherModel";

export function APIAtomExample(): View {
  const model = new WeatherModel();

  const weather = apiAtom(model.weatherURL, (json) => model.extractWeather(json), "");

  return TextLabel(weather, {
    font: core.font.headline_medium,
  });
}
