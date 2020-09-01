import React, { useState, useCallback } from "react";
import {
  TextareaAutosize,
  useTheme,
  makeStyles,
  Theme,
  createStyles
} from "@material-ui/core";
import VerticalDisplaySection from "../../layout/vertical-display-section";
import useMarkdown from "../../hooks/use-markdown";
import useShortcut from "../../hooks/use-shortcut";
import "fontsource-roboto";

const inputMarkdown = `# Weow
## Live editing is working fine

- Some
  - Bullet
    - Points

 1. And
 1. some
   1. numbers

\`\`\`
monospace
\`\`\`

Inline \`monospace\` test

<div>
 How about some html?
<div>
<img src="http://http.cat/404" height="100px"/>
`;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    textArea: {
      border: "none",
      backgroundColor: theme.palette.background.paper,
      color: theme.palette.text.primary,
      height: "100%",
      width: "100%",
      fontFamily: "monospace",
      fontSize: 18
    }
  })
);

const MarkdownEditorComponent = (): JSX.Element => {
  const theme = useTheme();
  const classes = useStyles(theme);
  const [rawMarkdown, setRawMarkdown] = useState<string>(inputMarkdown);
  const renderedMarkdown = useMarkdown(rawMarkdown);
  const [editMode, setEditMode] = useState<boolean>(false);

  const toggleEditMode = useCallback(
    () => setEditMode((prev: boolean) => !prev),
    []
  );

  useShortcut(
    {
      altKey: false,
      ctrlKey: true,
      key: "e"
    },
    toggleEditMode
  );

  const handleOnChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>): void =>
      setRawMarkdown(event.target.value),
    []
  );

  return (
    <VerticalDisplaySection>
      {editMode ? (
        <TextareaAutosize
          autoFocus
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
