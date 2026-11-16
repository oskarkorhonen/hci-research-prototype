# Study materials: how the reports and AI summaries are built

Each trial shows a three-claim "AI-generated summary" of a fictional technical
report, with the report in a viewer beside it. The participant answers one
Yes/No question by applying a board policy that is shown on screen.

- **AI-Incorrect trial:** one claim (the key claim) misstates the report. Correct answer: No.
- **AI-Correct trial:** all three claims are accurate. Correct answer: Yes.

The study measures whether people check the source, so checking must be
necessary: the deciding fact sits in exactly one passage of the report.

One scenario is one file in `src/data/scenarios/`, shaped like
`library-incorrect-1.ts` (the reference example). Types are in
`src/data/types.ts`, policies in `src/data/domains.ts`. The rules below are
enforced where possible by `src/data/scenarios/materials.test.ts`
(`npx vitest run src/data/scenarios`).

## The twelve scenarios

| File | Subject | Type | Key block | Key page | Deciding fact |
|---|---|---|---|---|---|
| library-incorrect-1 | swiftcache, caching library | AI-Incorrect | b2 | 5 | Audit rated a cache-key vulnerability critical |
| library-correct-1 | queuelite, message queue library | AI-Correct | b1 | 4 | Audit found no critical or high-severity vulnerability |
| library-incorrect-2 | tidepool, connection-pool library | AI-Incorrect | b1 | 4 | Open connections kept growing; pool exhausted near hour 31 of every 48-hour run |
| library-correct-2 | logweave, structured-logging library | AI-Correct | b2 | 5 | Stable for the full sustained load test |
| model-incorrect-1 | RankFlow, recommendation ranking model | AI-Incorrect | b3 | 5 | 12% of holdout sessions were also in the training data |
| model-correct-1 | SignalCast, demand-forecasting model | AI-Correct | b3 | 4 | No overlap between training and holdout data |
| model-incorrect-2 | FraudLens, fraud classifier | AI-Incorrect | b2 | 4 | Holdout recall 71%, target 85% |
| model-correct-2 | ChurnScope, churn-prediction model | AI-Correct | b3 | 5 | Meets its stated target on the holdout set |
| postmortem-incorrect-1 | Checkout outage INC-4417, race condition | AI-Incorrect | b1 | 4 | Race condition still occurred in 3% of full-load runs |
| postmortem-correct-1 | Authentication outage INC-4502, certificate renewal | AI-Correct | b1 | 5 | No failure at full production-scale load |
| postmortem-incorrect-2 | Search service out-of-memory crashes INC-4631 | AI-Incorrect | b3 | 5 | Crash recurred in 2 of 10 full-load runs |
| postmortem-correct-2 | Notification duplicates INC-4688, idempotency keys | AI-Correct | b2 | 4 | Zero duplicates at full production-scale load |

## Rules for every report

1. Exactly 6 pages, laid out like the reference example. Page 1 is a SUMMARY
   with Background, Objective, Methods, Scope and Report structure, and no
   results. Page 1 contains the words "presents findings only" and says the
   decision rests with the board.
2. 1050 to 1500 words of body text.
3. No verdicts anywhere: no recommendation, conclusion, approval status or
   "ready / not ready" statement, and no Discussion or Conclusions section.
   The report presents findings; the participant decides.
4. **Single-location rule.** In an AI-Incorrect report the deciding problem
   appears only in the one section that holds the key passage. No other
   sentence, heading, appendix figure, limitation or reference may mention it,
   hint at it, or let a reader infer it. Someone who reads everything except
   that section must come away believing the policy is satisfied. Appendix
   figures stay consistent with the report without revealing the problem.
5. Every policy condition is addressed in its own section. Any condition that
   is not the key one is clearly satisfied.
6. Every report, of either type, contains exactly two minor caveats in
   sections away from the key passage, each explicitly marked as minor and
   clearly outside the policy's criteria. Negative-sounding words alone must
   not tell the two trial types apart.
7. In an AI-Correct report the key passage states plainly that the condition
   is met.
8. Fictional names only. Plain English a computer-science student can follow,
   with specialist terms explained in a few words on first use. Numbers stay
   consistent across sections and appendix.

## Rules for the three summary blocks

1. Exactly b1, b2, b3. Each `text` is one sentence of 12 to 32 words, positive
   in tone, in the same style for both trial types, and a paraphrase of its
   cited sentence, never a verbatim copy.
2. `citation.exact_text` is copied character for character from a single
   section body on `citation.page_num`, is one or two complete sentences, and
   occurs exactly once in the document.
3. `label` ends with "p. N" where N is `page_num`.
4. The three cited passages are different sentences on at least two pages.
   The two non-key cited sentences do not mention the deciding problem.
5. In an AI-Incorrect scenario the key claim asserts that the policy condition
   is met, worded as a correct report's claim would be, and its cited passage
   plainly shows it is not, with the severity, number or outcome stated. The
   other two claims are accurate.
6. The key passage sits among other sections on its page and does not stand
   out typographically.
