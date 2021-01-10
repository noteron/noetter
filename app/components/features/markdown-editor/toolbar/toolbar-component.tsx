import { Tooltip } from "@material-ui/core";
import { Edit } from "@material-ui/icons";
import { ToggleButton } from "@material-ui/lab";
import React from "react";
import { CurrentNote } from "../../note-management/note-management-types";
import TagButton from "../tag-button";

type Props = {
  editMode: boolean | undefined;
  currentNote: CurrentNote | undefined;
  onToggleEditMode: () => void;
  onTagsUpdated: (newTags: string[] | undefined) => void;
};

const ToolbarComponent = ({
  editMode,
  currentNote,
  onToggleEditMode,
  onTagsUpdated
}: Props): JSX.Element => {
  return (
    <div>
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
