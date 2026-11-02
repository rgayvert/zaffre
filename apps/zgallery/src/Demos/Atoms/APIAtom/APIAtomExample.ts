import { apiAtom, TextLabel } from "zaffre";
import { WeatherModel } from "./WeatherModel";

export const APIAtomExample = () => {
  const model = new WeatherModel();
  const weather = apiAtom(model.weatherURL, (json) => model.extractWeather(json), "");
  return TextLabel(weather);
}
