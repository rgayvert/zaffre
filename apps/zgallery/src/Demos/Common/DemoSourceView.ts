import { zutil, atom, pct, css_length, em, toggleAtom, ToastButton, zcolor, zborder, zfont, zspace, pickList } from "zaffre";
import { VStack, HDivider, URLText, StackOptions, SegmentedButtonOptions } from "zaffre";
import { SegmentedTextButton, HStack, Spacer, Button } from "zaffre";
import { highlightSourceText } from ":services";

/**
 * #DemoSourceView
 *   - retrieve the source files for a demo
 *   - filenames are displayed in a segmented text button
 *   - source for the selected file is retrieved with URLText and passed through Highlight.js
 *   - comments may be stripped or shown
 *   -
 */
export const DemoSourceView = (sourceDir: string, fileSpecs: string[][], fullPage: boolean, maxHeight?: css_length) => {
  const options: StackOptions = {
    height: pct(100),
    width: pct(100),
    maxHeight: em(40),
    justifyContent: "start",
    padding: zspace.s3,
    name: "Source",
    border: zborder.none,
  };
  const segmentedOptions: SegmentedButtonOptions<string> = {
    minHeight: em(2),
    selectionColor: zcolor.background,
    //width: pct(95),
    flexWrap: "wrap",
  };

  // Option to strip comments
  // Adapted from https://stackoverflow.com/questions/21817453 and https://stackoverflow.com/questions/37051797
  //
  const reduceMultipleBlankLines = (source: string) => {
    const eol = source.match(/\r\n/gm) ? "\r\n" : "\n";
    const regExp = new RegExp("(" + eol + "){2,}", "gm");
    return source.replace(regExp, eol + eol);
  }
  const stripCommentsAndHighlight = (source: string) => {
    return highlightSourceText(
      reduceMultipleBlankLines(source.replace(/\/\*[\s\S]*?\*\/|(?<=[^:])\/\/.*|^\/\/.*/g, ""))
    );
  }

  // construct a list of labels and full paths for the segmented button
  const labels = fileSpecs.map((spec) => spec[0]);
  const paths = fileSpecs.map((spec) => `${zutil.formatPath(sourceDir, spec[1])}`);
  const pathList = pickList([paths[0]], paths, { labels: labels } );

  const copyOfText = atom("");
  const showComments = toggleAtom(true);
  const commentIcon = atom(() => (showComments.get() ? "icon.comments" : "icon.nocomments"));
  const textTransform = atom(() => (showComments.get() ? highlightSourceText : stripCommentsAndHighlight));

  return VStack(options).append(
    HStack({ width: pct(100) }).append(
      Spacer(1),
      SegmentedTextButton(pathList, {
        ...segmentedOptions,
      }),
      Spacer(1),
      ToastButton("Copied", {
        leadingIconURI: "icon.copy",
        action: () => navigator.clipboard.writeText(copyOfText.get()),
        tooltip: "Copy to clipboard",
        border: zborder.none,
      }),
      Spacer("s2"),
      Button({
        leadingIconURI: commentIcon,
        action: () => showComments.toggle(),
        tooltip: "Toggle comments",
        border: zborder.none,
      })
    ),
    URLText(() => pathList.selectedValue() || "", {
      borderTop: zborder.thin,
      maxHeight: maxHeight,
      textTransformFn: textTransform,
      alignSelf: "start",
      width: pct(100),
      overflow: "auto",
      font: zfont.body_small,
      copyOfContents: copyOfText,
    })
  );
};
