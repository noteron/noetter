import {
  Button,
  ButtonGroup,
  createStyles,
  makeStyles,
  Theme,
  Tooltip
} from "@material-ui/core";
import { DeleteForever, Edit } from "@material-ui/icons";
import { ToggleButton } from "@material-ui/lab";
import React, { useCallback, useContext } from "react";
import { BackgroundColor } from "../../../../colors";
import { NoteManagementContext } from "../../note-management";
import { CurrentNote } from "../../note-management/note-management-types";
import useTagButton from "../tag-button/use-tag-button";

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
      borderColor: BackgroundColor.border,
      flexDirection: "column",
      display: "flex",
      justifyContent: "center"
    },
    buttonGroupsContainer: {
      marginLeft: theme.spacing(2),
      display: "flex",
      flexDirection: "row",
      justifyContent: "flex-start"
    },
    buttonGroup: {
      marginRight: theme.spacing(3)
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
  const tagButtonElements = useTagButton(
    currentNote?.fileDescription?.tags,
    onTagsUpdated,
    currentNote?.fileDescription?.fileNameWithoutExtension
  );
  const { deleteCurrentNote } = useContext(NoteManagementContext);

  const handleOnDelete = useCallback(
    () => deleteCurrentNote?.().then(() => {}),
    [deleteCurrentNote]
  );

  return (
    <div className={classes.root}>
      <div className={classes.buttonGroupsContainer}>
        <ButtonGroup className={classes.buttonGroup}>
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
          {tagButtonElements}
        </ButtonGroup>
        <ButtonGroup color="secondary" className={classes.buttonGroup}>
          <Tooltip title="Delete forever" aria-label="tags">
            <Button size="small" onClick={handleOnDelete}>
              <DeleteForever />
            </Button>
          </Tooltip>
        </ButtonGroup>
      </div>
    </div>
  );
};

export default ToolbarComponent;
