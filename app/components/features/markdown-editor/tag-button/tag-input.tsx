import Autocomplete, {
  AutocompleteRenderInputParams
} from "@material-ui/lab/Autocomplete";
import {
  createStyles,
  makeStyles,
  MenuItem,
  TextField
} from "@material-ui/core";
import React, { useCallback } from "react";
import { BackgroundColor } from "../../../../colors";

type Props = {
  editing: boolean;
  value: string;
  onUpdate: (newTag: string) => void;
  options: string[];
};

const useStyles = makeStyles(() =>
  createStyles({
    tagAutocompleteContainer: {
      padding: 0,
      backgroundColor: BackgroundColor.popup,
      borderRadius: 0,
      margin: 0
    },
    popperDisablePortal: {
      position: "relative"
    }
  })
);

const TagInput = ({
  editing,
  value,
  onUpdate,
  options
}: Props): JSX.Element => {
  const classes = useStyles();
  const handleOnChangeAutocomplete = useCallback(
    (
      // eslint-disable-next-line @typescript-eslint/ban-types
      _: React.ChangeEvent<{}>,
      newValue: string | null
    ) => {
      onUpdate(newValue ?? "");
    },
    [onUpdate]
  );

  return editing ? (
    <Autocomplete
      freeSolo
      options={options}
      renderInput={(params: AutocompleteRenderInputParams) => (
        <TextField
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...params}
          margin="normal"
          variant="standard"
          autoFocus
        />
      )}
      value={value}
      onChange={handleOnChangeAutocomplete}
      disableCloseOnSelect
      disablePortal
      classes={{
        paper: classes.tagAutocompleteContainer,
        popperDisablePortal: classes.popperDisablePortal
      }}
    />
  ) : (
    <MenuItem>{value}</MenuItem>
  );
};

export default TagInput;
