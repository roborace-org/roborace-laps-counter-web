import {
  Button,
  Grid,
  InputAdornment,
  TextField,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import React, { ChangeEvent, useCallback, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store";
import { RaceStatus } from "../../store/race/interfaces";
import { SocketStatus } from "../../store/socket/interfaces";
import {
  connectSocket,
  disconnectSocket,
  sendMessage,
  setNewRobots,
} from "../../store/socket/thunks";
const useStyles = makeStyles({
  root: {
    width: 500,
    height: "100vh",
    padding: 16,
  },
});
const Settings: React.FC = () => {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const [raceTimeValue, setTimeRaceValue] = useState<number>(0);
  const [robotsValueValue, setRobotsValueValue] = useState<string>("");
  const [wsURLValue, setWsURLValue] = useState<string>("");
  const {
    raceTimeLimit,
    robots,
    socketStatus,
    socketWsURL,
    raceStatus,
    isAdmin,
  } = useAppSelector((state) => ({
    raceTimeLimit: state.race.raceTimeLimit,
    robots: state.race.robots,
    socketStatus: state.socket.status,
    socketWsURL: state.socket.wsURL,
    raceStatus: state.race.status,
    isAdmin: state.race.isAdmin,
  }));

  useEffect(() => {
    setTimeRaceValue(Math.round(raceTimeLimit / 60));
    setRobotsValueValue(robots.map((r) => r.name).join("\n"));
    setWsURLValue(socketWsURL);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const timeLimitChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setTimeRaceValue(+event.target.value);
    },
    []
  );
  const robotsChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setRobotsValueValue(event.target.value);
  }, []);

  const setTimeLimitHandle = useCallback(() => {
    dispatch(
      sendMessage({
        raceTimeLimit: raceTimeValue * 60,
        type: "TIME",
      })
    );
  }, [dispatch, raceTimeValue]);

  const setRobotsHandle = useCallback(() => {
    dispatch(setNewRobots(robotsValueValue));
  }, [dispatch, robotsValueValue]);

  const connectHandle = useCallback(() => {
    dispatch(connectSocket(wsURLValue));
  }, [dispatch, wsURLValue]);

  const disconnectHandle = useCallback(() => {
    disconnectSocket();
  }, []);

  const wsUrlChanged = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setWsURLValue(event.target.value);
  }, []);

  return (
    <div className={classes.root}>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Grid container spacing={2} alignItems="center" wrap="nowrap">
            <Grid item xs>
              <TextField
                fullWidth
                variant="outlined"
                label="WS url"
                value={wsURLValue}
                onChange={wsUrlChanged}
                disabled={socketStatus !== SocketStatus.Disconnected}
              />
            </Grid>
            <Grid item>
              {socketStatus === SocketStatus.Connected && (
                <Button variant="contained" onClick={disconnectHandle}>
                  Disconnect
                </Button>
              )}
              {socketStatus === SocketStatus.Disconnected && (
                <Button variant="contained" onClick={connectHandle}>
                  Connect
                </Button>
              )}
            </Grid>
          </Grid>
        </Grid>
        {socketStatus === SocketStatus.Connected && isAdmin && (
          <>
            <Grid item xs={12}>
              <Grid container spacing={2} alignItems="center" wrap="nowrap">
                <Grid item xs>
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Time limit"
                    type="number"
                    value={raceTimeValue}
                    onChange={timeLimitChange}
                    InputProps={{
                      inputProps: { min: 1 },
                      endAdornment: (
                        <InputAdornment position="end">min</InputAdornment>
                      ),
                    }}
                    disabled={raceStatus !== RaceStatus.READY}
                  />
                </Grid>
                <Grid item>
                  <Button
                    variant="contained"
                    onClick={setTimeLimitHandle}
                    disabled={raceStatus !== RaceStatus.READY}
                  >
                    Set
                  </Button>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={2} alignItems="center" wrap="nowrap">
                <Grid item xs>
                  <TextField
                    fullWidth
                    multiline
                    variant="outlined"
                    minRows={6}
                    label="Robots"
                    value={robotsValueValue}
                    onChange={robotsChange}
                    disabled={raceStatus !== RaceStatus.READY}
                  />
                </Grid>
                <Grid item>
                  <Button
                    variant="contained"
                    onClick={setRobotsHandle}
                    disabled={raceStatus !== RaceStatus.READY}
                  >
                    Set
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </>
        )}
      </Grid>
    </div>
  );
};

export default Settings;
