import { useEffect, useRef, useState } from "react";
import PageShell, { Card, PrimaryButton } from "../components/PageShell";
import { useStudy } from "../contexts/StudyContext";
import { TRIAL_COUNT } from "../study/design";
import { sessionFileName } from "../study/session";
import { downloadJson } from "../study/storage";

type CopyState = "idle" | "copied" | "failed";

const COPY_MESSAGES: Record<CopyState, string> = {
  idle: "",
  copied: "Copied. Paste it into a message to the researcher.",
  failed: "Copying did not work in this browser. Please use the download button.",
};

export default function CompletePage() {
  const { lastCompleted, dismissCompleted } = useStudy();
  const hasDownloaded = useRef(false);
  const [copyState, setCopyState] = useState<CopyState>("idle");

  useEffect(() => {
    if (!lastCompleted || hasDownloaded.current) return;
    hasDownloaded.current = true;
    downloadJson(sessionFileName(lastCompleted), lastCompleted);
  }, [lastCompleted]);

  if (!lastCompleted) {
    return null;
  }

  const record = lastCompleted;
  const fileName = sessionFileName(record);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(JSON.stringify(record));
      setCopyState("copied");
    } catch {
      setCopyState("failed");
    }
  }

  return (
    <PageShell title="Thank you" subtitle="You have finished the study.">
      <Card>
        <p className="text-sm text-slate-700">
          You made{" "}
          <strong className="text-slate-900">
            {record.score} of {TRIAL_COUNT}
          </strong>{" "}
          correct decisions.
        </p>
      </Card>

      <Card>
        <h2 className="text-sm font-semibold text-slate-800">One last step: send your results</h2>
        <p className="text-sm text-slate-700 leading-relaxed">
          A file named <strong>{fileName}</strong> has been saved to your downloads folder. Please
          send it to the researcher who invited you. Your answers are only in that file. Nothing
          was uploaded anywhere.
        </p>
        <PrimaryButton onClick={() => downloadJson(fileName, record)}>
          Download the results file again
        </PrimaryButton>
        <button
          type="button"
          onClick={handleCopy}
          className="w-full py-2.5 rounded-xl font-semibold text-sm text-slate-700 border border-slate-300 hover:bg-slate-100 transition-colors"
        >
          Or copy the results as text
        </button>
        <p className="text-sm text-slate-600 min-h-[1.25rem]" role="status">
          {COPY_MESSAGES[copyState]}
        </p>
      </Card>

      <Card>
        <h2 className="text-sm font-semibold text-slate-800">What the study was about</h2>
        <p className="text-sm text-slate-700 leading-relaxed">
          In half of the tasks the AI summary contained one statement that contradicted the
          report. The study compares how well the three interfaces help people notice that. All
          reports, products and incidents were invented for the study.
        </p>
        <p className="text-sm text-slate-700 leading-relaxed">
          Please do not describe the tasks to anyone who might still take part.
        </p>
      </Card>

      <p className="text-center text-xs text-slate-400">
        <button type="button" onClick={dismissCompleted} className="underline hover:text-slate-600">
          Researcher: return to the start page
        </button>
      </p>
    </PageShell>
  );
}
