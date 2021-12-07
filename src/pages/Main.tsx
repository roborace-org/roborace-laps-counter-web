import { Container } from "@material-ui/core";
import React from "react";
import RaceHeader from "../components/common/RaceHeader";

import RaceGridWrapper from "../components/race/RaceGridWrapper";

const MainPage: React.FC = () => {
  return (
    <div>
      <RaceHeader />
      <Container maxWidth="xl">
        <RaceGridWrapper />
      </Container>
    </div>
  );
};

export default MainPage;
