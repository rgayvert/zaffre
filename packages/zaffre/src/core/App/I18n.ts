import { zutil, zget, atom, Atom, apiAtom, lazyinit } from ":foundation";

//
// An instance of I18n provides string translations for a single locale.
// The translations for each locale are assumed to contained in a file located at
//       /resources/locales/[localeID]/messages.json
//
// These are used by t() to perform string translations for content components.
//

export class I18n {
  static preferredLanguage(): string {
    return window.navigator.language;
  }
  static supportedLocalesMap = new Map([
    ["en-us", "English"],
    ["fr", "Français"],
    ["es", "Español"]
  ]);
  static localeIDFromName(localName: string): string {
    return zutil.keyAtMapValue(this.supportedLocalesMap, localName) || this.fallbackLocaleID;
  }
  static localeNameFromID(localeID: string): string {
    return this.supportedLocalesMap.get(localeID) || this.fallbackLocaleName;
  }
  static supportedLocaleIDs(): string[] {
    return [...this.supportedLocalesMap.keys()];
  }
  static supportedLocaleNames(): string[] {
    return [...this.supportedLocalesMap.values()];
  }
  static fallbackLocaleID = "en";
  static fallbackLocaleName = "English";

  @lazyinit static get currentInstance(): I18n {
    return new I18n(this.preferredLanguage());
  }

  static baseURL: string;

  static async initialize(localeURL: string): Promise<void> {
    this.baseURL = localeURL;
    await this.currentInstance.loadTranslations();
  }

  translations = atom(new Map<string, string>());
  localeID: Atom<string>;
  localeName: Atom<string>;

  extractTranslations(json: any): Map<string, string> {
    const answer = new Map<string, string>();
    for (const entry in json) {
      const message = json[entry]["message"];
      if (message) {
        answer.set(entry, message);
      }
    }
    return answer;
  }

  translate(value: string): string {
    return zget(this.translations)?.get(value) || value;
  }
  setTranslations(newTranslations: Map<string, string>): void {
    this.translations.set(newTranslations);
  }

  async loadTranslationsForLocaleID(localeID: string): Promise<void> {
    const url = `${I18n.baseURL}/${localeID}/messages.json`;
    const atom = apiAtom(url, (json) => this.setTranslations(this.extractTranslations(json)), undefined);
    await atom.getValue();
  }

  // If lang = "en-us" and fallback="es", try "en-us", then "en", then "es".
  async loadTranslations(): Promise<void> {
    const lang = this.localeID.get().toLowerCase();
    await this.loadTranslationsForLocaleID(lang);
    if (!this.translations && lang.includes("-")) {
      const baseLang = lang.split("-")[0];
      await this.loadTranslationsForLocaleID(baseLang);
    }
    if (!this.translations) {
      await this.loadTranslationsForLocaleID(I18n.fallbackLocaleID);
    }
  }

  constructor(lang: string) {
    this.localeID = atom(lang.toLowerCase(), { action: () => this.loadTranslations() });
    this.localeName = atom(I18n.localeNameFromID(this.localeID.get()));
    this.localeName.addAction((localeName) => this.localeID.set(I18n.localeIDFromName(localeName)));
  }
}
