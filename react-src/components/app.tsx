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

const inputMarkdown: string = `
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
        <Grid container spacing={0} className={classes.root}>
          <Grid item xs={12} className={classes.item}>
            <Grid container justify="center">
              <Paper variant="outlined" square className={classes.paper}>
                <Typography>Tree goes here</Typography>
              </Paper>
              <Paper variant="outlined" square className={classes.paper}>
                <Typography>Notes in directory goes here</Typography>
                <TextareaAutosize
                  onChange={handleOnChange}
                  value={rawMarkdown}
                />
              </Paper>
              <Paper variant="outlined" square className={classes.paper}>
                {renderedMarkdown}
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </ThemeProvider>
    </>
  );
};
export default App;
