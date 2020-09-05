import React, { Fragment } from "react";
import { render } from "react-dom";
import { AppContainer as ReactHotAppContainer } from "react-hot-loader";
import App from "./components/app";
import "./index.css";
import "hack-font/build/web/hack.css";
import "fontsource-roboto";

const AppContainer = process.env.PLAIN_HMR ? Fragment : ReactHotAppContainer;

document.addEventListener("DOMContentLoaded", () => {
  // eslint-disable-next-line global-require
  render(
    <AppContainer>
      <App />
    </AppContainer>,
    document.getElementById("root")
  );
});
