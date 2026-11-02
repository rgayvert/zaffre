import { arrayAtom, pickList, lorem, zlog, zutil } from ":foundation";

export class SampleListBoxModel {
  words =  arrayAtom<string | null>(zutil.sequence(0, 5).map((i) => lorem.words(i + 2)));
  wordList = pickList([], this.words, { action: (item) => zlog.info("selection: " + item) });

  removeListItem(item: string): void {
    this.words.delete(item);
  }
  addListItem(): void {
    this.words.push(lorem.words(5));
  }
  sort(): void {
    this.words.toggleSort();
  }
}
