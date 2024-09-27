import { atom } from "zaffre";

export class RegExModel {
  sourceText = atom("800-555-1234\n\nabc55\n", { action: () => this.groupTextChanged() });
  plainSourceText = atom("");
  pattern = atom("", { action: () => this.groupTextChanged() });
  groupText = atom("");

  groupTextChanged(): void {
    const pat = this.pattern.get().trim();
    const plainText = this.plainSourceText.get();
    if (pat) {
      try {
        // this part is a bit gnarly - parse the regex result and replace matches in the source text 
        // with highlighting spans
        const regex = new RegExp(pat, "g");
        const result = regex.exec(plainText);
        this.sourceText.set(plainText.replace(regex, (match) => `<span class='regex-highlight'>${match}</span>`));
        if (result && result.length > 1) {
          const part1 = result.slice(1).map((val, index) => `${index}: ${val}`);
          const part2 = Object.entries(result.groups || {}).map(([key, val]) => `${key}: ${val}`);
          this.groupText.set([...part1, ...part2].join("\n"));
        } else {
          this.groupText.set("");
        }
      } catch (e) {
        // incomplete or invalid regex
        this.sourceText.set(plainText);
        this.groupText.set("");
      }
    } else {
      this.sourceText.set(plainText);
      this.groupText.set("");
    }
  }
}
