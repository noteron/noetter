import React, { useMemo } from "react";
import { List, ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import { Note } from "@material-ui/icons";
import { FileDescription } from "../../hooks/use-file-reader";

type Props = {
  files: FileDescription[];
  openFileName: string | undefined;
  onItemClick: (fileName: string) => void;
};

const NotesList = ({
  files,
  openFileName,
  onItemClick
}: Props): JSX.Element => {
  const numberOfFiles = useMemo<number>(() => files.length, [files.length]);
  const memoizedFileList = useMemo<React.ReactNode>(
    () =>
      numberOfFiles ? (
        files.map((file) => (
          <ListItem
            button
            selected={openFileName === file.fileName}
            onClick={() => {
              onItemClick(file.fileName);
            }}
            key={file.fileName}
          >
            <ListItemText primary={file.title} />
          </ListItem>
        ))
      ) : (
        <ListItem disabled>No notes created</ListItem>
      ),
    [files, numberOfFiles, onItemClick, openFileName]
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
