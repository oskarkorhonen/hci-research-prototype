export interface PageContent {
  pageNum: number;
  sections: { heading?: string; body: string }[];
}

// Full simulated report content, keyed by document id. The exact_text values
// from scenario.ts appear verbatim here so the DocumentViewer can locate and
// highlight them.
export const documentPagesByDoc: Record<string, PageContent[]> = {
  // doc_1: swiftcache — a caching library with a memory leak and a security
  // vulnerability. Used by the three "AI-Incorrect" scenarios.
  doc_1: [
    {
      pageNum: 1,
      sections: [
        {
          heading: "SUMMARY",
          body: "Background: swiftcache is a caching library used to speed up backend services by storing frequently accessed data in memory. It has grown popular for its simple API and claimed high performance.",
        },
        {
          body: "Objective: To evaluate whether swiftcache is safe and reliable enough to run in production.",
        },
        {
          body: "Methods: We ran swiftcache through our standard benchmark suite (five independent load tests) and a security audit (static analysis and dependency scanning).",
        },
        {
          body: "Results: swiftcache showed a serious memory leak under sustained load, causing services to crash after several hours of continuous use. The security audit also found a critical vulnerability that could allow unauthorized access to cached data.",
        },
        {
          body: "Conclusion: swiftcache is not ready for production use in its current version.",
        },
      ],
    },
    {
      pageNum: 2,
      sections: [
        {
          heading: "1. BACKGROUND",
          body: "Backend services often cache frequently used data to reduce load on databases and speed up response times.",
        },
        {
          body: "swiftcache was released in 2023 and quickly gained attention for its simple setup and fast initial benchmark numbers.",
        },
        {
          body: "Early demos showed strong short-term performance, which led several teams to consider adopting it for production services.",
        },
        {
          body: "However, our internal Engineering Standards Board has not approved swiftcache for production use, citing the memory leak and security vulnerability described in this report.",
        },
        {
          body: "This report documents the full benchmark and security testing process used to evaluate swiftcache.",
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
          body: "We ran swiftcache through five independent load tests, each simulating 24 hours of continuous production traffic.",
        },
        {
          heading: "2.2 Security Audit",
          body: "We used static code analysis and dependency scanning tools to check for known vulnerabilities and unsafe coding patterns.",
        },
        {
          heading: "2.3 Comparison",
          body: "All tests were run against our current caching solution as a baseline for comparison.",
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
          body: "We ran five independent load tests. All five tests were included in this report.",
        },
        {
          heading: "3.2 Memory Usage",
          body: "In all five load tests, swiftcache's memory usage grew steadily over time and never stabilized. Services using swiftcache crashed after 6 to 9 hours of continuous use due to running out of available memory.",
        },
        {
          heading: "3.3 Security Findings",
          body: "The audit found a critical vulnerability in swiftcache's cache-key handling that could let an attacker access data belonging to other users.",
        },
        {
          heading: "3.4 Short-Term Performance",
          body: "In short test runs of under 30 minutes, swiftcache appeared faster than our current caching solution, which explains why early demos looked promising. This advantage disappeared once the memory leak began affecting performance later in each test.",
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
          body: "We combined results from all five load tests to look for a consistent throughput improvement over our current caching solution.",
        },
        {
          heading: "4.2 Throughput Comparison",
          body: "Across the five load tests, two showed a throughput improvement, two showed a decline, and one showed no meaningful difference compared to our current caching solution. Taken together, the five load tests do not show a clear or reliable throughput improvement for swiftcache over our current caching solution.",
        },
        {
          heading: "4.3 Crash Rate",
          body: "All five load tests recorded at least one crash caused by the memory leak, confirming this is a consistent and repeatable issue rather than a one-off problem.",
        },
      ],
    },
    {
      pageNum: 6,
      sections: [
        {
          heading: "5. DISCUSSION",
          body: "Given the memory leak and the critical security vulnerability, we do not recommend deploying swiftcache in production in its current version.",
        },
        {
          body: "Teams currently piloting swiftcache should pause deployment until these issues are fixed by the maintainers.",
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
          body: "Background: queuelite is a lightweight message queue library used to handle background jobs and asynchronous tasks in backend services.",
        },
        {
          body: "Objective: To evaluate whether queuelite is safe and reliable enough to run in production.",
        },
        {
          body: "Methods: We ran queuelite through our standard benchmark suite (five independent load tests) and a security audit (static analysis and dependency scanning).",
        },
        {
          body: "Results: queuelite showed stable memory usage across all five load tests, with no crashes or slowdowns over sustained use. The security audit found no critical or high-severity vulnerabilities.",
        },
        {
          body: "Conclusion: queuelite is ready for production use.",
        },
      ],
    },
    {
      pageNum: 2,
      sections: [
        {
          heading: "1. BACKGROUND",
          body: "Backend services often rely on message queues to handle background jobs without blocking user-facing requests.",
        },
        {
          body: "queuelite was released in 2023 and has since been adopted by several teams for its lightweight footprint and straightforward setup.",
        },
        {
          body: "Early internal testing showed consistent performance across a range of workloads, which prompted this full benchmark and security review.",
        },
        {
          body: "Our internal Engineering Standards Board reviewed the results of this report and approved queuelite for production use.",
        },
        {
          body: "This report documents the full benchmark and security testing process used to evaluate queuelite.",
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
          body: "We ran queuelite through five independent load tests, each simulating 24 hours of continuous production traffic.",
        },
        {
          heading: "2.2 Security Audit",
          body: "We used static code analysis and dependency scanning tools to check for known vulnerabilities and unsafe coding patterns.",
        },
        {
          heading: "2.3 Comparison",
          body: "All tests were run against our current message queue solution as a baseline for comparison.",
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
          body: "We ran five independent load tests. All five tests were included in this report.",
        },
        {
          heading: "3.2 Memory Usage",
          body: "In all five load tests, queuelite's memory usage remained stable throughout the full 24-hour test period, with no crashes or restarts required.",
        },
        {
          heading: "3.3 Security Findings",
          body: "The audit found no critical or high-severity vulnerabilities in queuelite's codebase or its dependencies.",
        },
        {
          heading: "3.4 Throughput",
          body: "In all five load tests, queuelite processed jobs faster than our current message queue solution, with no slowdown over the course of the test.",
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
          body: "We combined results from all five load tests to look for a consistent throughput improvement over our current message queue solution.",
        },
        {
          heading: "4.2 Throughput Comparison",
          body: "All five load tests showed a throughput improvement for queuelite over our current solution, with consistent results across every test.",
        },
        {
          heading: "4.3 Stability",
          body: "None of the five load tests recorded a crash or memory issue, confirming that queuelite's stability holds up under sustained production-like load.",
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
          heading: "6. CONCLUSIONS",
          body: "The Engineering Standards Board has approved queuelite, and this report supports that decision.",
        },
        {
          body: "We recommend adopting queuelite for new backend services going forward.",
        },
      ],
    },
  ],
};
