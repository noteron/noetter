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
  createStyles
} from "@material-ui/core";
import MarkdownEditor from "./features/markdown-editor";
import useShortcut from "./hooks/use-shortcut";
import useFileReader, { FileDescription } from "./hooks/use-file-reader";
import NotesList from "./features/notes-list";
import TagsTree from "./features/tags-tree";
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
  const classes = useStyles();
  const { readFileAsync, getFileDescriptions } = useFileReader();
  const [zenMode, setZenMode] = useState<boolean>(false);
  const [fileList, setFileList] = useState<FileDescription[]>([]);
  const [currentNote, setCurrentNote] = useState<Note>({ content: "#" });
  const [selectedTags, setSelectedTags] = useState<string[]>();

  const filteredFileList = useMemo<FileDescription[]>(() => {
    return fileList.filter((fileDescription) => {
      if (!selectedTags) {
        return true;
      }
      return fileDescription.tags.some((tagString) => {
        const tagsList = tagString.split("/");
        let noMissmatchFound = true;
        selectedTags.forEach((selectedTag, index) => {
          if (!noMissmatchFound) return;
          if (selectedTag !== tagsList[index]) {
            noMissmatchFound = false;
          }
        });
        return noMissmatchFound;
      });
    });
  }, [fileList, selectedTags]);

  const toggleZenMode = useCallback(
    () => setZenMode((prev: boolean) => !prev),
    []
  );

  const openMarkdownFile = useCallback(
    async (fileName: string): Promise<void> => {
      const fileContent = await readFileAsync(fileName);
      setCurrentNote({ fileName, content: fileContent });
    },
    [readFileAsync]
  );

  const fetchFiles = useCallback(async (): Promise<void> => {
    const filesWithMetadata = await getFileDescriptions();

    setFileList(filesWithMetadata);

    if (filesWithMetadata.length) {
      openMarkdownFile(filesWithMetadata[0].fileName);
      const tagsList = filesWithMetadata[0].tags?.[0].split("/");
      setSelectedTags(tagsList);
    }
  }, [getFileDescriptions, openMarkdownFile]);

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
              <TagsTree
                files={fileList}
                selectedTags={selectedTags}
                onItemClick={setSelectedTags}
              />
            </Grid>
          )}
          {!zenMode && (
            <Grid item xs={3} className={classes.item}>
              <NotesList
                files={filteredFileList}
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
