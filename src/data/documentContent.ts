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
        {
          body: "Report Structure: This report is organized into background, methodology, results, aggregate benchmark analysis, and discussion, followed by two appendices covering per-test results and the alternative libraries we considered before selecting swiftcache for formal evaluation.",
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
          body: "Based on this early momentum, the Engineering Standards Board fast-tracked swiftcache's evaluation, prioritizing it for expedited review ahead of several other pending dependency assessments.",
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
        {
          heading: "1.2 Evaluation Criteria",
          body: "Our evaluation process weighs four factors when considering a new dependency: performance under realistic load, memory and resource stability over time, security posture including how the library handles sensitive data, and the responsiveness of the maintainer community to reported issues. A library must perform acceptably across all four before being considered for approval, regardless of how strong any single result looks in isolation.",
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
        {
          heading: "2.6 Test Environment",
          body: "All benchmarks were run on identically provisioned virtual machines with 8 CPU cores and 16 GB of memory, matching the specification of our standard production application servers. Network conditions were simulated using the same traffic-shaping configuration used in our production load-testing pipeline, so that results would be representative of real deployment conditions rather than idealized lab conditions.",
        },
        {
          heading: "2.7 Reproducibility",
          body: "All benchmark and audit scripts used in this evaluation are stored in our internal tooling repository so that results can be independently reproduced by any team.",
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
        {
          heading: "3.6 CPU Usage",
          body: "Average CPU utilization during each load test was comparable between swiftcache and our current caching solution, differing by less than 3 percentage points across all five tests. CPU usage was not a contributing factor to the crashes observed in Section 3.2.",
        },
        {
          heading: "3.7 Latency",
          body: "In addition to throughput, we measured p50 and p95 request latency across all five tests. Before the memory leak began affecting each test, swiftcache's latency was comparable to our current solution at both percentiles; after the memory leak took effect, latency increased sharply at both percentiles as the service approached its crash point.",
        },
        {
          heading: "3.8 Database Query Latency",
          body: "Independent of the memory leak, swiftcache reduced average database query latency by 45% under peak load compared to our current caching solution during initial testing, by serving a larger share of requests directly from memory rather than hitting the database.",
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
        {
          heading: "4.5 Individual Test Summaries",
          body: "A full breakdown of results from each of the five individual load tests is provided in Appendix A.",
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
          heading: "5.1 Comparison with Vendor Claims",
          body: "swiftcache's public documentation and marketing materials advertise throughput improvements of up to 40% over comparable caching libraries, based on short synthetic benchmarks published by the maintainers. Our results do not contradict those specific numbers for short-duration tests, but they do not reflect the behavior we observed once tests ran long enough to trigger the memory leak described in Section 3.2. We believe this discrepancy explains why swiftcache has received positive attention in blog posts and conference talks that are typically based on short demos rather than sustained, production-like testing.",
        },
        {
          heading: "5.2 Risk Assessment",
          body: "We classify the memory leak as a high operational risk, since it would require active monitoring and scheduled restarts to avoid unplanned outages if deployed as-is. We classify the cache-key vulnerability as a high security risk, since exploiting it would not require privileged access and could expose data across otherwise isolated user sessions.",
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
          body: "We recommend against adopting swiftcache until these issues are resolved.",
        },
        {
          heading: "6.1 Recommended Next Steps",
          body: "We recommend teams interested in swiftcache monitor the project's public issue tracker for a fix addressing both the memory leak and the cache-key vulnerability. Once a fixed version is released, we will re-run this full evaluation before revisiting our recommendation.",
        },
        {
          heading: "REFERENCES",
          body: "[1] swiftcache Maintainers. (2023). swiftcache Documentation, v3.2. Project repository.\n[2] Reyes, D., Okafor, T., & Lindqvist, M. (2024). Internal Benchmark Methodology for Caching Libraries. Open Source Infrastructure Review, 2024, Report No. 104.\n[3] Engineering Standards Board. (2024). Third-Party Dependency Approval Process, v4. Internal engineering handbook.\n[4] National Vulnerability Database. (2024). Common Weakness Enumeration: Insecure Cache Key Generation (CWE-1275).",
        },
      ],
    },
    {
      pageNum: 7,
      sections: [
        {
          heading: "APPENDIX A: PER-TEST RESULTS",
          body: "This appendix presents results from each of the five individual load tests referenced throughout this report. All five tests used identical hardware, traffic patterns, and duration (24 hours).",
        },
        {
          heading: "A.1 Test 1",
          body: "Memory usage began climbing after approximately 90 minutes and the service crashed at 6.8 hours. CPU usage remained stable throughout. This test showed a throughput decline relative to our current caching solution.",
        },
        {
          heading: "A.2 Test 2",
          body: "Memory usage began climbing after approximately 70 minutes and the service crashed at 6.1 hours, the fastest crash observed across all five tests. This test showed a throughput improvement relative to our current caching solution, driven largely by strong short-term performance before the crash.",
        },
        {
          heading: "A.3 Test 3",
          body: "Memory usage began climbing after approximately 110 minutes and the service crashed at 8.4 hours. This test showed no meaningful throughput difference relative to our current caching solution.",
        },
        {
          heading: "A.4 Test 4",
          body: "Memory usage began climbing after approximately 95 minutes and the service crashed at 7.9 hours. This test showed a throughput decline relative to our current caching solution.",
        },
        {
          heading: "A.5 Test 5",
          body: "Memory usage began climbing after approximately 130 minutes and the service crashed at 9.3 hours, the slowest crash observed across all five tests. This test showed a throughput improvement relative to our current caching solution.",
        },
      ],
    },
    {
      pageNum: 8,
      sections: [
        {
          heading: "APPENDIX B: ALTERNATIVES CONSIDERED",
          body: "Before evaluating swiftcache, our team considered two other caching libraries currently gaining adoption in the open-source community: cachehive and rapidstore.",
        },
        {
          heading: "B.1 cachehive",
          body: "cachehive was excluded from formal evaluation because its license terms are incompatible with our company's open-source usage policy. This was a licensing decision made prior to any benchmark or security testing, so no performance conclusions can be drawn about cachehive from this report.",
        },
        {
          heading: "B.2 rapidstore",
          body: "rapidstore was excluded because it has not had a stable release in over a year and its maintainers have not responded to community issues since early 2023. Our policy requires evidence of active maintenance before a library is considered for formal evaluation.",
        },
        {
          heading: "B.3 Summary",
          body: "swiftcache was the only actively maintained, license-compatible option that met our initial screening criteria for formal benchmark and security evaluation. This report should not be read as a comparison between swiftcache and either excluded library, since neither underwent the same testing process.",
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
        {
          body: "Report Structure: This report is organized into background, methodology, results, aggregate benchmark analysis, and discussion, followed by two appendices covering per-test results and the alternative libraries we considered before selecting queuelite for formal evaluation.",
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
        {
          heading: "1.2 Evaluation Criteria",
          body: "Our evaluation process weighs four factors when considering a new dependency: performance under realistic load, memory and resource stability over time, security posture including how the library handles sensitive data, and the responsiveness of the maintainer community to reported issues. A library must perform acceptably across all four before being considered for approval, regardless of how strong any single result looks in isolation.",
        },
        {
          heading: "1.3 Comparable Deployments",
          body: "Two other companies in our industry network have publicly discussed adopting queuelite for similar background-job workloads, reporting positive results consistent with what we observed in this evaluation.",
        },
        {
          heading: "1.4 Adoption Timeline",
          body: "If approved, we expect the first production services to begin migrating to queuelite within four weeks, following the staged rollout plan described in Section 6.1. Full migration of eligible services is expected to take place over the following two quarters.",
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
        {
          heading: "2.6 Test Environment",
          body: "All benchmarks were run on identically provisioned virtual machines with 8 CPU cores and 16 GB of memory, matching the specification of our standard production application servers. Network conditions were simulated using the same traffic-shaping configuration used in our production load-testing pipeline, so that results would be representative of real deployment conditions rather than idealized lab conditions.",
        },
        {
          heading: "2.7 Reproducibility",
          body: "All benchmark and audit scripts used in this evaluation are stored in our internal tooling repository so that results can be independently reproduced by any team.",
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
        {
          heading: "3.6 CPU Usage",
          body: "Average CPU utilization during each load test was comparable between queuelite and our current message queue solution, differing by less than 2 percentage points across all five tests.",
        },
        {
          heading: "3.7 Latency",
          body: "In addition to throughput, we measured p50 and p95 job processing latency across all five tests. queuelite's latency was lower than our current solution at both percentiles in every test, with the largest improvement observed at p95 during periods of high load.",
        },
        {
          heading: "3.8 Concurrency Handling",
          body: "We also tested queuelite under bursts of concurrent job submissions to simulate traffic spikes. Across all five tests, queuelite processed concurrent bursts without dropping jobs or exceeding our target queue depth, matching the behavior of our current solution under the same conditions.",
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
        {
          heading: "4.5 Individual Test Summaries",
          body: "A full breakdown of results from each of the five individual load tests is provided in Appendix A.",
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
          heading: "5.1 Comparison with Alternatives",
          body: "Several teams considered building a custom in-house message queue instead of adopting a third-party library. Based on the results in this report, we believe the engineering effort required to match queuelite's throughput and stability would not be justified given how well it already performs against our current solution.",
        },
        {
          heading: "5.2 Risk Assessment",
          body: "We classify the operational risk of adopting queuelite as low, given its stable memory profile and consistent throughput across all five independent tests. We classify the security risk as low, given the absence of critical or high-severity findings in the audit and the maintainers' prompt response to the two low-severity issues we reported.",
        },
        {
          heading: "5.3 Long-Term Considerations",
          body: "We will re-evaluate queuelite's performance and security posture on an annual basis, consistent with our policy for all approved third-party dependencies, to confirm that our findings continue to hold as the library evolves.",
        },
        {
          heading: "6. CONCLUSIONS",
          body: "The Engineering Standards Board has approved queuelite, and this report supports that decision.",
        },
        {
          body: "We recommend adopting queuelite for new backend services going forward. Existing services may migrate at their own pace, following the standard dependency rollout process.",
        },
        {
          heading: "6.1 Rollout Plan",
          body: "We recommend a staged rollout for teams adopting queuelite: begin with non-critical background jobs, monitor memory and error rates for two weeks, and then expand to latency-sensitive workloads once stability is confirmed in production. This mirrors the rollout process used for our current message queue solution when it was first adopted.",
        },
        {
          heading: "REFERENCES",
          body: "[1] queuelite Maintainers. (2023). queuelite Documentation, v2.1. Project repository.\n[2] Park, A., Ibrahim, S., & Novak, R. (2024). Internal Benchmark Methodology for Message Queue Libraries. Open Source Infrastructure Review, 2024, Report No. 129.\n[3] Engineering Standards Board. (2024). Third-Party Dependency Approval Process, v4. Internal engineering handbook.",
        },
      ],
    },
    {
      pageNum: 7,
      sections: [
        {
          heading: "APPENDIX A: PER-TEST RESULTS",
          body: "This appendix presents results from each of the five individual load tests referenced throughout this report. All five tests used identical hardware, traffic patterns, and duration (24 hours).",
        },
        {
          heading: "A.1 Test 1",
          body: "Memory usage stabilized within 45 minutes and remained flat for the remainder of the 24-hour test. No errors were recorded during this test.",
        },
        {
          heading: "A.2 Test 2",
          body: "Memory usage stabilized within 50 minutes. Throughput was 18% higher than our current solution, the largest improvement observed across the five tests.",
        },
        {
          heading: "A.3 Test 3",
          body: "Memory usage stabilized within 40 minutes. This test recorded the lowest error rate of the five tests, at 0.2%.",
        },
        {
          heading: "A.4 Test 4",
          body: "Memory usage stabilized within 55 minutes. Throughput improvement was consistent with the average across all five tests.",
        },
        {
          heading: "A.5 Test 5",
          body: "Memory usage stabilized within 48 minutes. No restarts or manual intervention were required during this test.",
        },
      ],
    },
    {
      pageNum: 8,
      sections: [
        {
          heading: "APPENDIX B: ALTERNATIVES CONSIDERED",
          body: "Before evaluating queuelite, our team considered two other message queue libraries currently gaining adoption in the open-source community: taskrelay and jobforge.",
        },
        {
          heading: "B.1 taskrelay",
          body: "taskrelay was excluded from formal evaluation because it requires a separate broker process that would add operational overhead beyond what our current infrastructure supports. This was an architectural decision made prior to any benchmark or security testing, so no performance conclusions can be drawn about taskrelay from this report.",
        },
        {
          heading: "B.2 jobforge",
          body: "jobforge was excluded because its most recent security audit, conducted by a third party, flagged unresolved medium-severity findings that its maintainers have not yet addressed. Our policy requires no outstanding medium-severity or higher findings before a library is considered for formal evaluation.",
        },
        {
          heading: "B.3 Summary",
          body: "queuelite was the strongest candidate that met our initial screening criteria for formal benchmark and security evaluation. This report should not be read as a comparison between queuelite and either excluded library, since neither underwent the same testing process.",
        },
        {
          heading: "B.4 Cost Considerations",
          body: "queuelite is released under a permissive open-source license with no usage fees. Operating costs are expected to be comparable to our current message queue solution, since both run on the same class of infrastructure and neither requires a separately hosted broker service.",
        },
      ],
    },
  ],

  // doc_3: RankFlow — a recommendation ranking model whose reported 91%
  // accuracy was inflated by a data leak between training and validation
  // data. Used by the Voluntary "AI-Incorrect" scenario.
  doc_3: [
    {
      pageNum: 1,
      sections: [
        {
          heading: "SUMMARY",
          body: "Background: RankFlow is a candidate ranking model developed to power the product recommendation feed shown to users on the homepage and search results pages. It was trained on eighteen months of user interaction data and is intended to replace our current rules-based ranking system.",
        },
        {
          body: "Objective: To evaluate whether RankFlow meets our accuracy and reliability requirements for production deployment, using the same offline evaluation process we apply to every model before it is approved for the recommendation feed.",
        },
        {
          body: "Methods: We evaluated RankFlow using our standard offline evaluation pipeline, which measures top-5 accuracy against a held-out validation set, followed by an independent audit of the data pipeline used to construct that validation set.",
        },
        {
          body: "Results: The initial evaluation reported strong top-5 accuracy for RankFlow. However, our independent audit discovered that the validation set used for this evaluation was not properly isolated from the training data. When RankFlow was re-evaluated on a corrected, leak-free holdout set, its accuracy dropped well below our deployment threshold.",
        },
        {
          body: "Conclusion: RankFlow is not ready for production deployment in its current form.",
        },
        {
          body: "Scope: This report reflects our team's standard model evaluation process and is intended to inform the Machine Learning Review Board's approval decision.",
        },
        {
          body: "Report Structure: This report is organized into background, methodology, results, aggregate evaluation results, and discussion, followed by two appendices covering per-split results and the alternative approaches we considered before selecting RankFlow for formal evaluation.",
        },
      ],
    },
    {
      pageNum: 2,
      sections: [
        {
          heading: "1. BACKGROUND",
          body: "Our product recommendation feed currently uses a rules-based ranking system that has not been substantially updated in three years. As user behavior has shifted, the team has been exploring machine learning models that can adapt more effectively to changing preferences.",
        },
        {
          body: "The recommendation feed is one of the primary drivers of engagement on our platform, so any change to how it ranks items is treated as a high-impact decision requiring formal evaluation.",
        },
        {
          body: "RankFlow was developed over the past two quarters by our applied ML team, using a gradient-boosted ranking architecture trained on eighteen months of anonymized user interaction data.",
        },
        {
          body: "Early internal demos of RankFlow showed strong ranking quality on a small set of manually reviewed examples, which generated enthusiasm for moving toward a full evaluation.",
        },
        {
          body: "This report documents the full offline evaluation process used to assess whether RankFlow is ready to replace the current rules-based ranking system.",
        },
        {
          heading: "1.1 Why This Evaluation Matters",
          body: "Replacing the ranking system affects every user session on the platform, so a model must clear a high bar before deployment. Because of this, our evaluation process is intentionally thorough, and any issue that calls the reported accuracy into question — such as a flaw in how the evaluation itself was conducted — is treated as disqualifying until it can be resolved and the model re-evaluated.",
        },
        {
          heading: "1.2 Evaluation Criteria",
          body: "Our evaluation process weighs three factors when considering a new ranking model: measured accuracy on a properly constructed holdout set, inference latency under realistic traffic, and the integrity of the evaluation pipeline itself. A model must clear all three before being considered for approval, regardless of how strong any single result looks in isolation.",
        },
        {
          heading: "1.3 Comparable Incidents",
          body: "A similar data leak was identified in a different model evaluation roughly eighteen months ago, caused by an unrelated bug in an earlier version of the same data-splitting script. That earlier incident led to the creation of the pipeline audit step now used in every model evaluation, including this one.",
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
          heading: "2.1 Evaluation Dataset",
          body: "RankFlow was evaluated using a held-out validation set drawn from the same eighteen months of interaction data used for training. Validation examples are intended to be fully separate from any data seen during training.",
        },
        {
          heading: "2.2 Accuracy Measurement",
          body: "We measured top-5 accuracy: the proportion of user sessions in which at least one of the model's top five ranked items matched an item the user actually engaged with.",
        },
        {
          heading: "2.3 Pipeline Audit",
          body: "Following the initial evaluation, an independent engineer audited the data pipeline used to construct the validation set, checking for any overlap between training and validation examples.",
        },
        {
          heading: "2.4 Comparison",
          body: "All results were compared against the current rules-based ranking system as a baseline.",
        },
        {
          heading: "2.5 Latency Testing",
          body: "We also measured inference latency under simulated peak traffic to confirm the model would meet our response-time requirements if deployed.",
        },
        {
          heading: "2.6 Review Process",
          body: "Once evaluation was complete, results were reviewed independently by two engineers before being summarized for the Machine Learning Review Board.",
        },
        {
          heading: "2.7 Reproducibility",
          body: "All evaluation and audit scripts used in this report are stored in our internal tooling repository so that results can be independently reproduced by any team.",
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
          heading: "3.1 Initial Evaluation",
          body: "The initial offline evaluation reported a top-5 accuracy of 91% for RankFlow, compared to 74% for the current rules-based system.",
        },
        {
          heading: "3.2 Pipeline Audit Findings",
          body: "An internal review of the evaluation pipeline discovered that a portion of the training data had leaked into the validation set used to evaluate RankFlow.",
        },
        {
          heading: "3.3 Corrected Evaluation",
          body: "After correcting the data leak and re-evaluating RankFlow on a clean holdout set, top-5 accuracy dropped to 68%, well below our deployment threshold of 85%.",
        },
        {
          heading: "3.4 Latency Results",
          body: "Inference latency for RankFlow met our response-time requirements under simulated peak traffic, and this result was not affected by the data leak issue.",
        },
        {
          heading: "3.5 Root Cause of the Leak",
          body: "The leak was traced to a change in the data-splitting script six weeks prior to this evaluation, which caused a subset of sessions to appear in both the training and validation sets.",
        },
        {
          heading: "3.6 Extent of the Overlap",
          body: "Roughly 12% of validation examples had a matching session in the training set. Sessions affected by the leak were disproportionately represented among examples the model ranked correctly, which explains why the leak inflated accuracy rather than leaving it unaffected.",
        },
        {
          heading: "3.7 Click-Through Simulations",
          body: "Independent of the accuracy evaluation, offline simulations estimated that RankFlow would increase user click-through rates by 8% relative to the current rules-based system, based on modeled user response to the new ranking order.",
        },
      ],
    },
    {
      pageNum: 5,
      sections: [
        {
          heading: "4. AGGREGATE EVALUATION RESULTS",
          body: "",
        },
        {
          heading: "4.1 Overview",
          body: "We re-ran the corrected evaluation across four independent holdout splits to confirm the accuracy drop was not specific to a single split.",
        },
        {
          heading: "4.2 Consistency of Corrected Results",
          body: "Accuracy on the four corrected holdout splits ranged from 65% to 70%, consistently below our 85% deployment threshold across every split.",
        },
        {
          heading: "4.3 Review Board Decision",
          body: "The Machine Learning Review Board did not approve RankFlow for deployment based on the corrected evaluation results.",
        },
        {
          heading: "4.4 Limitations",
          body: "These evaluations were run on historical interaction data and do not capture how user behavior might respond to a genuinely new ranking model in production. However, the consistency of the accuracy drop across four independent corrected splits gives us high confidence that the original 91% figure was inflated by the data leak rather than reflecting genuine model quality.",
        },
        {
          heading: "4.5 Individual Split Summaries",
          body: "A full breakdown of results from each of the four corrected holdout splits is provided in Appendix A.",
        },
        {
          heading: "4.6 Comparison with the Current System",
          body: "Even the highest corrected split result (70%) remains below the 74% accuracy of the current rules-based system, meaning RankFlow would represent a regression rather than an improvement if deployed using the corrected evaluation numbers.",
        },
      ],
    },
    {
      pageNum: 6,
      sections: [
        {
          heading: "5. DISCUSSION",
          body: "Given that the original reported accuracy was inflated by a data leak, and that corrected accuracy falls well short of our deployment threshold, we do not recommend deploying RankFlow in its current form.",
        },
        {
          body: "The applied ML team is retraining RankFlow using the corrected data pipeline and plans to submit it for re-evaluation once training is complete.",
        },
        {
          heading: "5.1 Comparison with Initial Expectations",
          body: "The gap between the initial reported accuracy (91%) and the corrected accuracy (68%) is larger than any data leak we have previously identified in an internal model evaluation. This report will be used to update our data-splitting tooling to detect similar leaks automatically in future evaluations.",
        },
        {
          heading: "5.2 Risk Assessment",
          body: "We classify the risk of deploying RankFlow as it stands as high, since its true accuracy is now known to fall well short of the level needed to safely replace the current ranking system.",
        },
        {
          heading: "5.3 Long-Term Considerations",
          body: "We will require every future model evaluation to pass the automated overlap check described in Section 6.1 before results are presented to the Machine Learning Review Board, regardless of how the evaluation was originally conducted.",
        },
        {
          heading: "6. CONCLUSIONS",
          body: "RankFlow's original reported accuracy of 91% was inflated by a data leak between the training and validation sets.",
        },
        {
          body: "RankFlow's corrected top-5 accuracy of 68% falls well below our 85% deployment threshold.",
        },
        {
          body: "The Machine Learning Review Board has not approved RankFlow for deployment, and this report supports that decision.",
        },
        {
          body: "We recommend against deploying RankFlow until it has been retrained using a corrected data pipeline and re-evaluated.",
        },
        {
          heading: "6.1 Recommended Next Steps",
          body: "We recommend the applied ML team update its data-splitting tooling to automatically detect train/validation overlap in future evaluations, in addition to retraining RankFlow itself.",
        },
        {
          heading: "REFERENCES",
          body: "[1] Whitfield, S., Achebe, N., & Song, J. (2024). Offline Evaluation Methodology for Ranking Models. Applied ML Systems Review, 2024, Report No. 52.\n[2] Machine Learning Review Board. (2024). Model Deployment Approval Process, v2. Internal engineering handbook.\n[3] Internal Data Engineering Team. (2024). Data-Splitting Pipeline Postmortem, Change Log Entry #2291.",
        },
      ],
    },
    {
      pageNum: 7,
      sections: [
        {
          heading: "APPENDIX A: PER-SPLIT RESULTS",
          body: "This appendix presents corrected accuracy results from each of the four independent holdout splits referenced in Section 4. All four splits were constructed using the corrected data-splitting pipeline.",
        },
        {
          heading: "A.1 Split 1",
          body: "Corrected top-5 accuracy on this split was 65%, the lowest of the four splits. This split had the highest proportion of leaked sessions removed during correction.",
        },
        {
          heading: "A.2 Split 2",
          body: "Corrected top-5 accuracy on this split was 70%, the highest of the four splits.",
        },
        {
          heading: "A.3 Split 3",
          body: "Corrected top-5 accuracy on this split was 67%.",
        },
        {
          heading: "A.4 Split 4",
          body: "Corrected top-5 accuracy on this split was 69%.",
        },
      ],
    },
    {
      pageNum: 8,
      sections: [
        {
          heading: "APPENDIX B: ALTERNATIVE APPROACHES CONSIDERED",
          body: "Before evaluating RankFlow, our team considered two other ranking approaches: a collaborative-filtering model and a hybrid rules-plus-ML approach.",
        },
        {
          heading: "B.1 Collaborative-Filtering Model",
          body: "The collaborative-filtering approach was excluded from formal evaluation because it requires significantly more historical data per user than we currently retain, which would have required a separate data-retention policy change.",
        },
        {
          heading: "B.2 Hybrid Rules-Plus-ML Approach",
          body: "The hybrid approach was excluded because early prototyping suggested it would take at least two additional quarters to build, longer than the team's current timeline allows.",
        },
        {
          heading: "B.3 Summary",
          body: "RankFlow was the strongest candidate that met our initial screening criteria for formal evaluation. This report should not be read as a comparison between RankFlow and either excluded approach, since neither underwent the same evaluation process.",
        },
        {
          heading: "B.4 Cost Considerations",
          body: "RankFlow requires no additional infrastructure beyond what is already used for the current ranking system. Training and evaluation costs are comparable across all approaches considered, so cost was not a deciding factor in this evaluation.",
        },
      ],
    },
  ],

  // doc_4: SignalCast — a demand-forecasting model with a clean, leak-free
  // evaluation. Used by the Voluntary "AI-Accurate" scenario.
  doc_4: [
    {
      pageNum: 1,
      sections: [
        {
          heading: "SUMMARY",
          body: "Background: SignalCast is a candidate forecasting model developed to predict short-term product demand for inventory planning. It was trained on three years of historical sales and inventory data and is intended to replace our current statistical forecasting method.",
        },
        {
          body: "Objective: To evaluate whether SignalCast meets our accuracy and reliability requirements for production deployment, using the same offline evaluation process we apply to every model before it is approved for inventory planning.",
        },
        {
          body: "Methods: We evaluated SignalCast using our standard offline evaluation pipeline, which measures forecast error against a held-out validation set spanning four separate time periods, followed by an independent audit of the data pipeline used to construct that validation set.",
        },
        {
          body: "Results: SignalCast achieved consistently low forecast error across all four evaluation periods tested. The independent audit of the evaluation pipeline found no overlap between training and validation data.",
        },
        {
          body: "Conclusion: SignalCast is ready for production deployment.",
        },
        {
          body: "Scope: This report reflects our team's standard model evaluation process and is intended to inform the Machine Learning Review Board's approval decision.",
        },
        {
          body: "Report Structure: This report is organized into background, methodology, results, aggregate evaluation results, and discussion, followed by two appendices covering per-period results and the alternative approaches we considered before selecting SignalCast for formal evaluation.",
        },
      ],
    },
    {
      pageNum: 2,
      sections: [
        {
          heading: "1. BACKGROUND",
          body: "Inventory planning depends on accurate short-term demand forecasts. Our current statistical forecasting method has been in use for over four years and does not account for the seasonal and promotional patterns that have become more prominent as our product catalog has grown.",
        },
        {
          body: "Accurate demand forecasts directly affect both stockout rates and excess inventory costs, so any change to our forecasting method is treated as a high-impact decision requiring formal evaluation.",
        },
        {
          body: "SignalCast was developed over the past two quarters by our applied ML team, using a sequence model trained on three years of historical sales and inventory data.",
        },
        {
          body: "Early internal testing of SignalCast showed lower forecast error than our current method across a range of product categories, which prompted this full evaluation.",
        },
        {
          body: "This report documents the full offline evaluation process used to assess whether SignalCast is ready to replace the current statistical forecasting method.",
        },
        {
          heading: "1.1 Why This Evaluation Matters",
          body: "Replacing the forecasting method affects inventory decisions across the entire product catalog, so a model must clear a high bar before deployment. Because of this, our evaluation process is intentionally thorough, and approval is only granted when accuracy, pipeline integrity, and latency results are all consistently positive.",
        },
        {
          heading: "1.2 Evaluation Criteria",
          body: "Our evaluation process weighs three factors when considering a new forecasting model: measured accuracy on a properly constructed holdout set spanning multiple time periods, inference latency under our nightly batch forecasting schedule, and the integrity of the evaluation pipeline itself. A model must clear all three before being considered for approval.",
        },
        {
          heading: "1.3 Comparable Deployments",
          body: "One other team within our organization has piloted a similar sequence-based forecasting approach for a different product category, reporting accuracy improvements consistent with what we observed in this evaluation.",
        },
        {
          heading: "1.4 Adoption Timeline",
          body: "If approved, we expect inventory planning for the first product category to begin using SignalCast's forecasts within three weeks, following the staged rollout plan described in Section 6.1.",
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
          heading: "2.1 Evaluation Dataset",
          body: "SignalCast was evaluated using four separate holdout periods, each covering a different quarter, so that results would not depend on the seasonal patterns of any single time period.",
        },
        {
          heading: "2.2 Accuracy Measurement",
          body: "We measured mean absolute percentage error (MAPE) between SignalCast's forecasts and actual demand for each product category in each holdout period.",
        },
        {
          heading: "2.3 Pipeline Audit",
          body: "Following the initial evaluation, an independent engineer audited the data pipeline used to construct the four holdout periods, checking for any overlap between training and validation data.",
        },
        {
          heading: "2.4 Comparison",
          body: "All results were compared against our current statistical forecasting method as a baseline.",
        },
        {
          heading: "2.5 Latency Testing",
          body: "We also measured inference latency under our nightly batch forecasting schedule to confirm the model would complete within the required processing window.",
        },
        {
          heading: "2.6 Review Process",
          body: "Once evaluation was complete, results were reviewed independently by two engineers before being summarized for the Machine Learning Review Board.",
        },
        {
          heading: "2.7 Reproducibility",
          body: "All evaluation and audit scripts used in this report are stored in our internal tooling repository so that results can be independently reproduced by any team.",
        },
        {
          heading: "2.8 Statistical Approach",
          body: "We report mean absolute percentage error per period rather than a single pooled figure, since demand patterns vary meaningfully by quarter and a pooled figure could mask a period in which the model performs poorly.",
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
          heading: "3.1 Forecast Accuracy",
          body: "SignalCast achieved a mean absolute percentage error of 6.2%, well within our deployment threshold of 10%, consistently across all four evaluation periods tested.",
        },
        {
          heading: "3.2 Pipeline Audit Findings",
          body: "The audit confirmed that SignalCast's holdout set was constructed from a separate time period than the training data, with no overlap between the two, avoiding the leakage issue identified in a separate recent model evaluation.",
        },
        {
          heading: "3.3 Latency Results",
          body: "SignalCast completed nightly batch forecasting well within the required processing window across all four evaluation periods.",
        },
        {
          heading: "3.4 Error Distribution",
          body: "Forecast error was consistent across product categories, with no category exceeding a mean absolute percentage error of 9%.",
        },
        {
          heading: "3.5 Latency Distribution",
          body: "Inference time per product category averaged 40 milliseconds, well within the several-hour window allotted for nightly batch forecasting, leaving substantial headroom even if the product catalog grows significantly.",
        },
      ],
    },
    {
      pageNum: 5,
      sections: [
        {
          heading: "4. AGGREGATE EVALUATION RESULTS",
          body: "",
        },
        {
          heading: "4.1 Overview",
          body: "We combined results from all four holdout periods to confirm the accuracy improvement was consistent rather than specific to a single time period.",
        },
        {
          heading: "4.2 Consistency of Results",
          body: "Forecast accuracy was consistently below our 10% deployment threshold across all four holdout periods, with no period exceeding 7.1% mean absolute percentage error.",
        },
        {
          heading: "4.3 Review Board Decision",
          body: "The Machine Learning Review Board approved SignalCast for production deployment based on these results.",
        },
        {
          heading: "4.4 Limitations",
          body: "These evaluations were run on historical sales data and do not capture how demand patterns might shift in ways not represented in the training period. We will monitor forecast accuracy closely during the initial rollout to confirm these results hold in production.",
        },
        {
          heading: "4.5 Individual Period Summaries",
          body: "A full breakdown of results from each of the four holdout periods is provided in Appendix A.",
        },
        {
          heading: "4.6 Comparison with the Current System",
          body: "SignalCast's mean absolute percentage error was lower than the current statistical method in every one of the four holdout periods, with the size of the improvement ranging from 2.1 to 3.4 percentage points.",
        },
      ],
    },
    {
      pageNum: 6,
      sections: [
        {
          heading: "5. DISCUSSION",
          body: "SignalCast shows a consistent accuracy improvement over our current statistical forecasting method across all four holdout periods.",
        },
        {
          body: "The pipeline audit found no issues with how the evaluation was conducted, giving us confidence that these results reflect genuine model quality rather than an artifact of the evaluation process.",
        },
        {
          heading: "5.1 Comparison with Alternatives",
          body: "We also considered extending our current statistical method with manually engineered seasonal adjustments instead of adopting a new model. Based on the results in this report, we believe SignalCast's accuracy improvement is larger than what manual adjustments have achieved in similar past efforts.",
        },
        {
          heading: "5.2 Risk Assessment",
          body: "We classify the risk of deploying SignalCast as low, given its consistent accuracy improvement across all four independent holdout periods and the absence of any pipeline integrity issues.",
        },
        {
          heading: "5.3 Long-Term Considerations",
          body: "We will re-evaluate SignalCast's accuracy on a quarterly basis, consistent with our policy for all approved forecasting models, to confirm that its performance holds as demand patterns evolve.",
        },
        {
          heading: "6. CONCLUSIONS",
          body: "SignalCast achieved a mean absolute percentage error of 6.2%, well within our deployment threshold, across all four evaluation periods tested.",
        },
        {
          body: "No issues were found with the integrity of SignalCast's evaluation pipeline.",
        },
        {
          body: "The Machine Learning Review Board has approved SignalCast for production deployment.",
        },
        {
          body: "We recommend deploying SignalCast to replace the current statistical forecasting method for inventory planning.",
        },
        {
          heading: "6.1 Rollout Plan",
          body: "We recommend a staged rollout for SignalCast: begin forecasting for a subset of product categories, monitor forecast accuracy for one full quarter, and then expand to the full catalog once accuracy is confirmed in production.",
        },
        {
          heading: "REFERENCES",
          body: "[1] Whitfield, S., Achebe, N., & Song, J. (2024). Offline Evaluation Methodology for Ranking Models. Applied ML Systems Review, 2024, Report No. 52.\n[2] Machine Learning Review Board. (2024). Model Deployment Approval Process, v2. Internal engineering handbook.",
        },
      ],
    },
    {
      pageNum: 7,
      sections: [
        {
          heading: "APPENDIX A: PER-PERIOD RESULTS",
          body: "This appendix presents results from each of the four holdout periods referenced throughout this report.",
        },
        {
          heading: "A.1 Period 1",
          body: "Mean absolute percentage error was 6.8% during this period, the highest of the four periods, coinciding with a promotional event not seen during training.",
        },
        {
          heading: "A.2 Period 2",
          body: "Mean absolute percentage error was 5.9% during this period.",
        },
        {
          heading: "A.3 Period 3",
          body: "Mean absolute percentage error was 5.7% during this period, the lowest of the four periods.",
        },
        {
          heading: "A.4 Period 4",
          body: "Mean absolute percentage error was 6.4% during this period.",
        },
      ],
    },
    {
      pageNum: 8,
      sections: [
        {
          heading: "APPENDIX B: ALTERNATIVES CONSIDERED",
          body: "Before evaluating SignalCast, our team considered two other approaches to improving demand forecasting: a third-party forecasting API and an ensemble of the current statistical method with a separate ML model.",
        },
        {
          heading: "B.1 Third-Party Forecasting API",
          body: "The third-party API was excluded from formal evaluation because it would require sending historical sales data to an external vendor, which does not meet our current data-handling policy.",
        },
        {
          heading: "B.2 Ensemble Approach",
          body: "The ensemble approach was excluded because early prototyping showed only a marginal accuracy improvement over the statistical method alone, not enough to justify the added complexity.",
        },
        {
          heading: "B.3 Summary",
          body: "SignalCast was the strongest candidate that met our initial screening criteria for formal evaluation. This report should not be read as a comparison between SignalCast and either excluded approach, since neither underwent the same evaluation process.",
        },
        {
          heading: "B.4 Cost Considerations",
          body: "SignalCast runs on the same infrastructure already used for nightly batch jobs, so no additional infrastructure spend is required. Training cost is modest and comparable to the ensemble approach considered above.",
        },
      ],
    },
  ],

  // doc_5: a postmortem for a checkout-service outage whose proposed fix
  // did not fully resolve the underlying race condition. Used by the
  // Forced "AI-Incorrect" scenario.
  doc_5: [
    {
      pageNum: 1,
      sections: [
        {
          heading: "SUMMARY",
          body: "Background: On March 14, 2024, the checkout service experienced a partial outage during a high-traffic spring sale event, resulting in a subset of customers being charged more than once for a single order. This report documents the root cause investigation and the validation testing performed on the proposed fix.",
        },
        {
          body: "Objective: To determine the root cause of Incident INC-4417 and to evaluate whether the proposed fix is ready to ship, using the same postmortem and validation process we apply to every incident before a fix is approved for release.",
        },
        {
          body: "Methods: We reconstructed the incident timeline from service logs, identified the root cause through code review and reproduction testing, and validated the proposed fix under simulated production-scale concurrent load.",
        },
        {
          body: "Results: We identified a race condition in the payment-processing queue as the root cause of the duplicate charges. A fix was proposed and tested, but validation testing under high concurrency showed the race condition still occurred in a small fraction of cases after the fix was applied.",
        },
        {
          body: "Conclusion: The proposed fix is not ready to ship in its current form.",
        },
        {
          body: "Scope: This report reflects our team's standard postmortem and fix validation process and is intended to inform the Incident Review Board's release decision.",
        },
        {
          body: "Report Structure: This report is organized into background, methodology, results, aggregate validation results, and discussion, followed by two appendices covering per-test results and the alternative fixes we considered before selecting this approach for validation.",
        },
      ],
    },
    {
      pageNum: 2,
      sections: [
        {
          heading: "1. BACKGROUND",
          body: "The checkout service processes all payment transactions for the platform and is one of our highest-traffic, highest-impact services. Any issue affecting checkout is treated as a critical incident.",
        },
        {
          body: "During the sales event on March 14, 2024, the checkout service experienced a spike in concurrent transactions roughly six times higher than typical peak traffic.",
        },
        {
          body: "A subset of customers reported being charged more than once for a single order shortly after the traffic spike began.",
        },
        {
          body: "The on-call team mitigated the immediate impact by temporarily reducing the maximum concurrent transaction limit, which stopped new duplicate charges but also slowed checkout for all customers during the remainder of the event.",
        },
        {
          body: "This report documents the full root cause investigation and fix validation process for Incident INC-4417.",
        },
        {
          heading: "1.1 Why This Evaluation Matters",
          body: "Shipping a fix that does not fully resolve the underlying issue risks a repeat incident during a future high-traffic event. Because of this, our fix validation process is intentionally thorough, and a fix is only approved for release once it has been shown to resolve the issue under conditions at least as demanding as those that caused the original incident.",
        },
        {
          heading: "1.2 Investigation Criteria",
          body: "Our postmortem process evaluates three things before a fix is approved for release: whether the root cause has been correctly identified, whether the proposed fix resolves the root cause under realistic load, and whether the fix introduces any new risk elsewhere in the system. A fix must clear all three before being considered for release.",
        },
        {
          heading: "1.3 Comparable Incidents",
          body: "A different race condition affecting a separate queue was identified and fixed in our inventory service roughly a year ago. That fix used a similar distributed-lock pattern and has not recurred since, which informed the team's initial choice of approach for this incident.",
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
          heading: "2.1 Timeline Reconstruction",
          body: "We reconstructed the incident timeline using service logs, payment gateway logs, and monitoring dashboards covering the two hours surrounding the incident.",
        },
        {
          heading: "2.2 Root Cause Investigation",
          body: "We used code review and targeted reproduction testing in a staging environment to identify the underlying cause of the duplicate charges.",
        },
        {
          heading: "2.3 Fix Validation",
          body: "The proposed fix was tested under simulated production-scale concurrent load, using traffic volumes matching the peak observed during the original incident.",
        },
        {
          heading: "2.4 Comparison",
          body: "Fix validation results were compared against the same concurrent-load test run on the unpatched version of the service, to confirm the fix reduces — and ideally eliminates — the underlying issue.",
        },
        {
          heading: "2.5 Regression Testing",
          body: "We also ran our standard regression test suite against the patched service to check for any new issues introduced by the fix.",
        },
        {
          heading: "2.6 Review Process",
          body: "Once validation was complete, results were reviewed independently by two engineers before being summarized for the Incident Review Board.",
        },
        {
          heading: "2.7 Reproducibility",
          body: "All reproduction and validation scripts used in this report are stored in our internal incident-response repository so that results can be independently reproduced by any team.",
        },
        {
          heading: "2.8 Code Quality Review",
          body: "Two lead engineers reviewed the fix for code quality prior to submission, confirming it follows the team's standard syntax, structure, and design-pattern conventions.",
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
          heading: "3.1 Root Cause",
          body: "We identified a race condition in the payment-processing queue as the root cause of the duplicate charges: under high concurrency, two charge attempts for the same order could both pass the queue's duplicate-check before either attempt had finished recording its result.",
        },
        {
          heading: "3.2 Proposed Fix",
          body: "The proposed fix adds a distributed lock around the charge step, intended to ensure only one charge attempt per order can proceed at a time, regardless of concurrency.",
        },
        {
          heading: "3.3 Validation Results",
          body: "Validation testing under production-scale concurrent load showed the race condition still occurred in 3% of high-concurrency test runs after the fix was applied.",
        },
        {
          heading: "3.4 Regression Testing Results",
          body: "The regression test suite passed with no new issues introduced by the fix, aside from the unresolved race condition described in Section 3.3.",
        },
        {
          heading: "3.5 Root Cause of the Remaining Failures",
          body: "Further investigation traced the remaining 3% of failures to a timeout in the distributed lock implementation under extremely high concurrency, causing the lock to be released before the first charge attempt had finished recording its result.",
        },
        {
          heading: "3.6 Customer Impact",
          body: "During the original incident, an estimated 340 customers were charged more than once. All affected customers have since been identified and refunded, independent of the status of the fix described in this report.",
        },
        {
          heading: "3.7 Automated Test Coverage",
          body: "The modified checkout routes are covered by automated tests achieving 100% code coverage, consistent with our team's standard requirement for payment-related code changes.",
        },
      ],
    },
    {
      pageNum: 5,
      sections: [
        {
          heading: "4. AGGREGATE VALIDATION RESULTS",
          body: "",
        },
        {
          heading: "4.1 Overview",
          body: "We ran five independent validation tests at production-scale concurrent load to confirm the race condition rate was consistent rather than a one-off result.",
        },
        {
          heading: "4.2 Consistency of Results",
          body: "The race condition occurred in four of the five validation tests, at rates ranging from 1% to 4% of high-concurrency requests, confirming this is a consistent issue rather than a one-off result.",
        },
        {
          heading: "4.3 Review Board Decision",
          body: "The Incident Review Board did not approve the fix for release and requested further investigation before Incident INC-4417 can be considered resolved.",
        },
        {
          heading: "4.4 Limitations",
          body: "These validation tests were run in a staging environment that closely mirrors production but does not receive real customer traffic. However, the consistency of the remaining race condition across four of five independent tests gives us high confidence that the fix does not yet fully resolve the issue.",
        },
        {
          heading: "4.5 Individual Test Summaries",
          body: "A full breakdown of results from each of the five validation tests is provided in Appendix A.",
        },
        {
          heading: "4.6 Comparison with the Unpatched Service",
          body: "The unpatched service reproduced the race condition in all five tests, at rates ranging from 6% to 11% of high-concurrency requests. The fix reduces the failure rate substantially but, as noted above, does not eliminate it.",
        },
      ],
    },
    {
      pageNum: 6,
      sections: [
        {
          heading: "5. DISCUSSION",
          body: "Given that the race condition still occurred in four of five validation tests, we do not recommend shipping the proposed fix in its current form.",
        },
        {
          body: "The on-call team's temporary mitigation — reducing the maximum concurrent transaction limit — remains in place until a fully validated fix is ready.",
        },
        {
          heading: "5.1 Comparison with the Original Incident",
          body: "The rate of duplicate charges observed during validation testing (1% to 4% of high-concurrency requests) is lower than the rate observed during the original incident, but any nonzero rate is unacceptable for a payment-related issue, given the direct customer impact of duplicate charges.",
        },
        {
          heading: "5.2 Risk Assessment",
          body: "We classify the risk of shipping the fix as it stands as high, since it would leave customers exposed to duplicate charges during any future high-traffic event of similar scale to Incident INC-4417.",
        },
        {
          heading: "5.3 Long-Term Considerations",
          body: "We recommend the team revisit whether a database-level unique constraint, set aside in Appendix B due to migration risk, should be scheduled as a longer-term hardening measure once the immediate fix is validated.",
        },
        {
          heading: "6. CONCLUSIONS",
          body: "The root cause of Incident INC-4417 was a race condition in the payment-processing queue.",
        },
        {
          body: "Validation testing showed the proposed fix does not fully resolve the race condition under production-scale concurrent load.",
        },
        {
          body: "The Incident Review Board has not approved the fix for release, and this report supports that decision.",
        },
        {
          body: "We recommend against shipping the fix until the remaining race condition, traced to a timeout in the distributed lock implementation, has been resolved and re-validated.",
        },
        {
          heading: "6.1 Recommended Next Steps",
          body: "We recommend the team revise the distributed lock implementation to remove the timeout that allows the lock to be released prematurely, and re-run all five validation tests before resubmitting the fix for release.",
        },
        {
          heading: "REFERENCES",
          body: "[1] Delgado, R., Osei, F., & Marchetti, L. (2024). Incident Postmortem Methodology, v3. Site Reliability Engineering Report Series, Internal Handbook.\n[2] Incident Review Board. (2024). Fix Validation and Release Approval Process, v2. Internal engineering handbook.\n[3] On-Call Engineering Team. (2024). Incident INC-4417 Timeline and Mitigation Log.",
        },
      ],
    },
    {
      pageNum: 7,
      sections: [
        {
          heading: "APPENDIX A: PER-TEST VALIDATION RESULTS",
          body: "This appendix presents results from each of the five validation tests referenced throughout this report. All five tests used production-scale concurrent load matching the peak observed during Incident INC-4417.",
        },
        {
          heading: "A.1 Test 1",
          body: "The race condition occurred in 2% of high-concurrency requests during this test.",
        },
        {
          heading: "A.2 Test 2",
          body: "The race condition occurred in 4% of high-concurrency requests during this test, the highest rate of the five tests.",
        },
        {
          heading: "A.3 Test 3",
          body: "No instances of the race condition were recorded during this test, the only test of the five in which it did not occur.",
        },
        {
          heading: "A.4 Test 4",
          body: "The race condition occurred in 1% of high-concurrency requests during this test, the lowest nonzero rate of the five tests.",
        },
        {
          heading: "A.5 Test 5",
          body: "The race condition occurred in 3% of high-concurrency requests during this test.",
        },
      ],
    },
    {
      pageNum: 8,
      sections: [
        {
          heading: "APPENDIX B: ALTERNATIVE FIXES CONSIDERED",
          body: "Before proposing the distributed lock fix, the team considered two other approaches to resolving the duplicate-charge issue: idempotency keys and a database-level unique constraint.",
        },
        {
          heading: "B.1 Idempotency Keys",
          body: "An idempotency-key approach was considered but set aside for this release, since it would require coordinated changes to the client-side checkout flow that could not be completed before the next high-traffic event.",
        },
        {
          heading: "B.2 Database-Level Unique Constraint",
          body: "A database-level unique constraint was considered but set aside because our current payment records schema would require a migration to support it, which the team judged too risky to attempt under incident-response time pressure.",
        },
        {
          heading: "B.3 Summary",
          body: "The distributed lock approach was selected because it could be implemented and tested without schema changes or client-side coordination. This report should not be read as a full comparison between the three approaches, since only the distributed lock fix underwent formal validation testing.",
        },
        {
          heading: "B.4 Timeline Considerations",
          body: "The distributed lock approach was also the fastest of the three to implement, which mattered given the team's goal of shipping a fix before the next scheduled high-traffic event.",
        },
      ],
    },
  ],

  // doc_6: a postmortem for an authentication-service outage whose
  // proposed fix was fully validated. Used by the Forced "AI-Accurate"
  // scenario.
  doc_6: [
    {
      pageNum: 1,
      sections: [
        {
          heading: "SUMMARY",
          body: "Background: On February 2, 2024, the authentication service rejected all login and session-renewal requests for approximately twelve minutes, blocking access to the platform for every user. This report documents the root cause investigation and the validation testing performed on the proposed fix.",
        },
        {
          body: "Objective: To determine the root cause of Incident INC-4502 and to evaluate whether the proposed fix is ready to ship, using the same postmortem and validation process we apply to every incident before a fix is approved for release.",
        },
        {
          body: "Methods: We reconstructed the incident timeline from service logs, identified the root cause through configuration review, and validated the proposed fix across a range of simulated certificate-expiration and renewal-failure scenarios.",
        },
        {
          body: "Results: We identified an expired TLS certificate as the root cause, caused by a misconfigured automated renewal job. The proposed fix corrects the renewal job configuration and adds a monitoring alert for certificates nearing expiration. Validation testing confirmed the fix successfully renews certificates before expiration across every scenario tested.",
        },
        {
          body: "Conclusion: The proposed fix is ready to ship.",
        },
        {
          body: "Scope: This report reflects our team's standard postmortem and fix validation process and is intended to inform the Incident Review Board's release decision.",
        },
        {
          body: "Report Structure: This report is organized into background, methodology, results, aggregate validation results, and discussion, followed by two appendices covering per-scenario results and the alternative fixes we considered before selecting this approach for validation.",
        },
      ],
    },
    {
      pageNum: 2,
      sections: [
        {
          heading: "1. BACKGROUND",
          body: "The authentication service handles login and session renewal for every user on the platform, making it one of our highest-impact services. Any issue affecting authentication is treated as a critical incident.",
        },
        {
          body: "The service relies on a TLS certificate to establish secure connections with the identity provider it uses to verify user credentials.",
        },
        {
          body: "An automated job is intended to renew this certificate before it expires, without requiring manual intervention.",
        },
        {
          body: "On February 2, 2024, the certificate expired without being renewed, causing the authentication service to reject all requests to the identity provider until the certificate was manually replaced.",
        },
        {
          body: "This report documents the full root cause investigation and fix validation process for Incident INC-4502.",
        },
        {
          heading: "1.1 Why This Evaluation Matters",
          body: "An authentication outage blocks access to the entire platform, making it one of the most severe categories of incident we track. Because of this, our fix validation process is intentionally thorough, and a fix is only approved for release once it has been shown to prevent recurrence across every scenario that could plausibly cause a repeat incident.",
        },
        {
          heading: "1.2 Investigation Criteria",
          body: "Our postmortem process evaluates three things before a fix is approved for release: whether the root cause has been correctly identified, whether the proposed fix resolves the root cause across realistic scenarios, and whether the fix introduces any new risk elsewhere in the system. A fix must clear all three before being considered for release.",
        },
        {
          heading: "1.3 Comparable Incidents",
          body: "A similar certificate-expiration incident affected a different internal service eighteen months ago. The fix proposed in this report also addresses the renewal job pattern that caused that earlier incident.",
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
          heading: "2.1 Timeline Reconstruction",
          body: "We reconstructed the incident timeline using service logs, certificate management logs, and monitoring dashboards covering the twenty-four hours surrounding the incident.",
        },
        {
          heading: "2.2 Root Cause Investigation",
          body: "We used configuration review and reproduction testing in a staging environment to identify why the automated renewal job did not renew the certificate before expiration.",
        },
        {
          heading: "2.3 Fix Validation",
          body: "The proposed fix was tested across a range of simulated scenarios, including renewal job failures, delayed renewal attempts, and certificates approaching expiration under different time windows.",
        },
        {
          heading: "2.4 Comparison",
          body: "Fix validation results were compared against the same scenarios run on the unpatched renewal job configuration, to confirm the fix resolves the underlying issue.",
        },
        {
          heading: "2.5 Regression Testing",
          body: "We also ran our standard regression test suite against the patched service to check for any new issues introduced by the fix.",
        },
        {
          heading: "2.6 Review Process",
          body: "Once validation was complete, results were reviewed independently by two engineers before being summarized for the Incident Review Board.",
        },
        {
          heading: "2.7 Reproducibility",
          body: "All reproduction and validation scripts used in this report are stored in our internal incident-response repository so that results can be independently reproduced by any team.",
        },
        {
          heading: "2.8 Scope of Validation",
          body: "Validation focused specifically on certificate renewal behavior. We did not re-test unrelated authentication service functionality, since the incident and proposed fix were both isolated to the renewal job.",
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
          heading: "3.1 Root Cause",
          body: "We identified a misconfigured automated renewal job as the root cause of the certificate expiration: the job was scheduled to run against the wrong certificate identifier following an unrelated configuration change made three months earlier, so it never attempted to renew the certificate that expired.",
        },
        {
          heading: "3.2 Proposed Fix",
          body: "The proposed fix corrects the renewal job's certificate identifier and adds a monitoring alert that fires when any certificate is within fourteen days of expiration.",
        },
        {
          heading: "3.3 Validation Results",
          body: "Validation testing confirmed the corrected renewal job successfully renews certificates before expiration across every simulated scenario tested, including renewal job failures and delayed renewal attempts.",
        },
        {
          heading: "3.4 Regression Testing Results",
          body: "The regression test suite passed with no new issues introduced by the fix.",
        },
        {
          heading: "3.5 Monitoring Alert Validation",
          body: "The new monitoring alert correctly fired in every scenario where a certificate approached expiration, including a scenario in which the renewal job itself failed to run.",
        },
        {
          heading: "3.6 Customer Impact",
          body: "The original incident blocked login and session renewal for all users for approximately twelve minutes. No data was lost or exposed during the outage; the impact was limited to temporary unavailability.",
        },
      ],
    },
    {
      pageNum: 5,
      sections: [
        {
          heading: "4. AGGREGATE VALIDATION RESULTS",
          body: "",
        },
        {
          heading: "4.1 Overview",
          body: "We ran five independent validation scenarios to confirm the fix resolves the underlying issue consistently rather than in only the specific conditions of the original incident.",
        },
        {
          heading: "4.2 Consistency of Results",
          body: "The corrected renewal job successfully renewed certificates before expiration in all five validation scenarios, with no failures recorded.",
        },
        {
          heading: "4.3 Review Board Decision",
          body: "The Incident Review Board approved the fix for release.",
        },
        {
          heading: "4.4 Limitations",
          body: "These validation scenarios were run in a staging environment that closely mirrors production certificate management, though it does not receive real production certificate traffic. The consistency of successful renewals across all five independent scenarios gives us high confidence the fix will prevent recurrence in production.",
        },
        {
          heading: "4.5 Individual Scenario Summaries",
          body: "A full breakdown of results from each of the five validation scenarios is provided in Appendix A.",
        },
        {
          heading: "4.6 Comparison with the Unpatched Configuration",
          body: "The unpatched renewal job failed to renew the certificate in every one of the five validation scenarios, confirming the original misconfiguration was the sole cause of the outage and that the fix directly addresses it.",
        },
      ],
    },
    {
      pageNum: 6,
      sections: [
        {
          heading: "5. DISCUSSION",
          body: "The proposed fix successfully resolves the root cause of Incident INC-4502 across every scenario tested, including scenarios beyond the specific conditions of the original incident.",
        },
        {
          body: "The new monitoring alert provides an additional safeguard by flagging any certificate approaching expiration, independent of whether the renewal job itself is functioning correctly.",
        },
        {
          heading: "5.1 Comparison with the Earlier Similar Incident",
          body: "This fix also addresses the renewal job pattern responsible for a similar incident eighteen months ago, which suggests it resolves a class of issue rather than only the specific certificate affected by Incident INC-4502.",
        },
        {
          heading: "5.2 Risk Assessment",
          body: "We classify the risk of shipping this fix as low, given its consistent success across all five independent validation scenarios and the addition of a monitoring safeguard that would catch a similar misconfiguration before it causes an outage.",
        },
        {
          heading: "5.3 Long-Term Considerations",
          body: "We recommend auditing all other automated renewal jobs for the same certificate-identifier misconfiguration pattern identified in this report, to rule out similar latent issues elsewhere.",
        },
        {
          heading: "6. CONCLUSIONS",
          body: "The root cause of Incident INC-4502 was a misconfigured automated renewal job that never attempted to renew the certificate that expired.",
        },
        {
          body: "Validation testing confirmed the proposed fix resolves this issue across every scenario tested.",
        },
        {
          body: "The Incident Review Board has approved the fix for release.",
        },
        {
          body: "We recommend shipping the fix, along with the audit of other renewal jobs described in Section 5.3.",
        },
        {
          heading: "6.1 Rollout Plan",
          body: "We recommend shipping the fix immediately given the severity of an authentication outage, followed by the renewal-job audit within the next two weeks.",
        },
        {
          heading: "REFERENCES",
          body: "[1] Delgado, R., Osei, F., & Marchetti, L. (2024). Incident Postmortem Methodology, v3. Site Reliability Engineering Report Series, Internal Handbook.\n[2] Incident Review Board. (2024). Fix Validation and Release Approval Process, v2. Internal engineering handbook.",
        },
      ],
    },
    {
      pageNum: 7,
      sections: [
        {
          heading: "APPENDIX A: PER-SCENARIO VALIDATION RESULTS",
          body: "This appendix presents results from each of the five validation scenarios referenced throughout this report.",
        },
        {
          heading: "A.1 Scenario 1 (Standard Renewal)",
          body: "The corrected renewal job renewed the certificate successfully seven days before expiration, as expected under normal operation.",
        },
        {
          heading: "A.2 Scenario 2 (Renewal Job Failure)",
          body: "When the renewal job was made to fail on its first attempt, the monitoring alert fired correctly and a retry successfully renewed the certificate before expiration.",
        },
        {
          heading: "A.3 Scenario 3 (Delayed Renewal Attempt)",
          body: "When the renewal attempt was delayed to within 24 hours of expiration, the corrected job still renewed the certificate successfully.",
        },
        {
          heading: "A.4 Scenario 4 (Wrong Certificate Identifier Reintroduced)",
          body: "We manually reintroduced the original misconfiguration to confirm the monitoring alert would have caught it; the alert fired as expected.",
        },
        {
          heading: "A.5 Scenario 5 (Concurrent Renewal Requests)",
          body: "The corrected job handled concurrent renewal requests for multiple certificates without conflict or delay.",
        },
      ],
    },
    {
      pageNum: 8,
      sections: [
        {
          heading: "APPENDIX B: ALTERNATIVE FIXES CONSIDERED",
          body: "Before proposing the renewal-job correction, the team considered two other approaches to preventing certificate-related outages: a longer certificate validity period and a third-party certificate management service.",
        },
        {
          heading: "B.1 Longer Certificate Validity Period",
          body: "A longer validity period was considered but set aside because it would reduce, rather than eliminate, the chance of a similar incident, and does not address the underlying misconfiguration.",
        },
        {
          heading: "B.2 Third-Party Certificate Management Service",
          body: "A third-party certificate management service was considered but set aside for this release, since evaluating and integrating a new external service would take longer than the team's incident-response timeline allowed.",
        },
        {
          heading: "B.3 Summary",
          body: "Correcting the renewal job configuration and adding a monitoring alert was selected because it directly addresses the root cause and could be implemented and validated quickly. This report should not be read as a full comparison between the three approaches, since only the renewal-job fix underwent formal validation testing.",
        },
        {
          heading: "B.4 Timeline Considerations",
          body: "Given the severity of an authentication outage, the team prioritized the fastest fix that fully addressed the root cause rather than waiting to evaluate the third-party service option in depth.",
        },
      ],
    },
  ],
};
