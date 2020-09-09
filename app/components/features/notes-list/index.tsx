import React, { useMemo, useContext } from "react";
import { List, ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import { Note } from "@material-ui/icons";
import { FileDescription } from "../../hooks/use-file-reader";
import NoteManagementContext from "../../contexts/note-management-context";

type Props = {
  files: FileDescription[];
  openFileName: string | undefined;
};

const NotesList = ({ files, openFileName }: Props): JSX.Element => {
  const { openNote } = useContext(NoteManagementContext);
  const numberOfFiles = useMemo<number>(() => files.length, [files.length]);
  const memoizedFileList = useMemo<React.ReactNode>(
    () =>
      numberOfFiles ? (
        files.map((file) => (
          <ListItem
            button
            selected={openFileName === file.fileName}
            onClick={() => {
              if (openNote) openNote(file);
            }}
            key={file.fileName}
          >
            <ListItemText primary={file.title} />
          </ListItem>
        ))
      ) : (
        <ListItem disabled>No notes created</ListItem>
      ),
    [files, numberOfFiles, openFileName, openNote]
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
