import {
  ClickAwayListener,
  Grow,
  IconButton,
  MenuItem,
  Paper,
  Popper,
  TextField,
  Tooltip
} from "@material-ui/core";
import { Label } from "@material-ui/icons";
import { Autocomplete } from "@material-ui/lab";
import React, { useCallback, useState } from "react";

type Props = {
  tags: string[] | undefined;
  onTagsUpdated: (newTags: string[] | undefined) => void;
};

const TagButton = ({ tags, onTagsUpdated }: Props): JSX.Element => {
  const anchorRef = React.useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [tagsState, setTagsState] = useState<string[]>(tags ?? []);

  const handleOnClickLabel = useCallback(() => {
    setOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    onTagsUpdated(tagsState);
    setOpen(false);
  }, [onTagsUpdated, tagsState]);

  const handleOnChange = useCallback((event, value, reason, details) => {
    console.log(event, value, reason, details);
    setTagsState([value]);
  }, []);

  return (
    <>
      <Tooltip title="Tags" aria-label="tags">
        <IconButton size="small" onClick={handleOnClickLabel} ref={anchorRef}>
          <Label />
        </IconButton>
      </Tooltip>
      <Popper open={open} anchorEl={anchorRef.current} transition>
        {({ TransitionProps, placement }) => (
          <Grow
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === "bottom" ? "center top" : "center bottom"
            }}
          >
            <Paper style={{ width: 300 }}>
              <ClickAwayListener onClickAway={handleClose}>
                <div>
                  {tags?.map((tag, index) => {
                    if (index === tags.length - 1) {
                      return (
                        <Autocomplete
                          key={tag}
                          freeSolo
                          options={["asd", "asd/asdasd", "hej/hejhå"]} // TODO: Add all existing tags here
                          renderInput={(params) => (
                            <TextField
                              // eslint-disable-next-line react/jsx-props-no-spreading
                              {...params}
                              margin="normal"
                              variant="standard"
                              autoFocus
                            />
                          )}
                          value={tag}
                          onChange={handleOnChange}
                        />
                      );
                    }
                    return <MenuItem key={tag}>{tag}</MenuItem>;
                  })}
                </div>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  );
};

export default TagButton;
