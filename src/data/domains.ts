import type { Domain } from "./types";

export interface DomainBriefing {
  role: string;
  board: string;
  // The explicit decision rule. Shown on every trial in every interface, so a
  // decision follows from facts in the report and not from a general
  // impression of it.
  policy: string;
}

export const DOMAIN_BRIEFINGS: Record<Domain, DomainBriefing> = {
  library: {
    role: "a senior backend engineer",
    board: "your team's infrastructure review board",
    policy:
      "Approve a library only if the report shows (1) no critical or high-severity security vulnerability and (2) stable behaviour for the full duration of sustained load testing.",
  },
  model: {
    role: "a machine learning engineer",
    board: "your team's model review board",
    policy:
      "Approve deployment only if the report shows (1) no overlap (leakage) between the training data and the holdout set and (2) the model meets its stated target on the holdout set.",
  },
  postmortem: {
    role: "a site reliability engineer",
    board: "your team's incident review board",
    policy:
      "Approve shipping a fix only if the report shows the failure no longer occurs in validation testing at full production-scale load.",
  },
};
