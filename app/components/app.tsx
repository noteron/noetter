import React, { useState, useCallback, useEffect, useMemo } from "react";
import {
  ThemeProvider,
  createMuiTheme,
  CssBaseline,
  makeStyles,
  createStyles,
  Grid
} from "@material-ui/core";
import MarkdownEditor from "./features/markdown-editor";
import useShortcut from "./hooks/use-shortcut";
import useFileReader, { FileDescription } from "./hooks/use-file-reader";
import NotesList from "./features/notes-list";
import TagsTree from "./features/tags-tree";
import useDirectoryInitialization from "./hooks/use-directory-initialization";
import useFileWriter from "./hooks/use-file-writer";

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

const getNewNoteTemplate = (): Note => ({
  content: `---
title: Untitled
pinned: false
tags: [Untagged]
---

# Untitled`
});

const App = (): JSX.Element => {
  useDirectoryInitialization();
  const classes = useStyles();
  const { readFileAsync, getFileDescriptions } = useFileReader();
  const { saveNewFile, saveExistingFile } = useFileWriter();
  const [zenMode, setZenMode] = useState<boolean>(false);
  const [fileList, setFileList] = useState<FileDescription[]>([]);
  const [currentNote, setCurrentNote] = useState<Note>(getNewNoteTemplate());
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

  const createNewFile = useCallback((): void => {
    setCurrentNote(getNewNoteTemplate());
  }, []);

  const handleOnSave = useCallback(async () => {
    if (currentNote.fileName) {
      await saveExistingFile(currentNote.content, currentNote.fileName);
    }
    const fileName = await saveNewFile(currentNote.content);
    setCurrentNote((prev: Note): Note => ({ ...prev, fileName }));
    fetchFiles();
  }, [
    currentNote.content,
    currentNote.fileName,
    fetchFiles,
    saveExistingFile,
    saveNewFile
  ]);

  useShortcut(
    {
      altKey: true,
      ctrlKey: true,
      key: "z"
    },
    toggleZenMode
  );

  useShortcut(
    {
      altKey: false,
      ctrlKey: true,
      key: "n"
    },
    createNewFile
  );
  useShortcut(
    {
      altKey: false,
      ctrlKey: true,
      key: "s"
    },
    handleOnSave
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
