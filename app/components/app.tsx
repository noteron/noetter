import React, { useState, useCallback } from "react";
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
import NotesList from "./features/notes-list";
import TagsTree from "./features/tags-tree";
import useDirectoryInitialization from "./hooks/use-directory-initialization";
import useNoteManagement, {
  NoteManagementContext
} from "./features/note-management";
import useEvents, { EventContext } from "./features/events";
import { GlobalEventType } from "./features/events/event-types";

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
  const events = useEvents();
  const noteManagement = useNoteManagement();
  const classes = useStyles();
  const [zenMode, setZenMode] = useState<boolean>(false);

  const toggleZenMode = useCallback(
    () =>
      setZenMode((prev: boolean) => {
        if (events.triggerEvent)
          events.triggerEvent(
            prev
              ? GlobalEventType.ZenModeDisabled
              : GlobalEventType.ZenModeEnabled
          );
        return !prev;
      }),
    []
  );

  const handleOnSave = useCallback(() => {
    if (!noteManagement.saveNote) return;
    noteManagement.saveNote();
  }, [noteManagement]);

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
    noteManagement.createNewNote
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
      <EventContext.Provider value={events}>
        <NoteManagementContext.Provider value={noteManagement}>
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
                  <TagsTree />
                </Grid>
              )}
              {!zenMode && (
                <Grid item xs={3} className={classes.item}>
                  <NotesList />
                </Grid>
              )}
              <Grid item xs={zenMode ? 12 : 7} className={classes.item}>
                <MarkdownEditor />
              </Grid>
            </Grid>
          </ThemeProvider>
        </NoteManagementContext.Provider>
      </EventContext.Provider>
    </>
  );
};
export default App;
