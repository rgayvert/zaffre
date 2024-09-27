import { zutil } from "../Util";
import { Formatter, Parser } from "../Support";

//
// DateTimeService
//   - minimal date-time formatter
//   - requires no install
//   - use DayJS for full service
//

type BasicDateParts = Partial<{
  year: number;
  month: number;
  day: number;
}>;

function parseNumber(s: string, min: number, max: number): number {
  if (typeof s === "string") {
    const val = parseInt(s);
    return isNaN(val) ? 0 : zutil.clamp(val, min, max);
  } else {
    return min;
  }
}
function pad(val: number, n: number): string {
  return val.toString().padStart(n, "0");
}
// Simple time class, always 24-hour format
export class TimeOfDay {
  static fromString(s: string): TimeOfDay {
    const parts = s.split(":");
    const hour = parseNumber(parts[0], 0, 23);
    const minute = parseNumber(parts[1], 0, 59);
    const second = parseNumber(parts[2], 0, 59);
    return new TimeOfDay(hour, minute, second);
  }
  constructor(public hour: number, public minute: number, public second = 0) {}
  toString(): string {
    return `${pad(this.hour, 2)}:${pad(this.minute, 2)}:${pad(this.second, 2)}`;
  }
}
// Simple month class, always YYYY-MM
export class Month {
  static fromString(s: string): Month {
    const parts = s.split("-");
    const year = parseNumber(parts[0], 0, 4999);
    const month = parseNumber(parts[1], 0, 11);
    return new Month(year, month);
  }
  constructor(public year: number, public month: number) {}
  toString(): string {
    return `${pad(this.year, 4)}-${pad(this.month, 2)}`;
  }
}
// Simple week class, always YYYY-WNN
export class Week {
  static fromString(s: string): Week {
    const parts = s.split("-W");
    const year = parseNumber(parts[0], 0, 4999);
    const week = parseNumber(parts[1], 0, 52);
    return new Week(year, week);
  }
  constructor(public year: number, public week: number) {}
  toString(): string {
    return `${pad(this.year, 4)}-W${pad(this.week, 2)}`;
  }
}

export class DateTimeService {
  static defaultInstance: DateTimeService = new DateTimeService();

  constructor() {}

  // offset from UTC in minutes
  utcOffset(): number {
    return (new Date()).getTimezoneOffset();
  }

  months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // follow Days.js conventions (https://day.js.org/docs/en/display/format)

  formatPartMap: Map<string, (dt: Date) => string> = new Map([
    ["YYYY", (dt) => dt.getUTCFullYear().toString()],
    ["YY", (dt) => (dt.getUTCFullYear() % 100).toString()],
    ["MMM", (dt) => this.months[dt.getUTCMonth()]],
    ["MM", (dt) => (dt.getUTCMonth() + 1).toString().padStart(2, "0")],
    ["M", (dt) => (dt.getUTCMonth() + 1).toString()],
    ["DD", (dt) => dt.getUTCDate().toString().padStart(2, "0")],
    ["D", (dt) => dt.getUTCDate().toString()],
    ["ddd", (dt) => this.days[dt.getUTCDay()]],
    ["dd", (dt) => dt.getUTCDay().toString().padStart(2, "0")],
    ["d", (dt) => dt.getUTCDay().toString()],
    ["HH", (dt) => dt.getUTCHours().toString().padStart(2, "0")],
    ["H", (dt) => dt.getUTCHours().toString()],
    ["mm", (dt) => dt.getUTCMinutes().toString().padStart(2, "0")],
    ["m", (dt) => dt.getUTCMinutes().toString()],
    ["ss", (dt) => dt.getUTCSeconds().toString().padStart(2, "0")],
    ["s", (dt) => dt.getUTCSeconds().toString()],
    ["A", (dt) => (dt.getUTCHours() >= 12 ? "PM" : "AM")],
    ["a", (dt) => (dt.getUTCHours() >= 12 ? "pm" : "am")],
  ]);

  format(date: Date, format: string, locale?: string): string {
    const reg = new RegExp([...this.formatPartMap.keys()].join("|"), "g");
    let r;
    let result = "";
    let offset = 0;
    while ((r = reg.exec(format))) {
      const rep = this.formatPartMap.get(r[0])!(date);
      const fixed = format.substring(offset, r.index);
      result += fixed;
      result += rep;
      offset += fixed.length + r[0].length;
    }
    return result;
  }

  // Handle the following formats:
  // (MDY): M/d/yyyy, MM/dd/yyyy, MMM dd, yyyy
  // (DMY): d/M/yyyy, dd/MM/yyyy, d MMM yyyy
  // (YMD): yyyy-MM-dd, yyyymmdd

  parseYY(s: string): number {
    const yy = parseInt(s.substring(0, 2));
    return yy < 50 ? yy + 2000 : yy + 1900;
  }

  parsePartMap: Map<string, (s: string) => [BasicDateParts, number]> = new Map([
    ["M", (s) => [<BasicDateParts>{ month: parseInt(s.substring(0, 1)) }, 1]],
    ["MM", (s) => [{ month: parseInt(s.substring(0, 2)) }, 2]],

    ["d", (s) => [{ day: parseInt(s.substring(0, 1)) }, 1]],
    ["dd", (s) => [{ day: parseInt(s.substring(0, 2)) }, 2]],

    ["D", (s) => [{ day: parseInt(s.substring(0, 1)) }, 1]],
    ["DD", (s) => [{ day: parseInt(s.substring(0, 2)) }, 2]],

    ["YY", (s) => [{ year: this.parseYY(s) }, 2]],
    ["YYYY", (s) => [{ year: parseInt(s.substring(0, 4)) }, 4]],
  ]);

  parseBasicDate(value: string, format: string): Date | undefined {
    const formatParts = format.split(/[\/,\- .]/);
    let val = value.split(/\D+/)?.join("");
    let result: BasicDateParts = {};
    formatParts.forEach((f) => {
      const fn = this.parsePartMap.get(f);
      if (fn) {
        const [res, len] = fn(val);
        result = { ...result, ...res };
        val = val.slice(len);
      } else {
        return undefined;
      }
    });
    if (result.year && result.month && result.day) {
      return new Date(Date.UTC(result.year, result.month - 1, result.day));
    } else {
      return undefined;
    }
  }
}


export function DateTimeFormatter(format: string, locale?: string): Formatter<Date> {
  return (date: Date) => DateTimeService.defaultInstance.format(date, format, locale);
}
export function BasicDateParser(format: string): Parser<Date> {
  return (s: string) => DateTimeService.defaultInstance.parseBasicDate(s, format);
}

