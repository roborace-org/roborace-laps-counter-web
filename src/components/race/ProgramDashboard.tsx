import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
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
import React, { useCallback, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store";
import { IBid, IQualificationResult, IStage } from "../../store/race/interfaces";
import {
  setBids,
  setSelectedStageId,
  setStages,
} from "../../store/race/reduser";

const ProgramDashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const [bidsLoading, setBidsLoading] = useState<boolean>(false);
  const [stagesLoading, setStagesLoading] = useState<boolean>(false);
  const [qualificationResults, setQualificationResults] = useState<IQualificationResult[]>([]);
  const [resultsLoading, setResultsLoading] = useState<boolean>(false);
  const [addResultDialogOpen, setAddResultDialogOpen] = useState<boolean>(false);
  const [addResultBid, setAddResultBid] = useState<IQualificationResult | null>(null);
  const [addResultSeconds, setAddResultSeconds] = useState<string>("");

  const {
    socketWsURL,
    selectedProgramId,
    bids,
    stages,
    selectedStageId,
  } = useAppSelector((state) => ({
    socketWsURL: state.socket.wsURL,
    selectedProgramId: state.race.selectedProgramId,
    bids: state.race.bids,
    stages: state.race.stages,
    selectedStageId: state.race.selectedStageId,
  }));

  const getBaseUrl = useCallback(() => {
    return socketWsURL
      .replace(/^ws:/, "http:")
      .replace(/^wss:/, "https:")
      .replace(/\/ws\/?$/, "");
  }, [socketWsURL]);

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

  const loadQualificationResults = useCallback(async (programId: number, stageId: number) => {
    setResultsLoading(true);
    setQualificationResults([]);
    try {
      const response = await fetch(`${getBaseUrl()}/robofinist/programs/${programId}/stages/${stageId}/results`);
      const data: IQualificationResult[] = await response.json();
      setQualificationResults(data);
    } catch (error) {
      console.error("Failed to load qualification results:", error);
    } finally {
      setResultsLoading(false);
    }
  }, [getBaseUrl]);

  useEffect(() => {
    if (selectedProgramId) {
      setQualificationResults([]);
      dispatch(setSelectedStageId(null));
      loadBidsHandle(selectedProgramId);
      loadStagesHandle(selectedProgramId);
    }
  }, [selectedProgramId, loadBidsHandle, loadStagesHandle, dispatch]);

  const handleStageChange = useCallback((stageId: number) => {
    dispatch(setSelectedStageId(stageId));
    const stage = stages.find(s => s.id === stageId);
    if (stage && stage.name.toLowerCase().includes('квалификац') && selectedProgramId) {
      loadQualificationResults(selectedProgramId, stageId);
    } else {
      setQualificationResults([]);
    }
  }, [dispatch, stages, selectedProgramId, loadQualificationResults]);

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

  const startStageHandle = useCallback(async (stageId: number) => {
    try {
      await fetch(`${getBaseUrl()}/robofinist/stages/${stageId}/start`, {
        method: 'POST',
      });
      if (selectedProgramId) {
        loadStagesHandle(selectedProgramId);
      }
    } catch (error) {
      console.error("Failed to start stage:", error);
    }
  }, [getBaseUrl, selectedProgramId, loadStagesHandle]);

  const getProgramPhase = useCallback(() => {
    const hasAcceptedBids = bids.some(bid => bid.status === 5);
    const qualificationStage = stages.find(stage => stage.name.toLowerCase().includes('квалификац'));
    
    if (hasAcceptedBids) {
      return { phase: 'Регистрация', canStartQualification: false, qualificationStageId: null };
    } else if (qualificationStage && qualificationStage.status === 0) {
      return { phase: 'Регистрация завершена', canStartQualification: true, qualificationStageId: qualificationStage.id };
    } else if (qualificationStage && qualificationStage.status === 2) {
      return { phase: 'Квалификация', canStartQualification: false, qualificationStageId: null };
    } else {
      return { phase: 'Неизвестно', canStartQualification: false, qualificationStageId: null };
    }
  }, [bids, stages]);

  const openAddResultDialog = useCallback((result: IQualificationResult) => {
    setAddResultBid(result);
    setAddResultSeconds("");
    setAddResultDialogOpen(true);
  }, []);

  const closeAddResultDialog = useCallback(() => {
    setAddResultDialogOpen(false);
    setAddResultBid(null);
  }, []);

  const formatSecondsInput = (value: string): string => {
    const digits = value.replace(/\D/g, '').slice(0, 4);
    if (digits.length <= 2) return digits;
    return `${digits.slice(0, 2)}.${digits.slice(2)}`;
  };

  const handleSecondsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatSecondsInput(e.target.value);
    setAddResultSeconds(formatted);
  };

  const calculateTimeInSeconds = (): number => {
    const secParts = addResultSeconds.split('.');
    const seconds = parseInt(secParts[0], 10) || 0;
    const centiseconds = parseInt(secParts[1] || '0', 10);
    return seconds + centiseconds / 100;
  };

  const saveResultHandle = useCallback(async (disqualified: boolean) => {
    if (!addResultBid || !selectedStageId) return;
    
    const attemptNumber = addResultBid.attempts.filter(a => a.laps !== null || a.time !== null || a.disqualified).length + 1;
    const laps = disqualified ? 0 : 1;
    const time = disqualified ? 0 : calculateTimeInSeconds();

    try {
      await fetch(`${getBaseUrl()}/robofinist/results`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stageId: selectedStageId,
          bidId: addResultBid.bidId,
          number: attemptNumber,
          laps,
          time,
          disqualified,
        }),
      });
      closeAddResultDialog();
      if (selectedProgramId && selectedStageId) {
        loadQualificationResults(selectedProgramId, selectedStageId);
      }
    } catch (error) {
      console.error("Failed to save result:", error);
    }
  }, [addResultBid, selectedStageId, addResultSeconds, getBaseUrl, closeAddResultDialog, selectedProgramId, loadQualificationResults]);

  if (!selectedProgramId) {
    return (
      <Typography variant="h6" style={{ textAlign: 'center', marginTop: 40 }}>
        Select a program in Settings
      </Typography>
    );
  }

  return (
    <div style={{ padding: 16 }}>
      <Grid container spacing={2}>
        {/* Program Phase */}
        {!bidsLoading && !stagesLoading && (
          <Grid item xs={12}>
            {(() => {
              const { phase, canStartQualification, qualificationStageId } = getProgramPhase();
              return (
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <Typography variant="h5">
                    Phase: <strong>{phase}</strong>
                  </Typography>
                  {canStartQualification && qualificationStageId && (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => startStageHandle(qualificationStageId)}
                    >
                      Start Qualification
                    </Button>
                  )}
                </div>
              );
            })()}
          </Grid>
        )}

        {/* Stage Selector */}
        {(stagesLoading || stages.length > 0) && (
          <Grid item xs={12} md={6}>
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

        {/* Participants Table (Registration Phase) */}
        {(bidsLoading || bids.length > 0) && bids.some(bid => bid.status === 5) && (
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Participants ({bids.length})
            </Typography>
            {bidsLoading ? (
              <CircularProgress size={24} />
            ) : (
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
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
                        <TableCell>
                          {bid.status === 5 && (
                            <>
                              <Button
                                size="small"
                                variant="outlined"
                                onClick={() => markParticipatedHandle(bid.id)}
                                style={{ backgroundColor: '#e8f5e9', marginRight: 8 }}
                              >
                                Participated
                              </Button>
                              <Button
                                size="small"
                                variant="outlined"
                                onClick={() => markAbsenceHandle(bid.id)}
                                style={{ backgroundColor: '#ffebee' }}
                              >
                                Absence
                              </Button>
                            </>
                          )}
                        </TableCell>
                      </TableRow>
                    </Tooltip>
                  ))}
                </TableBody>
              </Table>
            )}
          </Grid>
        )}

        {/* Qualification Results */}
        {(resultsLoading || qualificationResults.length > 0) && (
          <Grid item xs={12}>
            <Typography variant="h4" gutterBottom>
              Qualification Results
            </Typography>
            {resultsLoading ? (
              <CircularProgress size={24} />
            ) : (
              <Table size="medium">
                <TableHead>
                  <TableRow>
                    <TableCell style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>Place</TableCell>
                    <TableCell style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>Name</TableCell>
                    <TableCell style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>Best</TableCell>
                    <TableCell style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>Try 1</TableCell>
                    <TableCell style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>Try 2</TableCell>
                    <TableCell style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>Try 3</TableCell>
                    <TableCell style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {qualificationResults.map((result) => {
                    const completedAttempts = result.attempts.filter(a => a.laps !== null || a.time !== null || a.disqualified).length;
                    return (
                      <TableRow key={result.bidId}>
                        <TableCell style={{ fontSize: '1.1rem' }}>{result.place}</TableCell>
                        <TableCell style={{ fontSize: '1.1rem' }}>{result.name}</TableCell>
                        <TableCell style={{ fontSize: '1.1rem' }}><strong>{formatAttemptResult(result.best)}</strong></TableCell>
                        {result.attempts.map((attempt, index) => (
                          <TableCell key={index} style={{ fontSize: '1.1rem', color: attempt.disqualified ? 'red' : undefined }}>
                            {attempt.disqualified ? 'DQ' : formatAttemptResult(attempt)}
                          </TableCell>
                        ))}
                        <TableCell>
                          {completedAttempts < 3 && (
                            <Button
                              variant="outlined"
                              color="primary"
                              onClick={() => openAddResultDialog(result)}
                            >
                              Add Result
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </Grid>
        )}
      </Grid>

      {/* Add Result Dialog */}
      <Dialog open={addResultDialogOpen} onClose={closeAddResultDialog} maxWidth="xs" fullWidth>
        <DialogTitle>Add Result - {addResultBid?.name}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} style={{ marginTop: 8 }} alignItems="center">
            <Grid item xs={12}>
              <TextField
                label="Seconds (ss.cc)"
                fullWidth
                autoFocus
                value={addResultSeconds}
                onChange={handleSecondsChange}
                onKeyPress={(e) => e.key === 'Enter' && saveResultHandle(false)}
                placeholder="00.00"
                helperText="Enter 4 digits"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeAddResultDialog}>Cancel</Button>
          <Button 
            onClick={() => saveResultHandle(true)} 
            style={{ backgroundColor: '#ffebee', color: '#c62828' }}
          >
            Disqualification
          </Button>
          <Button 
            onClick={() => saveResultHandle(false)} 
            color="primary" 
            variant="contained"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

const formatTime = (seconds: number | null): string => {
  if (seconds === null || seconds === 0) return '-';
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  const centiseconds = Math.round((seconds % 1) * 100);
  if (minutes > 0) {
    return `${minutes}:${secs.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
  }
  return `${secs}.${centiseconds.toString().padStart(2, '0')}`;
};

const formatAttemptResult = (attempt: { laps: number | null; time: number | null } | null): string => {
  if (!attempt || (attempt.laps === null && attempt.time === null)) return '-';
  const lapsStr = attempt.laps !== null ? `${attempt.laps}` : '';
  const timeStr = formatTime(attempt.time);
  if (lapsStr && timeStr !== '-') {
    return `${lapsStr} / ${timeStr}`;
  }
  return lapsStr || timeStr;
};

export default ProgramDashboard;
