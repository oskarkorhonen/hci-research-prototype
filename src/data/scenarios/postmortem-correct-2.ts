import type { Scenario } from "../types";

// Notification duplicates INC-4688: fixed with idempotency keys on send
// requests. The deciding condition (zero duplicates at full production-scale
// load) is met and stated plainly in one passage on page 4 (4.2).
export const scenario: Scenario = {
  id: "postmortem-correct-2",
  domain: "postmortem",
  trial_type: "AI-Correct",
  research_question:
    "Based on the postmortem and fix validation report, should the fix for the notification service duplicate-message problem (Incident INC-4688) be approved to ship?",
  correct_answer: "Yes",
  key_block_id: "b2",
  ai_summary_blocks: [
    {
      id: "b1",
      text: "Duplicates happened because a delivery timeout made the queue retry a send that had already gone through to the provider.",
      label: "Incident INC-4688 Report, p. 3",
      citation: {
        page_num: 3,
        exact_text:
          "The root cause was an unsafe retry: when the email provider answered slowly, the delivery worker treated the send as failed and put it back on the queue, even though the provider had already accepted it, so the message was sent again.",
      },
    },
    {
      id: "b2",
      text: "Validation at full production-scale load produced zero duplicate messages across 40 runs, with every retried request recognised and ignored.",
      label: "Incident INC-4688 Report, p. 4",
      citation: {
        page_num: 4,
        exact_text:
          "In all 40 validation runs at full production-scale load, the service delivered zero duplicate messages, and every retried request was recognised by its idempotency key and ignored. The duplicate-message problem no longer occurs in validation testing at this load.",
      },
    },
    {
      id: "b3",
      text: "Two senior engineers independently reviewed and signed off on the change, and automated tests cover 93% of the code that was modified.",
      label: "Incident INC-4688 Report, p. 5",
      citation: {
        page_num: 5,
        exact_text:
          "Two senior engineers who were not involved in writing the fix reviewed the change and signed off on it, and automated test coverage of the changed code is 93%.",
      },
    },
  ],
  document: {
    id: "postmortem-correct-2",
    title: "Postmortem and Fix Validation Report: Notification Duplicates (INC-4688)",
    authors: "Haugen, E., Vargas, P., & Mbeki, N.",
    journal: "Site Reliability Engineering Report Series, 2024, No. 4688",
    pages: [
      {
        pageNum: 1,
        sections: [
          {
            heading: "SUMMARY",
            body: "Background: The notification service sends order updates, password resets and alerts to customers by email and push message. On 21 August 2024 many customers received the same message two to five times, an incident tracked as INC-4688 that lasted 3 hours 10 minutes. The fix adds idempotency keys, unique tokens attached to each send request so that the service can recognise a repeat of a request it has already handled and ignore it. A fix has been developed.",
          },
          {
            body: "Objective: To document the incident, its root cause, the fix, and how the fix was tested, so that the incident review board has the facts it needs to decide whether the fix ships.",
          },
          {
            body: "Methods: We rebuilt the incident from queue logs and provider delivery records and found the root cause by tracing individual duplicated messages. We then validated the fix with automated tests, a forced-timeout test, and repeated validation runs at production-scale load, meaning the number of messages per second seen at the daily peak.",
          },
          {
            body: "Scope: This report presents findings only. It does not contain a recommendation. The decision rests with the incident review board, which applies its own policy to the findings in Sections 2 to 5.",
          },
          {
            body: "Report structure: Section 1 gives the incident background and timeline, Section 2 the root cause, Section 3 the fix, Section 4 the validation method and results, Section 5 the review and rollout preparation, and Section 6 the limitations. Appendix A gives incident figures and Appendix B the test environment.",
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
            heading: "1.1 The Notification Service",
            body: "Other services place send requests on a message queue. Delivery workers take requests from the queue and pass them to an external email or push provider. The service runs as nine delivery workers. On a typical day it sends about 800 messages per second, and at the daily peak it sends about 2,500.",
          },
          {
            heading: "1.2 Customer Impact",
            body: "Between 11:05 and 14:15 UTC on 21 August 2024, about 83,000 customers received at least one duplicate message. In total about 310,000 extra messages were sent. We received 1,900 customer complaints and the email provider briefly rate-limited our account.",
          },
          {
            heading: "1.3 Timeline",
            body: "11:00, the email provider begins responding slowly after an incident on its side. 11:05, the first duplicates are sent. 11:40, the support team reports a rise in complaints and the on-call engineer is paged. 12:30, engineers link the duplicates to queue retries. 13:10, retries are switched off by configuration. 14:15, the last duplicate is sent after the queue drains. 15:30, the incident is closed.",
          },
          {
            heading: "1.4 Support Communication",
            body: "Minor caveat, outside the board's criteria: the support team's reply template for affected customers went out about two hours after the first complaints, later than our guideline of one hour. This concerns customer communication and has no bearing on whether the fix itself works.",
          },
          {
            heading: "1.5 Incident Response Team",
            body: "Four engineers worked on the incident: the on-call engineer, two members of the notifications team and one queue specialist. A fifth engineer coordinated with the email provider.",
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
            body: "The root cause was an unsafe retry: when the email provider answered slowly, the delivery worker treated the send as failed and put it back on the queue, even though the provider had already accepted it, so the message was sent again.",
          },
          {
            heading: "2.2 How It Was Found",
            body: "Engineers followed ten duplicated messages from the queue logs to the provider's delivery records. In every case the provider had accepted the first send before the worker's 5-second timeout expired, and the worker retried anyway.",
          },
          {
            heading: "2.3 Why It Appeared on 21 August",
            body: "Provider responses normally take about 300 ms, so timeouts were rare and retries were never exercised at scale. When responses slowed to more than 5 seconds, every worker began retrying many sends at once.",
          },
          {
            heading: "3. THE FIX",
            body: "",
          },
          {
            heading: "3.1 Change Made",
            body: "Each send request now carries an idempotency key, a unique token created when the request is first placed on the queue. Before sending, the worker records the key. If a request with the same key arrives again, the worker skips the send and reports the earlier outcome.",
          },
          {
            heading: "3.2 Scope of the Change",
            body: "The change touches the delivery worker and the key store, a small table that holds keys for 72 hours. Calling services do not change. The check can be switched off with a single configuration flag.",
          },
          {
            heading: "3.3 Performance Overhead",
            body: "Recording and checking a key adds one lookup per message. In a single-worker benchmark, median send time rose from 11 ms to 13 ms, an increase of about 18% of the worker's own processing time and under 1% of the full delivery time.",
          },
        ],
      },
      {
        pageNum: 4,
        sections: [
          {
            heading: "4. VALIDATION METHOD AND RESULTS",
            body: "",
          },
          {
            heading: "4.1 Validation Approach",
            body: "The fix was validated in three ways: the existing automated tests, a forced-timeout test, and repeated runs at full production-scale load in a dedicated test environment. Full production-scale load means 2,500 messages per second, matching the daily peak. Each run lasted 30 minutes, and the provider was replaced by a test double that was slowed to respond after 6 seconds for a random 20% of requests, so that retries were certain to occur.",
          },
          {
            heading: "4.2 Full-Load Validation Results",
            body: "In all 40 validation runs at full production-scale load, the service delivered zero duplicate messages, and every retried request was recognised by its idempotency key and ignored. The duplicate-message problem no longer occurs in validation testing at this load.",
          },
          {
            heading: "4.3 Automated and Forced-Timeout Tests",
            body: "The existing suite of 1,050 tests passed after the change. We added 31 tests for the key store and the retry path, and all 31 passed. In the forced-timeout test, a single request was retried five times and produced one message.",
          },
          {
            heading: "4.4 Test Environment",
            body: "Tests ran on nine delivery workers matching production hardware, with a queue and key store restored from anonymised snapshots. Each run started from a freshly emptied queue so that no run could affect another.",
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
            body: "Two senior engineers who were not involved in writing the fix reviewed the change and signed off on it, and automated test coverage of the changed code is 93%.",
          },
          {
            heading: "5.2 Rollback Rehearsal",
            body: "The team rehearsed switching the key check off through its configuration flag in a staging environment. The rollback took three minutes and returned the service to its previous behaviour with no messages lost.",
          },
          {
            heading: "5.3 Monitoring Added",
            body: "Two new alerts were added: one on the number of retried requests per minute and one on the key store filling above 80% of its capacity. Both alerts and their dashboards were tested with synthetic traffic and fired as expected.",
          },
          {
            heading: "5.4 Proposed Rollout",
            body: "The proposed rollout enables the fix on three of the nine delivery workers for 24 hours and then on all nine. A named on-call engineer is assigned for the rollout window, and the rollback steps are listed in the updated runbook.",
          },
          {
            heading: "5.5 Documentation",
            body: "The runbook for notification incidents now includes the new alerts and the rollback steps. The incident has been logged in the tracker with links to the queue logs, the test scripts and this report.",
          },
        ],
      },
      {
        pageNum: 6,
        sections: [
          {
            heading: "6. LIMITATIONS",
            body: "This report covers Incident INC-4688 and the email delivery path of the notification service only. The push-message path uses a separate provider and was not examined.",
          },
          {
            body: "Minor caveat, outside the board's criteria: the customer impact figures in Section 1.2 are estimates derived from provider delivery records, and the number of extra messages may be off by a few thousand.",
          },
          {
            heading: "APPENDIX A: INCIDENT FIGURES",
            body: "Duration of customer impact: 3 hours 10 minutes. Customers who received at least one duplicate: about 83,000. Extra messages sent: about 310,000. Customer complaints received: 1,900. Provider timeout in the delivery worker: 5 seconds. Typical load: about 800 messages per second. Peak load: about 2,500 messages per second.",
          },
          {
            heading: "APPENDIX B: TEST ENVIRONMENT",
            body: "Delivery workers: nine, each with 4 CPU cores and 8 GB of memory. Queue and key store: restored from anonymised snapshots. Load profile for full-load runs: 2,500 messages per second for 30 minutes, with a provider test double that responds after 6 seconds for a random 20% of requests. Key retention: 72 hours.",
          },
          {
            heading: "REFERENCES",
            body: "[1] Notifications Team. (2024). Notification Service Architecture Overview, v3. Internal engineering handbook.\n[2] Haugen, E., Vargas, P., & Mbeki, N. (2023). Standard Method for Replay-Based Load Validation of Queue Consumers. Site Reliability Engineering Report Series, No. 3988.\n[3] Incident Review Board. (2024). Incident Report Template, v3. Internal engineering handbook.",
          },
        ],
      },
    ],
  },
};
