import { zutil } from "../Util";

export class CsvToJsonService {
  static defaultInstance: CsvToJsonService = new CsvToJsonService();

  convert(text: string): any {
    return zutil.csvToJSON(text);
  }
}
