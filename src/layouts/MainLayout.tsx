import React, { useCallback, useMemo, useState } from "react";
import { AppBar, Toolbar, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import PoperMenu, { PoperMenuItem } from "../components/ui/PopperMenu";
import { RealRaceTimeContext } from "../contexts/RealRaceTimeContext";
import useRealRaceTime from "../helpers/hook/useRaceTime";
import SettingsDrawer from "./SettingsDrawer";
import LoginDrawer from "./LoginDrawer";
import { useAppDispatch, useAppSelector } from "../store";
import { setAdmin } from "../store/race/reduser";
import { Link, useHistory } from "react-router-dom";

const useStyles = makeStyles({
  root: {
    minHeight: "100vh",
    width: "100%",
    display: "flex",
    flexDirection: "column",
  },
  flexGrow: {
    flexGrow: 1,
  },
  main: {
    flexGrow: 1,
  },
  logo: {
    color: "rgba(0, 0, 0, 0.87)",
    textDecoration: "none",
  },
});
const MainLayout: React.FC = ({ children }) => {
  const classes = useStyles();
  const [openSettings, setOpenSettings] = useState<boolean>(false);
  const [openLogin, setOpenLogin] = useState<boolean>(false);
  const realRaceTime = useRealRaceTime();
  const isAdmin = useAppSelector((state) => state.race.isAdmin);
  const dispatch = useAppDispatch();

  const logoutHandle = useCallback(() => {
    dispatch(setAdmin(false));
  }, [dispatch]);

  const history = useHistory();
  const menuItems: PoperMenuItem[] = useMemo(() => {
    const menu = [
      {
        title: "Settings",
        clickHandler: () => {
          setOpenSettings(true);
        },
      },
    ];
    if (!isAdmin) {
      menu.push({
        title: "Login",
        clickHandler: () => {
          setOpenLogin(true);
        },
      });
    } else {
      menu.push(
        {
          title: "Admin",
          clickHandler: () => {
            history.push("/admin");
          },
        },
        {
          title: "Logout",
          clickHandler: () => {
            logoutHandle();
          },
        }
      );
    }
    return menu;
  }, [isAdmin, logoutHandle, history]);

  return (
    <RealRaceTimeContext.Provider value={realRaceTime}>
      <div className={classes.root}>
        <AppBar position="static" color="transparent">
          <Toolbar>
            <div className={classes.flexGrow}>
              <Link to="/" className={classes.logo}>
                <Typography variant="h4">Roborace Laps Counter</Typography>
              </Link>
            </div>
            <PoperMenu items={menuItems} />
          </Toolbar>
        </AppBar>
        <main className={classes.main}>{children}</main>
        <SettingsDrawer open={openSettings} setOpen={setOpenSettings} />
        <LoginDrawer open={openLogin} setOpen={setOpenLogin} />
      </div>
    </RealRaceTimeContext.Provider>
  );
};

export default MainLayout;
