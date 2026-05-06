import { Container } from "@material-ui/core";
import React from "react";
import RaceHeader from "../components/common/RaceHeader";
import ProgramDashboard from "../components/race/ProgramDashboard";
import RaceGridWrapper from "../components/race/RaceGridWrapper";
import { useAppSelector } from "../store";

const MainPage: React.FC = () => {
  const selectedProgramId = useAppSelector((state) => state.race.selectedProgramId);

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
