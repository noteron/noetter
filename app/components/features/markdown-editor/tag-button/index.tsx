import {
  ClickAwayListener,
  Grow,
  IconButton,
  Paper,
  Popper,
  TextField,
  Tooltip
} from "@material-ui/core";
import { Label } from "@material-ui/icons";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import { NoteManagementContext } from "../../note-management";
import TagInput from "./tag-input";

type Props = {
  tags: string[] | undefined;
  onTagsUpdated: (newTags: string[] | undefined) => void;
  fileNameWithoutExtension: string | undefined;
};

const TagButton = ({
  tags,
  onTagsUpdated,
  fileNameWithoutExtension
}: Props): JSX.Element => {
  const { allAvailableNotes } = useContext(NoteManagementContext);

  const anchorRef = React.useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [tagsState, setTagsState] = useState<string[]>(tags ?? []);

  useEffect(() => setTagsState(tags ?? []), [tags]);

  const usedTagsFromOtherNotes = useMemo<string[]>(
    () =>
      Array.from<string>(
        new Set<string>(
          allAvailableNotes?.reduce<string[]>(
            (aggregate, current) =>
              current.fileNameWithoutExtension === fileNameWithoutExtension
                ? aggregate
                : [...aggregate, ...current.tags],
            []
          ) ?? []
        )
      ).sort(),
    [allAvailableNotes, fileNameWithoutExtension]
  );

  const handleOnClickLabel = useCallback(() => {
    setOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    onTagsUpdated(tagsState);
    setOpen(false);
  }, [onTagsUpdated, tagsState]);

  const memoizedTags = useMemo<JSX.Element[]>(
    () =>
      tags?.map((tag, index) => (
        <TagInput
          key={tag}
          editing={index === tags.length - 1}
          value={tag}
          options={usedTagsFromOtherNotes.filter(
            (tagFromOtherNote) => tagFromOtherNote !== tag
          )}
          onUpdate={(newValue: string) => {
            onTagsUpdated(
              tags?.reduce<string[]>((aggregate, current, currentIndex) => {
                const shouldReplaceCurrent = currentIndex === index;
                if (shouldReplaceCurrent) {
                  return newValue?.length
                    ? [...aggregate, newValue]
                    : aggregate;
                }
                return [...aggregate, current];
              }, [])
            );
            setOpen(false);
          }}
        />
      )) ?? [],
    [onTagsUpdated, tags, usedTagsFromOtherNotes]
  );

  return (
    <>
      <Tooltip title="Tags" aria-label="tags">
        <IconButton size="small" onClick={handleOnClickLabel} ref={anchorRef}>
          <Label />
        </IconButton>
      </Tooltip>
      {tags?.map((t) => (
        <TextField value={t} key={t} disabled />
      ))}
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
                <div>{memoizedTags}</div>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  );
};

export default TagButton;
