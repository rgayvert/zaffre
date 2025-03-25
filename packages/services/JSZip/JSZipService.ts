import { downloadBlob } from "zaffre";
import JSZip from "jszip";

type ZipFileDef = {
  fileName: string;
  contents: string;
};

export class JSZipService {
  static zipAndDownload(files: ZipFileDef[], fileName: string): void {
    const zip = new JSZip();
    files.forEach((f) => zip.file(f.fileName, f.contents));

    zip.generateAsync({type: "blob"}).then(
      (blob) => downloadBlob(blob, fileName)
    )
  }
}
