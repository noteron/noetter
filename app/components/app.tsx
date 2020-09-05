import React, { useState, useCallback, useEffect, useMemo } from "react";
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
import readline from "readline";
import FolderIcon from "@material-ui/icons/Folder";
import VerticalDisplaySection from "./layout/vertical-display-section";
import MarkdownEditor from "./features/markdown-editor";
import useShortcut from "./hooks/use-shortcut";

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

type FileDescription = {
  fileName: string;
  title: string;
  tags: string[];
  created: number;
  modified: number;
};

const App = (): JSX.Element => {
  const classes = useStyles();
  const [zenMode, setZenMode] = useState<boolean>(false);
  const [fileList, setFileList] = useState<FileDescription[]>([]);
  const [currentNote, setCurrentNote] = useState<Note>({ content: "#" });

  const homeDir = useMemo<string>(() => os.homedir(), []);
  const folderPath = useMemo<string>(
    () => path.normalize(`${homeDir}/.notes`),
    [homeDir]
  );

  const toggleZenMode = useCallback(
    () => setZenMode((prev: boolean) => !prev),
    []
  );

  const openMarkdownFile = useCallback(
    (fileName: string): void => {
      const fileContent = fs.readFileSync(
        path.normalize(`${folderPath}/${fileName}`),
        { encoding: "utf-8" }
      );
      setCurrentNote({ fileName, content: fileContent });
    },
    [folderPath]
  );

  const fetchFiles = useCallback(async (): Promise<void> => {
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
    }
    const folderContent = fs.readdirSync(folderPath);

    const filesWithMetadata = await Promise.all(
      folderContent.map(
        async (fileName: string): Promise<FileDescription> =>
          new Promise<FileDescription>((resolve) => {
            let readRowCount = 0;
            const rowsToRead = 5;

            const readStream = fs.createReadStream(
              path.normalize(`${folderPath}/${fileName}`)
            );
            const reader = readline.createInterface({
              input: readStream
            });
            let title = "";
            let tags: string[] = [];
            let created: number;
            let modified: number;

            reader.on("line", (line: string) => {
              readRowCount += 1;
              // TODO: Prevent reader from reading entire file if possible
              // console.log(
              //   "reader.on(line) callback, read rows: ",
              //   readRowCount
              // );

              if (line.startsWith("tags: ")) {
                tags = line
                  .replace("tags: [", "")
                  .replaceAll("]", "")
                  .split(",");
              }
              if (line.startsWith("title: ")) {
                title = line.replace("title: ", "");
              }
              if (line.startsWith("created: ")) {
                created = Date.parse(
                  line.replace("created: ", "").replaceAll("'", "")
                );
              }
              if (line.startsWith("modified: ")) {
                modified = Date.parse(
                  line.replace("modified: ", "").replaceAll("'", "")
                );
              }

              if (readRowCount === rowsToRead) {
                reader.close();
                readStream.destroy();
                resolve({
                  fileName,
                  title,
                  tags,
                  created,
                  modified
                });
              }
            });
          })
      )
    );

    setFileList(filesWithMetadata);

    if (folderContent.length) {
      openMarkdownFile(folderContent[0]);
    }
  }, [folderPath, openMarkdownFile]);

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
        fileList.map((file) => (
          <ListItem
            button
            selected={currentNote.fileName === file.fileName}
            onClick={() => {
              openMarkdownFile(file.fileName);
            }}
            key={file.fileName}
          >
            <ListItemText
              primary={file.title}
              secondary={file.tags.join(" & ")}
            />
          </ListItem>
        ))
      ) : (
        <ListItem disabled>No notes created</ListItem>
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
