import React, { useCallback, useMemo, useState } from "react";
import { AppBar, FormControl, MenuItem, Select, Toolbar, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import PoperMenu, { PoperMenuItem } from "../components/ui/PopperMenu";
import { RealRaceTimeContext } from "../contexts/RealRaceTimeContext";
import useRealRaceTime from "../helpers/hook/useRaceTime";
import SettingsDrawer from "./SettingsDrawer";
import LoginDrawer from "./LoginDrawer";
import { useAppDispatch, useAppSelector } from "../store";
import { setAdmin, setBids, setSelectedProgramId, setSelectedStageId, setStages } from "../store/race/reduser";
import { Link, useHistory } from "react-router-dom";
import { IProgram } from "../store/race/interfaces";

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
  programSelect: {
    minWidth: 200,
    marginRight: 16,
    "& .MuiSelect-select": {
      paddingTop: 8,
      paddingBottom: 8,
    },
  },
});
const MainLayout: React.FC = ({ children }) => {
  const classes = useStyles();
  const [openSettings, setOpenSettings] = useState<boolean>(false);
  const [openLogin, setOpenLogin] = useState<boolean>(false);
  const realRaceTime = useRealRaceTime();
  const { isAdmin, programs, selectedProgramId } = useAppSelector((state) => ({
    isAdmin: state.race.isAdmin,
    programs: state.race.programs,
    selectedProgramId: state.race.selectedProgramId,
  }));
  const dispatch = useAppDispatch();
  const history = useHistory();

  const handleProgramChange = useCallback((programId: number | null) => {
    dispatch(setSelectedProgramId(programId));
    dispatch(setSelectedStageId(null));
    dispatch(setBids([]));
    dispatch(setStages([]));
    if (programId !== null) {
      history.push('/program');
    }
  }, [dispatch, history]);

  const logoutHandle = useCallback(() => {
    dispatch(setAdmin(false));
  }, [dispatch]);
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
                <Typography variant="h4">
                  Roborace Laps Counter
                </Typography>
              </Link>
            </div>
            {programs.length > 0 && (
              <FormControl variant="outlined" className={classes.programSelect}>
                <Select
                  value={selectedProgramId ?? ""}
                  onChange={(e) => handleProgramChange(e.target.value === "" ? null : e.target.value as number)}
                  displayEmpty
                >
                  <MenuItem value="">
                    <em>Select Program</em>
                  </MenuItem>
                  {programs.map((program: IProgram) => (
                    <MenuItem key={program.id} value={program.id}>
                      {program.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
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
