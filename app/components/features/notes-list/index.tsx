import React, { useMemo, useContext } from "react";
import { List, ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import { Note } from "@material-ui/icons";
import NoteManagementContext from "../note-management/contexts/note-management-context";
import { FileDescription } from "../note-management/note-management-types";

const NotesList = (): JSX.Element => {
  const { openNote, allAvailableNotes, currentNote, selectedTags } = useContext(
    NoteManagementContext
  );
  const numberOfFiles = useMemo<number>(() => allAvailableNotes?.length ?? 0, [
    allAvailableNotes?.length
  ]);
  const filteredFileList = useMemo<FileDescription[]>(() => {
    return (allAvailableNotes ?? []).filter((fileDescription) => {
      if (!selectedTags) {
        return true;
      }
      return fileDescription.tags.some((tagString) => {
        const tagsList = tagString.split("/");
        let noMissmatchFound = true;
        (selectedTags ?? []).forEach((selectedTag, index) => {
          if (!noMissmatchFound) return;
          if (selectedTag !== tagsList[index]) {
            noMissmatchFound = false;
          }
        });
        return noMissmatchFound;
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
    <List>
      <ListItem dense>
        <ListItemIcon>
          <Note />
        </ListItemIcon>
        <ListItemText primary={`Notes (${numberOfFiles})`} />
      </ListItem>
      {memoizedFileList}
    </List>
  );
};

export default NotesList;
