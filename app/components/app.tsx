import React, {
  useState,
  useCallback,
  useEffect,
  useMemo,
  useContext
} from "react";
import {
  ThemeProvider,
  createMuiTheme,
  CssBaseline,
  Grid,
  makeStyles,
  createStyles,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from "@material-ui/core";
import fs from "fs";
import path from "path";
import os from "os";
import FolderIcon from "@material-ui/icons/Folder";
import VerticalDisplaySection from "./layout/vertical-display-section";
import MarkdownEditor from "./features/markdown-editor";
import useShortcut from "./hooks/use-shortcut";
import FilePathContext from "./contexts/file-path-context";
import useDirectoryInitialization from "./hooks/use-directory-initialization";

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
      fontSize: 20,
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
  useDirectoryInitialization();
  const { notesFolderPath } = useContext(FilePathContext);
  const classes = useStyles();

  const [zenMode, setZenMode] = useState<boolean>(false);
  const [fileList, setFileList] = useState<string[]>([]);
  const [currentNote, setCurrentNote] = useState<Note>({ content: "#" });

  const toggleZenMode = useCallback(
    () => setZenMode((prev: boolean) => !prev),
    []
  );

  const openMarkdownFile = useCallback(
    (fileName: string): void => {
      const fileContent = fs.readFileSync(
        path.normalize(`${notesFolderPath}/${fileName}`),
        { encoding: "utf-8" }
      );
      setCurrentNote({ fileName, content: fileContent });
    },
    [notesFolderPath]
  );

  const fetchFiles = useCallback((): void => {
    const folderContent = fs.readdirSync(notesFolderPath);
    setFileList(folderContent);

    if (folderContent.length) {
      // open first file and read from it
      openMarkdownFile(folderContent[0]);
    }
  }, [notesFolderPath, openMarkdownFile]);

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

  const memoizedFileList = useMemo<React.ReactNode>(
    () =>
      fileList.length ? (
        fileList.map((fileName) => (
          <ListItem
            button
            selected={currentNote.fileName === fileName}
            onClick={() => {
              openMarkdownFile(fileName);
            }}
            key={fileName}
          >
            {fileName}
          </ListItem>
        ))
      ) : (
        <Typography>No files created</Typography>
      ),
    [currentNote.fileName, fileList, openMarkdownFile]
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
              <VerticalDisplaySection>
                <Typography>Tree goes here</Typography>
              </VerticalDisplaySection>
            </Grid>
          )}

          {!zenMode && (
            <Grid item xs={3} className={classes.item}>
              <List>
                <ListItem style={{ fontWeight: "bold" }}>
                  <ListItemIcon>
                    <FolderIcon />
                  </ListItemIcon>
                  <ListItemText primary={`Notes (${fileList.length})`} />
                </ListItem>
                {memoizedFileList}
              </List>
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
