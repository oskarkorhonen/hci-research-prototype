import type { Scenario } from "../types";

// tidepool: a database connection-pool library whose connection count kept
// growing in every sustained load test, exhausting the pool near hour 31.
// That finding appears in exactly one passage (page 4, 3.2). Everything else
// in the report is clean or explicitly minor, and no other section describes
// how long the tests actually ran or what happened to the pool.
export const scenario: Scenario = {
  id: "library-incorrect-2",
  domain: "library",
  trial_type: "AI-Incorrect",
  research_question:
    "Based on the benchmark and security audit report, should tidepool be approved for production use?",
  correct_answer: "No",
  key_block_id: "b1",
  ai_summary_blocks: [
    {
      id: "b1",
      text: "Connection counts stayed stable for the full 48 hours in all four sustained load tests, with no restarts needed.",
      label: "tidepool Report, p. 4",
      citation: {
        page_num: 4,
        exact_text:
          "In all four sustained load tests, the number of open connections kept growing, and the pool was exhausted at around hour 31 of the 48-hour run in every test, after which the service stopped accepting requests until it was restarted.",
      },
    },
    {
      id: "b2",
      text: "The security audit found no critical or high-severity vulnerabilities in tidepool or the libraries it depends on.",
      label: "tidepool Report, p. 5",
      citation: {
        page_num: 5,
        exact_text:
          "The audit found no critical or high-severity vulnerability in tidepool or in any of its dependencies, and static analysis flagged nothing above low severity.",
      },
    },
    {
      id: "b3",
      text: "On average, tidepool delivered 14% more requests per second than the current connection pool across the four load tests.",
      label: "tidepool Report, p. 4",
      citation: {
        page_num: 4,
        exact_text:
          "Request throughput was higher than the current connection pool in all four tests, with an average improvement of 14%, because tidepool reuses idle connections more aggressively.",
      },
    },
  ],
  document: {
    id: "library-incorrect-2",
    title: "Benchmark and Security Audit Report: tidepool v1.8",
    authors: "Haddad, L., Svensson, K., & Obi, N.",
    journal: "Open Source Infrastructure Review, 2024, Report No. 151",
    pages: [
      {
        pageNum: 1,
        sections: [
          {
            heading: "SUMMARY",
            body: "Background: tidepool is a connection-pool library. A connection pool keeps a set of database connections open and hands them out to requests as needed, so that each request does not have to set up its own connection. Several engineering teams in our organization have asked to adopt tidepool in place of parts of our existing pooling layer.",
          },
          {
            body: "Objective: To document how tidepool behaves under our standard benchmark and security review process, which every third-party dependency goes through before it can be considered for company-wide use.",
          },
          {
            body: "Methods: We ran tidepool through four independent 48-hour load tests and a security audit consisting of static analysis, dependency scanning, and a manual review of how the library handles credentials and connection settings. Each load test ran in a fresh environment so that one run could not influence another.",
          },
          {
            body: "Scope: This report presents findings only. It does not contain a recommendation. The approval decision rests with the infrastructure review board, which applies its own policy to the findings in Sections 3 and 4.",
          },
          {
            body: "Report structure: Section 1 gives background, Section 2 describes the method, Section 3 reports the load-test results, Section 4 reports the audit results, and Section 5 lists limitations. Appendix A gives per-test figures.",
          },
        ],
      },
      {
        pageNum: 2,
        sections: [
          {
            heading: "1. BACKGROUND",
            body: "Every request that touches our databases needs a connection, and opening one is slow compared with reusing one that already exists. Our services therefore share pools of open connections, and the pooling layer has become a busy part of the platform as traffic has grown.",
          },
          {
            body: "tidepool was first released in 2023 and gained attention for its small configuration surface and its ability to resize pools automatically. Two teams in our organization ran informal pilots in staging environments earlier this year, which prompted this formal evaluation.",
          },
          {
            heading: "1.1 Why a Formal Evaluation",
            body: "Once a dependency is approved, any team may adopt it without repeating the evaluation. For that reason the process is deliberately thorough and is carried out by engineers who are not involved in the teams requesting the library.",
          },
          {
            heading: "1.2 What the Evaluation Covers",
            body: "The evaluation covers four areas: behaviour under sustained load, performance, security posture, and maintainer responsiveness. Each area is reported separately so that the board can weigh them against its own approval policy.",
          },
          {
            heading: "1.3 Version Evaluated",
            body: "All results in this report refer to tidepool v1.8, the current stable release at the time of testing, built from the tagged source with default settings unless stated otherwise.",
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
            heading: "2.1 Load-Test Setup",
            body: "We ran four independent load tests, each simulating 48 hours of continuous production traffic. Traffic patterns were modelled on request logs from our production services over the previous six months, including the daily peak.",
          },
          {
            heading: "2.2 Security Audit Procedure",
            body: "The audit combined static code analysis, dependency scanning against public vulnerability databases, and a manual review of how the library stores credentials and validates connection settings. Findings were rated on the organization's four-level severity scale: low, medium, high, and critical.",
          },
          {
            heading: "2.3 Baseline for Comparison",
            body: "All measurements were compared against our current connection pool, which has run in production for more than three years and serves as the reference point for both performance and stability.",
          },
          {
            heading: "2.4 Metrics Collected",
            body: "For each load test we recorded the number of open connections, request throughput, connection wait time, CPU utilization, and any crashes or restarts. Metrics were sampled every 60 seconds for the full duration of each test.",
          },
          {
            heading: "2.5 Test Environment",
            body: "Tests ran on identically provisioned virtual machines with 8 CPU cores and 16 GB of memory, matching our standard production application servers, against a database server configured like our production databases. Network conditions used the same traffic-shaping configuration as our production load-testing pipeline.",
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
            heading: "3. LOAD-TEST RESULTS",
            body: "",
          },
          {
            heading: "3.1 Test Overview",
            body: "All four load tests are included in this report, and no test was excluded.",
          },
          {
            heading: "3.2 Connection Stability",
            body: "In all four sustained load tests, the number of open connections kept growing, and the pool was exhausted at around hour 31 of the 48-hour run in every test, after which the service stopped accepting requests until it was restarted.",
          },
          {
            heading: "3.3 Throughput",
            body: "Request throughput was higher than the current connection pool in all four tests, with an average improvement of 14%, because tidepool reuses idle connections more aggressively. The improvement was largest during the daily peak.",
          },
          {
            heading: "3.4 Connection Wait Time",
            body: "The median time a request waited to obtain a connection was between 1.8 and 2.4 milliseconds in every test, compared with 3.1 milliseconds for the current connection pool.",
          },
          {
            heading: "3.5 CPU Utilization",
            body: "Average CPU utilization was about 2 percentage points higher with tidepool than with the current pool. This is a minor observation. It is outside the board's approval criteria and is within the tolerance the organization accepts for a connection pool.",
          },
        ],
      },
      {
        pageNum: 5,
        sections: [
          {
            heading: "4. SECURITY AUDIT RESULTS",
            body: "",
          },
          {
            heading: "4.1 Dependency Scan",
            body: "The dependency scan covered tidepool's seven direct and transitive dependencies. Six were on current versions. One was a single minor version behind its latest release, with no published advisories affecting the version in use.",
          },
          {
            heading: "4.2 Static Analysis and Manual Review",
            body: "The audit found no critical or high-severity vulnerability in tidepool or in any of its dependencies, and static analysis flagged nothing above low severity. The auditors also tried to obtain stored database credentials through the pool's configuration interface, using two ordinary application accounts, and did not succeed.",
          },
          {
            heading: "4.3 Configuration Defaults",
            body: "The default configuration encrypts connections to the database and keeps credentials out of log output. A minor caveat, outside the board's approval criteria: the documentation for the pool-resizing settings is incomplete, which the auditors rated a low-severity documentation issue.",
          },
          {
            heading: "4.4 Maintainer Responsiveness",
            body: "Over the past twelve months the maintainers responded to newly opened issues within a median of three working days and published five releases. The project has four active maintainers employed by three different organizations.",
          },
          {
            heading: "4.5 Licensing",
            body: "tidepool is distributed under a permissive open-source license that is compatible with our company's open-source usage policy.",
          },
        ],
      },
      {
        pageNum: 6,
        sections: [
          {
            heading: "5. LIMITATIONS",
            body: "The load tests ran in a staging environment that mirrors production but does not receive real user traffic, so behaviour in production could differ in detail. The audit covered v1.8 only and does not extend to earlier or later releases.",
          },
          {
            body: "A minor caveat, outside the board's approval criteria: the project's example code uses an older configuration syntax that still works but is no longer the documented form.",
          },
          {
            heading: "APPENDIX A: PER-TEST FIGURES",
            body: "Test 1: throughput +12%, median connection wait 2.1 ms. Test 2: throughput +15%, median connection wait 1.8 ms. Test 3: throughput +13%, median connection wait 2.4 ms. Test 4: throughput +16%, median connection wait 2.0 ms. Throughput is relative to the current connection pool under the same traffic.",
          },
          {
            heading: "APPENDIX B: ALTERNATIVES SCREENED",
            body: "Two other connection-pool libraries, poolhive and linkbank, were screened before this evaluation. poolhive was excluded because its license is incompatible with our open-source usage policy, and linkbank because it has had no stable release in over a year. Neither was benchmarked or audited.",
          },
          {
            heading: "REFERENCES",
            body: "[1] tidepool Maintainers. (2023). tidepool Documentation, v1.8. Project repository.\n[2] Haddad, L., Svensson, K., & Obi, N. (2024). Internal Benchmark Methodology for Database Libraries. Open Source Infrastructure Review, Report No. 133.\n[3] Engineering Standards Board. (2024). Third-Party Dependency Approval Process, v4. Internal engineering handbook.",
          },
        ],
      },
    ],
  },
};
