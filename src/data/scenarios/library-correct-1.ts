import type { Scenario } from "../types";

// queuelite: a message queue library with a clean security audit. The key
// passage (page 4, 3.2) states plainly that no critical or high-severity
// vulnerability was found. The report holds two minor caveats, in 4.5 and in
// the limitations on page 6, both marked as outside the policy's criteria.
export const scenario: Scenario = {
  id: "library-correct-1",
  domain: "library",
  trial_type: "AI-Correct",
  research_question:
    "Based on the benchmark and security audit report, should queuelite be approved for production use?",
  correct_answer: "Yes",
  key_block_id: "b1",
  ai_summary_blocks: [
    {
      id: "b1",
      text: "The security audit turned up no critical or high-severity vulnerabilities, either in queuelite itself or in the libraries it depends on.",
      label: "queuelite Report, p. 4",
      citation: {
        page_num: 4,
        exact_text:
          "The audit found no critical or high-severity vulnerability in queuelite or in any of its dependencies, and static analysis flagged nothing above low severity.",
      },
    },
    {
      id: "b2",
      text: "Memory use stayed steady for the entire 24 hours in all four load tests, with no crashes or restarts.",
      label: "queuelite Report, p. 5",
      citation: {
        page_num: 5,
        exact_text:
          "In all four load tests, queuelite's memory usage levelled off within the first hour and then remained stable for the full 24-hour test period, with no crashes or restarts.",
      },
    },
    {
      id: "b3",
      text: "At peak load, queuelite cut the median delay between sending and delivering a message by 38% compared with the current queue.",
      label: "queuelite Report, p. 5",
      citation: {
        page_num: 5,
        exact_text:
          "Under peak load, queuelite cut the median time between a message being sent and being delivered by 38% compared with our current queue, because it groups small messages into batches.",
      },
    },
  ],
  document: {
    id: "library-correct-1",
    title: "Benchmark and Security Audit Report: queuelite v2.6",
    authors: "Park, A., Ibrahim, S., & Novak, R.",
    journal: "Open Source Infrastructure Review, 2024, Report No. 142",
    pages: [
      {
        pageNum: 1,
        sections: [
          {
            heading: "SUMMARY",
            body: "Background: queuelite is a message queue library. A message queue lets one service hand work to another by placing a message in a waiting line, so that the sender does not have to wait for the receiver. Several engineering teams in our organization have asked to adopt queuelite in place of parts of our existing queue.",
          },
          {
            body: "Objective: To document how queuelite behaves under our standard benchmark and security review process, which every third-party dependency goes through before it can be considered for company-wide use.",
          },
          {
            body: "Methods: We ran queuelite through four independent 24-hour load tests and a security audit consisting of static analysis, dependency scanning, and a manual review of how the library handles authentication and message contents. Each load test ran in a fresh environment so that one run could not influence another.",
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
            body: "Our platform relies on queues to move work between services, such as sending receipts after a purchase or resizing uploaded images. As traffic has grown, the queue we use today has become one of the busiest components in the system, and several teams have asked for something faster.",
          },
          {
            body: "queuelite was first released in 2022 and is known for its small footprint and for delivering messages in the order they were sent. Two teams in our organization ran informal pilots in staging environments earlier this year, which prompted this formal evaluation.",
          },
          {
            heading: "1.1 Why a Formal Evaluation",
            body: "Once a dependency is approved, any team may adopt it without repeating the evaluation. For that reason the process is deliberately thorough and is carried out by engineers who are not involved in the teams requesting the library.",
          },
          {
            heading: "1.2 What the Evaluation Covers",
            body: "The evaluation covers four areas: security posture, memory and resource stability over time, performance under realistic load, and maintainer responsiveness. Each area is reported separately so that the board can weigh them against its own approval policy.",
          },
          {
            heading: "1.3 Version Evaluated",
            body: "All results in this report refer to queuelite v2.6, the current stable release at the time of testing, built from the tagged source with default settings unless stated otherwise.",
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
            body: "The audit combined static code analysis, dependency scanning against public vulnerability databases, and a manual review of how the library authenticates clients and stores message contents. Findings were rated on the organization's four-level severity scale: low, medium, high, and critical.",
          },
          {
            heading: "2.2 Load-Test Setup",
            body: "We ran four independent load tests, each simulating 24 hours of continuous production traffic. Traffic patterns were modelled on message logs from our production services over the previous six months, including the daily peak.",
          },
          {
            heading: "2.3 Baseline for Comparison",
            body: "All measurements were compared against our current queue, which has run in production for more than three years and serves as the reference point for both performance and stability.",
          },
          {
            heading: "2.4 Metrics Collected",
            body: "For each load test we recorded memory usage, message throughput, delivery delay, CPU utilization, and any crashes or restarts. Metrics were sampled every 60 seconds for the full duration of each test.",
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
            body: "The dependency scan covered queuelite's nine direct and transitive dependencies. Eight were on current versions. One was a single minor version behind its latest release, with no published advisories affecting the version in use.",
          },
          {
            heading: "3.2 Static Analysis and Manual Review",
            body: "The audit found no critical or high-severity vulnerability in queuelite or in any of its dependencies, and static analysis flagged nothing above low severity. The auditors also tried to read and alter messages while they were waiting in the queue, using two ordinary client accounts, and did not succeed.",
          },
          {
            heading: "3.3 Configuration Defaults",
            body: "The default configuration requires every client to authenticate, disables remote administration, and binds only to the local network interface. Messages are encrypted when stored on disk.",
          },
          {
            heading: "3.4 Maintainer Responsiveness",
            body: "Over the past twelve months the maintainers responded to newly opened issues within a median of two working days and published six releases. The project has five active maintainers employed by three different organizations.",
          },
          {
            heading: "3.5 Licensing",
            body: "queuelite is distributed under a permissive open-source license that is compatible with our company's open-source usage policy.",
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
            heading: "4.2 Memory Usage",
            body: "In all four load tests, queuelite's memory usage levelled off within the first hour and then remained stable for the full 24-hour test period, with no crashes or restarts. Peak memory stayed below 55% of the available 16 GB in every run.",
          },
          {
            heading: "4.3 Delivery Delay",
            body: "Under peak load, queuelite cut the median time between a message being sent and being delivered by 38% compared with our current queue, because it groups small messages into batches. The reduction was smaller outside peak hours, averaging 17%.",
          },
          {
            heading: "4.4 Throughput",
            body: "Message throughput was higher than the current queue in three of the four tests and equal within measurement error in the fourth. The average improvement across the four tests was 22%.",
          },
          {
            heading: "4.5 CPU Utilization",
            body: "Average CPU utilization was about 3 percentage points higher with queuelite than with the current queue. This is a minor observation. It is outside the board's approval criteria and is within the tolerance the organization accepts for a queue.",
          },
        ],
      },
      {
        pageNum: 6,
        sections: [
          {
            heading: "5. LIMITATIONS",
            body: "The load tests ran in a staging environment that mirrors production but does not receive real user traffic, so behaviour in production could differ in detail. The audit covered v2.6 only and does not extend to earlier or later releases.",
          },
          {
            body: "A minor caveat, outside the board's approval criteria: the help text of queuelite's command-line administration tool contains several typos and one outdated option name. The tool itself worked as intended throughout testing.",
          },
          {
            heading: "APPENDIX A: PER-TEST FIGURES",
            body: "Test 1: peak memory 52%, throughput +24%. Test 2: peak memory 54%, throughput +27%. Test 3: peak memory 51%, throughput +0% (within measurement error). Test 4: peak memory 53%, throughput +37%. Throughput is relative to the current queue under the same traffic.",
          },
          {
            heading: "APPENDIX B: ALTERNATIVES SCREENED",
            body: "Two other queue libraries, hopline and relaybox, were screened before this evaluation. hopline was excluded because its license is incompatible with our open-source usage policy, and relaybox because it has had no stable release in over a year. Neither was benchmarked or audited.",
          },
          {
            heading: "REFERENCES",
            body: "[1] queuelite Maintainers. (2022). queuelite Documentation, v2.6. Project repository.\n[2] Park, A., Ibrahim, S., & Novak, R. (2024). Internal Benchmark Methodology for Queue Libraries. Open Source Infrastructure Review, Report No. 127.\n[3] Engineering Standards Board. (2024). Third-Party Dependency Approval Process, v4. Internal engineering handbook.",
          },
        ],
      },
    ],
  },
};
