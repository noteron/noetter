import { createStyles, makeStyles, Theme, Tooltip } from "@material-ui/core";
import { Edit } from "@material-ui/icons";
import { ToggleButton } from "@material-ui/lab";
import React from "react";
import { BackgroundColor } from "../../../../colors";
import { CurrentNote } from "../../note-management/note-management-types";
import TagButton from "../tag-button";

type Props = {
  editMode: boolean | undefined;
  currentNote: CurrentNote | undefined;
  onToggleEditMode: () => void;
  onTagsUpdated: (newTags: string[] | undefined) => void;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      height: "49px",
      backgroundColor: BackgroundColor.toolbar,
      borderWidth: "0 0 1px 0",
      borderStyle: "solid",
      borderColor: BackgroundColor.border
    }
  })
);

const ToolbarComponent = ({
  editMode,
  currentNote,
  onToggleEditMode,
  onTagsUpdated
}: Props): JSX.Element => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Tooltip title="Toggle edit mode" aria-label="toggle edit mode">
        <ToggleButton
          size="small"
          onChange={onToggleEditMode}
          selected={editMode ?? false}
          value
        >
          <Edit />
        </ToggleButton>
      </Tooltip>
      <TagButton
        tags={currentNote?.fileDescription?.tags}
        fileNameWithoutExtension={
          currentNote?.fileDescription?.fileNameWithoutExtension
        }
        onTagsUpdated={onTagsUpdated}
      />
    </div>
  );
};

export default ToolbarComponent;
