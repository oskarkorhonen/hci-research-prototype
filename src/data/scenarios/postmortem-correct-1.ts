import type { Scenario } from "../types";

// Authentication outage INC-4502: a misconfigured certificate-renewal job.
// The deciding condition (no failure at full production-scale load) is met and
// stated plainly in one passage on page 5 (5.1). The report carries the same
// kinds of minor caveats as the incorrect reports.
export const scenario: Scenario = {
  id: "postmortem-correct-1",
  domain: "postmortem",
  trial_type: "AI-Correct",
  research_question:
    "Based on the postmortem and fix validation report, should the fix for the authentication service certificate-renewal failure (Incident INC-4502) be approved to ship?",
  correct_answer: "Yes",
  key_block_id: "b1",
  ai_summary_blocks: [
    {
      id: "b1",
      text: "Validation at full production-scale load showed the authentication failure no longer occurs once the corrected renewal job is in place.",
      label: "Incident INC-4502 Report, p. 5",
      citation: {
        page_num: 5,
        exact_text:
          "In all 50 validation runs at full production-scale load, every certificate renewed on schedule and no login request failed because of a certificate error. The failure no longer occurs in validation testing at this load.",
      },
    },
    {
      id: "b2",
      text: "The root cause was a renewal job still pointed at a retired certificate authority, so renewals had been failing silently for months.",
      label: "Incident INC-4502 Report, p. 3",
      citation: {
        page_num: 3,
        exact_text:
          "The root cause was a misconfigured certificate-renewal job: it still used the address of the retired certificate authority, so every renewal attempt since the January migration failed without raising an error.",
      },
    },
    {
      id: "b3",
      text: "In a time-shifted simulation the corrected job renewed all 14 service certificates on schedule, and a deliberately broken setting raised an alert within five minutes.",
      label: "Incident INC-4502 Report, p. 4",
      citation: {
        page_num: 4,
        exact_text:
          "In a simulation with the clock moved 90 days forward, the corrected job renewed all 14 service certificates on schedule, and a deliberately broken endpoint setting raised an alert within five minutes.",
      },
    },
  ],
  document: {
    id: "postmortem-correct-1",
    title: "Postmortem and Fix Validation Report: Authentication Service Outage (INC-4502)",
    authors: "Delgado, R., Osei, F., & Marchetti, L.",
    journal: "Site Reliability Engineering Report Series, 2024, No. 4502",
    pages: [
      {
        pageNum: 1,
        sections: [
          {
            heading: "SUMMARY",
            body: "Background: The authentication service signs customers in and issues the session tokens that other services trust. On 9 April 2024 an outage, tracked as Incident INC-4502, stopped most sign-ins for 1 hour 52 minutes. The cause was a certificate-renewal job, the scheduled task that replaces the security certificates services use to prove their identity to each other, which had been configured incorrectly. A fix has been developed.",
          },
          {
            body: "Objective: To document the incident, its root cause, the fix, and how the fix was tested, so that the incident review board has the facts it needs to decide whether the fix ships.",
          },
          {
            body: "Methods: We rebuilt the incident from service logs and certificate records and found the root cause by inspecting the job's configuration history. We then validated the fix with a time-shifted simulation, automated tests, and repeated validation runs at production-scale load, meaning the number of simultaneous sign-in requests seen at the daily traffic peak.",
          },
          {
            body: "Scope: This report presents findings only. It does not contain a recommendation. The decision rests with the incident review board, which applies its own policy to the findings in Sections 2 to 5.",
          },
          {
            body: "Report structure: Section 1 gives the incident background and timeline, Section 2 the root cause, Section 3 the fix, Section 4 the validation method and first results, Section 5 the full-load results and review, and Section 6 the limitations. Appendix A gives incident figures and Appendix B the test environment.",
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
            heading: "1.1 The Authentication Service",
            body: "The authentication service checks passwords and one-time codes and issues session tokens. Internally, its eight instances talk to the user database and to the token store over encrypted connections that rely on certificates. On a typical day the service handles about 250 sign-in requests per second, and at the daily peak it handles about 900.",
          },
          {
            heading: "1.2 Customer Impact",
            body: "Between 02:15 and 04:07 UTC on 9 April 2024, 87% of sign-in attempts failed. We estimate that about 64,000 customers were affected. Most were on the Asia-Pacific morning commute and retried successfully after service was restored.",
          },
          {
            heading: "1.3 Timeline",
            body: "02:15, the certificate used between the authentication service and the token store expires. 02:17, sign-in errors begin to climb. 02:24, the on-call engineer is paged. 02:50, engineers identify the expired certificate. 03:41, a replacement certificate is issued by hand. 04:07, sign-ins return to normal after all instances reload the certificate. 05:30, the incident is closed.",
          },
          {
            heading: "1.4 Status Page",
            body: "Minor caveat, outside the board's criteria: the first public status page update was posted 25 minutes after the outage began, later than the 15 minutes our communication guideline asks for. This concerns customer communication and has no bearing on whether the fix itself works.",
          },
          {
            heading: "1.5 Incident Response Team",
            body: "Five engineers worked on the incident: the on-call engineer, two members of the authentication team, one security engineer and one platform engineer. A sixth engineer wrote the customer-facing status updates.",
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
            body: "The root cause was a misconfigured certificate-renewal job: it still used the address of the retired certificate authority, so every renewal attempt since the January migration failed without raising an error. The certificate therefore reached its expiry date without ever being replaced.",
          },
          {
            heading: "2.2 How It Was Found",
            body: "Engineers compared the job's configuration history with the migration schedule and saw that the authority address had never been updated. The job's own logs, which nobody was watching, showed a refused connection on every nightly attempt since 17 January.",
          },
          {
            heading: "2.3 Why It Went Unnoticed",
            body: "The job reported success whenever it finished running, whether or not a certificate had been renewed. Other certificates were renewed by a different mechanism, so most expiry dates passed without trouble and the failing job did not draw attention.",
          },
          {
            heading: "3. THE FIX",
            body: "",
          },
          {
            heading: "3.1 Change Made",
            body: "The fix points the renewal job at the current certificate authority and changes the job so that it reports failure whenever a certificate is not renewed. It also adds an alert that fires if any certificate is within 14 days of expiry.",
          },
          {
            heading: "3.2 Scope of the Change",
            body: "The change touches the job's configuration file and its exit-status handling. It needs no change to the authentication service code, and the previous configuration is kept in version control for rollback.",
          },
          {
            heading: "3.3 Operational Overhead",
            body: "The renewal job runs nightly as before and takes about 40 seconds. The new alert adds one scheduled query per hour against the certificate inventory.",
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
            body: "The fix was validated in three ways: a time-shifted simulation of the renewal job, the existing automated tests, and repeated runs at full production-scale load in a dedicated test environment. Full production-scale load means 900 simultaneous sign-in requests per second, matching the daily peak.",
          },
          {
            heading: "4.2 Time-Shifted Simulation",
            body: "In a simulation with the clock moved 90 days forward, the corrected job renewed all 14 service certificates on schedule, and a deliberately broken endpoint setting raised an alert within five minutes.",
          },
          {
            heading: "4.3 Automated Tests",
            body: "The existing suite of 860 tests passed after the change. We added 22 tests for the job's exit-status handling and its alert, and all 22 passed.",
          },
          {
            heading: "4.4 Design of the Full-Load Runs",
            body: "Each full-load run used certificates with a four-hour lifetime and replayed three hours of recorded peak traffic, so that at least one renewal fell inside every run. Each run started from a fresh copy of the environment so that no run could affect another.",
          },
          {
            heading: "4.5 Test Environment",
            body: "Tests ran on eight authentication instances matching production hardware, with a token store and user database restored from anonymised snapshots. Sign-in traffic was generated by replaying recorded requests through the production load balancer configuration.",
          },
        ],
      },
      {
        pageNum: 5,
        sections: [
          {
            heading: "5. FULL-LOAD RESULTS AND REVIEW",
            body: "",
          },
          {
            heading: "5.1 Full-Load Validation Results",
            body: "In all 50 validation runs at full production-scale load, every certificate renewed on schedule and no login request failed because of a certificate error. The failure no longer occurs in validation testing at this load.",
          },
          {
            heading: "5.2 Code Review and Test Coverage",
            body: "Two senior engineers who were not involved in writing the fix reviewed the change and signed off on it. Automated test coverage of the changed code is 92%.",
          },
          {
            heading: "5.3 Rollback Rehearsal",
            body: "The team rehearsed restoring the previous configuration in a staging environment. The rollback took three minutes and left the service unchanged apart from the renewal job.",
          },
          {
            heading: "5.4 Monitoring Added",
            body: "A dashboard now shows the days remaining on every certificate, and the 14-day alert is routed to the on-call rota. Both were tested with a deliberately short-lived certificate and fired as expected.",
          },
          {
            heading: "5.5 Proposed Rollout",
            body: "The proposed rollout applies the corrected configuration during the next scheduled maintenance window, with a named on-call engineer assigned. The first nightly run under the new configuration will be watched by hand.",
          },
        ],
      },
      {
        pageNum: 6,
        sections: [
          {
            heading: "6. LIMITATIONS",
            body: "This report covers Incident INC-4502 and the renewal job for the authentication service only. Certificates managed by other mechanisms were not examined.",
          },
          {
            body: "Minor caveat, outside the board's criteria: the customer impact figure in Section 1.2 is an estimate derived from sign-in logs, and the true number of affected customers may differ by a few thousand.",
          },
          {
            heading: "APPENDIX A: INCIDENT FIGURES",
            body: "Duration of customer impact: 1 hour 52 minutes. Share of sign-in attempts that failed during impact: 87%. Customers affected: about 64,000. Renewal attempts that failed silently before the incident: 82 nightly attempts from 17 January to 8 April. Typical load: about 250 sign-in requests per second. Peak load: about 900 sign-in requests per second.",
          },
          {
            heading: "APPENDIX B: TEST ENVIRONMENT",
            body: "Authentication instances: eight, each with 8 CPU cores and 16 GB of memory. Token store and user database: restored from anonymised snapshots. Load profile for full-load runs: 900 sign-in requests per second for three hours, replayed from recorded traffic, with four-hour certificate lifetimes.",
          },
          {
            heading: "REFERENCES",
            body: "[1] Authentication Team. (2024). Authentication Service Architecture Overview, v5. Internal engineering handbook.\n[2] Delgado, R., Osei, F., & Marchetti, L. (2023). Standard Method for Replay-Based Load Validation. Site Reliability Engineering Report Series, No. 3902.\n[3] Incident Review Board. (2024). Incident Report Template, v3. Internal engineering handbook.",
          },
        ],
      },
    ],
  },
};
