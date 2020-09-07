import React, { useState, useCallback, useRef, useEffect } from "react";
import { useTheme, makeStyles, Theme, createStyles } from "@material-ui/core";
import VerticalDisplaySection from "../../layout/vertical-display-section";
import useMarkdown from "../../hooks/use-markdown";
import useShortcut from "../../hooks/use-shortcut";
import useEditorTools from "./hooks/use-editor-tools";
import { InsertType } from "./types";
import useImageAttachments from "./hooks/use-image-attachments";

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

type Props = {
  rawMarkdown: string;
  onChange: (value: string) => void;
};

const MarkdownEditorComponent = ({
  rawMarkdown,
  onChange
}: Props): JSX.Element => {
  const theme = useTheme();
  const classes = useStyles(theme);
  const renderedMarkdown = useMarkdown(rawMarkdown);
  const textArea = useRef<HTMLTextAreaElement>(null);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [imageString, setImageString] = useState<string>();
  const { transformImages, clipboardContainsImage } = useImageAttachments();

  useEffect(() => {
    const ref = textArea.current;
    if (editMode && ref) {
      ref.focus();
      const wantedCursorPosition = rawMarkdown.length;
      ref.selectionStart = wantedCursorPosition;
      ref.selectionEnd = wantedCursorPosition;
    }
  }, [editMode, rawMarkdown]);

  const handleOnMarkdownUpdated = useCallback(
    (newMarkdown: string) => onChange(newMarkdown),
    [onChange]
  );

  const { insertOrReplaceAtPosition, writeDebugInfoToConsole } = useEditorTools(
    rawMarkdown,
    handleOnMarkdownUpdated
  );

  const handleOnToggleEditModeShortcut = useCallback(
    () => setEditMode((prev: boolean) => !prev),
    []
  );

  const handleOnInsertCheckboxShortcut = useCallback(() => {
    insertOrReplaceAtPosition(" - [ ] ", InsertType.RowStart, textArea);
  }, [insertOrReplaceAtPosition]);

  const handleOnDebugShortcut = useCallback(
    () => writeDebugInfoToConsole(textArea),
    [writeDebugInfoToConsole]
  );

  useShortcut(
    {
      altKey: false,
      ctrlKey: true,
      key: "e"
    },
    handleOnToggleEditModeShortcut
  );

  useShortcut(
    {
      altKey: true,
      ctrlKey: false,
      key: "d"
    },
    handleOnInsertCheckboxShortcut
  );

  useShortcut(
    {
      altKey: true,
      ctrlKey: false,
      key: "s"
    },
    handleOnDebugShortcut
  );

  const handleOnChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>): void =>
      onChange(event.target.value),
    [onChange]
  );

  const handleOnPaste = useCallback(
    (event: React.ClipboardEvent<HTMLTextAreaElement>): void => {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions

      if (
        event.clipboardData &&
        event.clipboardData.items.length > 0 &&
        clipboardContainsImage(event.clipboardData)
      ) {
        // event.preventDefault();
        transformImages(event.clipboardData);
        return;
      }
      console.log("There was no image pasted");
    },
    [clipboardContainsImage, transformImages]
  );

  return (
    <VerticalDisplaySection>
      {imageString && <img src={imageString} alt="hello" />}
      {editMode ? (
        <textarea
          ref={textArea}
          draggable={false}
          className={classes.textArea}
          onChange={handleOnChange}
          value={rawMarkdown}
          onPaste={handleOnPaste}
        />
      ) : (
        renderedMarkdown
      )}
    </VerticalDisplaySection>
  );
};

export default MarkdownEditorComponent;
