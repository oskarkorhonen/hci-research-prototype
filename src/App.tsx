import React from "react";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { TelemetryProvider } from "./contexts/TelemetryContext";
import SelectionPage from "./pages/SelectionPage";
import InstructionsPage from "./pages/InstructionsPage";
import TaskPage from "./pages/TaskPage";
import SurveyPage from "./pages/SurveyPage";
import CompletePage from "./pages/CompletePage";
import AdminPage from "./pages/AdminPage";

export default function App() {
  return (
    <TelemetryProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<SelectionPage />} />
          <Route path="/instructions" element={<InstructionsPage />} />
          <Route path="/task" element={<TaskPage />} />
          <Route path="/survey" element={<SurveyPage />} />
          <Route path="/complete" element={<CompletePage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </TelemetryProvider>
  );
}
