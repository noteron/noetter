import Autocomplete, {
  AutocompleteRenderInputParams
} from "@material-ui/lab/Autocomplete";
import { MenuItem, TextField } from "@material-ui/core";
import React, { useCallback } from "react";

type Props = {
  editing: boolean;
  value: string;
  onUpdate: (newTag: string) => void;
  options: string[];
};

const TagInput = ({
  editing,
  value,
  onUpdate,
  options
}: Props): JSX.Element => {
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
    />
  ) : (
    <MenuItem>{value}</MenuItem>
  );
};

export default TagInput;
