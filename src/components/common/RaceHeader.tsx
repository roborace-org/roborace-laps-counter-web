import {
  Button,
  Container,
  Grid,
  makeStyles,
  Theme,
  Typography,
} from "@material-ui/core";
import React, { useCallback, useContext, useMemo } from "react";
import { RealRaceTimeContext } from "../../contexts/RealRaceTimeContext";
import { msToTime } from "../../helpers/fns";
import { useAppDispatch, useAppSelector } from "../../store";
import { RaceStatus } from "../../store/race/interfaces";
import { sendMessage } from "../../store/socket/thunks";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    background: "#F4F4F4",
    padding: "16px 0",
    [theme.breakpoints.down("xs")]: {
      padding: "8px 0",
    },
  },
  container: {
    padding: "0 32px",
    [theme.breakpoints.down("xs")]: {
      padding: 0,
    },
  },
  status: {
    background: "#777777",
    padding: 16,
    borderRadius: 4,
    color: "#ffffff",
    fontSize: 32,
    fontWeight: "bold",
    minWidth: 135,
    lineHeight: 1,
    [theme.breakpoints.down("xs")]: {
      padding: 8,
      fontSize: 20,
      minWidth: 100,
    },
    "&:hover": {
      background: "#777777",
    },
  },
  time: {
    background: " #000000",
    padding: 16,
    borderRadius: 4,
    color: "#ffffff",
    fontSize: 32,
    fontWeight: "bold",
    minWidth: 135,
    [theme.breakpoints.down("xs")]: {
      padding: 8,
      fontSize: 20,
      minWidth: 100,
    },
  },
  btnState: {
    fontSize: 12,
  },
}));

const RaceHeader: React.FC<{ asAdmin?: boolean }> = ({ asAdmin = false }) => {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const realRaceTime = useContext(RealRaceTimeContext);
  const { status, raceTimeLimit: raceTimeLimitState } = useAppSelector(
    (state) => ({
      status: state.race.status,
      raceTimeLimit: state.race.raceTimeLimit,
    })
  );

  const raceTimeLimit = useMemo(() => {
    return raceTimeLimitState / 60;
  }, [raceTimeLimitState]);

  const statusHandle = useCallback(
    (state: string) => () => {
      dispatch(
        sendMessage({
          state,
          type: "COMMAND",
        })
      );
    },
    [dispatch]
  );

  const command = useMemo(() => {
    switch (status) {
      case RaceStatus.RUNNING:
        return {
          label: "FINISH",
          command: "FINISH",
        };
      case RaceStatus.FINISH:
        return {
          label: "READY",
          command: "READY",
        };
      case RaceStatus.READY:
        return {
          label: "STEADY",
          command: "STEADY",
        };
      default:
        return {
          label: "GO",
          command: "RUNNING",
        };
    }
  }, [status]);
  return (
    <div className={classes.root}>
      <Container maxWidth="lg">
        <div className={classes.container}>
          <Grid
            container
            spacing={1}
            alignItems="center"
            justifyContent="space-between"
          >
            <Grid item xs>
              <Grid container spacing={1} alignItems="center" wrap="nowrap">
                <Grid item>
                  <Typography noWrap>Race state:</Typography>
                </Grid>
                <Grid item>
                  <div className={classes.status}>{status || "-"}</div>
                </Grid>
                {asAdmin && (
                  <Grid item>
                    <Button
                      color="primary"
                      variant="contained"
                      onClick={statusHandle(command.command)}
                    >
                      {command.label}
                    </Button>
                  </Grid>
                )}
              </Grid>
            </Grid>
            <Grid item>
              <Grid container spacing={1} alignItems="center" wrap="nowrap">
                <Grid item>
                  <Typography noWrap>Race time:</Typography>
                </Grid>
                <Grid item>
                  <div className={classes.time}>{msToTime(realRaceTime)}</div>
                </Grid>
                <Grid item>
                  <Typography>Limit:</Typography>
                </Grid>
                <Grid item>
                  <Typography>{`${raceTimeLimit}(min)`}</Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </div>
      </Container>
    </div>
  );
};

export default RaceHeader;
