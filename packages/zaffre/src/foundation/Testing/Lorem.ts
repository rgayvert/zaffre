import { zutil } from "../Util";

//
// lorem - a collection of functions that return randomized data for testing.
//

export interface LoremMovie {
  title: string;
  year: number;
}

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
  uniqueWordList: (numWords: number): string[] => {
    return zutil
      .randomSequence(1, loremWords.length)
      .slice(0, numWords)
      .map((index) => loremWords[index]);
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
  movies: (count: number): LoremMovie[] => {
    return zutil.randomSubset(LoremMovies, zutil.clamp(count, 1, 100));
  },
};

const LoremMovies = [
  // Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top
  { title: "The Shawshank Redemption", year: 1994 },
  { title: "The Godfather", year: 1972 },
  { title: "The Godfather: Part II", year: 1974 },
  { title: "The Dark Knight", year: 2008 },
  { title: "12 Angry Men", year: 1957 },
  { title: "Schindler's List", year: 1993 },
  { title: "Pulp Fiction", year: 1994 },
  { title: "The Lord of the Rings: The Return of the King", year: 2003 },
  { title: "The Good, the Bad and the Ugly", year: 1966 },
  { title: "Fight Club", year: 1999 },
  { title: "The Lord of the Rings: The Fellowship of the Ring", year: 2001 },
  { title: "Star Wars: Episode V - The Empire Strikes Back", year: 1980 },
  { title: "Forrest Gump", year: 1994 },
  { title: "Inception", year: 2010 },
  { title: "The Lord of the Rings: The Two Towers", year: 2002 },
  { title: "One Flew Over the Cuckoo's Nest", year: 1975 },
  { title: "Goodfellas", year: 1990 },
  { title: "The Matrix", year: 1999 },
  { title: "Seven Samurai", year: 1954 },
  { title: "Star Wars: Episode IV - A New Hope", year: 1977 },
  { title: "City of God", year: 2002 },
  { title: "Se7en", year: 1995 },
  { title: "The Silence of the Lambs", year: 1991 },
  { title: "It's a Wonderful Life", year: 1946 },
  { title: "Life Is Beautiful", year: 1997 },
  { title: "The Usual Suspects", year: 1995 },
  { title: "Léon: The Professional", year: 1994 },
  { title: "Spirited Away", year: 2001 },
  { title: "Saving Private Ryan", year: 1998 },
  { title: "Once Upon a Time in the West", year: 1968 },
  { title: "American History X", year: 1998 },
  { title: "Interstellar", year: 2014 },
  { title: "Casablanca", year: 1942 },
  { title: "City Lights", year: 1931 },
  { title: "Psycho", year: 1960 },
  { title: "The Green Mile", year: 1999 },
  { title: "The Intouchables", year: 2011 },
  { title: "Modern Times", year: 1936 },
  { title: "Raiders of the Lost Ark", year: 1981 },
  { title: "Rear Window", year: 1954 },
  { title: "The Pianist", year: 2002 },
  { title: "The Departed", year: 2006 },
  { title: "Terminator 2: Judgment Day", year: 1991 },
  { title: "Back to the Future", year: 1985 },
  { title: "Whiplash", year: 2014 },
  { title: "Gladiator", year: 2000 },
  { title: "Memento", year: 2000 },
  { title: "The Prestige", year: 2006 },
  { title: "The Lion King", year: 1994 },
  { title: "Apocalypse Now", year: 1979 },
  { title: "Alien", year: 1979 },
  { title: "Sunset Boulevard", year: 1950 },
  { title: "Dr. Strangelove or: How I Learned to Stop Worrying and Love the Bomb", year: 1964 },
  { title: "The Great Dictator", year: 1940 },
  { title: "Cinema Paradiso", year: 1988 },
  { title: "The Lives of Others", year: 2006 },
  { title: "Grave of the Fireflies", year: 1988 },
  { title: "Paths of Glory", year: 1957 },
  { title: "Django Unchained", year: 2012 },
  { title: "The Shining", year: 1980 },
  { title: "WALL·E", year: 2008 },
  { title: "American Beauty", year: 1999 },
  { title: "The Dark Knight Rises", year: 2012 },
  { title: "Princess Mononoke", year: 1997 },
  { title: "Aliens", year: 1986 },
  { title: "Oldboy", year: 2003 },
  { title: "Once Upon a Time in America", year: 1984 },
  { title: "Witness for the Prosecution", year: 1957 },
  { title: "Das Boot", year: 1981 },
  { title: "Citizen Kane", year: 1941 },
  { title: "North by Northwest", year: 1959 },
  { title: "Vertigo", year: 1958 },
  { title: "Star Wars: Episode VI - Return of the Jedi", year: 1983 },
  { title: "Reservoir Dogs", year: 1992 },
  { title: "Braveheart", year: 1995 },
  { title: "M", year: 1931 },
  { title: "Requiem for a Dream", year: 2000 },
  { title: "Amélie", year: 2001 },
  { title: "A Clockwork Orange", year: 1971 },
  { title: "Like Stars on Earth", year: 2007 },
  { title: "Taxi Driver", year: 1976 },
  { title: "Lawrence of Arabia", year: 1962 },
  { title: "Double Indemnity", year: 1944 },
  { title: "Eternal Sunshine of the Spotless Mind", year: 2004 },
  { title: "Amadeus", year: 1984 },
  { title: "To Kill a Mockingbird", year: 1962 },
  { title: "Toy Story 3", year: 2010 },
  { title: "Logan", year: 2017 },
  { title: "Full Metal Jacket", year: 1987 },
  { title: "Dangal", year: 2016 },
  { title: "The Sting", year: 1973 },
  { title: "2001: A Space Odyssey", year: 1968 },
  { title: "Singin' in the Rain", year: 1952 },
  { title: "Toy Story", year: 1995 },
  { title: "Bicycle Thieves", year: 1948 },
  { title: "The Kid", year: 1921 },
  { title: "Inglourious Basterds", year: 2009 },
  { title: "Snatch", year: 2000 },
  { title: "3 Idiots", year: 2009 },
  { title: "Monty Python and the Holy Grail", year: 1975 },
];
