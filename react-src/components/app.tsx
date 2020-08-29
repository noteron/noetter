import React from "react";
import {
  ThemeProvider,
  createMuiTheme,
  CssBaseline,
  Grid,
  Paper,
  makeStyles,
  Theme,
  createStyles,
  Typography
} from "@material-ui/core";

const darkTheme = createMuiTheme({
  palette: {
    type: "dark",
    primary: {
      main: "#a1887f"
    },
    secondary: {
      main: "#e2812d"
    }
  }
});

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      flexGrow: 1,
      width: "100%",
      overflowX: "hidden",
      margin: 0
    },
    item: {
      padding: 0
    },
    paper: {
      padding: 20,
      flexGrow: 1,
      height: "100vh"
    }
  })
);

const App = (): JSX.Element => {
  const classes = useStyles(darkTheme);
  return (
    <>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Grid container spacing={0} className={classes.root}>
          <Grid item xs={12} className={classes.item}>
            <Grid container justify="center">
              <Paper variant="outlined" square className={classes.paper}>
                <Typography>Tree goes here</Typography>
              </Paper>
              <Paper variant="outlined" square className={classes.paper}>
                <Typography>Notes in directory goes here</Typography>
              </Paper>
              <Paper variant="outlined" square className={classes.paper}>
                <Typography>Editor and viewer goes here</Typography>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </ThemeProvider>
    </>
  );
};
export default App;
