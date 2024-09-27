This is a simple tool for testing regular expressions. If you enter the pattern

```js
  (\(?\d{3}\)?[-.\s]?)(\d{3})-(\d{4})
```

any 10-digit phone numbers should be highlighted in the text, and the matching groups displayed in the list.

This type of text highlighting is not directly supported in Zaffre yet, so we have to dip a bit lower for this. The main component adds a style ".regex-highlight", which is used by the model when it parses the result of applying the regex.

This works, but it's an example of what Zaffre code should not look like. The problem is that Zaffre (in both foundation and components) does not provide the right kind of abstractions for this problem. We should add regex parsing support to clean up groupTextChanged(), and provide text components to provide this type of highlighting.