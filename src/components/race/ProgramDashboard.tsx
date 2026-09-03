import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@material-ui/core";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useHistory } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store";
import { IBid, IQualificationResult, IStage } from "../../store/race/interfaces";
import {
  setBids,
  setRobotBidMap,
  setSelectedStageId,
  setStages,
} from "../../store/race/reduser";
import { sendMessage, setNewRobots } from "../../store/socket/thunks";

interface IHeatParticipant {
  bidId: number;
  name: string;
  qualificationTime: number | null;
  qualificationPlace: number;
  race: number;
  position: number;
  laps: number | null;
  time: number | null;
  place: number | null;
}

type SortColumn = 'qualificationPlace' | 'race' | 'place';
type SortDirection = 'asc' | 'desc';

const ProgramDashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const [bidsLoading, setBidsLoading] = useState<boolean>(false);
  const [stagesLoading, setStagesLoading] = useState<boolean>(false);
  const [qualificationResults, setQualificationResults] = useState<IQualificationResult[]>([]);
  const [resultsLoading, setResultsLoading] = useState<boolean>(false);
  const [addResultDialogOpen, setAddResultDialogOpen] = useState<boolean>(false);
  const [addResultBid, setAddResultBid] = useState<IQualificationResult | null>(null);
  const [addResultSeconds, setAddResultSeconds] = useState<string>("");
  const [heatParticipants, setHeatParticipants] = useState<IHeatParticipant[]>([]);
  const [selectedRaceCount, setSelectedRaceCount] = useState<number>(1);
  const [raceCountLocked, setRaceCountLocked] = useState<boolean>(false);
  const [heatsResults, setHeatsResults] = useState<IQualificationResult[]>([]);
  const [sortColumn, setSortColumn] = useState<SortColumn>('qualificationPlace');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [selectedFinalCount, setSelectedFinalCount] = useState<number>(4);
  const [finalResults, setFinalResults] = useState<IQualificationResult[]>([]);
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const history = useHistory();

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

  const getRaceCountKey = useCallback((programId: number, stageId: number) => {
    return `raceCount_${programId}_${stageId}`;
  }, []);

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

  const loadHeatsResults = useCallback(async (programId: number, stageId: number) => {
    try {
      const response = await fetch(`${getBaseUrl()}/robofinist/programs/${programId}/stages/${stageId}/results`);
      const data: IQualificationResult[] = await response.json();
      setHeatsResults(data);
    } catch (error) {
      console.error("Failed to load heats results:", error);
    }
  }, [getBaseUrl]);

  const loadFinalResults = useCallback(async (programId: number, stageId: number) => {
    try {
      const response = await fetch(`${getBaseUrl()}/robofinist/programs/${programId}/stages/${stageId}/results`);
      const data: IQualificationResult[] = await response.json();
      setFinalResults(data);
    } catch (error) {
      console.error("Failed to load final results:", error);
    }
  }, [getBaseUrl]);

  useEffect(() => {
    if (selectedProgramId) {
      setQualificationResults([]);
      setHeatParticipants([]);
      setSelectedRaceCount(1);
      setHeatsResults([]);
      setFinalResults([]);
      dispatch(setSelectedStageId(null));
      loadBidsHandle(selectedProgramId);
      loadStagesHandle(selectedProgramId);
    }
  }, [selectedProgramId, loadBidsHandle, loadStagesHandle, dispatch]);

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

  const programPhase = useMemo(() => {
    const hasAcceptedBids = bids.some(bid => bid.status === 5);
    const qualificationStage = stages.find(stage => stage.name.toLowerCase().includes('квалификац'));
    const heatsStage = stages.find(stage => stage.name.toLowerCase().includes('отборочн'));
    const finalStage = stages.find(stage => stage.name.toLowerCase().includes('финал'));
    
    const baseState = {
      phase: 'Неизвестно',
      canStartQualification: false,
      canFinishQualification: false,
      canFormHeats: false,
      heatsInProgress: false,
      finalPending: false,
      finalInProgress: false,
      qualificationStageId: qualificationStage?.id ?? null,
      heatsStageId: heatsStage?.id ?? null,
      finalStageId: finalStage?.id ?? null,
      activeStageId: null as number | null,
    };
    
    if (hasAcceptedBids) {
      return { ...baseState, phase: 'Регистрация' };
    } else if (qualificationStage && qualificationStage.status === 0) {
      return { ...baseState, phase: 'Регистрация завершена', canStartQualification: true, activeStageId: qualificationStage.id };
    } else if (qualificationStage && qualificationStage.status === 2) {
      return { ...baseState, phase: 'Квалификация', canFinishQualification: true, activeStageId: qualificationStage.id };
    } else if (qualificationStage && qualificationStage.status === 3 && heatsStage && heatsStage.status === 0) {
      return { ...baseState, phase: 'Отборочный заезд', canFormHeats: true, activeStageId: heatsStage.id };
    } else if (qualificationStage && qualificationStage.status === 3 && heatsStage && heatsStage.status === 2) {
      return { ...baseState, phase: 'Отборочный заезд - в процессе', heatsInProgress: true, activeStageId: heatsStage.id };
    } else if (heatsStage && heatsStage.status === 3 && finalStage && finalStage.status === 0) {
      return { ...baseState, phase: 'Финал - формирование', finalPending: true, activeStageId: finalStage.id };
    } else if (heatsStage && heatsStage.status === 3 && finalStage && finalStage.status === 2) {
      return { ...baseState, phase: 'Финал - в процессе', finalInProgress: true, activeStageId: finalStage.id };
    } else {
      return baseState;
    }
  }, [bids, stages]);

  // Determine current tab based on phase
  const currentPhaseTab = useMemo(() => {
    if (programPhase.phase === 'Регистрация' || programPhase.phase === 'Регистрация завершена') return 0;
    if (programPhase.phase === 'Квалификация') return 1;
    if (programPhase.phase === 'Отборочный заезд' || programPhase.heatsInProgress) return 2;
    if (programPhase.finalPending || programPhase.finalInProgress) return 3;
    return 0;
  }, [programPhase]);

  // Auto-select tab based on phase
  useEffect(() => {
    setSelectedTab(currentPhaseTab);
  }, [currentPhaseTab]);

  // Auto-select active stage based on phase
  useEffect(() => {
    if (stages.length === 0) return;
    if (programPhase.activeStageId && programPhase.activeStageId !== selectedStageId) {
      dispatch(setSelectedStageId(programPhase.activeStageId));
    }
  }, [stages, programPhase.activeStageId, selectedStageId, dispatch]);

  // Load qualification results when needed
  useEffect(() => {
    if (stages.length === 0 || !selectedProgramId || resultsLoading) return;
    if (programPhase.qualificationStageId && qualificationResults.length === 0) {
      loadQualificationResults(selectedProgramId, programPhase.qualificationStageId);
    }
  }, [stages, selectedProgramId, qualificationResults.length, resultsLoading, programPhase.qualificationStageId, loadQualificationResults]);

  // Load heats results when needed
  useEffect(() => {
    if (stages.length === 0 || !selectedProgramId) return;
    if (programPhase.heatsInProgress && programPhase.heatsStageId && heatsResults.length === 0) {
      loadHeatsResults(selectedProgramId, programPhase.heatsStageId);
    }
  }, [stages, selectedProgramId, heatsResults.length, programPhase.heatsInProgress, programPhase.heatsStageId, loadHeatsResults]);

  // Load heats results for final phase
  useEffect(() => {
    if (stages.length === 0 || !selectedProgramId) return;
    if ((programPhase.finalPending || programPhase.finalInProgress) && programPhase.heatsStageId && heatsResults.length === 0) {
      loadHeatsResults(selectedProgramId, programPhase.heatsStageId);
    }
  }, [stages, selectedProgramId, heatsResults.length, programPhase.finalPending, programPhase.finalInProgress, programPhase.heatsStageId, loadHeatsResults]);

  // Load final results
  useEffect(() => {
    if (stages.length === 0 || !selectedProgramId) return;
    if (programPhase.finalInProgress && programPhase.finalStageId && finalResults.length === 0) {
      loadFinalResults(selectedProgramId, programPhase.finalStageId);
    }
  }, [stages, selectedProgramId, finalResults.length, programPhase.finalInProgress, programPhase.finalStageId, loadFinalResults]);

  const finishStageHandle = useCallback(async (stageId: number) => {
    try {
      await fetch(`${getBaseUrl()}/robofinist/stages/${stageId}/finish`, {
        method: 'POST',
      });
      if (selectedProgramId) {
        loadStagesHandle(selectedProgramId);
      }
    } catch (error) {
      console.error("Failed to finish stage:", error);
    }
  }, [getBaseUrl, selectedProgramId, loadStagesHandle]);

  const formHeatsBidsHandle = useCallback(async (heatsStageId: number, qualificationStageId: number) => {
    if (!selectedProgramId) return;
    try {
      // Clear previous race count lock for this stage
      localStorage.removeItem(getRaceCountKey(selectedProgramId, heatsStageId));
      setRaceCountLocked(false);
      
      await fetch(`${getBaseUrl()}/robofinist/stages/${heatsStageId}/form-bids?programId=${selectedProgramId}&qualificationStageId=${qualificationStageId}`, {
        method: 'POST',
      });
      loadStagesHandle(selectedProgramId);
    } catch (error) {
      console.error("Failed to form heats bids:", error);
    }
  }, [getBaseUrl, selectedProgramId, loadStagesHandle, getRaceCountKey]);

  const formFinalBidsHandle = useCallback(async (finalStageId: number, count: number) => {
    if (!selectedProgramId) return;
    try {
      await fetch(`${getBaseUrl()}/robofinist/stages/${finalStageId}/form-bids?count=${count}`, {
        method: 'POST',
      });
      await startStageHandle(finalStageId);
      loadStagesHandle(selectedProgramId);
    } catch (error) {
      console.error("Failed to form final bids:", error);
    }
  }, [getBaseUrl, selectedProgramId, loadStagesHandle, startStageHandle]);

  // Sorted heats results for final
  const sortedHeatsResults = useMemo(() => {
    return [...heatsResults]
      .filter(r => r.attempts?.[0]?.laps !== null && r.attempts?.[0]?.laps !== undefined)
      .sort((a, b) => {
        const aLaps = a.attempts?.[0]?.laps ?? 0;
        const bLaps = b.attempts?.[0]?.laps ?? 0;
        if (bLaps !== aLaps) return bLaps - aLaps;
        const aTime = a.attempts?.[0]?.time ?? Infinity;
        const bTime = b.attempts?.[0]?.time ?? Infinity;
        return aTime - bTime;
      })
      .map((r, index) => ({ ...r, place: index + 1 }));
  }, [heatsResults]);

  // Auto-adjust selectedFinalCount if it exceeds available participants
  useEffect(() => {
    if (sortedHeatsResults.length > 0 && selectedFinalCount > sortedHeatsResults.length) {
      setSelectedFinalCount(Math.max(3, sortedHeatsResults.length));
    }
  }, [sortedHeatsResults.length, selectedFinalCount]);

  // Sorted final results with places
  const sortedFinalResults = useMemo(() => {
    return [...finalResults]
      .filter(r => r.attempts?.[0]?.laps !== null && r.attempts?.[0]?.laps !== undefined)
      .sort((a, b) => {
        const aLaps = a.attempts?.[0]?.laps ?? 0;
        const bLaps = b.attempts?.[0]?.laps ?? 0;
        if (bLaps !== aLaps) return bLaps - aLaps;
        const aTime = a.attempts?.[0]?.time ?? Infinity;
        const bTime = b.attempts?.[0]?.time ?? Infinity;
        return aTime - bTime;
      })
      .map((r, index) => ({ ...r, finalPlace: index + 1 }));
  }, [finalResults]);

  // Finalists with their final results
  const finalistsWithResults = useMemo(() => {
    return sortedHeatsResults.slice(0, selectedFinalCount).map((h, index) => {
      const finalResult = sortedFinalResults.find(f => f.bidId === h.bidId);
      return {
        ...h,
        position: index + 1,
        finalLaps: finalResult?.attempts?.[0]?.laps ?? null,
        finalTime: finalResult?.attempts?.[0]?.time ?? null,
        finalPlace: finalResult?.finalPlace ?? null,
      };
    });
  }, [sortedHeatsResults, sortedFinalResults, selectedFinalCount]);

  const startFinalRaceHandle = useCallback(() => {
    if (!programPhase.finalStageId) return;
    
    const finalists = sortedHeatsResults.slice(0, selectedFinalCount);
    const bidMap: Record<string, number> = {};
    finalists.forEach(f => {
      bidMap[f.name] = f.bidId;
    });
    dispatch(setRobotBidMap(bidMap));
    dispatch(setSelectedStageId(programPhase.finalStageId));
    
    const robotsStr = finalists.map(f => f.name).join('\n');
    dispatch(setNewRobots(robotsStr));
    dispatch(sendMessage({ raceTimeLimit: 5 * 60, type: 'TIME' }));
    history.push('/admin');
  }, [sortedHeatsResults, selectedFinalCount, programPhase.finalStageId, dispatch, history]);

  const calculateRaceCountOptions = useCallback((participantCount: number): number[] => {
    if (participantCount <= 3) return [1];
    if (participantCount <= 6) return [1, 2];
    
    const options: number[] = [];
    for (let races = 2; races <= Math.ceil(participantCount / 3); races++) {
      const perRace = Math.ceil(participantCount / races);
      if (perRace <= 6 && perRace >= 3) {
        options.push(races);
      }
    }
    return options.length > 0 ? options : [Math.ceil(participantCount / 6)];
  }, []);

  const distributeParticipantsToRaces = useCallback((participants: IHeatParticipant[], raceCount: number): IHeatParticipant[] => {
    const sorted = [...participants].sort((a, b) => a.qualificationPlace - b.qualificationPlace);
    return sorted.map((p, index) => ({
      ...p,
      race: (index % raceCount) + 1,
      position: Math.floor(index / raceCount) + 1,
    }));
  }, []);

  const initializeHeatParticipants = useCallback(() => {
    const qualifiedResults = qualificationResults
      .filter(r => r.best && r.best.time && r.best.time > 0)
      .sort((a, b) => (a.best?.time ?? Infinity) - (b.best?.time ?? Infinity));
    
    const raceCountOptions = calculateRaceCountOptions(qualifiedResults.length);
    const defaultRaceCount = raceCountOptions[0] || 1;
    
    // Check for saved race count
    let raceCount = defaultRaceCount;
    let locked = false;
    if (selectedProgramId && programPhase.heatsStageId) {
      const savedRaceCount = localStorage.getItem(getRaceCountKey(selectedProgramId, programPhase.heatsStageId));
      if (savedRaceCount) {
        const parsed = parseInt(savedRaceCount, 10);
        if (!isNaN(parsed) && raceCountOptions.includes(parsed)) {
          raceCount = parsed;
          locked = true;
        }
      }
    }
    
    const participants: IHeatParticipant[] = qualifiedResults.map((r, index) => {
      // Find heats result for this bid - use first attempt (heats have one attempt)
      const heatResult = heatsResults.find(hr => hr.bidId === r.bidId);
      const heatAttempt = heatResult?.attempts?.[0];
      return {
        bidId: r.bidId,
        name: r.name,
        qualificationTime: r.best?.time ?? null,
        qualificationPlace: index + 1,
        race: (index % raceCount) + 1,
        position: Math.floor(index / raceCount) + 1,
        laps: heatAttempt?.laps ?? null,
        time: heatAttempt?.time ?? null,
        place: null,
      };
    });
    
    setHeatParticipants(participants);
    setSelectedRaceCount(raceCount);
    setRaceCountLocked(locked);
  }, [qualificationResults, heatsResults, calculateRaceCountOptions, selectedProgramId, programPhase.heatsStageId, getRaceCountKey]);

  const handleRaceCountChange = useCallback((raceCount: number) => {
    setSelectedRaceCount(raceCount);
    setHeatParticipants(prev => distributeParticipantsToRaces(prev, raceCount));
  }, [distributeParticipantsToRaces]);

  const startRaceHandle = useCallback((raceNumber: number) => {
    // Save race count and lock it
    if (selectedProgramId && programPhase.heatsStageId) {
      localStorage.setItem(getRaceCountKey(selectedProgramId, programPhase.heatsStageId), String(selectedRaceCount));
      setRaceCountLocked(true);
    }
    
    const participantsInRace = heatParticipants
      .filter(p => p.race === raceNumber)
      .sort((a, b) => a.position - b.position);
    
    const bidMap: Record<string, number> = {};
    participantsInRace.forEach(p => {
      bidMap[p.name] = p.bidId;
    });
    dispatch(setRobotBidMap(bidMap));
    
    const robotsStr = participantsInRace.map(p => p.name).join('\n');
    dispatch(setNewRobots(robotsStr));
    dispatch(sendMessage({ raceTimeLimit: 5 * 60, type: 'TIME' }));
    history.push('/admin');
  }, [heatParticipants, dispatch, history, selectedProgramId, programPhase.heatsStageId, selectedRaceCount, getRaceCountKey]);

  // Update heat participants when heats results change
  useEffect(() => {
    if (heatsResults.length > 0 && heatParticipants.length > 0) {
      setHeatParticipants(prev => prev.map(p => {
        const heatResult = heatsResults.find(hr => hr.bidId === p.bidId);
        const heatAttempt = heatResult?.attempts?.[0];
        return {
          ...p,
          laps: heatAttempt?.laps ?? null,
          time: heatAttempt?.time ?? null,
          place: null,
        };
      }));
    }
  }, [heatsResults]);

  useEffect(() => {
    if (programPhase.heatsInProgress && qualificationResults.length > 0 && heatParticipants.length === 0) {
      initializeHeatParticipants();
    }
  }, [programPhase.heatsInProgress, qualificationResults.length, heatParticipants.length, initializeHeatParticipants]);

  // Calculate places for participants with results
  const participantsWithPlaces = useMemo(() => {
    const withResults = heatParticipants.filter(p => p.laps !== null && p.time !== null);
    const withoutResults = heatParticipants.filter(p => p.laps === null || p.time === null);
    
    // Sort by laps desc, then time asc
    const sorted = [...withResults].sort((a, b) => {
      if (b.laps !== a.laps) return (b.laps ?? 0) - (a.laps ?? 0);
      return (a.time ?? Infinity) - (b.time ?? Infinity);
    });
    
    // Assign places
    const withPlaces = sorted.map((p, index) => ({ ...p, place: index + 1 }));
    const withoutPlaces = withoutResults.map(p => ({ ...p, place: null }));
    
    return [...withPlaces, ...withoutPlaces];
  }, [heatParticipants]);

  // Check if ALL participants have results (to show/hide Actions column)
  const allHaveResults = useMemo(() => {
    return heatParticipants.length > 0 && heatParticipants.every(p => p.laps !== null && p.time !== null);
  }, [heatParticipants]);

  // Check if any participant has results (for sorting)
  const hasAnyResults = useMemo(() => {
    return heatParticipants.some(p => p.laps !== null && p.time !== null);
  }, [heatParticipants]);

  // Sorted participants for display
  const sortedParticipants = useMemo(() => {
    const participants = [...participantsWithPlaces];
    
    return participants.sort((a, b) => {
      let aVal: number | null;
      let bVal: number | null;
      
      switch (sortColumn) {
        case 'qualificationPlace':
          aVal = a.qualificationPlace;
          bVal = b.qualificationPlace;
          break;
        case 'race':
          aVal = a.race;
          bVal = b.race;
          break;
        case 'place':
          aVal = a.place;
          bVal = b.place;
          break;
        default:
          aVal = a.qualificationPlace;
          bVal = b.qualificationPlace;
      }
      
      // Handle nulls - put them at the end
      if (aVal === null && bVal === null) return 0;
      if (aVal === null) return 1;
      if (bVal === null) return -1;
      
      return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
    });
  }, [participantsWithPlaces, sortColumn, sortDirection]);

  const handleSort = useCallback((column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  }, [sortColumn]);

  // Auto-switch to Place sort when results appear
  useEffect(() => {
    if (hasAnyResults && sortColumn === 'qualificationPlace') {
      setSortColumn('place');
      setSortDirection('asc');
    }
  }, [hasAnyResults, sortColumn]);

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

  const handleTabChange = (_event: React.ChangeEvent<Record<string, unknown>>, newValue: number) => {
    setSelectedTab(newValue);
  };

  return (
    <div style={{ padding: 16 }}>
      <Grid container spacing={2}>
        {/* Tabs */}
        {!bidsLoading && !stagesLoading && (
          <Grid item xs={12}>
            <Tabs
              value={selectedTab}
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="primary"
              style={{ marginBottom: 16 }}
            >
              <Tab label="Заявки" />
              <Tab label="Квалификация" />
              <Tab label="Отборочный заезд" />
              <Tab label="Финальный заезд" />
            </Tabs>
            
            {/* Phase Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
              <Typography variant="h5">
                <strong>{programPhase.phase}</strong>
              </Typography>
              {programPhase.canStartQualification && programPhase.qualificationStageId && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => startStageHandle(programPhase.qualificationStageId!)}
                >
                  Start Qualification
                </Button>
              )}
              {programPhase.canFinishQualification && programPhase.qualificationStageId && (
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => finishStageHandle(programPhase.qualificationStageId!)}
                >
                  Завершить квалификацию
                </Button>
              )}
              {programPhase.canFormHeats && programPhase.heatsStageId && programPhase.qualificationStageId && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => formHeatsBidsHandle(programPhase.heatsStageId!, programPhase.qualificationStageId!)}
                >
                  Сформировать заявки
                </Button>
              )}
            </div>
          </Grid>
        )}

        {/* Tab Content */}
        {(() => {
          // Tab 0: Заявки (Registration)
          if (selectedTab === 0) {
            return (
              <Grid item xs={12}>
                <Typography variant="h4" gutterBottom>
                  Participants ({bids.length})
                </Typography>
                {bidsLoading ? (
                  <CircularProgress size={24} />
                ) : (
                  <Table size="medium">
                    <TableHead>
                      <TableRow>
                        <TableCell style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>Name</TableCell>
                        <TableCell style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>Status</TableCell>
                        <TableCell style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>Actions</TableCell>
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
                            <TableCell style={{ fontSize: '1.1rem' }}>{bid.name}</TableCell>
                            <TableCell style={{ fontSize: '1.1rem' }}>{bid.statusLabel}</TableCell>
                            <TableCell>
                              {bid.status === 5 && (
                                <>
                                  <Button
                                    variant="outlined"
                                    onClick={() => markParticipatedHandle(bid.id)}
                                    style={{ backgroundColor: '#e8f5e9', marginRight: 8 }}
                                  >
                                    Participated
                                  </Button>
                                  <Button
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
            );
          }
          
          // Tab 1: Квалификация (Qualification Results)
          if (selectedTab === 1) {
            return (
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
                        {programPhase.phase === 'Квалификация' && (
                          <TableCell style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>Actions</TableCell>
                        )}
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
                            {programPhase.phase === 'Квалификация' && (
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
                            )}
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                )}
              </Grid>
            );
          }
          
          // Tab 2: Отборочный заезд (Heats)
          if (selectedTab === 2) {
            // Show message if heats stage not started yet
            if (!programPhase.heatsInProgress && !programPhase.finalPending && !programPhase.finalInProgress) {
              return (
                <Grid item xs={12}>
                  <Typography variant="body1">
                    Отборочный этап будет доступен после завершения квалификации и формирования заявок.
                  </Typography>
                </Grid>
              );
            }
            
            return (
              <Grid item xs={12}>
                {/* Finish Stage Button */}
                {allHaveResults && programPhase.heatsStageId && programPhase.heatsInProgress && (
                  <div style={{ marginBottom: 16 }}>
                    <Button
                      variant="contained"
                      color="secondary"
                      size="large"
                      onClick={() => finishStageHandle(programPhase.heatsStageId!)}
                    >
                      Завершить отборочный этап
                    </Button>
                  </div>
                )}
                
                {/* Race Count Buttons */}
                {heatParticipants.length > 0 && (
                  <div style={{ marginBottom: 16 }}>
                    <Typography variant="body1" style={{ marginBottom: 8 }}>
                      Count of races: {raceCountLocked && <span style={{ color: '#888' }}>(locked)</span>}
                    </Typography>
                    {calculateRaceCountOptions(heatParticipants.length).map((count) => (
                      <Button
                        key={count}
                        variant={selectedRaceCount === count ? "contained" : "outlined"}
                        color="primary"
                        onClick={() => handleRaceCountChange(count)}
                        style={{ marginRight: 8 }}
                        disabled={raceCountLocked}
                      >
                        {count}
                      </Button>
                    ))}
                  </div>
                )}

                {heatParticipants.length > 0 ? (
                  <Table size="medium">
                    <TableHead>
                      <TableRow>
                        <TableCell 
                          style={{ fontSize: '1.1rem', fontWeight: 'bold', cursor: hasAnyResults ? 'pointer' : 'default' }}
                          onClick={() => hasAnyResults && handleSort('place')}
                        >
                          Place {sortColumn === 'place' && (sortDirection === 'asc' ? '↑' : '↓')}
                        </TableCell>
                        <TableCell style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>Name</TableCell>
                        <TableCell 
                          style={{ fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer' }}
                          onClick={() => handleSort('qualificationPlace')}
                        >
                          Q Place {sortColumn === 'qualificationPlace' && (sortDirection === 'asc' ? '↑' : '↓')}
                        </TableCell>
                        <TableCell style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>Q Time</TableCell>
                        <TableCell 
                          style={{ fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer' }}
                          onClick={() => handleSort('race')}
                        >
                          Race {sortColumn === 'race' && (sortDirection === 'asc' ? '↑' : '↓')}
                        </TableCell>
                        <TableCell style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>Position</TableCell>
                        <TableCell style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>Laps</TableCell>
                        <TableCell style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>Time</TableCell>
                        {!allHaveResults && programPhase.heatsInProgress && (
                          <TableCell style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>Actions</TableCell>
                        )}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {sortedParticipants.map((participant, index, sortedArray) => {
                          const raceColors = ['#e3f2fd', '#fff3e0', '#e8f5e9', '#fce4ec', '#f3e5f5', '#e0f7fa'];
                          const bgColor = raceColors[(participant.race - 1) % raceColors.length];
                          const isFirstInRace = index === 0 || sortedArray[index - 1].race !== participant.race;
                          const raceParticipants = heatParticipants.filter(p => p.race === participant.race);
                          const raceHasNoResults = raceParticipants.every(p => p.laps === null && p.time === null);
                          return (
                            <TableRow key={participant.bidId} style={{ backgroundColor: bgColor }}>
                              <TableCell style={{ fontSize: '1.1rem' }}>{participant.place ?? '-'}</TableCell>
                              <TableCell style={{ fontSize: '1.1rem' }}>{participant.name}</TableCell>
                              <TableCell style={{ fontSize: '1.1rem' }}>{participant.qualificationPlace}</TableCell>
                              <TableCell style={{ fontSize: '1.1rem' }}>{formatTime(participant.qualificationTime)}</TableCell>
                              <TableCell style={{ fontSize: '1.1rem' }}>{participant.race}</TableCell>
                              <TableCell style={{ fontSize: '1.1rem' }}>{participant.position}</TableCell>
                              <TableCell style={{ fontSize: '1.1rem' }}>{participant.laps ?? '-'}</TableCell>
                              <TableCell style={{ fontSize: '1.1rem' }}>{formatTime(participant.time)}</TableCell>
                              {!allHaveResults && programPhase.heatsInProgress && (
                                <TableCell>
                                  {isFirstInRace && raceHasNoResults && (
                                    <Button
                                      variant="contained"
                                      color="primary"
                                      onClick={() => startRaceHandle(participant.race)}
                                    >
                                      Start Race {participant.race}
                                    </Button>
                                  )}
                                </TableCell>
                              )}
                            </TableRow>
                          );
                        })}
                    </TableBody>
                  </Table>
                ) : (
                  <Typography variant="body1">
                    Загрузка данных...
                  </Typography>
                )}
              </Grid>
            );
          }
          
          // Tab 3: Финальный заезд (Final)
          if (selectedTab === 3) {
            // Final Phase - Pending (formation)
            if (programPhase.finalPending) {
              return (
                <Grid item xs={12}>
                  <Typography variant="h4" gutterBottom>
                    Финал - Формирование заезда
                  </Typography>
                  
                  {/* Form Final Button */}
                  <div style={{ marginBottom: 16 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      size="large"
                      onClick={() => programPhase.finalStageId && 
                        formFinalBidsHandle(programPhase.finalStageId, selectedFinalCount)}
                    >
                      Сформировать заезд
                    </Button>
                  </div>
                  
                  {/* Finalist Count Buttons */}
                  <div style={{ marginBottom: 16 }}>
                    <Typography variant="body1" style={{ marginBottom: 8 }}>
                      Количество финалистов:
                    </Typography>
                    {[3, 4, 5, 6].filter(count => count <= sortedHeatsResults.length).map((count) => (
                      <Button
                        key={count}
                        variant={selectedFinalCount === count ? "contained" : "outlined"}
                        color="primary"
                        onClick={() => setSelectedFinalCount(count)}
                        style={{ marginRight: 8 }}
                      >
                        {count}
                      </Button>
                    ))}
                  </div>

                  <Table size="medium">
                    <TableHead>
                      <TableRow>
                        <TableCell style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>Place</TableCell>
                        <TableCell style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>Name</TableCell>
                        <TableCell style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>Laps</TableCell>
                        <TableCell style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>Time</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {sortedHeatsResults.map((result) => {
                        const isFinalist = result.place <= selectedFinalCount;
                        const bgColor = isFinalist ? '#c8e6c9' : '#ffcdd2';
                        return (
                          <TableRow key={result.bidId} style={{ backgroundColor: bgColor }}>
                            <TableCell style={{ fontSize: '1.1rem' }}>{result.place}</TableCell>
                            <TableCell style={{ fontSize: '1.1rem' }}>{result.name}</TableCell>
                            <TableCell style={{ fontSize: '1.1rem' }}>{result.attempts?.[0]?.laps ?? '-'}</TableCell>
                            <TableCell style={{ fontSize: '1.1rem' }}>{formatTime(result.attempts?.[0]?.time ?? null)}</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </Grid>
              );
            }
            
            // Final Phase - In Progress
            if (programPhase.finalInProgress) {
              const hasAnyFinalResults = finalistsWithResults.some(f => f.finalLaps !== null);
              return (
                <Grid item xs={12}>
                  <Typography variant="h4" gutterBottom>
                    Финал
                  </Typography>
                  
                  <Table size="medium">
                    <TableHead>
                      <TableRow>
                        <TableCell style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>Place</TableCell>
                        <TableCell style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>Position</TableCell>
                        <TableCell style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>Name</TableCell>
                        <TableCell style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>Laps</TableCell>
                        <TableCell style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>Time</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {finalistsWithResults.map((result) => (
                        <TableRow key={result.bidId} style={{ backgroundColor: '#c8e6c9' }}>
                          <TableCell style={{ fontSize: '1.1rem' }}>{result.finalPlace ?? '-'}</TableCell>
                          <TableCell style={{ fontSize: '1.1rem' }}>{result.position}</TableCell>
                          <TableCell style={{ fontSize: '1.1rem' }}>{result.name}</TableCell>
                          <TableCell style={{ fontSize: '1.1rem' }}>{result.finalLaps ?? '-'}</TableCell>
                          <TableCell style={{ fontSize: '1.1rem' }}>{formatTime(result.finalTime)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  
                  {!hasAnyFinalResults && (
                    <div style={{ marginTop: 24, textAlign: 'center' }}>
                      <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        onClick={startFinalRaceHandle}
                      >
                        Race Start
                      </Button>
                    </div>
                  )}
                </Grid>
              );
            }
            
            // Final tab but not in final phase yet - show message
            return (
              <Grid item xs={12}>
                <Typography variant="h4" gutterBottom>
                  Финальный заезд
                </Typography>
                <Typography variant="body1">
                  Финальный заезд будет доступен после завершения отборочного этапа.
                </Typography>
              </Grid>
            );
          }
          
          return null;
        })()}
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
  return formatTime(attempt.time);
};

export default ProgramDashboard;
