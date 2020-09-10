import React, { useCallback, useState } from "react";
import {
  Drawer,
  Typography,
  TextField,
  makeStyles,
  createStyles,
  Button
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

  const handleOnChangeRootPath: React.ChangeEventHandler<
    HTMLTextAreaElement | HTMLInputElement
  > = useCallback((event) => {
    setRootPathState(event.target.value);
  }, []);

  return (
    <Drawer
      classes={{ paper: classes.root }}
      className={classes.root}
      anchor="right"
      open={settings.open}
      onClose={settings.onClose}
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
      <Typography variant="body1">
        Notes will be stored in subfolder called notes
      </Typography>
      <Button>Set new folder and move existing content</Button>
      <Button>Set new folder without moving existing content</Button>
    </Drawer>
  );
};

export default SettingsDrawer;
