import { atom, zutil } from "zaffre";

// Note: to avoid circular updates (which can occur due to rounding), we use a separate 
// temperature atom as the sole-source-of-truth

export class SevenTempConverterModel {
  temperature = atom(0);
  celsius = atom(0);
  fahrenheit = atom(32);

  constructor() {
    this.celsius.addAction((c) => this.temperature.set(c));
    this.fahrenheit.addAction((f) => this.temperature.set(((f - 32) * 5) / 9));
    this.temperature.addAction((tc) => {
      this.celsius.set(zutil.roundTo(tc, 2));
      this.fahrenheit.set(zutil.roundTo((tc * 9) / 5 + 32, 2));
    });
  }

}

