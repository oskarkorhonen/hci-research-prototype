import type { Scenario } from "../types";

// Checkout outage INC-4417: a race condition in the order-update path. The
// deciding problem is that the race condition still occurred in 3% of the
// full-load validation runs after the fix. That result appears only in the one
// passage on page 4 (4.3). Everything else in the report is clean or
// explicitly minor, so the decision cannot be made from a general impression.
export const scenario: Scenario = {
  id: "postmortem-incorrect-1",
  domain: "postmortem",
  trial_type: "AI-Incorrect",
  research_question:
    "Based on the postmortem and fix validation report, should the fix for the checkout service race condition (Incident INC-4417) be approved to ship?",
  correct_answer: "No",
  key_block_id: "b1",
  ai_summary_blocks: [
    {
      id: "b1",
      text: "Validation testing at full production-scale load showed the race condition no longer occurs once the fix is applied.",
      label: "Incident INC-4417 Report, p. 4",
      citation: {
        page_num: 4,
        exact_text:
          "After the fix was applied, the race condition still occurred in 3 of the 100 full-load runs (3%), each time leaving two order records for a single purchase.",
      },
    },
    {
      id: "b2",
      text: "Engineers identified the root cause as a race condition in the order-update code and reproduced it in an isolated environment before designing the fix.",
      label: "Incident INC-4417 Report, p. 3",
      citation: {
        page_num: 3,
        exact_text:
          "The root cause was a race condition in the order-update transaction: when two requests for the same item arrived within a few milliseconds, both read the same stock count before either wrote its update, and the later write overwrote the earlier one. The team reproduced this behaviour in an isolated environment before any fix was designed.",
      },
    },
    {
      id: "b3",
      text: "Two senior engineers independently reviewed and signed off on the change, and automated tests cover 94% of the code that was modified.",
      label: "Incident INC-4417 Report, p. 5",
      citation: {
        page_num: 5,
        exact_text:
          "Two senior engineers who were not involved in writing the fix reviewed the change and signed off on it, and automated test coverage of the changed code is 94%.",
      },
    },
  ],
  document: {
    id: "postmortem-incorrect-1",
    title: "Postmortem and Fix Validation Report: Checkout Service Outage (INC-4417)",
    authors: "Delgado, R., Osei, F., & Marchetti, L.",
    journal: "Site Reliability Engineering Report Series, 2024, No. 4417",
    pages: [
      {
        pageNum: 1,
        sections: [
          {
            heading: "SUMMARY",
            body: "Background: The checkout service takes customer orders and charges their payment methods. On 14 March 2024 an outage, tracked as Incident INC-4417, left many customers unable to complete a purchase for 47 minutes. The cause was a race condition, a bug in which two operations touching the same data at nearly the same moment interleave and leave the data wrong. A fix has been developed.",
          },
          {
            body: "Objective: To document the incident, its root cause, the fix, and how the fix was tested, so that the incident review board has the facts it needs to decide whether the fix ships.",
          },
          {
            body: "Methods: We rebuilt the incident from service logs and database traces and found the root cause by reproducing it in an isolated environment. We then validated the fix with automated tests and with repeated validation runs at production-scale load, meaning the number of simultaneous requests seen at the daily traffic peak.",
          },
          {
            body: "Scope: This report presents findings only. It does not contain a recommendation. The decision rests with the incident review board, which applies its own policy to the findings in Sections 2 to 5.",
          },
          {
            body: "Report structure: Section 1 gives the incident background and timeline, Section 2 the root cause, Section 3 the fix, Section 4 the fix validation, Section 5 the review and rollout preparation, and Section 6 the limitations. Appendix A gives incident figures and Appendix B the test environment.",
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
            heading: "1.1 The Checkout Service",
            body: "The checkout service receives orders from the website and the mobile app, checks stock in the inventory database, charges the customer and records the order. It runs as twelve identical instances behind a load balancer. On a typical day it handles about 300 checkout requests per second, and at the daily peak it handles about 1,200.",
          },
          {
            heading: "1.2 Customer Impact",
            body: "Between 19:12 and 19:59 UTC on 14 March 2024, 38% of checkout attempts returned an error page. We estimate that about 21,000 customers were affected. Of these, about 9,400 completed their purchase on a later attempt and about 11,600 did not.",
          },
          {
            heading: "1.3 Timeline",
            body: "19:06, a flash sale begins and traffic climbs toward the daily peak. 19:12, the checkout error rate passes 5%. 19:18, the on-call engineer is paged. 19:31, engineers trace the errors to inventory updates and remove the sale banner from the home page to reduce traffic. 19:59, the error rate falls below 1% as traffic subsides. 21:40, the incident is closed after inventory counts are corrected by hand.",
          },
          {
            heading: "1.4 Alerting",
            body: "Minor caveat, outside the board's criteria: the page to the on-call engineer went out six minutes after the error rate first passed 5%, because the alert threshold was set at 10%. The threshold has since been lowered to 2%. This affects how quickly future incidents are noticed and has no bearing on whether the fix itself works.",
          },
          {
            heading: "1.5 Incident Response Team",
            body: "Four engineers worked on the incident: the on-call engineer, two members of the checkout team and one database specialist. A fifth engineer wrote the customer-facing status updates.",
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
            body: "The root cause was a race condition in the order-update transaction: when two requests for the same item arrived within a few milliseconds, both read the same stock count before either wrote its update, and the later write overwrote the earlier one. The team reproduced this behaviour in an isolated environment before any fix was designed.",
          },
          {
            heading: "2.2 How It Was Found",
            body: "Engineers replayed one hour of recorded peak traffic against a copy of the production database and saw the same error pattern within four minutes. Database traces showed overlapping transactions on the same inventory rows, which matched the pattern in the production logs.",
          },
          {
            heading: "2.3 Why It Appeared Only During the Sale",
            body: "At normal traffic, two requests for the same item rarely arrive within a few milliseconds of each other. During the flash sale, thousands of customers asked for the same few items at once, so overlapping updates became frequent and stock counts drifted until the database rejected new orders.",
          },
          {
            heading: "3. THE FIX",
            body: "",
          },
          {
            heading: "3.1 Change Made",
            body: "The fix wraps the stock check and the stock update in a single transaction that takes a row-level lock, a lock that makes other requests for the same item wait their turn. With the lock in place, the second request reads the stock count only after the first has written its update.",
          },
          {
            heading: "3.2 Scope of the Change",
            body: "The change touches one function and two database queries in the order-update path. It needs no schema change, and it can be switched on or off with a single configuration flag.",
          },
          {
            heading: "3.3 Performance Overhead",
            body: "Locking makes some requests wait. In a single-instance benchmark, median checkout time rose from 182 ms to 191 ms, a 5% increase, and the 99th-percentile time rose from 410 ms to 436 ms.",
          },
        ],
      },
      {
        pageNum: 4,
        sections: [
          {
            heading: "4. FIX VALIDATION",
            body: "",
          },
          {
            heading: "4.1 Validation Approach",
            body: "The fix was validated in three ways: the existing regression test suite, new tests aimed at the order-update path, and repeated runs at full production-scale concurrent load in a dedicated test environment. Full production-scale load means 1,200 simultaneous checkout requests per second against a database copy of production size, matching the daily peak. Each run lasted 30 minutes.",
          },
          {
            heading: "4.2 Regression and Targeted Tests",
            body: "The existing regression suite of 1,412 tests passed after the change. We added 38 new tests for the order-update path, including tests that send overlapping requests for the same item, and all 38 passed.",
          },
          {
            heading: "4.3 Full-Load Validation Runs",
            body: "Each run replayed the traffic recorded during the incident against a fresh copy of the database, so that no run could affect another. After the fix was applied, the race condition still occurred in 3 of the 100 full-load runs (3%), each time leaving two order records for a single purchase.",
          },
          {
            heading: "4.4 Test Environment",
            body: "Tests ran on twelve application instances matching production hardware, with a database copy restored from the previous night's snapshot and customer data anonymised. Load was generated by replaying recorded traffic through the same load balancer configuration used in production.",
          },
        ],
      },
      {
        pageNum: 5,
        sections: [
          {
            heading: "5. REVIEW AND ROLLOUT PREPARATION",
            body: "",
          },
          {
            heading: "5.1 Code Review and Test Coverage",
            body: "Two senior engineers who were not involved in writing the fix reviewed the change and signed off on it, and automated test coverage of the changed code is 94%.",
          },
          {
            heading: "5.2 Rollback Rehearsal",
            body: "The team rehearsed switching the fix off through its configuration flag in a staging environment. The rollback took four minutes and returned the service to its previous behaviour with no data loss.",
          },
          {
            heading: "5.3 Monitoring Added",
            body: "Two new alerts were added: one on a checkout error rate above 2% and one on inventory update conflicts. Both alerts and their dashboards were tested with synthetic traffic and fired as expected.",
          },
          {
            heading: "5.4 Proposed Rollout",
            body: "The proposed rollout enables the fix on one of the twelve instances for 24 hours and then on all twelve. A named on-call engineer is assigned for the rollout window, and the rollback steps are listed in the updated runbook.",
          },
          {
            heading: "5.5 Documentation",
            body: "The runbook for checkout errors now includes the new alerts and the rollback steps. The incident has been logged in the tracker with links to the traces, the replay scripts and this report.",
          },
        ],
      },
      {
        pageNum: 6,
        sections: [
          {
            heading: "6. LIMITATIONS",
            body: "This report covers Incident INC-4417 and the order-update path of the checkout service only. Other services that read inventory counts were not examined.",
          },
          {
            body: "Minor caveat, outside the board's criteria: the customer impact figures in Section 1.2 are estimates derived from session logs, and the number of customers who later completed a purchase may be off by a few hundred.",
          },
          {
            heading: "APPENDIX A: INCIDENT FIGURES",
            body: "Duration of customer impact: 47 minutes. Average checkout error rate during impact: 38%. Peak checkout error rate: 61% at 19:41 UTC. Customers affected: about 21,000, of whom about 9,400 later completed a purchase. Typical load: about 300 checkout requests per second. Peak load: about 1,200 checkout requests per second.",
          },
          {
            heading: "APPENDIX B: TEST ENVIRONMENT",
            body: "Application instances: twelve, each with 8 CPU cores and 16 GB of memory. Database: one primary and two read replicas, restored from the nightly snapshot with customer data anonymised. Load profile for full-load runs: 1,200 checkout requests per second for 30 minutes, replayed from recorded incident traffic.",
          },
          {
            heading: "REFERENCES",
            body: "[1] Checkout Team. (2024). Checkout Service Architecture Overview, v6. Internal engineering handbook.\n[2] Delgado, R., Osei, F., & Marchetti, L. (2023). Standard Method for Replay-Based Load Validation. Site Reliability Engineering Report Series, No. 3902.\n[3] Incident Review Board. (2024). Incident Report Template, v3. Internal engineering handbook.",
          },
        ],
      },
    ],
  },
};
