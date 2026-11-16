import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import { StudyProvider, useStudy } from "./contexts/StudyContext";
import type { Phase } from "./contexts/StudyContext";
import AboutYouPage from "./pages/AboutYouPage";
import AdminPage from "./pages/AdminPage";
import BlockSurveyPage from "./pages/BlockSurveyPage";
import BriefingPage from "./pages/BriefingPage";
import CompletePage from "./pages/CompletePage";
import ConfidencePage from "./pages/ConfidencePage";
import FinalSurveyPage from "./pages/FinalSurveyPage";
import InterfaceIntroPage from "./pages/InterfaceIntroPage";
import TaskPage from "./pages/TaskPage";
import WelcomePage from "./pages/WelcomePage";

const PHASE_SCREENS: Record<Phase, () => JSX.Element | null> = {
  "about-you": AboutYouPage,
  briefing: BriefingPage,
  interface: InterfaceIntroPage,
  task: TaskPage,
  confidence: ConfidencePage,
  "block-survey": BlockSurveyPage,
  final: FinalSurveyPage,
};

// The whole participant flow lives at one URL. Which screen shows is decided
// by the session's phase, so the browser's back button cannot revisit a task.
function StudyFlow() {
  const { session, lastCompleted } = useStudy();
  if (!session) {
    return lastCompleted ? <CompletePage /> : <WelcomePage />;
  }
  const Screen = PHASE_SCREENS[session.phase];
  return <Screen />;
}

export default function App() {
  return (
    <StudyProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<StudyFlow />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </StudyProvider>
  );
}
