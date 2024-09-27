// 
// wttr API: https://github.com/chubin/wttr.in
//
interface WeatherDesc {
  value: string;
}
interface Weather {
  current_condition: [
    {
      temp_C: string;
      weatherDesc: WeatherDesc[];
    }
  ];
}

export class WeatherModel {
  weatherURL = "https://wttr.in/London?format=j1";

  extractWeather(json: any): string {
    try {
      const weather = <Weather>json;
      const temp = weather.current_condition[0].temp_C;
      const desc = weather.current_condition[0].weatherDesc[0].value;
      return `London Weather: ${temp}\xB0 ${desc}`;
    } catch (e) {
      return "";
    }
  }
}
