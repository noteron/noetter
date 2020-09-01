import React, { ReactNode } from "react";
import {
  Paper,
  makeStyles,
  Theme,
  createStyles,
  useTheme
} from "@material-ui/core";

type Props = {
  children: ReactNode | undefined;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      padding: 20,
      flexGrow: 1,
      height: "100vh",
      wordWrap: "break-word",
      overflowWrap: "break-word",
      overflowY: "auto"
    }
  })
);

const VerticalDisplaySection = ({ children }: Props): JSX.Element => {
  const theme = useTheme();
  const classes = useStyles(theme);
  return (
    <Paper variant="outlined" square className={classes.paper}>
      {children}
    </Paper>
  );
};

export default VerticalDisplaySection;
