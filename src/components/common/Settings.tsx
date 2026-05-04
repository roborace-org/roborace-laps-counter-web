import {
  Button,
  CircularProgress,
  Divider,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import React, { ChangeEvent, useCallback, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store";
import { IBid, IEvent, IProgram, IStage, RaceStatus } from "../../store/race/interfaces";
import {
  setBids,
  setEvents,
  setSelectedEventId,
  setPrograms,
  setSelectedProgramId,
  setSelectedStageId,
  setStages,
} from "../../store/race/reduser";
import { SocketStatus } from "../../store/socket/interfaces";
import {
  connectSocket,
  disconnectSocket,
  sendMessage,
  setNewRobots,
} from "../../store/socket/thunks";
const useStyles = makeStyles({
  root: {
    width: 750,
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
  const [eventsLoading, setEventsLoading] = useState<boolean>(false);
  const [programsLoading, setProgramsLoading] = useState<boolean>(false);
  const [bidsLoading, setBidsLoading] = useState<boolean>(false);
  const [stagesLoading, setStagesLoading] = useState<boolean>(false);
  const {
    raceTimeLimit,
    robots,
    socketStatus,
    socketWsURL,
    raceStatus,
    isAdmin,
    events,
    selectedEventId,
    programs,
    selectedProgramId,
    bids,
    stages,
    selectedStageId,
  } = useAppSelector((state) => ({
    raceTimeLimit: state.race.raceTimeLimit,
    robots: state.race.robots,
    socketStatus: state.socket.status,
    socketWsURL: state.socket.wsURL,
    raceStatus: state.race.status,
    isAdmin: state.race.isAdmin,
    events: state.race.events,
    selectedEventId: state.race.selectedEventId,
    programs: state.race.programs,
    selectedProgramId: state.race.selectedProgramId,
    bids: state.race.bids,
    stages: state.race.stages,
    selectedStageId: state.race.selectedStageId,
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

  const getBaseUrl = useCallback(() => {
    return wsURLValue
      .replace(/^ws:/, "http:")
      .replace(/^wss:/, "https:")
      .replace(/\/ws\/?$/, "");
  }, [wsURLValue]);

  const loadEventsHandle = useCallback(async () => {
    setEventsLoading(true);
    try {
      const response = await fetch(`${getBaseUrl()}/robofinist/events`);
      const data: IEvent[] = await response.json();
      dispatch(setEvents(data));
    } catch (error) {
      console.error("Failed to load events:", error);
    } finally {
      setEventsLoading(false);
    }
  }, [getBaseUrl, dispatch]);

  const loadProgramsHandle = useCallback(async (eventId: number) => {
    setProgramsLoading(true);
    dispatch(setPrograms([]));
    dispatch(setSelectedProgramId(null));
    try {
      const response = await fetch(`${getBaseUrl()}/robofinist/events/${eventId}/programs`);
      const data: IProgram[] = await response.json();
      dispatch(setPrograms(data));
    } catch (error) {
      console.error("Failed to load programs:", error);
    } finally {
      setProgramsLoading(false);
    }
  }, [getBaseUrl, dispatch]);

  const loadBidsHandle = useCallback(async (programId: number) => {
    setBidsLoading(true);
    dispatch(setBids([]));
    try {
      const response = await fetch(`${getBaseUrl()}/robofinist/programs/${programId}/bids`);
      const data: IBid[] = await response.json();
      dispatch(setBids(data));
    } catch (error) {
      console.error("Failed to load bids:", error);
    } finally {
      setBidsLoading(false);
    }
  }, [getBaseUrl, dispatch]);

  const loadStagesHandle = useCallback(async (programId: number) => {
    setStagesLoading(true);
    dispatch(setStages([]));
    try {
      const response = await fetch(`${getBaseUrl()}/robofinist/programs/${programId}/stages`);
      const data: IStage[] = await response.json();
      dispatch(setStages(data));
    } catch (error) {
      console.error("Failed to load stages:", error);
    } finally {
      setStagesLoading(false);
    }
  }, [getBaseUrl, dispatch]);

  const handleEventChange = useCallback((eventId: number) => {
    dispatch(setSelectedEventId(eventId));
    dispatch(setBids([]));
    dispatch(setStages([]));
    dispatch(setSelectedStageId(null));
    loadProgramsHandle(eventId);
  }, [loadProgramsHandle, dispatch]);

  const handleProgramChange = useCallback((programId: number) => {
    dispatch(setSelectedProgramId(programId));
    dispatch(setSelectedStageId(null));
    loadBidsHandle(programId);
    loadStagesHandle(programId);
  }, [dispatch, loadBidsHandle, loadStagesHandle]);

  const handleStageChange = useCallback((stageId: number) => {
    dispatch(setSelectedStageId(stageId));
  }, [dispatch]);

  const markParticipatedHandle = useCallback(async (bidId: number) => {
    try {
      await fetch(`${getBaseUrl()}/robofinist/bids/${bidId}/participated`, {
        method: 'POST',
      });
      if (selectedProgramId) {
        loadBidsHandle(selectedProgramId);
      }
    } catch (error) {
      console.error("Failed to mark bid as participated:", error);
    }
  }, [getBaseUrl, selectedProgramId, loadBidsHandle]);

  const markAbsenceHandle = useCallback(async (bidId: number) => {
    try {
      await fetch(`${getBaseUrl()}/robofinist/bids/${bidId}/absence`, {
        method: 'POST',
      });
      if (selectedProgramId) {
        loadBidsHandle(selectedProgramId);
      }
    } catch (error) {
      console.error("Failed to mark bid as absence:", error);
    }
  }, [getBaseUrl, selectedProgramId, loadBidsHandle]);

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
        <Grid item xs={12}>
          <Divider />
        </Grid>
        <Grid item xs={12}>
          {events.length === 0 ? (
            <Button
              variant="contained"
              onClick={loadEventsHandle}
              disabled={eventsLoading}
              startIcon={eventsLoading ? <CircularProgress size={20} /> : null}
            >
              Load Events
            </Button>
          ) : selectedProgramId ? (
            <Typography variant="h6">
              {events.find(e => e.id === selectedEventId)?.name}
            </Typography>
          ) : (
            <FormControl fullWidth variant="outlined">
              <InputLabel>Event</InputLabel>
              <Select
                value={selectedEventId ?? ""}
                onChange={(e) => handleEventChange(e.target.value as number)}
                label="Event"
              >
                {events.map((event) => (
                  <MenuItem key={event.id} value={event.id}>
                    {event.name} ({event.date})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </Grid>
        {(programsLoading || programs.length > 0) && (
          <Grid item xs={12}>
            {programsLoading ? (
              <CircularProgress size={24} />
            ) : (
              <FormControl fullWidth variant="outlined">
                <InputLabel>Program</InputLabel>
                <Select
                  value={selectedProgramId ?? ""}
                  onChange={(e) => handleProgramChange(e.target.value as number)}
                  label="Program"
                >
                  {programs.map((program) => (
                    <MenuItem key={program.id} value={program.id}>
                      {program.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </Grid>
        )}
        {(stagesLoading || stages.length > 0) && (
          <Grid item xs={12}>
            {stagesLoading ? (
              <CircularProgress size={24} />
            ) : (
              <FormControl fullWidth variant="outlined">
                <InputLabel>Stage</InputLabel>
                <Select
                  value={selectedStageId ?? ""}
                  onChange={(e) => handleStageChange(e.target.value as number)}
                  label="Stage"
                >
                  {stages.map((stage) => (
                    <MenuItem key={stage.id} value={stage.id}>
                      {stage.name} - {stage.statusLabel ?? "Unknown"}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </Grid>
        )}
        {(bidsLoading || bids.length > 0) && (
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Participants ({bids.length})
            </Typography>
            {bidsLoading ? (
              <CircularProgress size={24} />
            ) : (() => {
              const hasActions = bids.some(bid => bid.status === 5);
              return (
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Status</TableCell>
                      {hasActions && <TableCell>Actions</TableCell>}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {bids.map((bid) => (
                      <Tooltip
                        key={bid.id}
                        title={bid.organizations.map(o => o.name).join(", ") || ""}
                        placement="left"
                      >
                        <TableRow>
                          <TableCell>{bid.name}</TableCell>
                          <TableCell>{bid.statusLabel}</TableCell>
                          {hasActions && (
                            <TableCell>
                              {bid.status === 5 && (
                                <>
                                  <Button
                                    size="small"
                                    variant="outlined"
                                    onClick={() => markParticipatedHandle(bid.id)}
                                    style={{ backgroundColor: '#e8f5e9', marginRight: 8 }}
                                  >
                                    Приняла участие
                                  </Button>
                                  <Button
                                    size="small"
                                    variant="outlined"
                                    onClick={() => markAbsenceHandle(bid.id)}
                                    style={{ backgroundColor: '#ffebee' }}
                                  >
                                    Неявка
                                  </Button>
                                </>
                              )}
                            </TableCell>
                          )}
                        </TableRow>
                      </Tooltip>
                    ))}
                  </TableBody>
                </Table>
              );
            })()}
          </Grid>
        )}
      </Grid>
    </div>
  );
};

export default Settings;
