import React, { useState, useCallback, useEffect } from "react";
import {
  ThemeProvider,
  createMuiTheme,
  CssBaseline,
  Grid,
  makeStyles,
  createStyles,
  Typography
} from "@material-ui/core";
import VerticalDisplaySection from "./layout/vertical-display-section";
import MarkdownEditor from "./features/markdown-editor";
import useShortcut from "./hooks/use-shortcut";
import useFileReader, { FileDescription } from "./hooks/use-file-reader";
import NotesList from "./features/notes-list";
import TagsTree from "./features/tags-tree";

const darkTheme = createMuiTheme({
  palette: {
    type: "dark",
    primary: {
      main: "#a1887f"
    },
    secondary: {
      main: "#e2812d"
    }
  }
});

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      flexGrow: 1,
      width: "100%",
      margin: 0,
      maxHeight: "100vh",
      height: "100%",
      overflowX: "hidden",
      overflowY: "hidden",
      fontFamily: "Roboto"
    },
    item: {
      padding: 0,
      flexGrow: 1,
      height: "100vh"
    }
  })
);

export type Note = {
  content: string;
  fileName?: string;
};

const App = (): JSX.Element => {
  const classes = useStyles();
  const {
    readFileSync,
    readDirectorySync,
    readFileMetadataAsync
  } = useFileReader();
  const [zenMode, setZenMode] = useState<boolean>(false);
  const [fileList, setFileList] = useState<FileDescription[]>([]);
  const [currentNote, setCurrentNote] = useState<Note>({ content: "#" });

  const toggleZenMode = useCallback(
    () => setZenMode((prev: boolean) => !prev),
    []
  );

  const openMarkdownFile = useCallback(
    (fileName: string): void => {
      const fileContent = readFileSync(fileName);
      setCurrentNote({ fileName, content: fileContent });
    },
    [readFileSync]
  );

  const fetchFiles = useCallback(async (): Promise<void> => {
    const folderContent = readDirectorySync();

    const filesWithMetadata = await Promise.all(
      folderContent.map(readFileMetadataAsync)
    );

    setFileList(filesWithMetadata);

    if (folderContent.length) {
      openMarkdownFile(folderContent[0]);
    }
  }, [openMarkdownFile, readDirectorySync, readFileMetadataAsync]);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  useShortcut(
    {
      altKey: true,
      ctrlKey: true,
      key: "z"
    },
    toggleZenMode
  );

  return (
    <>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Grid
          container
          justify="center"
          direction="row"
          className={classes.root}
        >
          {!zenMode && (
            <Grid item xs={2} className={classes.item}>
              <TagsTree files={fileList} />
            </Grid>
          )}
          {!zenMode && (
            <Grid item xs={3} className={classes.item}>
              <NotesList
                files={fileList}
                openFileName={currentNote.fileName}
                onItemClick={openMarkdownFile}
              />
            </Grid>
          )}
          <Grid item xs={zenMode ? 12 : 7} className={classes.item}>
            <MarkdownEditor
              rawMarkdown={currentNote.content}
              onChange={(value) => {
                setCurrentNote((prev) => ({ ...prev, content: value }));
              }}
            />
          </Grid>
        </Grid>
      </ThemeProvider>
    </>
  );
};
export default App;
