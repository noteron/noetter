import {
  Button,
  ClickAwayListener,
  createStyles,
  Grow,
  makeStyles,
  Paper,
  Popper,
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
import { BackgroundColor } from "../../../../colors";
import { NoteManagementContext } from "../../note-management";
import TagInput from "./tag-input";

const useStyles = makeStyles(() =>
  createStyles({
    tagEditorContainer: {
      padding: 0,
      backgroundColor: BackgroundColor.popup,
      borderWidth: "1px 1px 1px 1px",
      borderColor: BackgroundColor.border,
      borderStyle: "solid",
      borderRadius: 0,
      width: 500
    }
  })
);

const useTagButton = (
  tags: string[] | undefined,
  onTagsUpdated: (newTags: string[] | undefined) => void,
  fileNameWithoutExtension: string | undefined
): JSX.Element[] => {
  const classes = useStyles();

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
          }}
        />
      )) ?? [],
    [onTagsUpdated, tags, usedTagsFromOtherNotes]
  );

  const handleOnEnterUp: React.KeyboardEventHandler<HTMLDivElement> = useCallback(
    (event) => {
      if (event.key !== "Enter") return;
      event.preventDefault();
      handleClose();
    },
    [handleClose]
  );

  return [
    <Tooltip title="Tags" aria-label="tags" key="tag-button-tooltip">
      <Button size="small" onClick={handleOnClickLabel} ref={anchorRef}>
        <Label />
      </Button>
    </Tooltip>,
    <Popper
      open={open}
      anchorEl={anchorRef.current}
      transition
      key="tag-button-popper"
    >
      {({ TransitionProps, placement }) => (
        <Grow
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...TransitionProps}
          style={{
            transformOrigin:
              placement === "bottom" ? "center top" : "center bottom"
          }}
        >
          <Paper className={classes.tagEditorContainer}>
            <ClickAwayListener onClickAway={handleClose}>
              <div onKeyUp={handleOnEnterUp}>{memoizedTags}</div>
            </ClickAwayListener>
          </Paper>
        </Grow>
      )}
    </Popper>
  ];
};
export default useTagButton;
