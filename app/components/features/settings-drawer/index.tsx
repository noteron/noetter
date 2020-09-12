import React, { useCallback, useState, useMemo } from "react";
import {
  Drawer,
  Typography,
  TextField,
  makeStyles,
  createStyles,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from "@material-ui/core";
import { UseSettingsReturnProps } from "../../hooks/use-settings";

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      width: "450px",
      padding: 16
    }
  })
);

type Props = {
  settings: UseSettingsReturnProps;
};

const SettingsDrawer = ({ settings }: Props): JSX.Element => {
  const classes = useStyles();

  const [rootPathState, setRootPathState] = useState<string>(
    settings.rootFolderPath
  );
  const [showMigrationDialog, setShowMigrationDialog] = useState<boolean>(
    false
  );

  const handleOnClose = useCallback(() => {
    setRootPathState(settings.rootFolderPath);
    settings.onClose();
  }, [settings]);

  const handleOnChangeRootPath: React.ChangeEventHandler<
    HTMLTextAreaElement | HTMLInputElement
  > = useCallback((event) => {
    setRootPathState(event.target.value);
  }, []);

  const invalidSaveState = useMemo<boolean>(
    () => !rootPathState.length || rootPathState === settings.rootFolderPath,
    [rootPathState, settings.rootFolderPath]
  );

  const handleOnClickSave = useCallback(() => {
    setShowMigrationDialog(true);
  }, []);

  const handleOnCloseMigrationDialog = useCallback(() => {
    setShowMigrationDialog(false);
  }, []);

  /* TODO:
  // Move styles to useStyles statement
  // Implement detecting feasible folder
  //    check if exists
  //    otherwise try to create
  // Implement changing folder
  // Implement migrating data
  */

  return (
    <Drawer
      classes={{ paper: classes.root }}
      className={classes.root}
      anchor="right"
      open={settings.open}
      onClose={handleOnClose}
    >
      <Typography variant="h5" style={{ marginBottom: 24 }}>
        Settings
      </Typography>
      <TextField
        required
        label="Root folder"
        value={rootPathState}
        onChange={handleOnChangeRootPath}
      />
      <Typography variant="caption" style={{ marginTop: 5 }}>
        Notes and attachments will be stored in separate subfolders
      </Typography>
      <Button
        variant="contained"
        disabled={invalidSaveState}
        onClick={handleOnClickSave}
        style={{ marginTop: 24 }}
      >
        Save
      </Button>
      <Dialog open={showMigrationDialog} onClose={handleOnCloseMigrationDialog}>
        <DialogTitle>Migrate existing data?</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            You can move your existing notes to the new folder. Otherwise any
            existing files in the new folder will be used instead.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleOnCloseMigrationDialog} color="primary">
            Keep old files
          </Button>
          <Button
            onClick={handleOnCloseMigrationDialog}
            color="primary"
            autoFocus
          >
            Move old files
          </Button>
        </DialogActions>
      </Dialog>
    </Drawer>
  );
};

export default SettingsDrawer;
