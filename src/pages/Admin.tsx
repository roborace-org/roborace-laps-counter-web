import { Container } from "@material-ui/core";
import React from "react";
import RaceHeader from "../components/common/RaceHeader";

import RaceGridWrapper from "../components/race/RaceGridWrapper";

const MainPage: React.FC = () => {
  return (
    <div>
      <RaceHeader asAdmin={true} />
      <Container maxWidth="xl">
        <RaceGridWrapper asAdmin={true} />
      </Container>
    </div>
  );
};

export default MainPage;
