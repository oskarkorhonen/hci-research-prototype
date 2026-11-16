import type { Scenario } from "../types";

// Search service out-of-memory crashes INC-4631: fixed by a size cap on the
// query-result cache. The deciding problem is that the crash recurred in 2 of
// 10 full-load validation runs. That result appears only in the one passage on
// page 5 (5.1). The reduced-load runs on page 4 are true and clean.
export const scenario: Scenario = {
  id: "postmortem-incorrect-2",
  domain: "postmortem",
  trial_type: "AI-Incorrect",
  research_question:
    "Based on the postmortem and fix validation report, should the fix for the search service out-of-memory crashes (Incident INC-4631) be approved to ship?",
  correct_answer: "No",
  key_block_id: "b3",
  ai_summary_blocks: [
    {
      id: "b1",
      text: "The root cause was a query-result cache with no size limit, which grew until the service ran out of memory.",
      label: "Incident INC-4631 Report, p. 3",
      citation: {
        page_num: 3,
        exact_text:
          "The root cause was a query-result cache with no size limit: entries were added for every distinct query and never removed, so memory use climbed steadily until the service process ran out of memory and was killed.",
      },
    },
    {
      id: "b2",
      text: "Two engineers outside the project reviewed and signed off on the change, and automated tests cover 91% of the modified code.",
      label: "Incident INC-4631 Report, p. 4",
      citation: {
        page_num: 4,
        exact_text:
          "Two engineers from outside the search team reviewed the change and signed off on it, and automated test coverage of the changed code is 91%.",
      },
    },
    {
      id: "b3",
      text: "In ten validation runs at full production-scale load, the out-of-memory crash did not recur.",
      label: "Incident INC-4631 Report, p. 5",
      citation: {
        page_num: 5,
        exact_text:
          "In the ten six-hour runs at full production-scale load, the out-of-memory crash recurred in 2 of the 10 runs, after 3 hours 40 minutes and after 5 hours 10 minutes, even with the cache cap in place.",
      },
    },
  ],
  document: {
    id: "postmortem-incorrect-2",
    title: "Postmortem and Fix Validation Report: Search Service Memory Crashes (INC-4631)",
    authors: "Nakamura, H., Brandt, S., & Okonkwo, J.",
    journal: "Site Reliability Engineering Report Series, 2024, No. 4631",
    pages: [
      {
        pageNum: 1,
        sections: [
          {
            heading: "SUMMARY",
            body: "Background: The search service answers product and content searches for the website and mobile app. On 2 June 2024 its instances repeatedly ran out of memory and restarted, an incident tracked as INC-4631 that degraded search for 2 hours 5 minutes. The cause was a query-result cache, a store of recent search answers kept in memory for reuse, that grew without limit. A fix has been developed.",
          },
          {
            body: "Objective: To document the incident, its root cause, the fix, and how the fix was tested, so that the incident review board has the facts it needs to decide whether the fix ships.",
          },
          {
            body: "Methods: We rebuilt the incident from service logs and memory dumps and found the root cause by examining what filled the memory. We then validated the fix with automated tests and with repeated validation runs of six hours each, at two traffic levels: 40% of production traffic and full production-scale load, meaning the query rate seen at the daily peak.",
          },
          {
            body: "Scope: This report presents findings only. It does not contain a recommendation. The decision rests with the incident review board, which applies its own policy to the findings in Sections 2 to 5.",
          },
          {
            body: "Report structure: Section 1 gives the incident background and timeline, Section 2 the root cause, Section 3 the fix, Section 4 the validation method and first results, Section 5 the full-load validation and rollout preparation, and Section 6 the limitations. Appendix A gives incident figures and Appendix B the test environment.",
          },
        ],
      },
      {
        pageNum: 2,
        sections: [
          {
            heading: "1. INCIDENT BACKGROUND AND TIMELINE",
            body: "",
          },
          {
            heading: "1.1 The Search Service",
            body: "The search service runs as ten identical instances. Each instance keeps a cache of recent query results in memory so that repeated searches are answered without touching the index. On a typical day the service handles about 500 queries per second, and at the daily peak it handles about 1,200.",
          },
          {
            heading: "1.2 Customer Impact",
            body: "Between 14:40 and 16:45 UTC on 2 June 2024, searches were slow or failed on every instance in turn. About 26% of search requests returned an error during the period, and an estimated 140,000 searches failed in total.",
          },
          {
            heading: "1.3 Timeline",
            body: "14:10, a marketing campaign launches and search traffic rises. 14:40, the first instance runs out of memory and restarts. 14:52, the on-call engineer is paged after three restarts. 15:20, engineers see memory climbing on every instance and begin restarting instances on a schedule to keep them alive. 16:45, the campaign ends and traffic falls enough for instances to stay up. 18:00, the incident is closed.",
          },
          {
            heading: "1.4 Alerting",
            body: "Minor caveat, outside the board's criteria: the page to the on-call engineer went out 12 minutes after the first restart, because the alert required three restarts within ten minutes. The rule has since been changed to fire on the first restart. This affects how quickly future incidents are noticed and has no bearing on whether the fix itself works.",
          },
          {
            heading: "1.5 Incident Response Team",
            body: "Four engineers worked on the incident: the on-call engineer, two members of the search team and one platform engineer. A fifth engineer wrote the customer-facing status updates.",
          },
        ],
      },
      {
        pageNum: 3,
        sections: [
          {
            heading: "2. ROOT CAUSE",
            body: "",
          },
          {
            heading: "2.1 Mechanism",
            body: "The root cause was a query-result cache with no size limit: entries were added for every distinct query and never removed, so memory use climbed steadily until the service process ran out of memory and was killed.",
          },
          {
            heading: "2.2 How It Was Found",
            body: "Engineers took memory dumps from three instances shortly before they failed. In each, more than 80% of the memory was held by cached query results. The cache code contained no limit on the number of entries or on their total size.",
          },
          {
            heading: "2.3 Why It Appeared on 2 June",
            body: "The cache had grown slowly for months, but instances were restarted by weekly deployments before it became large. A deployment freeze left the instances running for 19 days, and the campaign added many unusual long-tail queries, each of which created a new cache entry.",
          },
          {
            heading: "3. THE FIX",
            body: "",
          },
          {
            heading: "3.1 Change Made",
            body: "The fix caps the query-result cache at 2 GB per instance and removes the least recently used entries first when the cap is reached. Evicting an entry only means that a later identical search is answered from the index instead of from memory.",
          },
          {
            heading: "3.2 Scope of the Change",
            body: "The change touches the cache module and one configuration file. The cap is a configuration value, so it can be raised or lowered without a new release, and the change can be switched off with a single flag.",
          },
          {
            heading: "3.3 Performance Overhead",
            body: "Because some searches now go to the index instead of the cache, the median search time rose from 38 ms to 41 ms in a single-instance benchmark, an increase of about 8%.",
          },
        ],
      },
      {
        pageNum: 4,
        sections: [
          {
            heading: "4. VALIDATION METHOD AND FIRST RESULTS",
            body: "",
          },
          {
            heading: "4.1 Validation Approach",
            body: "The fix was validated with the existing automated tests, new tests aimed at the cache, and repeated six-hour runs in a dedicated test environment. Runs were made at two traffic levels, ten runs at 40% of production traffic and ten runs at full production-scale load. Full production-scale load means 1,200 queries per second, matching the daily peak.",
          },
          {
            heading: "4.2 Automated Tests",
            body: "The existing suite of 2,030 tests passed after the change. We added 27 tests for the cache, covering the size cap and the eviction order, and all 27 passed.",
          },
          {
            heading: "4.3 Code Review and Test Coverage",
            body: "Two engineers from outside the search team reviewed the change and signed off on it, and automated test coverage of the changed code is 91%.",
          },
          {
            heading: "4.4 Reduced-Load Validation Runs",
            body: "In the ten six-hour runs at 40% of production traffic, about 480 queries per second, memory use on every instance levelled off below 55% of available memory and no out-of-memory crash occurred. The cache reached its 2 GB cap in every run and stayed there.",
          },
          {
            heading: "4.5 Test Environment",
            body: "Tests ran on ten search instances matching production hardware, with an index copy of production size. Query traffic was generated by replaying a sample of recorded queries, including the long-tail queries from the campaign.",
          },
        ],
      },
      {
        pageNum: 5,
        sections: [
          {
            heading: "5. FULL-LOAD VALIDATION AND ROLLOUT PREPARATION",
            body: "",
          },
          {
            heading: "5.1 Full-Load Validation Runs",
            body: "Each run started from a freshly restarted environment so that no run could affect another. In the ten six-hour runs at full production-scale load, the out-of-memory crash recurred in 2 of the 10 runs, after 3 hours 40 minutes and after 5 hours 10 minutes, even with the cache cap in place.",
          },
          {
            heading: "5.2 Rollback Rehearsal",
            body: "The team rehearsed switching the cap off through its configuration flag in a staging environment. The rollback took five minutes and returned the service to its previous behaviour with no interruption to search.",
          },
          {
            heading: "5.3 Monitoring Added",
            body: "Two new alerts were added: one on cache size above 90% of its cap and one on instance memory above 85%. Both alerts and their dashboards were tested with synthetic load and fired as expected.",
          },
          {
            heading: "5.4 Proposed Rollout",
            body: "The proposed rollout enables the fix on two of the ten instances for 48 hours and then on all ten. A named on-call engineer is assigned for the rollout window, and the rollback steps are listed in the updated runbook.",
          },
          {
            heading: "5.5 Documentation",
            body: "The runbook for search memory alerts now includes the cap setting and the rollback steps. The incident has been logged in the tracker with links to the memory dumps, the replay scripts and this report.",
          },
        ],
      },
      {
        pageNum: 6,
        sections: [
          {
            heading: "6. LIMITATIONS",
            body: "This report covers Incident INC-4631 and the query-result cache of the search service only. Other in-memory structures in the service were not examined.",
          },
          {
            body: "Minor caveat, outside the board's criteria: the customer impact figures in Section 1.2 are estimates derived from request logs, and the total number of failed searches may be off by a few thousand.",
          },
          {
            heading: "APPENDIX A: INCIDENT FIGURES",
            body: "Duration of customer impact: 2 hours 5 minutes. Share of search requests that returned an error during impact: 26%. Failed searches: about 140,000. Share of memory held by cached query results in dumps: above 80%. Days instances ran without a restart before the incident: 19. Typical load: about 500 queries per second. Peak load: about 1,200 queries per second.",
          },
          {
            heading: "APPENDIX B: TEST ENVIRONMENT",
            body: "Search instances: ten, each with 8 CPU cores and 32 GB of memory. Index: a copy of the production index. Load profiles: 480 queries per second and 1,200 queries per second, each for six hours, replayed from recorded query samples. Cache cap under test: 2 GB per instance.",
          },
          {
            heading: "REFERENCES",
            body: "[1] Search Team. (2024). Search Service Architecture Overview, v4. Internal engineering handbook.\n[2] Nakamura, H., Brandt, S., & Okonkwo, J. (2023). Standard Method for Replay-Based Load Validation of Search Services. Site Reliability Engineering Report Series, No. 3957.\n[3] Incident Review Board. (2024). Incident Report Template, v3. Internal engineering handbook.",
          },
        ],
      },
    ],
  },
};
