import React, { useEffect, useRef } from "react";
import {
  CssBaseline,
  ThemeProvider,
} from "@material-ui/core";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import MainLayout from "./layouts/MainLayout";
import { renderRoutes } from "react-router-config";
import { HashRouter } from "react-router-dom";
import { routes } from "./routes";
import { baseTheme } from "./theme";
import { useAppDispatch, useAppSelector } from "./store";
import { connectSocket } from "./store/socket/thunks";
import { SocketStatus } from "./store/socket/interfaces";

function App(): JSX.Element {
  const dispatch = useAppDispatch();
  const connected = useAppSelector(
    (state) => state.socket.status === SocketStatus.Connected
  );
  const hasRobots = useAppSelector((state) => state.race.robots.length > 0);
  const hasEverConnected = useRef(false);

  if (connected) {
    hasEverConnected.current = true;
  }

  const wsURL = useAppSelector((state) => state.socket.wsURL);
  useEffect(() => {
    dispatch(connectSocket(wsURL));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  const showContent = connected || hasEverConnected.current || hasRobots;

  return (
    <>
      <CssBaseline />
      <ThemeProvider theme={baseTheme}>
        <HashRouter>
          <MainLayout>
            {showContent && renderRoutes(routes)}
          </MainLayout>
        </HashRouter>
      </ThemeProvider>
    </>
  );
}

export default App;
