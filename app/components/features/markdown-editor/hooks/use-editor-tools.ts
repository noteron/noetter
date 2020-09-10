/* eslint-disable no-console */
import { useCallback } from "react";
import {
  getCursorPosition,
  getRowInformation,
  getCurrentRow
} from "../editor-helpers";
import { InsertType, CursorPosition } from "../editor-types";

type InsertHandler = (
  cursorPosition: CursorPosition,
  insertString: string,
  markdown: string,
  onMarkdownUpdated: (markdown: string) => void,
  ref: HTMLTextAreaElement
) => void;

type EditorToolsState = {
  insertOrReplaceAtPosition: (
    insertString: string,
    insertType: InsertType,
    ref: React.RefObject<HTMLTextAreaElement>,
    markdown: string,
    onMarkdownUpdated: (markdown: string) => void
  ) => void;
  writeDebugInfoToConsole: (
    refObject: React.RefObject<HTMLTextAreaElement>,
    markdown: string
  ) => void;
};

const useEditorTools = (): EditorToolsState => {
  const handleReplaceSelection = useCallback<InsertHandler>(
    (
      cursorPosition: CursorPosition,
      insertString: string,
      markdown: string,
      onMarkdownUpdated: (markdown: string) => void,
      ref: HTMLTextAreaElement
    ) => {
      if (!cursorPosition.isSelection) {
        console.log(
          "Can not Replace Selection, no selection present. Inserting at cursor position"
        );
      }
      const selectionStart = cursorPosition.isForwardSelection
        ? cursorPosition.start
        : cursorPosition.end;
      const selectionEnd = cursorPosition.isForwardSelection
        ? cursorPosition.end
        : cursorPosition.start;
      const startString = markdown.slice(0, selectionStart);
      const endString = markdown.slice(selectionEnd + 1);
      const newMarkdown = `${startString}${insertString}${endString}`;
      onMarkdownUpdated(newMarkdown);
      ref.selectionStart = selectionStart;
      ref.selectionEnd = selectionEnd;
    },
    []
  );

  const handleInsertAroundSelection = useCallback<InsertHandler>(
    (
      cursorPosition: CursorPosition,
      insertString: string,
      markdown: string,
      onMarkdownUpdated: (markdown: string) => void
    ) => {
      if (!cursorPosition.isSelection) {
        console.log(
          "can not insert around, no selection present. Inserting at cursor position."
        );
      }
      const selectionStart = cursorPosition.isForwardSelection
        ? cursorPosition.start
        : cursorPosition.end;
      const selectionEnd = cursorPosition.isForwardSelection
        ? cursorPosition.end
        : cursorPosition.start;
      const startString = markdown.slice(0, selectionStart);
      const selectedString = markdown.slice(selectionStart, selectionEnd + 1);
      const endString = markdown.slice(selectionEnd);
      const newMarkdown = cursorPosition.isSelection
        ? `${startString}${insertString}${selectedString}${insertString}${endString}`
        : `${startString}${insertString}${endString}`;
      onMarkdownUpdated(newMarkdown);
    },
    []
  );

  const handleInsertAtRowEnd = useCallback<InsertHandler>(
    (
      cursorPosition: CursorPosition,
      insertString: string,
      markdown: string,
      onMarkdownUpdated: (markdown: string) => void
    ) => {
      const rows = getRowInformation(markdown);
      const row = getCurrentRow(cursorPosition, rows);
      if (!row) {
        console.log("Could not insert at end of row, no row selected.");
        return;
      }
      const stringBeforeRowEnd = markdown.slice(0, row?.endsAtPosition);
      const stringAfterRowEnd = markdown.slice(row?.endsAtPosition);
      const newMarkdown = `${stringBeforeRowEnd}${insertString}${stringAfterRowEnd}`;
      onMarkdownUpdated(newMarkdown);
    },
    []
  );

  const handleInsertAtRowStart = useCallback<InsertHandler>(
    (
      cursorPosition: CursorPosition,
      insertString: string,
      markdown: string,
      onMarkdownUpdated: (markdown: string) => void,
      ref: HTMLTextAreaElement
    ) => {
      const rows = getRowInformation(markdown);
      const row = getCurrentRow(cursorPosition, rows);
      if (!row) {
        console.log("Could not insert at beginning of row, no row selected.");
        return;
      }
      const stringBeforeRowStart = markdown.slice(0, row?.startsAtPosition);
      const stringAfterRowStart = markdown.slice(row?.startsAtPosition);
      const newMarkdown = `${stringBeforeRowStart}${insertString}${stringAfterRowStart}`;
      onMarkdownUpdated(newMarkdown);
      const newCursorPosition = cursorPosition.start + insertString.length;
      ref.selectionStart = newCursorPosition;
      ref.selectionEnd = newCursorPosition;
    },
    []
  );

  const handleInsertAtSelectionEnd = useCallback<InsertHandler>(
    (
      cursorPosition: CursorPosition,
      insertString: string,
      markdown: string,
      onMarkdownUpdated: (markdown: string) => void
    ): void => {
      if (!cursorPosition.isSelection) {
        console.log(
          "can not insert at selection end, no selection present. Inserting at cursor position."
        );
      }
      const selectionEnd = cursorPosition.isForwardSelection
        ? cursorPosition.end
        : cursorPosition.start;
      const startString = markdown.slice(0, selectionEnd);
      const endString = markdown.slice(selectionEnd);
      const newMarkdown = `${startString}${insertString}${endString}`;
      onMarkdownUpdated(newMarkdown);
    },
    []
  );

  const handleInsertAtSelectionStart = useCallback<InsertHandler>(
    (
      cursorPosition: CursorPosition,
      insertString: string,
      markdown: string,
      onMarkdownUpdated: (markdown: string) => void
    ): void => {
      if (!cursorPosition.isSelection) {
        console.log(
          "can not insert at selection start, no selection present. Inserting at cursor position."
        );
      }
      const selectionStart = cursorPosition.isForwardSelection
        ? cursorPosition.start
        : cursorPosition.end;
      const startString = markdown.slice(0, selectionStart);
      const endString = markdown.slice(selectionStart);
      const newMarkdown = `${startString}${insertString}${endString}`;
      onMarkdownUpdated(newMarkdown);
    },
    []
  );

  const insertOrReplaceAtPosition = useCallback(
    (
      insertString: string,
      insertType: InsertType,
      refObject: React.RefObject<HTMLTextAreaElement>,
      markdown: string,
      onMarkdownUpdated: (markdown: string) => void
    ): void => {
      const ref = refObject.current;
      if (!ref) {
        console.log("No ref. Unable to insert or replace strings.");
        return;
      }
      const cursorPosition = getCursorPosition(ref);
      switch (insertType) {
        case InsertType.ReplaceSelection:
          handleReplaceSelection(
            cursorPosition,
            insertString,
            markdown,
            onMarkdownUpdated,
            ref
          );
          break;
        case InsertType.AroundSelection:
          handleInsertAroundSelection(
            cursorPosition,
            insertString,
            markdown,
            onMarkdownUpdated,
            ref
          );
          break;
        case InsertType.RowEnd:
          handleInsertAtRowEnd(
            cursorPosition,
            insertString,
            markdown,
            onMarkdownUpdated,
            ref
          );
          break;
        case InsertType.RowStart:
          handleInsertAtRowStart(
            cursorPosition,
            insertString,
            markdown,
            onMarkdownUpdated,
            ref
          );
          break;
        case InsertType.SelectionEnd:
          handleInsertAtSelectionEnd(
            cursorPosition,
            insertString,
            markdown,
            onMarkdownUpdated,
            ref
          );
          break;
        case InsertType.SelectionStart:
          handleInsertAtSelectionStart(
            cursorPosition,
            insertString,
            markdown,
            onMarkdownUpdated,
            ref
          );
          break;
        default:
      }
    },
    [
      handleInsertAroundSelection,
      handleInsertAtRowEnd,
      handleInsertAtRowStart,
      handleInsertAtSelectionEnd,
      handleInsertAtSelectionStart,
      handleReplaceSelection
    ]
  );

  const writeDebugInfoToConsole = useCallback(
    (
      refObject: React.RefObject<HTMLTextAreaElement>,
      markdown: string
    ): void => {
      console.log("-----DEBUG-----");
      const ref = refObject.current;
      if (!ref) {
        console.log("No reference");
        return;
      }
      const rows = getRowInformation(markdown);
      const cursor = getCursorPosition(ref);
      console.log("Rows", rows);
      console.log("Cursor", cursor);
      console.log("Current rows", getCurrentRow(cursor, rows));
      console.log("-----END-----");
    },
    []
  );

  return {
    insertOrReplaceAtPosition,
    writeDebugInfoToConsole
  };
};

export default useEditorTools;
