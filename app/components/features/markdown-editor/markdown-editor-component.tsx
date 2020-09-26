import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  useContext,
  useMemo
} from "react";
import MonacoEditor, {
  ChangeHandler,
  EditorDidMount
} from "react-monaco-editor";
import * as monaco from "monaco-editor";
import VerticalDisplaySection from "../../layout/vertical-display-section";
import useMarkdown from "../../hooks/use-markdown";
import useEditorTools from "./hooks/use-editor-tools";
import { InsertType } from "./editor-types";
import useImageAttachments from "./hooks/use-image-attachments";
import NoteManagementContext from "../note-management/contexts/note-management-context";
import { DEFAULT_NOTE } from "../note-management/note-management-constants";
import { GlobalEventType } from "../events/event-types";
import { useEventListener } from "../events";
import useLocalStorageState from "../local-storage-state/use-local-storage-state";
import LocalStorageKeys from "../local-storage-state/local-storage-keys";

const uncheckedCheckboxRegex = /- (\[\]|\[ \])( )*/;
const checkedCheckboxRegex = /- \[(X|x)\] /;

const [FIRST_COLUMN, FIRST_LINE] = [1, 1];

const MarkdownEditorComponent = (): JSX.Element => {
  const { currentNote, updateCurrentNote } = useContext(NoteManagementContext);
  const textArea = useRef<HTMLTextAreaElement>(null);
  const [editMode, setEditMode] = useLocalStorageState<boolean>(
    LocalStorageKeys.EditorMode,
    false
  );
  const [queueFocus, setQueueFocus] = useState<boolean>(false);
  const [queueInsertCheckbox, setQueueInsertCheckbox] = useState<boolean>(
    false
  );
  const [cursorPosition, setCursorPosition] = useState<monaco.Position>();
  const { saveImageFromClipboard } = useImageAttachments();
  const {
    insertOrReplaceAtPosition,
    writeDebugInfoToConsole
  } = useEditorTools();
  const [editor, setEditor] = useState<monaco.editor.IStandaloneCodeEditor>();

  const rawMarkdown = useMemo<string>(() => currentNote?.markdown ?? "", [
    currentNote?.markdown
  ]);
  const renderedMarkdown = useMarkdown(currentNote?.markdown ?? "");

  useEffect(() => {
    if (!queueFocus || !editMode || !editor) return;
    if (!cursorPosition) {
      const layoutInfo = editor.getLayoutInfo();
      editor.setPosition({
        column: layoutInfo.contentWidth,
        lineNumber: layoutInfo.lineNumbersWidth
      });
    } else {
      editor.setPosition(cursorPosition);
    }
    editor.focus();
    setQueueFocus(false);
  }, [editMode, editor, queueFocus, cursorPosition, rawMarkdown.length]);

  useEffect(() => {
    if (!editMode) {
      setEditor(undefined);
    }
  }, [editMode]);

  const handleOnWindowResize = useCallback(
    (ev) => {
      if (editor) {
        editor.layout();
      }
    },
    [editor]
  );

  useEffect(() => {
    window.addEventListener("resize", handleOnWindowResize);
    return () => {
      window.removeEventListener("resize", handleOnWindowResize);
    };
  }, [handleOnWindowResize]);

  const handleOnMarkdownUpdated = useCallback(
    (newMarkdown: string) => {
      if (!updateCurrentNote) return;
      updateCurrentNote({
        markdown: newMarkdown,
        fileDescription: {
          created:
            currentNote?.fileDescription.created ??
            DEFAULT_NOTE.fileDescription.created,
          modified: Date.now(),
          fileExists: currentNote?.fileDescription.fileExists ?? true,
          fileNameWithoutExtension:
            currentNote?.fileDescription.fileNameWithoutExtension ??
            DEFAULT_NOTE.fileDescription.fileNameWithoutExtension,
          tags:
            currentNote?.fileDescription.tags ??
            DEFAULT_NOTE.fileDescription.tags,
          title:
            currentNote?.fileDescription.title ??
            DEFAULT_NOTE.fileDescription.title
        }
      });
    },
    [
      currentNote?.fileDescription.created,
      currentNote?.fileDescription.fileExists,
      currentNote?.fileDescription.fileNameWithoutExtension,
      currentNote?.fileDescription.tags,
      currentNote?.fileDescription.title,
      updateCurrentNote
    ]
  );

  const handleOnInsertCheckboxShortcut = useCallback(() => {
    const model = editor?.getModel();
    if (!editor || !model) return;
    const uncheckedCheckbox = "- [ ] ";
    const checkedCheckbox = "- [x] ";
    const selection = editor.getSelection();
    const unmodifiedLine = model.getLineContent(
      selection?.selectionStartLineNumber ?? FIRST_LINE
    );
    const uncheckedCheckboxMatch = unmodifiedLine?.match(
      uncheckedCheckboxRegex
    );
    const checkedCheckboxMatch = unmodifiedLine?.match(checkedCheckboxRegex);
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
      const updatedLine = `${lineIndentation}${uncheckedCheckbox}${lineContent}`;
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
        uncheckedCheckboxRegex,
        checkedCheckbox
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
        checkedCheckboxRegex,
        uncheckedCheckbox
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
  }, [editor]);

  const handleOnDebugShortcut = useCallback(
    () => writeDebugInfoToConsole(textArea, rawMarkdown),
    [rawMarkdown, writeDebugInfoToConsole]
  );

  const handleToggleEditMode = useCallback(() => {
    setEditMode(editMode === undefined ? false : !editMode);
    setQueueFocus(true);
  }, [editMode, setEditMode]);

  useEventListener(
    GlobalEventType.EditorToggleEditModeTrigger,
    handleToggleEditMode
  );

  useEffect(() => {
    if (!queueInsertCheckbox) return;
    handleOnInsertCheckboxShortcut();
    setQueueInsertCheckbox(false);
  }, [handleOnInsertCheckboxShortcut, queueInsertCheckbox]);

  const handleMakeRowIntoCheckbox = useCallback(
    () => setQueueInsertCheckbox(true),
    []
  );
  useEventListener(
    GlobalEventType.EditorMakeRowIntoCheckboxTrigger,
    handleMakeRowIntoCheckbox
  );

  useEventListener(
    GlobalEventType.EditorDebugConsoleTrigger,
    handleOnDebugShortcut
  );

  const handleOnPaste = useCallback(
    async (event: React.ClipboardEvent<HTMLTextAreaElement>): Promise<void> => {
      const markdownLinkToImage = await saveImageFromClipboard(event);
      insertOrReplaceAtPosition(
        markdownLinkToImage,
        InsertType.ReplaceSelection,
        textArea,
        rawMarkdown,
        handleOnMarkdownUpdated
      );
    },
    [
      handleOnMarkdownUpdated,
      insertOrReplaceAtPosition,
      rawMarkdown,
      saveImageFromClipboard
    ]
  );

  const handleEditorDidMount: EditorDidMount = useCallback(
    (reference: monaco.editor.IStandaloneCodeEditor) => {
      setEditor(reference);
    },
    []
  );

  const handleOnChangeEditor: ChangeHandler = useCallback(
    (value) => {
      handleOnMarkdownUpdated(value);
    },
    [handleOnMarkdownUpdated]
  );

  const applyUpdateCursorPositionHandler = useCallback(() => {
    if (!editor) return;
    editor.onDidChangeCursorPosition((e) => {
      const position = editor.getPosition();
      setCursorPosition(position ?? undefined);
    });
  }, [editor]);

  useEffect(applyUpdateCursorPositionHandler, [
    applyUpdateCursorPositionHandler
  ]);

  return editMode ? (
    <MonacoEditor
      theme="vs-dark"
      language="markdown"
      value={rawMarkdown}
      onChange={handleOnChangeEditor}
      editorDidMount={handleEditorDidMount}
    />
  ) : (
    <VerticalDisplaySection>{renderedMarkdown}</VerticalDisplaySection>
  );
};

export default MarkdownEditorComponent;
