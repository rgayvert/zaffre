
//
// zutil - a collection of utility functions
//

export const zutil = {
  // return an object containing all of the entries in a given object with values that are not undefined
  withoutUndefinedValues: (obj: any): any => {
    return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v != undefined));
  },
  // round a number to some number of decimal places
  roundTo: (num: number, places: number): number => {
    const factor = 10 ** places;
    return Math.round((num + Number.EPSILON) * factor) / factor;
  },
  /** Return a string representation of a number rounded to a given number of decimal places */
  printRoundedTo: (num: number, places: number): string => {
    const val = zutil.roundTo(Math.abs(num), places);
    const whole = Math.floor(val);
    const fraction = zutil.roundTo(val - whole, places);
    return `${num < 0 ? "-" : ""}${whole}.${fraction.toString().substring(2).padEnd(places, "0")}`;
  },
  /** Create an arithmetic sequence of count integers */
  sequence: (start: number, count: number, step = 1): number[] => {
    return Array(count)
      .fill(undefined)
      .map((_val: number, idx: number) => start + idx * step);
  },
  /** Create a geometric sequence of count integers, starting with a */
  geometricSequence: (a: number, r: number, count: number): number[] => {
    return zutil.sequence(1, count).map((n) => a * r ** (n - 1));
  },
  /** Return a random integer in [from, to] */
  randomInt: (from: number, to: number): number => {
    const min = Math.ceil(from);
    const max = Math.floor(to);
    return Math.floor(Math.random() * (max - min + 1) + min);
  },
  /** Return a random float in [from, to) */
  random: (from: number, to: number): number => {
    return from + Math.random() * (to - from);
  },
  /** Create a scrambled sequence of N consecutive integers */
  randomSequence: (start: number, N: number): number[] => {
    const a = zutil.sequence(start, N);
    zutil.shuffle(a);
    return a;
  },
  /** Pick a random element of an array */
  randomElement<T>(a: T[]): T {
    return a[zutil.randomInt(0, a.length - 1)];
  },
  /** Pick a random element of an array matching a predicate */
  randomElementMatching<T>(a: T[], predicate: (x: T) => boolean): T | undefined {
    if (!a.find((x) => predicate(x))) {
      return undefined;
    }
    let answer;
    do {
      answer = zutil.randomElement(a);
    } while (!predicate(answer));
    return answer;
  },
  /**
   *  pick n random elements from an array
   */
  randomSubset<T>(a: T[], N: number): T[] {
    return zutil
      .randomSequence(0, a.length)
      .slice(0, N)
      .map((i) => a[i]);
  },
  // break up an array into chunks of a given size (the last chunk may be smaller)
  chunk<T>(a: T[], chunkSize: number): T[][] {
    const answer = [];
    for (let i = 0; i < a.length; i += chunkSize) {
      answer.push(a.slice(i, i + chunkSize));
    }
    return answer;
  },
  // calculate the cumulative sums of a sequence of numbers
  cumulativeSum: (array: number[]): number[] => {
    const answer = [...array];
    answer.forEach((val, index) => (answer[index] = val + (answer[index - 1] || 0)));
    return answer;
  },
  // return a copy of an array with elements at index and index + 1 switched
  moveElementDown: <T>(array: T[], index: number): T[] => {
    if (index < 0 || index >= array.length - 1) {
      return array;
    }
    return [...array.slice(0, index), array[index + 1], array[index], ...array.slice(index + 2)];
  },
  // return a copy of an array with elements at index - 1 and index switched
  moveElementUp: <T>(array: T[], index: number): T[] => {
    if (index === 0 || index >= array.length) {
      return array;
    }
    return [...array.slice(0, index - 1), array[index], array[index - 1], ...array.slice(index + 1)];
  },
  // return a copy of an array with elements at index moved to the beginning
  moveElementFirst: <T>(array: T[], index: number): T[] => {
    if (index === 0 || index >= array.length) {
      return array;
    }
    return [array[index], ...array.slice(0, index), ...array.slice(index + 1)];
  },
  // filter an array to exclude one value
  without: <T>(array: T[], val: T): T[] => {
    return array.filter((x) => x !== val);
  },
  // filter an array to exclude a list of values
  withoutAll: <T>(array: T[], vals: T[]): T[] => {
    return array.filter((x) => !vals.includes(x));
  },
  // count the number of elements in an array that satisfy a given predicate
  countWhere: <T>(array: T[], fn: (a: T) => boolean): number => {
    return array.filter(fn).length;
  },
  // apply a numeric function to the elements of an array, and return the sum
  sum: <T>(array: T[], fn: (a: T) => number): number => {
    return array.reduce((sum, val) => sum + fn(val), 0);
  },
  // apply a numeric function to the elements of an array, and return the max
  max: <T>(array: T[], fn: (a: T) => number): number => {
    if (array.length === 0) {
      return 0;
    }
    return array.reduce((maxval, val) => Math.max(maxval, fn(val)), fn(array[0]));
  },
  // apply a numeric function to the elements of an array, and return the min
  min: <T>(array: T[], fn: (a: T) => number): number => {
    if (array.length === 0) {
      return 0;
    }
    return array.reduce((maxval, val) => Math.min(maxval, fn(val)), fn(array[0]));
  },
  // constrain a numeric value to the interval [min, max]
  clamp: (num: number, min: number, max: number): number => {
    return num < min ? min : num > max ? max : num;
  },
  // adapted from https://stackoverflow.com/questions/2450954
  shuffle: <T>(array: T[]): void => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  },

  mergeOptions: (oldOpts: any, newOpts: any): any => {
    const answer = { ...oldOpts };
    for (const k2 in newOpts) {
      if (newOpts[k2] !== undefined && newOpts[k2].constructor === Object) {
        answer[k2] = oldOpts[k2] ? zutil.mergeOptions(oldOpts[k2], newOpts[k2]) : { ...newOpts[k2] };
      } else {
        answer[k2] = newOpts[k2];
      }
    }
    return answer;
  },

  extractOptions: (options: any, keys: string[]): any => {
    const answer: any = {};
    for (const key of keys) {
      if (key in options) {
        answer[key] = options[key];
        delete options[key];
      }
    }
    return answer;
  },

  extractLeafValues: (obj: any): any[] => {
    const answer: any[] = [];
    Object.keys(obj).forEach((key) => {
      if (typeof obj[key] === "object") {
        answer.push(...zutil.extractLeafValues(obj[key]));
      } else {
        answer.push(obj[key]);
      }
    });
    return answer;
  },

  extractValues: (obj: any, match: (val: any) => boolean): any[] => {
    const answer: any[] = [];
    Object.keys(obj).forEach((key) => {
      if (match(obj[key])) {
        answer.push(obj[key]);
      } else if (typeof obj[key] === "object") {
        answer.push(...zutil.extractLeafValues(obj[key]));
      }
    });
    return answer;
  },

  /*
   * String
   */
  firstLine: (text: string): string => {
    return text.split("\n", 1)[0];
  },
  asArrayOfLines: (text: string, trim = false): string[] => {
    const lines = text.split("\n");
    return trim ? lines.map((line) => line.trim()).filter((line) => line) : lines.filter((line) => line.trim());
  },
  sameAs: (str1: string, str2: string): boolean => {
    return str1.toLowerCase() === str2.toLowerCase();
  },
  includesCaseInsensitive: (str1: string, str2: string): boolean => {
    return str1.toLowerCase().includes(str2.toLowerCase());
  },
  capitalizeFirstLetter: (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  },
  countOccurrences: (str: string, sub: string): number => {
    const matches = str.match(new RegExp(sub, "g"));
    return matches ? matches.length : 0;
  },
  joinNonEmpty(parts: (string | undefined)[], delimiter = " "): string {
    return parts.filter((s) => s).join(delimiter);
  },
  trimFirstAndLast: (str: string): string => {
    return str.substring(1, str.length - 1);
  },
  isWhitespace: (ch: string): boolean => {
    return /\s/.test(ch);
  },
  isBracketedBy: (str: string, twoCharString: string): boolean => {
    return str.startsWith(twoCharString[0]) && str.endsWith(twoCharString[1]);
  },
  // adapted from https://www.geeksforgeeks.org/how-to-convert-a-string-into-kebab-case-using-javascript/
  kebabize: (str: string): string => {
    const match = str.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g);
    return match ? match.join("-").toLowerCase() : str;
  },
  camelToSnakeCase: (str: string): string => {
    return str
      .split(/(?=[A-Z])/)
      .join("_")
      .toLowerCase();
  },
  kebabToCamelCase: (str: string): string => {
    return str.replace(/-./g, (match) => match[1].toUpperCase());
  },
  camelCaseToWords: (str: string): string => {
    return zutil.capitalizeFirstLetter(str.replace(/([A-Z])/g, " $1"));
  },
  stripWhitespace: (str: string): string => {
    return str.replace(/\s/g, "");
  },

  isImageFile: (path: string): boolean => {
    return Boolean(path.toLowerCase().match(/\.(jpg|jpeg|png|gif)$/));
  },
  isMarkdownFile: (path: string): boolean => {
    return Boolean(path.toLowerCase().match(/\.md$/));
  },
  isPDFFile: (path: string): boolean => {
    return Boolean(path.toLowerCase().match(/\.pdf$/));
  },
  formatPath: (...parts: string[]): string => {
    return parts
      .map((part) => (part.endsWith("/") ? part.slice(0, -1) : part))
      .map((part, index) => (index > 0 && part.startsWith("/") ? part.slice(1) : part))
      .join("/");
  },
  stripSuffix: (str: string, delimiter = "-"): string => {
    const idx = str.lastIndexOf(delimiter);
    return idx === -1 ? str : str.substring(0, idx);
  },
  containsLineTerminator: (str: string): boolean => {
    return Boolean(/\r|\n/.exec(str));
  },

  keyAtMapValue: <K, V>(map: Map<K, V>, value: V): K | undefined => {
    for (const k of map.keys()) {
      if (value === map.get(k)) {
        return k;
      }
    }
    return undefined;
  },
  getMapValue: <K, V>(map: Map<K, V>, key: K, value: () => V): V => {
    const val = map.get(key);
    if (!val) {
      const newValue = value();
      map.set(key, newValue);
      return newValue;
    } else {
      return val;
    }
  },

  indexedTypeToMap: <T>(obj: { [key: string]: T }): Map<string, T> => {
    return new Map(Object.entries(obj));
  },

  mapIndexedType: <V, W>(obj: { [_key: string]: V }, fn: (val: V) => W): { [_key: string]: W } => {
    return Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, fn(v)]));
  },

  pick(obj: any, keys: string[]): any {
    return Object.fromEntries(Object.entries(obj).filter(([key, value]) => keys.includes(key)));
  },

  accumulate: <S, T>(array: S[], fn: (val: S) => T[]): T[] => {
    const answer: T[] = [];
    array.forEach((val: S) => answer.push(...fn(val)));
    return answer;
  },

  error: (...msg: any[]): void => {
    console.trace();
    console.log(`[error]`, ...msg);
  },

  formatSeconds: (seconds: number, includeMillis = false): string => {
    const day = Math.floor(seconds / 86400);
    const hour = Math.floor((seconds - day * 86400) / 3600);
    const minute = Math.floor((seconds - day * 86400 - hour * 3600) / 60);
    const second = Math.floor(seconds % 60);
    let answer = [hour, minute, second].map((v) => v.toString().padStart(2, "0")).join(":");
    if (includeMillis) {
      const millis = zutil
        .printRoundedTo(seconds % 1, 3)
        .padStart(3, "0")
        .substring(2);
      answer = `${answer}.${millis}`;
    }
    return answer;
  },
  timeNow(includeMillis = true): string {
    const now = new Date();
    const millis = includeMillis ? `.${now.getMilliseconds()}` : "";
    return (
      [now.getHours(), now.getMinutes(), now.getSeconds()].map((n) => n.toString().padStart(2, "0")).join(":") + millis
    );
  },
  repeatForMillis(millis: number, fn: () => void): void {
    let lastMillis = performance.now();
    let elapsedMillis = 0;
    while (elapsedMillis < millis) {
      fn();
      elapsedMillis += performance.now() - lastMillis;
      lastMillis = performance.now();
    }
  },
  isValidDate(value: any): boolean {
    return value instanceof Date && value.toString() !== "Invalid Date";
  },
  // adapted from https://github.com/hapi-server/data-specification/issues/54
  isISO8601(value: string): boolean {
    const regex =
      /^(?:[1-9]\d{3}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1\d|2[0-8])|(?:0[13-9]|1[0-2])-(?:29|30)|(?:0[13578]|1[02])-31)|(?:[1-9]\d(?:0[48]|[2468][048]|[13579][26])|(?:[2468][048]|[13579][26])00)-02-29)T(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d(?:\.\d{1,9})?(?:Z|[+-][01]\d:[0-5]\d)$/;
    return regex.test(value);
  },

  browserIsSafari: (): boolean => {
    return /^((?!chrome).)*safari/i.test(navigator.userAgent);
  },
  browserIsChrome: (): boolean => {
    return /Chrome/i.test(navigator.userAgent);
  },
  touchEventsSupported: (): boolean => {
    return "ontouchstart" in window;
  },

  interp3: (x: number, [x1, x2, x3]: number[], [y1, y2, y3]: number[]): number => {
    if (x < x1) {
      return y1;
    } else if (x > x3) {
      return y3;
    } else if (x < x2) {
      return y1 + ((x - x1) / (x2 - x1)) * (y2 - y1);
    } else {
      return y2 + ((x - x2) / (x3 - x2)) * (y3 - y2);
    }
  },
  uuid(): string {
    return crypto.randomUUID();
  },
};
