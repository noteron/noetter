/* eslint-disable no-console */
import { useCallback } from "react";
import {
  getCursorPosition,
  getRowInformation,
  getCurrentRow
} from "../editor-helpers";
import { InsertType, CursorPosition } from "../types";

type InsertHandler = (
  cursorPosition: CursorPosition,
  insertString: string,
  ref: HTMLTextAreaElement
) => void;

type EditorToolsState = {
  insertOrReplaceAtPosition: (
    insertString: string,
    insertType: InsertType,
    ref: React.RefObject<HTMLTextAreaElement>
  ) => void;
  writeDebugInfoToConsole: (
    refObject: React.RefObject<HTMLTextAreaElement>
  ) => void;
};

const useEditorTools = (
  rawMarkdown: string,
  onMarkdownUpdated: (newMarkdown: string) => void
): EditorToolsState => {
  const handleReplaceSelection = useCallback<InsertHandler>(
    (
      cursorPosition: CursorPosition,
      insertString: string,
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
      const startString = rawMarkdown.slice(0, selectionStart);
      const endString = rawMarkdown.slice(selectionEnd + 1);
      const newMarkdown = `${startString}${insertString}${endString}`;
      onMarkdownUpdated(newMarkdown);
      ref.selectionStart = selectionStart;
      ref.selectionEnd = selectionEnd;
    },
    [onMarkdownUpdated, rawMarkdown]
  );

  const handleInsertAroundSelection = useCallback<InsertHandler>(
    (cursorPosition: CursorPosition, insertString: string) => {
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
      const startString = rawMarkdown.slice(0, selectionStart);
      const selectedString = rawMarkdown.slice(
        selectionStart,
        selectionEnd + 1
      );
      const endString = rawMarkdown.slice(selectionEnd);
      const newMarkdown = cursorPosition.isSelection
        ? `${startString}${insertString}${selectedString}${insertString}${endString}`
        : `${startString}${insertString}${endString}`;
      onMarkdownUpdated(newMarkdown);
    },
    [onMarkdownUpdated, rawMarkdown]
  );

  const handleInsertAtRowEnd = useCallback<InsertHandler>(
    (cursorPosition: CursorPosition, insertString: string) => {
      const rows = getRowInformation(rawMarkdown);
      const row = getCurrentRow(cursorPosition, rows);
      if (!row) {
        console.log("Could not insert at end of row, no row selected.");
        return;
      }
      const stringBeforeRowEnd = rawMarkdown.slice(0, row?.endsAtPosition);
      const stringAfterRowEnd = rawMarkdown.slice(row?.endsAtPosition);
      const newMarkdown = `${stringBeforeRowEnd}${insertString}${stringAfterRowEnd}`;
      onMarkdownUpdated(newMarkdown);
    },
    [onMarkdownUpdated, rawMarkdown]
  );

  const handleInsertAtRowStart = useCallback<InsertHandler>(
    (
      cursorPosition: CursorPosition,
      insertString: string,
      ref: HTMLTextAreaElement
    ) => {
      const rows = getRowInformation(rawMarkdown);
      const row = getCurrentRow(cursorPosition, rows);
      if (!row) {
        console.log("Could not insert at beginning of row, no row selected.");
        return;
      }
      const stringBeforeRowStart = rawMarkdown.slice(0, row?.startsAtPosition);
      const stringAfterRowStart = rawMarkdown.slice(row?.startsAtPosition);
      const newMarkdown = `${stringBeforeRowStart}${insertString}${stringAfterRowStart}`;
      onMarkdownUpdated(newMarkdown);
      const newCursorPosition = cursorPosition.start + insertString.length;
      ref.selectionStart = newCursorPosition;
      ref.selectionEnd = newCursorPosition;
    },
    [onMarkdownUpdated, rawMarkdown]
  );

  const handleInsertAtSelectionEnd = useCallback<InsertHandler>(
    (cursorPosition: CursorPosition, insertString: string): void => {
      if (!cursorPosition.isSelection) {
        console.log(
          "can not insert at selection end, no selection present. Inserting at cursor position."
        );
      }
      const selectionEnd = cursorPosition.isForwardSelection
        ? cursorPosition.end
        : cursorPosition.start;
      const startString = rawMarkdown.slice(0, selectionEnd);
      const endString = rawMarkdown.slice(selectionEnd);
      const newMarkdown = `${startString}${insertString}${endString}`;
      onMarkdownUpdated(newMarkdown);
    },
    [onMarkdownUpdated, rawMarkdown]
  );

  const handleInsertAtSelectionStart = useCallback<InsertHandler>(
    (cursorPosition: CursorPosition, insertString: string): void => {
      if (!cursorPosition.isSelection) {
        console.log(
          "can not insert at selection start, no selection present. Inserting at cursor position."
        );
      }
      const selectionStart = cursorPosition.isForwardSelection
        ? cursorPosition.start
        : cursorPosition.end;
      const startString = rawMarkdown.slice(0, selectionStart);
      const endString = rawMarkdown.slice(selectionStart);
      const newMarkdown = `${startString}${insertString}${endString}`;
      onMarkdownUpdated(newMarkdown);
    },
    [onMarkdownUpdated, rawMarkdown]
  );

  const insertOrReplaceAtPosition = useCallback(
    (
      insertString: string,
      insertType: InsertType,
      refObject: React.RefObject<HTMLTextAreaElement>
    ): void => {
      const ref = refObject.current;
      if (!ref) {
        console.log("No ref. Unable to insert or replace strings.");
        return;
      }
      const cursorPosition = getCursorPosition(ref);
      switch (insertType) {
        case InsertType.ReplaceSelection:
          handleReplaceSelection(cursorPosition, insertString, ref);
          break;
        case InsertType.AroundSelection:
          handleInsertAroundSelection(cursorPosition, insertString, ref);
          break;
        case InsertType.RowEnd:
          handleInsertAtRowEnd(cursorPosition, insertString, ref);
          break;
        case InsertType.RowStart:
          handleInsertAtRowStart(cursorPosition, insertString, ref);
          break;
        case InsertType.SelectionEnd:
          handleInsertAtSelectionEnd(cursorPosition, insertString, ref);
          break;
        case InsertType.SelectionStart:
          handleInsertAtSelectionStart(cursorPosition, insertString, ref);
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
    (refObject: React.RefObject<HTMLTextAreaElement>): void => {
      console.log("-----DEBUG-----");
      const ref = refObject.current;
      if (!ref) {
        console.log("No reference");
        return;
      }
      const rows = getRowInformation(rawMarkdown);
      const cursor = getCursorPosition(ref);
      console.log("Rows", rows);
      console.log("Cursor", cursor);
      console.log("Current rows", getCurrentRow(cursor, rows));
      console.log("-----END-----");
    },
    [rawMarkdown]
  );

  return { insertOrReplaceAtPosition, writeDebugInfoToConsole };
};

export default useEditorTools;
