import React, { useMemo, useContext } from "react";
import {
  createStyles,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  Theme
} from "@material-ui/core";
import { Note } from "@material-ui/icons";
import NoteManagementContext from "../note-management/contexts/note-management-context";
import { FileDescription } from "../note-management/note-management-types";
import { BackgroundColor } from "../../../colors";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: theme.palette.background.paper,
      height: "100%",
      display: "flex",
      flexDirection: "column",
      borderWidth: "0 1px 0 1px",
      borderStyle: "solid",
      borderColor: "black"
    },
    notesList: {
      overflowY: "auto",
      flex: 1,
      overflowX: "hidden",
      backgroundColor: BackgroundColor.notesList
    },
    title: {
      backgroundColor: BackgroundColor.toolbar,
      borderWidth: "0 0 1px 0",
      borderStyle: "solid",
      borderColor: "black"
    }
  })
);

const NotesList = (): JSX.Element => {
  const classes = useStyles();
  const { openNote, allAvailableNotes, currentNote, selectedTags } = useContext(
    NoteManagementContext
  );
  const numberOfFiles = useMemo<number>(() => allAvailableNotes?.length ?? 0, [
    allAvailableNotes?.length
  ]);
  const filteredFileList = useMemo<FileDescription[]>(() => {
    return (allAvailableNotes ?? []).filter((fileDescription) => {
      if (!selectedTags?.length) {
        return true;
      }
      return fileDescription.tags.some((tagString) => {
        const tagsList = tagString.split("/");
        let noMismatchFound = true;
        (selectedTags ?? []).forEach((selectedTag, index) => {
          if (!noMismatchFound) return;
          if (selectedTag !== tagsList[index]) {
            noMismatchFound = false;
          }
        });
        return noMismatchFound;
      });
    });
  }, [allAvailableNotes, selectedTags]);
  const memoizedFileList = useMemo<React.ReactNode>(
    () =>
      numberOfFiles ? (
        (filteredFileList ?? []).map((file) => (
          <ListItem
            button
            selected={
              currentNote?.fileDescription.fileNameWithoutExtension ===
              file.fileNameWithoutExtension
            }
            onClick={() => {
              if (openNote) openNote(file);
            }}
            key={file.fileNameWithoutExtension}
          >
            <ListItemText primary={file.title} />
          </ListItem>
        ))
      ) : (
        <ListItem disabled>No notes created</ListItem>
      ),
    [
      filteredFileList,
      currentNote?.fileDescription?.fileNameWithoutExtension,
      numberOfFiles,
      openNote
    ]
  );

  return (
    <div className={classes.root}>
      <List disablePadding className={classes.title}>
        <ListItem>
          <ListItemIcon>
            <Note />
          </ListItemIcon>
          <ListItemText primary={`Notes (${numberOfFiles})`} />
        </ListItem>
      </List>
      <List dense disablePadding className={classes.notesList}>
        {memoizedFileList}
      </List>
    </div>
  );
};

export default NotesList;
