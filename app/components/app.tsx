import React from "react";
import {
  ThemeProvider,
  createMuiTheme,
  CssBaseline,
  makeStyles,
  createStyles,
  Grid
} from "@material-ui/core";
import MarkdownEditor from "./features/markdown-editor";
import NotesList from "./features/notes-list";
import TagsTree from "./features/tags-tree";
import useDirectoryInitialization from "./hooks/use-directory-initialization";
import SettingsDrawer from "./features/settings-drawer";
import useSettings from "./hooks/use-settings";
import useNoteManagement, {
  NoteManagementContext
} from "./features/note-management";
import useEvents, { EventContext } from "./features/events";
import useZenMode from "./hooks/use-zen-mode";
import useKeyboardShortcuts from "./features/keyboard-shortcuts";

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
  const noteManagement = useNoteManagement(events);
  const classes = useStyles();
  const zenMode = useZenMode(events);
  const settings = useSettings();
  useKeyboardShortcuts(events);

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
                  <TagsTree onSettingsClick={settings.onOpen} />
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
            <SettingsDrawer settings={settings} />
          </ThemeProvider>
        </NoteManagementContext.Provider>
      </EventContext.Provider>
    </>
  );
};
export default App;
