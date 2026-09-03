import { Container } from "@material-ui/core";
import React, { useCallback, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import RaceHeader from "../components/common/RaceHeader";
import ProgramDashboard from "../components/race/ProgramDashboard";
import RaceGridWrapper from "../components/race/RaceGridWrapper";
import { useAppDispatch, useAppSelector } from "../store";
import { setSelectedEventId, setSelectedProgramId, setPrograms } from "../store/race/reduser";
import { IProgram } from "../store/race/interfaces";

interface RouteParams {
  eventId?: string;
  programId?: string;
}

const MainPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const history = useHistory();
  const { eventId, programId } = useParams<RouteParams>();
  const selectedProgramId = useAppSelector((state) => state.race.selectedProgramId);
  const selectedEventId = useAppSelector((state) => state.race.selectedEventId);
  const programs = useAppSelector((state) => state.race.programs);
  const socketWsURL = useAppSelector((state) => state.socket.wsURL);

  const getBaseUrl = useCallback(() => {
    return socketWsURL
      .replace(/^ws:/, "http:")
      .replace(/^wss:/, "https:")
      .replace(/\/ws\/?$/, "");
  }, [socketWsURL]);

  // Load programs for event
  const loadPrograms = useCallback(async (eventIdNum: number) => {
    try {
      const response = await fetch(`${getBaseUrl()}/robofinist/events/${eventIdNum}/programs`);
      const data: IProgram[] = await response.json();
      dispatch(setPrograms(data));
    } catch (error) {
      console.error("Failed to load programs:", error);
    }
  }, [getBaseUrl, dispatch]);

  // Load from URL params on mount
  useEffect(() => {
    if (eventId && programId) {
      const eventIdNum = parseInt(eventId, 10);
      const programIdNum = parseInt(programId, 10);
      if (!isNaN(eventIdNum) && !isNaN(programIdNum)) {
        if (selectedEventId !== eventIdNum) {
          dispatch(setSelectedEventId(eventIdNum));
          loadPrograms(eventIdNum);
        }
        if (selectedProgramId !== programIdNum) {
          dispatch(setSelectedProgramId(programIdNum));
        }
      }
    }
  }, [eventId, programId, dispatch, selectedEventId, selectedProgramId, loadPrograms]);

  // Load programs when eventId changes
  useEffect(() => {
    if (selectedEventId && programs.length === 0) {
      loadPrograms(selectedEventId);
    }
  }, [selectedEventId, programs.length, loadPrograms]);

  // Update URL when selection changes
  useEffect(() => {
    if (selectedEventId && selectedProgramId) {
      const expectedPath = `/event/${selectedEventId}/program/${selectedProgramId}`;
      if (history.location.pathname !== expectedPath) {
        history.replace(expectedPath);
      }
    } else if (history.location.pathname !== '/') {
      // Only redirect to root if we're not already there and have no selection
      if (!selectedEventId && !selectedProgramId && !eventId && !programId) {
        history.replace('/');
      }
    }
  }, [selectedEventId, selectedProgramId, history, eventId, programId]);

  return (
    <div>
      {!selectedProgramId && <RaceHeader />}
      <Container maxWidth="xl">
        {selectedProgramId ? <ProgramDashboard /> : <RaceGridWrapper />}
      </Container>
    </div>
  );
};

export default MainPage;
