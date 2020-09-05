import React, { useState, useCallback, useRef } from "react";
import { useTheme, makeStyles, Theme, createStyles } from "@material-ui/core";
import VerticalDisplaySection from "../../layout/vertical-display-section";
import useMarkdown from "../../hooks/use-markdown";
import useShortcut from "../../hooks/use-shortcut";
import useEditorTools from "./hooks/use-editor-tools";
import { InsertType } from "./types";

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

  return (
    <VerticalDisplaySection>
      {editMode ? (
        <textarea
          ref={textArea}
          draggable={false}
          className={classes.textArea}
          onChange={handleOnChange}
          value={rawMarkdown}
        />
      ) : (
        renderedMarkdown
      )}
    </VerticalDisplaySection>
  );
};

export default MarkdownEditorComponent;
