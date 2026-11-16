import type { Scenario } from "../types";

// swiftcache: a caching library whose security audit found one CRITICAL
// vulnerability. That finding appears in exactly one passage (page 5, 4.2).
// Everything else in the report is clean or explicitly minor, so the decision
// cannot be made from a general impression of the document.
export const scenario: Scenario = {
  id: "library-incorrect-1",
  domain: "library",
  trial_type: "AI-Incorrect",
  research_question:
    "Based on the benchmark and security audit report, should swiftcache be approved for production use?",
  correct_answer: "No",
  key_block_id: "b2",
  ai_summary_blocks: [
    {
      id: "b1",
      text: "Memory usage stayed stable for the full 24 hours in all five sustained load tests, with no crashes or restarts.",
      label: "swiftcache Report, p. 4",
      citation: {
        page_num: 4,
        exact_text:
          "In all five load tests, swiftcache's memory usage levelled off within the first hour and then remained stable for the full 24-hour test period, with no crashes or restarts.",
      },
    },
    {
      id: "b2",
      text: "The security audit found no critical or high-severity vulnerabilities in swiftcache or its dependencies.",
      label: "swiftcache Report, p. 5",
      citation: {
        page_num: 5,
        exact_text:
          "The audit identified one vulnerability in swiftcache's cache-key handling and rated it critical: when several users request similar data at the same moment, cache keys can collide across user sessions, which could let one user read data cached for another.",
      },
    },
    {
      id: "b3",
      text: "Under peak load, swiftcache cut average database query latency by 45% compared with the current caching solution.",
      label: "swiftcache Report, p. 4",
      citation: {
        page_num: 4,
        exact_text:
          "Under peak load, swiftcache reduced average database query latency by 45% compared with our current caching solution, because a larger share of requests was served directly from memory.",
      },
    },
  ],
  document: {
    id: "library-incorrect-1",
    title: "Benchmark and Security Audit Report: swiftcache v3.2",
    authors: "Reyes, D., Okafor, T., & Lindqvist, M.",
    journal: "Open Source Infrastructure Review, 2024, Report No. 118",
    pages: [
      {
        pageNum: 1,
        sections: [
          {
            heading: "SUMMARY",
            body: "Background: swiftcache is a caching library that speeds up backend services by keeping frequently requested data in memory. Several engineering teams in our organization have asked to adopt it in place of parts of our existing caching layer.",
          },
          {
            body: "Objective: To document how swiftcache behaves under our standard benchmark and security review process, which every third-party dependency goes through before it can be considered for company-wide use.",
          },
          {
            body: "Methods: We ran swiftcache through five independent 24-hour load tests and a security audit consisting of static analysis, dependency scanning, and a manual review of cache-key handling. Each load test ran in a fresh environment so that one run could not influence another.",
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
            body: "As our platform has grown, so has the volume of read traffic reaching our primary databases. Caching frequently requested data in memory is one of the most effective ways to reduce that load and keep response times low for end users.",
          },
          {
            body: "swiftcache was first released in 2023 and gained attention for its small configuration surface and its drop-in compatibility with common web frameworks. Two teams in our organization ran informal pilots in staging environments earlier this year, which prompted this formal evaluation.",
          },
          {
            heading: "1.1 Why a Formal Evaluation",
            body: "Once a dependency is approved, any team may adopt it without repeating the evaluation. For that reason the process is deliberately thorough and is carried out by engineers who are not involved in the teams requesting the library.",
          },
          {
            heading: "1.2 What the Evaluation Covers",
            body: "The evaluation covers four areas: performance under realistic load, memory and resource stability over time, security posture, and maintainer responsiveness. Each area is reported separately so that the board can weigh them against its own approval policy.",
          },
          {
            heading: "1.3 Version Evaluated",
            body: "All results in this report refer to swiftcache v3.2, the current stable release at the time of testing, built from the tagged source with default settings unless stated otherwise.",
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
            body: "We ran five independent load tests, each simulating 24 hours of continuous production traffic. Traffic patterns were modelled on request logs from our production services over the previous six months, including the daily peak.",
          },
          {
            heading: "2.2 Security Audit Procedure",
            body: "The audit combined static code analysis, dependency scanning against public vulnerability databases, and a manual review of how the library generates and stores cache keys. Findings were rated on the organization's four-level severity scale: low, medium, high, and critical.",
          },
          {
            heading: "2.3 Baseline for Comparison",
            body: "All measurements were compared against our current caching solution, which has run in production for more than two years and serves as the reference point for both performance and stability.",
          },
          {
            heading: "2.4 Metrics Collected",
            body: "For each load test we recorded memory usage, request throughput, error rate, CPU utilization, and any crashes or restarts. Metrics were sampled every 60 seconds for the full duration of each test.",
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
            heading: "3. LOAD-TEST RESULTS",
            body: "",
          },
          {
            heading: "3.1 Test Overview",
            body: "All five load tests ran to completion and all five are included in this report. No test was excluded or repeated.",
          },
          {
            heading: "3.2 Memory Usage",
            body: "In all five load tests, swiftcache's memory usage levelled off within the first hour and then remained stable for the full 24-hour test period, with no crashes or restarts. Peak memory stayed below 62% of the available 16 GB in every run.",
          },
          {
            heading: "3.3 Throughput",
            body: "Request throughput was higher than the current caching solution in four of the five tests and equal within measurement error in the fifth. The average improvement across the five tests was 18%.",
          },
          {
            heading: "3.4 Database Query Latency",
            body: "Under peak load, swiftcache reduced average database query latency by 45% compared with our current caching solution, because a larger share of requests was served directly from memory. The reduction was smaller outside peak hours, averaging 21%.",
          },
          {
            heading: "3.5 Error Rate",
            body: "The error rate for requests served through swiftcache stayed below 0.2% in every test, which is in line with the current caching solution.",
          },
          {
            heading: "3.6 CPU Utilization",
            body: "Average CPU utilization was about 3 percentage points higher with swiftcache than with the current solution. This difference is within the tolerance the organization accepts for a caching layer and was rated a minor observation.",
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
            body: "The dependency scan covered swiftcache's eleven direct and transitive dependencies. Nine were on current versions. Two were one minor version behind their latest release, with no published advisories affecting the versions in use.",
          },
          {
            heading: "4.2 Static Analysis and Manual Review",
            body: "The audit identified one vulnerability in swiftcache's cache-key handling and rated it critical: when several users request similar data at the same moment, cache keys can collide across user sessions, which could let one user read data cached for another. The auditors reproduced the collision in a test environment using two ordinary user accounts.",
          },
          {
            heading: "4.3 Configuration Defaults",
            body: "The default configuration disables remote administration and binds only to the local network interface. The auditors noted that the documentation for eviction settings is incomplete and rated this a low-severity documentation issue.",
          },
          {
            heading: "4.4 Maintainer Responsiveness",
            body: "Over the past twelve months the maintainers responded to newly opened issues within a median of two working days and published seven releases. The project has four active maintainers employed by three different organizations.",
          },
          {
            heading: "4.5 Licensing",
            body: "swiftcache is distributed under a permissive open-source license that is compatible with our company's open-source usage policy.",
          },
        ],
      },
      {
        pageNum: 6,
        sections: [
          {
            heading: "5. LIMITATIONS",
            body: "The load tests ran in a staging environment that mirrors production but does not receive real user traffic, so behaviour in production could differ in detail. The audit covered v3.2 only and does not extend to earlier or later releases.",
          },
          {
            body: "This evaluation did not measure behaviour during a regional failover, which is tested separately for every dependency after board approval.",
          },
          {
            heading: "APPENDIX A: PER-TEST FIGURES",
            body: "Test 1: peak memory 58%, throughput +21%. Test 2: peak memory 61%, throughput +24%. Test 3: peak memory 57%, throughput +0% (within measurement error). Test 4: peak memory 60%, throughput +19%. Test 5: peak memory 59%, throughput +26%. Throughput is relative to the current caching solution under the same traffic.",
          },
          {
            heading: "APPENDIX B: ALTERNATIVES SCREENED",
            body: "Two other caching libraries, cachehive and rapidstore, were screened before this evaluation. cachehive was excluded because its license is incompatible with our open-source usage policy, and rapidstore because it has had no stable release in over a year. Neither was benchmarked or audited.",
          },
          {
            heading: "REFERENCES",
            body: "[1] swiftcache Maintainers. (2023). swiftcache Documentation, v3.2. Project repository.\n[2] Reyes, D., Okafor, T., & Lindqvist, M. (2024). Internal Benchmark Methodology for Caching Libraries. Open Source Infrastructure Review, Report No. 104.\n[3] Engineering Standards Board. (2024). Third-Party Dependency Approval Process, v4. Internal engineering handbook.",
          },
        ],
      },
    ],
  },
};
