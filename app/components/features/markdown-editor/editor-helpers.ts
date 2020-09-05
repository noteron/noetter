import { CursorPosition, EditorRow } from "./types";

export const getCursorPosition = (
  ref: HTMLTextAreaElement
): CursorPosition => ({
  start: ref.selectionStart,
  end: ref.selectionEnd,
  isSelection: ref.selectionStart !== ref.selectionEnd,
  isForwardSelection:
    ref.selectionDirection === "none"
      ? undefined
      : ref.selectionDirection === "forward"
});

export const getCurrentRow = (
  cursorPosition: CursorPosition,
  rowInformation: EditorRow[]
) =>
  rowInformation.find(
    (row) =>
      row.startsAtPosition <= cursorPosition.start &&
      row.endsAtPosition >= cursorPosition.end
  );

export const getRowInformation = (rawMarkdown: string): EditorRow[] => {
  let absolutePositionInMarkdownString = -1;
  const splitMarkdown: string[] = rawMarkdown.split("\n");
  return splitMarkdown.map(
    (row: string, index: number): EditorRow => {
      const stringValue = `${row}\n`;
      const startsAtPosition = absolutePositionInMarkdownString + 1;
      const endsAtPosition =
        absolutePositionInMarkdownString + stringValue.length;
      absolutePositionInMarkdownString = endsAtPosition;
      return {
        index,
        startsAtPosition,
        endsAtPosition,
        stringValue
      };
    }
  );
};
