import { zutil } from "../Util";

//
// lorem - a collection of functions that return randomized data for testing.
//

const loremWords = `lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut 
labore et dolore magna aliqua Ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip
ex ea commodo consequat duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat 
nulla pariatur excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim 
id est laborum`
  .split(" ")
  .filter((part) => part.length > 1)
  .map((word) => word.trim());


export const lorem = {
  words: (minWords: number, maxWords = minWords): string => {
    const nwords = zutil.randomInt(minWords, maxWords);
    return zutil
      .sequence(0, nwords)
      .map((i) => loremWords[zutil.randomInt(0, loremWords.length - 1)])
      .join(" ");
  },
  sentences: (minWords: number, maxWords = minWords, minSentLen = 5, maxSenLen = minSentLen * 2): string => {
    minWords = Math.max(minWords, 4);
    const wordCount = maxWords ? zutil.randomInt(minWords, maxWords) : minWords;
    const lineCounts: number[] = [];
    let count = 0;
    while (count < wordCount) {
      let next = zutil.randomInt(minSentLen, maxSenLen);
      if (count + next > wordCount || wordCount - next - count < maxSenLen) {
        next = wordCount - count;
      }
      lineCounts.push(next);
      count += next;
    }
    return lineCounts
      .map((lineCount) =>
        zutil
          .sequence(0, lineCount)
          .map((_idx) => loremWords[zutil.randomInt(0, loremWords.length - 1)])
          .join(" ")
      )
      .map((line) => zutil.capitalizeFirstLetter(line) + ".")
      .join(" ");
  },

  redacted: (len1: number, len2 = len1, sentLen = 10): string => {
    const words = lorem.sentences(len1, len2, sentLen).split(" ");
    const spans = words.map((word) => `<span>${word}</span>&nbsp`).join("");
    return `<div class="redacted-text">${spans}</div>`;
  },

  image: (width: number, height?: number): string => {
    const index = zutil.randomInt(1, 500);
    const sz = height ? `${width}/${height}` : `${width}`;
    return `https://picsum.photos/${sz}?random=${index}`;
  },
 
  date: (): Date => {
    return new Date(zutil.randomInt(new Date(2000, 0).getTime(), new Date(2023, 12).getTime()));
  },
  time: (): Date => {
    const dt = new Date(0, 0, 0);
    dt.setSeconds(zutil.randomInt(0, 86400));
    return dt;
  },

};
