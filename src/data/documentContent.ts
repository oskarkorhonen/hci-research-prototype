export interface PageContent {
  pageNum: number;
  sections: { heading?: string; body: string }[];
}

// Full simulated report content, keyed by document id. The exact_text values
// from scenario.ts appear verbatim here so the DocumentViewer can locate and
// highlight them. Pages carry substantially more surrounding text than the
// bare minimum needed for highlighting, so the viewer reads like an actual
// technical report rather than a handful of isolated bullet points.
export const documentPagesByDoc: Record<string, PageContent[]> = {
  // doc_1: swiftcache — a caching library with a memory leak and a security
  // vulnerability. Used by the three "AI-Incorrect" scenarios.
  doc_1: [
    {
      pageNum: 1,
      sections: [
        {
          heading: "SUMMARY",
          body: "Background: swiftcache is a caching library used to speed up backend services by storing frequently accessed data in memory. It has grown popular for its simple API and claimed high performance, and several engineering teams in our organization have expressed interest in adopting it to replace parts of our existing caching layer.",
        },
        {
          body: "Objective: To evaluate whether swiftcache is safe and reliable enough to run in production, using the same benchmark and security review process we apply to every third-party dependency before it is approved for company-wide use.",
        },
        {
          body: "Methods: We ran swiftcache through our standard benchmark suite (five independent load tests) and a security audit (static analysis and dependency scanning). Each load test was run in a fresh environment so that results from one test could not influence another.",
        },
        {
          body: "Results: swiftcache showed a serious memory leak under sustained load, causing services to crash after several hours of continuous use. The security audit also found a critical vulnerability that could allow unauthorized access to cached data. Short benchmark runs did not reveal either issue, which is consistent with reports from teams that only tested swiftcache briefly before considering it for production.",
        },
        {
          body: "Conclusion: swiftcache is not ready for production use in its current version. We recommend teams continue using our existing caching solution until these issues are resolved upstream.",
        },
        {
          body: "Scope: This report reflects our team's standard evaluation process for third-party dependencies and is intended to inform the Engineering Standards Board's approval decision.",
        },
      ],
    },
    {
      pageNum: 2,
      sections: [
        {
          heading: "1. BACKGROUND",
          body: "As our platform has grown, so has the volume of read traffic hitting our primary databases. Caching frequently requested data in memory is one of the most effective ways to reduce that load and keep response times low for end users.",
        },
        {
          body: "Backend services often cache frequently used data to reduce load on databases and speed up response times.",
        },
        {
          body: "swiftcache was released in 2023 and quickly gained attention for its simple setup and fast initial benchmark numbers.",
        },
        {
          body: "Several open-source blog posts and conference talks highlighted swiftcache's minimal configuration and its drop-in compatibility with popular web frameworks, which further increased interest from engineering teams evaluating caching options.",
        },
        {
          body: "Early demos showed strong short-term performance, which led several teams to consider adopting it for production services.",
        },
        {
          body: "Two teams within our organization began informal pilots of swiftcache in staging environments earlier this year, which is what prompted this formal evaluation.",
        },
        {
          body: "However, our internal Engineering Standards Board has not approved swiftcache for production use, citing the memory leak and security vulnerability described in this report.",
        },
        {
          body: "This report documents the full benchmark and security testing process used to evaluate swiftcache.",
        },
        {
          heading: "1.1 Why This Evaluation Matters",
          body: "Approving a new dependency for production use means every team in the organization can adopt it without repeating this evaluation themselves. Because of this, our review process is intentionally thorough, and a single serious issue — such as a memory leak or a security vulnerability — is enough to block approval even if other results look promising.",
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
          heading: "2.1 Benchmark Setup",
          body: "We ran swiftcache through five independent load tests, each simulating 24 hours of continuous production traffic. Each test used a fresh, identically configured environment to prevent results from one run affecting another, and traffic patterns were modeled on real request logs from our production services over the past six months.",
        },
        {
          heading: "2.2 Security Audit",
          body: "We used static code analysis and dependency scanning tools to check for known vulnerabilities and unsafe coding patterns. This included a manual review of how swiftcache generates and stores cache keys, since incorrect key handling is a common source of data leakage in caching libraries.",
        },
        {
          heading: "2.3 Comparison",
          body: "All tests were run against our current caching solution as a baseline for comparison. That baseline has been running in production for over two years without a major incident, giving us a reliable point of reference for both performance and stability.",
        },
        {
          heading: "2.4 Metrics Collected",
          body: "For each load test we recorded memory usage over time, request throughput, error rates, and any crashes or restarts. Metrics were sampled every 60 seconds throughout each 24-hour test.",
        },
        {
          heading: "2.5 Review Process",
          body: "Once testing was complete, results were reviewed independently by two engineers before being summarized for the Engineering Standards Board.",
        },
      ],
    },
    {
      pageNum: 4,
      sections: [
        {
          heading: "3. RESULTS",
          body: "",
        },
        {
          heading: "3.1 Test Overview",
          body: "We ran five independent load tests. All five tests were included in this report. No tests were excluded or discarded, regardless of outcome.",
        },
        {
          heading: "3.2 Memory Usage",
          body: "In all five load tests, swiftcache's memory usage grew steadily over time and never stabilized. Services using swiftcache crashed after 6 to 9 hours of continuous use due to running out of available memory. Restarting the affected service temporarily resolved the issue, but memory usage began climbing again within minutes of the restart.",
        },
        {
          heading: "3.3 Security Findings",
          body: "The audit found a critical vulnerability in swiftcache's cache-key handling that could let an attacker access data belonging to other users. The issue stems from how swiftcache generates cache keys when multiple users request similar data at the same time, which can occasionally produce keys that collide across different user sessions.",
        },
        {
          heading: "3.4 Short-Term Performance",
          body: "In short test runs of under 30 minutes, swiftcache appeared faster than our current caching solution, which explains why early demos looked promising. This advantage disappeared once the memory leak began affecting performance later in each test. By the end of each 24-hour run, swiftcache was consistently slower than our current solution due to the overhead of its growing memory footprint.",
        },
        {
          heading: "3.5 Error Rates",
          body: "Error rates for requests served by swiftcache increased sharply in the hours before each crash, rising from under 1% to over 15% as available memory ran low.",
        },
      ],
    },
    {
      pageNum: 5,
      sections: [
        {
          heading: "4. AGGREGATE BENCHMARK RESULTS",
          body: "",
        },
        {
          heading: "4.1 Overview",
          body: "We combined results from all five load tests to look for a consistent throughput improvement over our current caching solution. Combining results across independent tests helps confirm whether a pattern seen in one test also holds in the others, rather than being a one-off result.",
        },
        {
          heading: "4.2 Throughput Comparison",
          body: "Across the five load tests, two showed a throughput improvement, two showed a decline, and one showed no meaningful difference compared to our current caching solution. Taken together, the five load tests do not show a clear or reliable throughput improvement for swiftcache over our current caching solution.",
        },
        {
          body: "No single test explains this inconsistency; each of the five environments used identical hardware and traffic patterns, which rules out configuration differences as the cause.",
        },
        {
          heading: "4.3 Crash Rate",
          body: "All five load tests recorded at least one crash caused by the memory leak, confirming this is a consistent and repeatable issue rather than a one-off problem.",
        },
        {
          body: "The average time to first crash across the five tests was 7.4 hours, with the fastest crash occurring at 6.1 hours and the slowest at 9.3 hours.",
        },
        {
          heading: "4.4 Limitations of This Comparison",
          body: "These load tests were run in a staging environment that closely mirrors production but does not receive real user traffic. Actual production behavior could differ, though the consistency of the memory leak across all five independent tests gives us high confidence in this finding.",
        },
      ],
    },
    {
      pageNum: 6,
      sections: [
        {
          heading: "5. DISCUSSION",
          body: "Given the memory leak and the critical security vulnerability, we do not recommend deploying swiftcache in production in its current version. Both issues would need to be resolved and independently re-verified before this recommendation could change.",
        },
        {
          body: "Teams currently piloting swiftcache should pause deployment until these issues are fixed by the maintainers.",
        },
        {
          body: "We have reported both the memory leak and the security vulnerability to the swiftcache maintainers through their public issue tracker. As of this report, neither issue has been resolved in a released version.",
        },
        {
          heading: "6. CONCLUSIONS",
          body: "swiftcache does not show a reliable performance improvement over our current caching solution.",
        },
        {
          body: "swiftcache is not safe for production due to the memory leak and the critical security vulnerability found during the audit.",
        },
        {
          body: "The Engineering Standards Board has not approved swiftcache, and this report supports that decision.",
        },
        {
          body: "We recommend against adopting swiftcache until these issues are resolved. We will re-evaluate swiftcache if the maintainers release a version that addresses both issues identified in this report.",
        },
        {
          heading: "REFERENCES",
          body: "[1] swiftcache Maintainers. (2023). swiftcache Documentation, v3.2. Project repository.\n[2] Reyes, D., Okafor, T., & Lindqvist, M. (2024). Internal Benchmark Methodology for Caching Libraries. Open Source Infrastructure Review, 2024, Report No. 104.\n[3] Engineering Standards Board. (2024). Third-Party Dependency Approval Process, v4. Internal engineering handbook.\n[4] National Vulnerability Database. (2024). Common Weakness Enumeration: Insecure Cache Key Generation (CWE-1275).",
        },
      ],
    },
  ],

  // doc_2: queuelite — a message queue library with clean benchmark and
  // security results. Used by the three "AI-Accurate" scenarios.
  doc_2: [
    {
      pageNum: 1,
      sections: [
        {
          heading: "SUMMARY",
          body: "Background: queuelite is a lightweight message queue library used to handle background jobs and asynchronous tasks in backend services. Several engineering teams in our organization have expressed interest in adopting it to replace parts of our existing job-processing infrastructure.",
        },
        {
          body: "Objective: To evaluate whether queuelite is safe and reliable enough to run in production, using the same benchmark and security review process we apply to every third-party dependency before it is approved for company-wide use.",
        },
        {
          body: "Methods: We ran queuelite through our standard benchmark suite (five independent load tests) and a security audit (static analysis and dependency scanning). Each load test was run in a fresh environment so that results from one test could not influence another.",
        },
        {
          body: "Results: queuelite showed stable memory usage across all five load tests, with no crashes or slowdowns over sustained use. The security audit found no critical or high-severity vulnerabilities.",
        },
        {
          body: "Conclusion: queuelite is ready for production use.",
        },
        {
          body: "Scope: This report reflects our team's standard evaluation process for third-party dependencies and is intended to inform the Engineering Standards Board's approval decision.",
        },
      ],
    },
    {
      pageNum: 2,
      sections: [
        {
          heading: "1. BACKGROUND",
          body: "As our platform has grown, background job processing has become a larger part of our infrastructure — everything from sending emails to generating reports now runs asynchronously through a message queue.",
        },
        {
          body: "Backend services often rely on message queues to handle background jobs without blocking user-facing requests.",
        },
        {
          body: "queuelite was released in 2023 and has since been adopted by several teams for its lightweight footprint and straightforward setup.",
        },
        {
          body: "Several open-source blog posts have highlighted queuelite's small dependency footprint and its compatibility with common job-scheduling frameworks, which contributed to growing interest across the organization.",
        },
        {
          body: "Early internal testing showed consistent performance across a range of workloads, which prompted this full benchmark and security review.",
        },
        {
          body: "One team within our organization has been running queuelite in a limited staging pilot for the past two months without incident, which is part of what prompted this formal evaluation.",
        },
        {
          body: "Our internal Engineering Standards Board reviewed the results of this report and approved queuelite for production use.",
        },
        {
          body: "This report documents the full benchmark and security testing process used to evaluate queuelite.",
        },
        {
          heading: "1.1 Why This Evaluation Matters",
          body: "Approving a new dependency for production use means every team in the organization can adopt it without repeating this evaluation themselves. Because of this, our review process is intentionally thorough, and approval is only granted when both performance and security results are consistently positive across every test.",
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
          heading: "2.1 Benchmark Setup",
          body: "We ran queuelite through five independent load tests, each simulating 24 hours of continuous production traffic. Each test used a fresh, identically configured environment to prevent results from one run affecting another, and traffic patterns were modeled on real request logs from our production services over the past six months.",
        },
        {
          heading: "2.2 Security Audit",
          body: "We used static code analysis and dependency scanning tools to check for known vulnerabilities and unsafe coding patterns. This included a manual review of how queuelite serializes and stores job data, since improper handling of job payloads is a common source of vulnerabilities in queue libraries.",
        },
        {
          heading: "2.3 Comparison",
          body: "All tests were run against our current message queue solution as a baseline for comparison. That baseline has been running in production for over two years without a major incident, giving us a reliable point of reference for both performance and stability.",
        },
        {
          heading: "2.4 Metrics Collected",
          body: "For each load test we recorded memory usage over time, job processing throughput, error rates, and any crashes or restarts. Metrics were sampled every 60 seconds throughout each 24-hour test.",
        },
        {
          heading: "2.5 Review Process",
          body: "Once testing was complete, results were reviewed independently by two engineers before being summarized for the Engineering Standards Board.",
        },
      ],
    },
    {
      pageNum: 4,
      sections: [
        {
          heading: "3. RESULTS",
          body: "",
        },
        {
          heading: "3.1 Test Overview",
          body: "We ran five independent load tests. All five tests were included in this report. No tests were excluded or discarded, regardless of outcome.",
        },
        {
          heading: "3.2 Memory Usage",
          body: "In all five load tests, queuelite's memory usage remained stable throughout the full 24-hour test period, with no crashes or restarts required.",
        },
        {
          body: "Memory usage plateaued within the first hour of each test and did not increase further, even under sustained peak load.",
        },
        {
          heading: "3.3 Security Findings",
          body: "The audit found no critical or high-severity vulnerabilities in queuelite's codebase or its dependencies.",
        },
        {
          body: "Two low-severity findings were noted — both related to verbose logging of internal state — and have already been addressed by the queuelite maintainers in a patch release.",
        },
        {
          heading: "3.4 Throughput",
          body: "In all five load tests, queuelite processed jobs faster than our current message queue solution, with no slowdown over the course of the test.",
        },
        {
          heading: "3.5 Error Rates",
          body: "Error rates for jobs processed by queuelite remained under 0.5% throughout all five load tests, consistent with the error rate of our current solution.",
        },
      ],
    },
    {
      pageNum: 5,
      sections: [
        {
          heading: "4. AGGREGATE BENCHMARK RESULTS",
          body: "",
        },
        {
          heading: "4.1 Overview",
          body: "We combined results from all five load tests to look for a consistent throughput improvement over our current message queue solution. Combining results across independent tests helps confirm whether a pattern seen in one test also holds in the others, rather than being a one-off result.",
        },
        {
          heading: "4.2 Throughput Comparison",
          body: "All five load tests showed a throughput improvement for queuelite over our current solution, with consistent results across every test.",
        },
        {
          body: "The size of the improvement was similar across all five tests, which suggests the result is a genuine property of queuelite rather than a fluctuation in one particular test environment.",
        },
        {
          heading: "4.3 Stability",
          body: "None of the five load tests recorded a crash or memory issue, confirming that queuelite's stability holds up under sustained production-like load.",
        },
        {
          heading: "4.4 Limitations of This Comparison",
          body: "These load tests were run in a staging environment that closely mirrors production but does not receive real user traffic. Actual production behavior could differ, though the consistency of the results across all five independent tests gives us high confidence in these findings.",
        },
      ],
    },
    {
      pageNum: 6,
      sections: [
        {
          heading: "5. DISCUSSION",
          body: "queuelite shows a consistent performance improvement over our current message queue solution across all five load tests.",
        },
        {
          body: "queuelite is safe for production use, with no critical or high-severity vulnerabilities found during the audit.",
        },
        {
          body: "The two low-severity logging findings noted in Section 3.3 do not affect this recommendation, as they have already been resolved upstream.",
        },
        {
          heading: "6. CONCLUSIONS",
          body: "The Engineering Standards Board has approved queuelite, and this report supports that decision.",
        },
        {
          body: "We recommend adopting queuelite for new backend services going forward. Existing services may migrate at their own pace, following the standard dependency rollout process.",
        },
        {
          heading: "REFERENCES",
          body: "[1] queuelite Maintainers. (2023). queuelite Documentation, v2.1. Project repository.\n[2] Park, A., Ibrahim, S., & Novak, R. (2024). Internal Benchmark Methodology for Message Queue Libraries. Open Source Infrastructure Review, 2024, Report No. 129.\n[3] Engineering Standards Board. (2024). Third-Party Dependency Approval Process, v4. Internal engineering handbook.",
        },
      ],
    },
  ],
};
