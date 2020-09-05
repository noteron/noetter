import React, { ReactNode } from "react";
import { Paper, makeStyles, createStyles } from "@material-ui/core";

type Props = {
  children: ReactNode | undefined;
};

const useStyles = makeStyles(() =>
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
  const classes = useStyles();
  return (
    <Paper variant="outlined" square className={classes.paper}>
      {children}
    </Paper>
  );
};

export default VerticalDisplaySection;
