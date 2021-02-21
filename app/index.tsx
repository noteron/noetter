import React, { Fragment } from "react";
import { render } from "react-dom";
import { AppContainer as ReactHotAppContainer } from "react-hot-loader";
import "./index.css";
import "fontsource-roboto";

const AppContainer = process.env.PLAIN_HMR ? Fragment : ReactHotAppContainer;

document.addEventListener("DOMContentLoaded", () => {
  // eslint-disable-next-line global-require
  const App = require("./components/app").default;
  render(
    <AppContainer>
      <App />
    </AppContainer>,
    document.getElementById("root")
  );
});
