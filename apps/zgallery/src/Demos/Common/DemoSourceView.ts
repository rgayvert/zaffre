import { zutil, core, atom, pct, css_length, em, toggleAtom, ToastButton } from "zaffre";
import { VStack, HDivider, URLText, StackOptions, SegmentedOptions } from "zaffre";
import { View, SegmentedTextButton, HStack, Spacer, Button } from "zaffre";
import { highlightSourceText } from ":services";

/**
 * #DemoSourceView
 *   - retrieve the source files for a demo
 *   - filenames are displayed in a segmented text button
 *   - source for the selected file is retrieved with URLText and passed through Highlight.js
 *   - comments may be stripped or shown
 *   -
 */
export function DemoSourceView(sourceDir: string, fileNames: string[], maxHeight?: css_length): View {
  const options: StackOptions = {
    height: pct(100),
    width: pct(100),
    justifyContent: "start",
    padding: core.space.s3,
    name: "Source",
    border: core.border.thin,
  };
  const segmentedOptions: SegmentedOptions = {
    minHeight: em(2),
    selectionColor: core.color.background,
    width: pct(95),
    flexWrap: "wrap",
  };

  // Option to strip comments
  // Adapted from https://stackoverflow.com/questions/21817453 and https://stackoverflow.com/questions/37051797
  //
  function reduceMultipleBlankLines(source: string): string {
    const eol = source.match(/\r\n/gm) ? "\r\n" : "\n";
    const regExp = new RegExp("(" + eol + "){2,}", "gm");
    return source.replace(regExp, eol + eol);
  }
  function stripCommentsAndHighlight(source: string): string {
    return highlightSourceText(
      reduceMultipleBlankLines(source.replace(/\/\*[\s\S]*?\*\/|(?<=[^:])\/\/.*|^\/\/.*/g, ""))
    );
  }

  // construct a list of full paths for the segmented button
  const paths = fileNames.map((fileName) => `${zutil.formatPath(sourceDir, fileName)}`);
  const selectedPath = atom(paths[0]);
  const copyOfText = atom("");
  const showComments = toggleAtom(true);
  const commentIcon = atom(() => (showComments.get() ? "icon.comments" : "icon.nocomments"));
  const textTransform = atom(() => (showComments.get() ? highlightSourceText : stripCommentsAndHighlight));

  return VStack(options).append(
    HStack({ width: pct(100) }).append(
      Spacer(1),
      SegmentedTextButton(selectedPath, paths, {
        labels: fileNames,
        ...segmentedOptions,
      }),
      Spacer(1),
      ToastButton("Copied", {
      //Button({
          leadingIconURI: "icon.copy",
        action: () => navigator.clipboard.writeText(copyOfText.get()),
        tooltip: "Copy to clipboard",
        border: core.border.none,
      }),
      Spacer(core.space.s2),
      Button({
        leadingIconURI: commentIcon,
        action: () => showComments.toggle(),
        tooltip: "Toggle comments",
        border: core.border.none,
      })
    ),
    HDivider({ width: pct(100), margin: core.space.s1, background: core.color.gray }),
    URLText(selectedPath, {
      maxHeight: maxHeight,
      textTransformFn: textTransform,
      alignSelf: "start",
      width: pct(100),
      overflow: "auto",
      font: core.font.body_small,
      copyOfContents: copyOfText,
    })
  );
}
