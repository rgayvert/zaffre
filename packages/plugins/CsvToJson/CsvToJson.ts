import { CsvToJsonService } from "zaffre";
import { zutil } from ":foundation";
import { ConvertCsvToJson } from "convert-csv-to-json";

export class CsvToJson extends CsvToJsonService {
  public static async install(): Promise<void> {
    CsvToJsonService.defaultInstance = new CsvToJson();
  }

  converter = new ConvertCsvToJson();

  convert(text: string): any {
    return this.converter.csvStringToJson(text);
  }
}
