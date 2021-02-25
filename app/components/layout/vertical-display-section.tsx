import React, { ReactNode } from "react";
import { Paper, makeStyles, createStyles } from "@material-ui/core";
import { BackgroundColor } from "../../colors";

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
      overflowY: "auto",
      backgroundColor: BackgroundColor.editor
    }
  })
);

const VerticalDisplaySection = ({ children }: Props): JSX.Element => {
  const classes = useStyles();
  return (
    <Paper square className={classes.paper}>
      {children}
    </Paper>
  );
};

export default VerticalDisplaySection;
