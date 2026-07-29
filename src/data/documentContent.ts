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
};
