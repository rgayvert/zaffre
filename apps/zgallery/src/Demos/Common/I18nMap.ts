import { I18n } from "zaffre";

/**
 * #I18nMap
 *   - not currently used
 *   - intended to provide translations for demos
 */

export type LocaleString = [string, string, string];
type LocaleMap = Map<string, Map<string, string>>;

export class I18nMap {
  localeMap: LocaleMap;

  constructor(strings: LocaleString[]) {
    this.localeMap = new Map<string, Map<string, string>>();
    strings.forEach(([locale, key, contents]) => {
      let map = this.localeMap.get(locale);
      if (!map) {
        map = new Map<string, string>();
        this.localeMap.set(locale, map);
      }
      map.set(key, contents);
    });
  }

  getWithLocale(localeID: string, key: string): string | undefined {
    return this.localeMap.get(localeID)?.get(key);
  }
  
  get(key: string): string {
    return this.getWithLocale(I18n.currentInstance.localeID.get(), key) || 
        this.getWithLocale(I18n.fallbackLocaleID, key) || key;
  }
}
