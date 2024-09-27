
//
// SanitizeService
//   - stub for HTML sanitization
//   - use DOMPurify for full service

export type SanitizeFn = (text: string) => string;

const defaultSanitizeFn = (text: string): string => {
  return text;
};

export class SanitizeService {
  static defaultInstance: SanitizeService = new SanitizeService(defaultSanitizeFn);

  constructor(protected sanitizeFn: SanitizeFn) {}

  clean(text: string): string {
    return this.sanitizeFn(text);
  }
}
