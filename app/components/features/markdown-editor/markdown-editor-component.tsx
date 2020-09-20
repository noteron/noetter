import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  useContext,
  useMemo
} from "react";
import { useTheme, makeStyles, Theme, createStyles } from "@material-ui/core";
import VerticalDisplaySection from "../../layout/vertical-display-section";
import useMarkdown from "../../hooks/use-markdown";
import useEditorTools from "./hooks/use-editor-tools";
import { InsertType, CursorPosition } from "./editor-types";
import useImageAttachments from "./hooks/use-image-attachments";
import NoteManagementContext from "../note-management/contexts/note-management-context";
import { DEFAULT_NOTE } from "../note-management/note-management-constants";
import useEventListener from "../events/hooks/use-event-listener";
import { GlobalEventType } from "../events/event-types";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    textArea: {
      border: "none",
      backgroundColor: theme.palette.background.paper,
      color: theme.palette.text.primary,
      height: "100%",
      width: "100%",
      fontFamily: "monospace",
      fontSize: 20,
      resize: "none",
      "&:focus": {
        outline: "none"
      }
    }
  })
);

const MarkdownEditorComponent = (): JSX.Element => {
  const theme = useTheme();
  const classes = useStyles(theme);
  const { currentNote, updateCurrentNote } = useContext(NoteManagementContext);
  const textArea = useRef<HTMLTextAreaElement>(null);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [needToSetFocus, setNeedToSetFocus] = useState<boolean>(false);
  const [lastCursorPosition, setLastCursorPosition] = useState<
    CursorPosition
  >();
  const { saveImageFromClipboard } = useImageAttachments();
  const {
    insertOrReplaceAtPosition,
    writeDebugInfoToConsole
  } = useEditorTools();

  const rawMarkdown = useMemo<string>(() => currentNote?.markdown ?? "", [
    currentNote?.markdown
  ]);
  const renderedMarkdown = useMarkdown(currentNote?.markdown ?? "");

  useEffect(() => {
    const ref = textArea.current;
    if (editMode && needToSetFocus && ref) {
      if (ref.ATTRIBUTE_NODE) ref.focus();
      const fallbackCursorPosition = rawMarkdown.length;
      ref.selectionStart = lastCursorPosition?.start ?? fallbackCursorPosition;
      ref.selectionEnd = lastCursorPosition?.end ?? fallbackCursorPosition;
      ref.selectionDirection =
        // eslint-disable-next-line no-nested-ternary
        lastCursorPosition?.isForwardSelection === undefined
          ? "none"
          : lastCursorPosition.isForwardSelection
          ? "forward"
          : "backward";
      setNeedToSetFocus(false);
    }
  }, [
    editMode,
    lastCursorPosition?.end,
    lastCursorPosition?.isForwardSelection,
    lastCursorPosition?.start,
    needToSetFocus,
    rawMarkdown.length
  ]);

  const updateLastCursorPosition = useCallback(() => {
    const ref = textArea.current;
    if (ref)
      setLastCursorPosition({
        start: ref.selectionStart,
        end: ref.selectionEnd,
        isForwardSelection: ref.selectionDirection === "forward",
        isSelection: ref.selectionDirection === "none"
      });
  }, []);

  const handleOnMarkdownUpdated = useCallback(
    (newMarkdown: string) => {
      if (!updateCurrentNote) return;
      updateLastCursorPosition();
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
      updateCurrentNote,
      updateLastCursorPosition
    ]
  );

  const handleOnToggleEditModeShortcut = useCallback(() => {
    setEditMode((prev: boolean) => !prev);
    setNeedToSetFocus(true);
  }, []);

  const handleOnInsertCheckboxShortcut = useCallback(() => {
    insertOrReplaceAtPosition(
      " - [ ] ",
      InsertType.RowStart,
      textArea,
      rawMarkdown,
      handleOnMarkdownUpdated
    );
  }, [handleOnMarkdownUpdated, insertOrReplaceAtPosition, rawMarkdown]);

  const handleOnDebugShortcut = useCallback(
    () => writeDebugInfoToConsole(textArea, rawMarkdown),
    [rawMarkdown, writeDebugInfoToConsole]
  );

  useEventListener(
    GlobalEventType.EditorToggleEditModeTrigger,
    handleOnToggleEditModeShortcut
  );
  useEventListener(
    GlobalEventType.EditorMakeRowIntoCheckboxTrigger,
    handleOnInsertCheckboxShortcut
  );
  useEventListener(
    GlobalEventType.EditorDebugConsoleTrigger,
    handleOnDebugShortcut
  );

  const handleOnTextAreaChanged = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>): void =>
      handleOnMarkdownUpdated(event.target.value),
    [handleOnMarkdownUpdated]
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

  return (
    <VerticalDisplaySection>
      {editMode ? (
        <textarea
          ref={textArea}
          draggable={false}
          className={classes.textArea}
          onChange={handleOnTextAreaChanged}
          value={rawMarkdown}
          onPaste={handleOnPaste}
          onKeyDown={updateLastCursorPosition}
        />
      ) : (
        renderedMarkdown
      )}
    </VerticalDisplaySection>
  );
};

export default MarkdownEditorComponent;
