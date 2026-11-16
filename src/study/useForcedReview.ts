import { useCallback, useEffect, useRef, useState } from "react";

export const FORCED_REVIEW_SECONDS = 15;

export type ForcedReviewState = "idle" | "reviewing" | "unlocked";

interface ForcedReview {
  state: ForcedReviewState;
  secondsLeft: number;
  start: () => void;
}

// The cognitive forcing function: once started, submission stays locked for a
// fixed number of seconds while the key passage is on screen.
export function useForcedReview(): ForcedReview {
  const [state, setState] = useState<ForcedReviewState>("idle");
  const [secondsLeft, setSecondsLeft] = useState(FORCED_REVIEW_SECONDS);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopTimer = useCallback(() => {
    if (timer.current !== null) {
      clearInterval(timer.current);
      timer.current = null;
    }
  }, []);

  useEffect(() => stopTimer, [stopTimer]);

  useEffect(() => {
    if (state === "reviewing" && secondsLeft <= 0) {
      stopTimer();
      setState("unlocked");
    }
  }, [state, secondsLeft, stopTimer]);

  const start = useCallback(() => {
    stopTimer();
    setSecondsLeft(FORCED_REVIEW_SECONDS);
    setState("reviewing");
    timer.current = setInterval(() => setSecondsLeft((seconds) => seconds - 1), 1000);
  }, [stopTimer]);

  return { state, secondsLeft, start };
}
