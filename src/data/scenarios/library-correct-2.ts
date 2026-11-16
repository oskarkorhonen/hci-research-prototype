import type { Scenario } from "../types";

// logweave: a structured-logging library that stayed stable for the full
// duration of every sustained load test. The key passage (page 5, 4.2) states
// plainly that behaviour was stable. The two minor caveats sit in 3.3 (page 4)
// and 4.5 (page 5), both marked as outside the policy's criteria.
export const scenario: Scenario = {
  id: "library-correct-2",
  domain: "library",
  trial_type: "AI-Correct",
  research_question:
    "Based on the benchmark and security audit report, should logweave be approved for production use?",
  correct_answer: "Yes",
  key_block_id: "b2",
  ai_summary_blocks: [
    {
      id: "b1",
      text: "The security audit found no critical or high-severity vulnerabilities in logweave or in the libraries it depends on.",
      label: "logweave Report, p. 4",
      citation: {
        page_num: 4,
        exact_text:
          "The audit found no critical or high-severity vulnerability in logweave or in any of its dependencies, and static analysis flagged nothing above low severity.",
      },
    },
    {
      id: "b2",
      text: "In all four 36-hour sustained load tests, logweave remained stable throughout, with no crashes, restarts or growth in memory use.",
      label: "logweave Report, p. 5",
      citation: {
        page_num: 5,
        exact_text:
          "In all four sustained load tests, logweave behaved stably for the full 36-hour test period: memory usage levelled off within the first hour, and there were no crashes, restarts or dropped log entries.",
      },
    },
    {
      id: "b3",
      text: "Logging through logweave added under 3% to the time each request took, compared with the current logging setup.",
      label: "logweave Report, p. 5",
      citation: {
        page_num: 5,
        exact_text:
          "Under peak load, logweave added an average of 2.6% to request handling time, compared with 4.9% for our current logging setup, because it formats log entries on a background thread.",
      },
    },
  ],
  document: {
    id: "library-correct-2",
    title: "Benchmark and Security Audit Report: logweave v4.1",
    authors: "Moreau, J., Adeyemi, F., & Kowalczyk, P.",
    journal: "Open Source Infrastructure Review, 2024, Report No. 156",
    pages: [
      {
        pageNum: 1,
        sections: [
          {
            heading: "SUMMARY",
            body: "Background: logweave is a structured-logging library. Structured logging records each event as labelled fields, such as a user ID and a status code, instead of a single line of free text, which makes logs much easier to search. Several engineering teams in our organization have asked to adopt logweave in place of parts of our existing logging setup.",
          },
          {
            body: "Objective: To document how logweave behaves under our standard benchmark and security review process, which every third-party dependency goes through before it can be considered for company-wide use.",
          },
          {
            body: "Methods: We ran logweave through four independent 36-hour load tests and a security audit consisting of static analysis, dependency scanning, and a manual review of how the library handles sensitive fields and log destinations. Each load test ran in a fresh environment so that one run could not influence another.",
          },
          {
            body: "Scope: This report presents findings only. It does not contain a recommendation. The approval decision rests with the infrastructure review board, which applies its own policy to the findings in Sections 3 and 4.",
          },
          {
            body: "Report structure: Section 1 gives background, Section 2 describes the method, Section 3 reports the audit results, Section 4 reports the load-test results, and Section 5 lists limitations. Appendix A gives per-test figures.",
          },
        ],
      },
      {
        pageNum: 2,
        sections: [
          {
            heading: "1. BACKGROUND",
            body: "When something goes wrong in production, logs are usually the first place engineers look. Our services currently write logs in several different formats, which slows down searching and makes it hard to follow a single request across services.",
          },
          {
            body: "logweave was first released in 2022 and is known for its consistent field names and its ability to write log entries without slowing down the code that produced them. Two teams in our organization ran informal pilots in staging environments earlier this year, which prompted this formal evaluation.",
          },
          {
            heading: "1.1 Why a Formal Evaluation",
            body: "Once a dependency is approved, any team may adopt it without repeating the evaluation. For that reason the process is deliberately thorough and is carried out by engineers who are not involved in the teams requesting the library.",
          },
          {
            heading: "1.2 What the Evaluation Covers",
            body: "The evaluation covers four areas: security posture, behaviour under sustained load, performance overhead, and maintainer responsiveness. Each area is reported separately so that the board can weigh them against its own approval policy.",
          },
          {
            heading: "1.3 Version Evaluated",
            body: "All results in this report refer to logweave v4.1, the current stable release at the time of testing, built from the tagged source with default settings unless stated otherwise.",
          },
        ],
      },
      {
        pageNum: 3,
        sections: [
          {
            heading: "2. METHOD",
            body: "",
          },
          {
            heading: "2.1 Security Audit Procedure",
            body: "The audit combined static code analysis, dependency scanning against public vulnerability databases, and a manual review of how the library masks sensitive fields and writes to log destinations. Findings were rated on the organization's four-level severity scale: low, medium, high, and critical.",
          },
          {
            heading: "2.2 Load-Test Setup",
            body: "We ran four independent load tests, each simulating 36 hours of continuous production traffic. Traffic patterns were modelled on request logs from our production services over the previous six months, including the daily peak.",
          },
          {
            heading: "2.3 Baseline for Comparison",
            body: "All measurements were compared against our current logging setup, which has run in production for more than three years and serves as the reference point for both performance and stability.",
          },
          {
            heading: "2.4 Metrics Collected",
            body: "For each load test we recorded memory usage, request handling time, log entries written compared with log entries produced, CPU utilization, disk usage, and any crashes or restarts. Metrics were sampled every 60 seconds for the full duration of each test.",
          },
          {
            heading: "2.5 Test Environment",
            body: "Tests ran on identically provisioned virtual machines with 8 CPU cores and 16 GB of memory, matching our standard production application servers. Network conditions used the same traffic-shaping configuration as our production load-testing pipeline.",
          },
          {
            heading: "2.6 Review of Results",
            body: "Two engineers reviewed the raw results independently before they were written up. All scripts are stored in the internal tooling repository so that any team can reproduce the measurements.",
          },
        ],
      },
      {
        pageNum: 4,
        sections: [
          {
            heading: "3. SECURITY AUDIT RESULTS",
            body: "",
          },
          {
            heading: "3.1 Dependency Scan",
            body: "The dependency scan covered logweave's six direct and transitive dependencies. Five were on current versions. One was a single minor version behind its latest release, with no published advisories affecting the version in use.",
          },
          {
            heading: "3.2 Static Analysis and Manual Review",
            body: "The audit found no critical or high-severity vulnerability in logweave or in any of its dependencies, and static analysis flagged nothing above low severity. The auditors also tried to make the library write masked fields such as passwords and card numbers to a log in readable form, and did not succeed.",
          },
          {
            heading: "3.3 Configuration Defaults",
            body: "The default configuration masks a built-in list of sensitive field names and writes only to local destinations. A minor caveat, outside the board's approval criteria: the documentation for custom log destinations is incomplete, which the auditors rated a low-severity documentation issue.",
          },
          {
            heading: "3.4 Maintainer Responsiveness",
            body: "Over the past twelve months the maintainers responded to newly opened issues within a median of two working days and published eight releases. The project has six active maintainers employed by four different organizations.",
          },
          {
            heading: "3.5 Licensing",
            body: "logweave is distributed under a permissive open-source license that is compatible with our company's open-source usage policy.",
          },
        ],
      },
      {
        pageNum: 5,
        sections: [
          {
            heading: "4. LOAD-TEST RESULTS",
            body: "",
          },
          {
            heading: "4.1 Test Overview",
            body: "All four load tests ran to completion and all four are included in this report. No test was excluded or repeated.",
          },
          {
            heading: "4.2 Stability Under Sustained Load",
            body: "In all four sustained load tests, logweave behaved stably for the full 36-hour test period: memory usage levelled off within the first hour, and there were no crashes, restarts or dropped log entries. Peak memory stayed below 48% of the available 16 GB in every run.",
          },
          {
            heading: "4.3 Request Overhead",
            body: "Under peak load, logweave added an average of 2.6% to request handling time, compared with 4.9% for our current logging setup, because it formats log entries on a background thread. Outside peak hours the overhead was lower still, averaging 1.4%.",
          },
          {
            heading: "4.4 Throughput",
            body: "Request throughput with logweave was higher than with the current logging setup in three of the four tests and equal within measurement error in the fourth. The average improvement across the four tests was 6%.",
          },
          {
            heading: "4.5 Disk Usage",
            body: "Log files written by logweave were about 4% larger than those from the current setup, because every entry carries labelled fields. This is a minor observation. It is outside the board's approval criteria and is within the storage budget the organization allows for logs.",
          },
        ],
      },
      {
        pageNum: 6,
        sections: [
          {
            heading: "5. LIMITATIONS",
            body: "The load tests ran in a staging environment that mirrors production but does not receive real user traffic, so behaviour in production could differ in detail. The audit covered v4.1 only and does not extend to earlier or later releases.",
          },
          {
            body: "A minor caveat, outside the board's approval criteria: the project's changelog groups several small fixes under a single entry, which makes it harder to tell exactly what changed between releases.",
          },
          {
            heading: "APPENDIX A: PER-TEST FIGURES",
            body: "Test 1: peak memory 44%, throughput +5%. Test 2: peak memory 47%, throughput +8%. Test 3: peak memory 45%, throughput +0% (within measurement error). Test 4: peak memory 46%, throughput +11%. Throughput is relative to the current logging setup under the same traffic.",
          },
          {
            heading: "APPENDIX B: ALTERNATIVES SCREENED",
            body: "Two other logging libraries, tracefold and inkline, were screened before this evaluation. tracefold was excluded because its license is incompatible with our open-source usage policy, and inkline because it has had no stable release in over a year. Neither was benchmarked or audited.",
          },
          {
            heading: "REFERENCES",
            body: "[1] logweave Maintainers. (2022). logweave Documentation, v4.1. Project repository.\n[2] Moreau, J., Adeyemi, F., & Kowalczyk, P. (2024). Internal Benchmark Methodology for Logging Libraries. Open Source Infrastructure Review, Report No. 139.\n[3] Engineering Standards Board. (2024). Third-Party Dependency Approval Process, v4. Internal engineering handbook.",
          },
        ],
      },
    ],
  },
};
