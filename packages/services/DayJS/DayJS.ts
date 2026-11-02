import { DateTimeService } from "zaffre";
import dayjs from "dayjs";

// Note: Day.js requires a plugin for UTC

export class DayJS extends DateTimeService {
  static daysFn: typeof dayjs;

  public static async install(): Promise<void> {
    const { default: days } = await import("dayjs");
    this.daysFn = days;
    DateTimeService.defaultInstance = new DayJS();
  }
  
  format(date: Date, format: string, locale?: string): string {
    const dt = locale === "utc" ? new Date(date.getTime() + this.utcOffset()*60000) : date;
    return DayJS.daysFn(dt).format(format); 
  }
}
 