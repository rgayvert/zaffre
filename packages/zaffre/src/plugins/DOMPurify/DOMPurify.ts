import { SanitizeService, SanitizeFn } from "zaffre";

export class DomPurify extends SanitizeService {

  public static async install(): Promise<void> {
    const { default: domPurify } = await import("dompurify");
    this.domPurifyFn = domPurify.sanitize;
    SanitizeService.defaultInstance = new DomPurify();
  }
  protected static domPurifyFn: SanitizeFn;

  constructor() {
    super(DomPurify.domPurifyFn);
  }
}
