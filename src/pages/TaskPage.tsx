import React from "react";
import { useTelemetry } from "../contexts/TelemetryContext";
import BaselineTaskPage from "./BaselineTaskPage";
import VoluntaryTaskPage from "./VoluntaryTaskPage";
import ForcedTaskPage from "./ForcedTaskPage";

export default function TaskPage() {
  const { conditionId } = useTelemetry();

  if (conditionId === "2") return <VoluntaryTaskPage />;
  if (conditionId === "3") return <ForcedTaskPage />;
  return <BaselineTaskPage />;
}
