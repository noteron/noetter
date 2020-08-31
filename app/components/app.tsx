import React, { useState, useCallback } from "react";
import {
  ThemeProvider,
  createMuiTheme,
  CssBaseline,
  Grid,
  Paper,
  makeStyles,
  Theme,
  createStyles,
  Typography,
  TextareaAutosize
} from "@material-ui/core";
import useMarkdown from "./hooks/use-markdown";

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

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      width: "100%",
      overflowX: "hidden",
      overflowY: "hidden",
      margin: 0
    },
    item: {
      padding: 0,
      flexGrow: 1,
      height: "100vh"
    },
    paper: {
      padding: 20,
      flexGrow: 1,
      height: "100vh",
      overflowY: "scroll",
      wordWrap: "break-word",
      overflowWrap: "break-word",
      scrollbarWidth: "thin"
    },
    textArea: {
      border: "none",
      backgroundColor: theme.palette.background.paper,
      color: theme.palette.text.primary
    }
  })
);

const inputMarkdown = `
# Weow
## Live editing is working fine

- Some
  - Bullet
    - Points

 1. And
 1. some
   1. numbers

\`\`\`
monospace
\`\`\`

Inline \`monospace\` test

<div>
 How about some html?
<div>
<img src="http://http.cat/404" height="100px"/>
`;

const App = (): JSX.Element => {
  const [rawMarkdown, setRawMarkdown] = useState<string>(inputMarkdown);
  const classes = useStyles(darkTheme);
  const renderedMarkdown = useMarkdown(rawMarkdown);

  const handleOnChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>): void =>
      setRawMarkdown(event.target.value),
    []
  );

  return (
    <>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Grid
          container
          justify="center"
          direction="row"
          className={classes.root}
        >
          <Grid item xs={2} className={classes.item}>
            <Paper variant="outlined" square className={classes.paper}>
              <Typography>Tree goes here</Typography>
            </Paper>
          </Grid>
          <Grid item xs={3} className={classes.item}>
            <Paper variant="outlined" square className={classes.paper}>
              <Typography>Notes in directory goes here</Typography>
              <TextareaAutosize
                draggable={false}
                className={classes.textArea}
                onChange={handleOnChange}
                value={rawMarkdown}
              />
            </Paper>
          </Grid>
          <Grid item xs={7} className={classes.item}>
            <Paper variant="outlined" square className={classes.paper}>
              {renderedMarkdown}
            </Paper>
          </Grid>
        </Grid>
      </ThemeProvider>
    </>
  );
};
export default App;
