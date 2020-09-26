import { useCallback } from "react";
import * as monaco from "monaco-editor";

const UNCHECKED_CHECKBOX_REGEX = /- (\[\]|\[ \])( )*/;
const CHECKED_CHECKBOX_REGEX = /- \[(X|x)\] /;
const UNCHECKED_CHECKBOX_TEMPLATE = "- [ ] ";
const CHECKED_CHECKBOX_TEMPLATE = "- [x] ";
const [FIRST_COLUMN, FIRST_LINE] = [1, 1];

type EditorToolsState = {
  toggleCheckboxOnCurrentLine: (
    editor: monaco.editor.IStandaloneCodeEditor
  ) => void;
};

const useEditorTools = (): EditorToolsState => {
  const toggleCheckboxOnCurrentLine = useCallback(
    (editor: monaco.editor.IStandaloneCodeEditor) => {
      const model = editor?.getModel();
      if (!model) return;
      const selection = editor.getSelection();
      const unmodifiedLine = model.getLineContent(
        selection?.selectionStartLineNumber ?? FIRST_LINE
      );
      const uncheckedCheckboxMatch = unmodifiedLine?.match(
        UNCHECKED_CHECKBOX_REGEX
      );
      const checkedCheckboxMatch = unmodifiedLine?.match(
        CHECKED_CHECKBOX_REGEX
      );
      const isCheckbox: boolean =
        !!uncheckedCheckboxMatch?.[0] || !!checkedCheckboxMatch?.[0];

      if (!isCheckbox) {
        const firstColumnAfterWhitespace = model.getLineFirstNonWhitespaceColumn(
          selection?.startLineNumber ?? FIRST_LINE
        );
        const lineContainsNoWhitespace =
          !unmodifiedLine.startsWith(" ") && !unmodifiedLine.startsWith("\t");
        const lineIsOnlyWhitespace =
          !lineContainsNoWhitespace && firstColumnAfterWhitespace === 0;

        const lineIndentation = lineContainsNoWhitespace
          ? ""
          : unmodifiedLine.slice(
              0,
              lineIsOnlyWhitespace ? undefined : firstColumnAfterWhitespace - 1
            );
        const lineContent = lineIsOnlyWhitespace
          ? ""
          : unmodifiedLine.slice(
              lineContainsNoWhitespace ? 0 : firstColumnAfterWhitespace - 1
            );
        const updatedLine = `${lineIndentation}${UNCHECKED_CHECKBOX_TEMPLATE}${lineContent}`;
        const lineRange = new monaco.Range(
          selection?.startLineNumber ?? FIRST_LINE,
          FIRST_COLUMN,
          selection?.startLineNumber ?? FIRST_LINE,
          unmodifiedLine.length + FIRST_COLUMN
        );
        model.pushEditOperations(
          editor.getSelections(),
          [
            {
              range: lineRange,
              text: updatedLine,
              forceMoveMarkers: true
            }
          ],
          () => (selection ? [selection] : null)
        );
        return;
      }
      if (uncheckedCheckboxMatch?.[0]) {
        const updatedLine = unmodifiedLine.replace(
          UNCHECKED_CHECKBOX_REGEX,
          CHECKED_CHECKBOX_TEMPLATE
        );
        const lineRange = new monaco.Range(
          selection?.startLineNumber ?? FIRST_LINE,
          FIRST_COLUMN,
          selection?.startLineNumber ?? FIRST_LINE,
          unmodifiedLine.length + FIRST_COLUMN
        );
        model.pushEditOperations(
          editor.getSelections(),
          [{ range: lineRange, text: updatedLine, forceMoveMarkers: true }],
          () => (selection ? [selection] : null)
        );
        return;
      }
      if (checkedCheckboxMatch?.[0]) {
        const updatedLine = unmodifiedLine.replace(
          CHECKED_CHECKBOX_REGEX,
          UNCHECKED_CHECKBOX_TEMPLATE
        );
        const lineRange = new monaco.Range(
          selection?.startLineNumber ?? FIRST_LINE,
          FIRST_COLUMN,
          selection?.startLineNumber ?? FIRST_LINE,
          unmodifiedLine.length + FIRST_COLUMN
        );
        model.pushEditOperations(
          editor.getSelections(),
          [{ range: lineRange, text: updatedLine, forceMoveMarkers: true }],
          () => (selection ? [selection] : null)
        );
      }
    },
    []
  );

  return {
    toggleCheckboxOnCurrentLine
  };
};

export default useEditorTools;
