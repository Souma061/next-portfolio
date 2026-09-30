"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Printer, Download } from "lucide-react";
import { PERSONAL_INFO } from "@/data/socialLinks";
import { EXPERIENCE } from "@/data/experience";

export default function ResumePage() {
  const handlePrint = () => {
    window.print();
  };

  const exp = EXPERIENCE[0];

  return (
    <div className="min-h-screen bg-[#070a0e] py-10 px-4 sm:px-6 lg:px-8 text-[#f3e6d5] print:p-0 print:m-0 print:bg-white print:text-black">
      {/* Interactive Controls (Hidden during print) */}
      <div className="mx-auto max-w-4xl mb-6 flex flex-wrap items-center justify-between gap-4 print:hidden">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full bg-[#121822] border border-[#232e40] px-4 py-2 text-xs font-mono text-[#b8aba0] hover:text-white hover:border-[#e86b1c]/50 transition-all"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Portfolio</span>
        </Link>

        <div className="flex items-center gap-3">
          <a
            href="/resume.pdf"
            download="Soumabrata_Ghosh_Resume.pdf"
            className="inline-flex items-center gap-2 rounded-full bg-[#161e2b] border border-[#232e40] px-4 py-2 text-xs font-mono text-[#f3e6d5] hover:border-[#e86b1c] hover:text-[#e86b1c] transition-all"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Download Clean PDF</span>
          </a>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 rounded-full bg-[#e86b1c] px-5 py-2 text-xs font-mono font-bold text-white shadow-lg shadow-[#e86b1c]/30 hover:bg-[#b84a0f] transition-all cursor-pointer"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>Print Sheet (Ctrl+P)</span>
          </button>
        </div>
      </div>

      {/* Standard White Paper Resume Sheet (Exact 1-Page Layout) */}
      <div className="mx-auto max-w-[820px] bg-white text-[#111827] shadow-2xl rounded-sm p-8 md:p-12 print:p-0 print:shadow-none print:max-w-full font-serif leading-relaxed text-[13px] print:text-[9.3pt]">
        {/* Header */}
        <header className="border-b border-gray-300 pb-2 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-gray-950 font-sans uppercase">
            Soumabrata Ghosh
          </h1>
          <p className="mt-1 text-xs font-sans text-gray-600">
            Kolkata, India &nbsp;|&nbsp;{" "}
            <a href={`mailto:${PERSONAL_INFO.email}`} className="text-blue-700 underline">
              {PERSONAL_INFO.email}
            </a>{" "}
            &nbsp;|&nbsp;{" "}
            <a href={PERSONAL_INFO.github} target="_blank" rel="noreferrer" className="text-blue-700 underline">
              github.com/Souma061
            </a>{" "}
            &nbsp;|&nbsp;{" "}
            <a href={PERSONAL_INFO.linkedin} target="_blank" rel="noreferrer" className="text-blue-700 underline">
              linkedin.com/in/soumabrata-ghosh
            </a>{" "}
            &nbsp;|&nbsp;{" "}
            <a href="https://souma.dev" target="_blank" rel="noreferrer" className="text-blue-700 underline">
              souma.dev
            </a>
          </p>
        </header>

        {/* Technical Skills */}
        <section className="mt-3.5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-900 border-b border-gray-800 pb-0.5 font-sans">
            Technical Skills
          </h2>
          <div className="mt-1.5 space-y-1 text-xs font-sans">
            <p>
              <strong className="font-semibold text-gray-950">Languages:</strong> C++20, C, TypeScript, JavaScript, Python, SQL, POSIX Shell/Bash
            </p>
            <p>
              <strong className="font-semibold text-gray-950">Distributed Systems:</strong> Redis Lua atomic leases, Apache Kafka (partitioning, consumer groups), Distributed Locks (Redlock), WebSockets, Circuit Breakers, Dead-Letter Queues
            </p>
            <p>
              <strong className="font-semibold text-gray-950">Databases & Storage:</strong> SQLite FTS5 / BM25, Turso libSQL, PostgreSQL (MVCC, Index Optimization), MongoDB, Redis Streams & Pub/Sub
            </p>
            <p>
              <strong className="font-semibold text-gray-950">Infrastructure & Tooling:</strong> Docker containerization, Linux eBPF/perf, Locust Load Testing, Git, Next.js, CI/CD pipelines
            </p>
          </div>
        </section>

        {/* Work Experience */}
        {exp && (
          <section className="mt-3.5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-900 border-b border-gray-800 pb-0.5 font-sans">
              Work Experience
            </h2>
            <div className="mt-1.5">
              <div className="flex justify-between items-baseline font-sans text-xs">
                <span className="font-bold text-gray-950 text-xs">
                  {exp.company} <span className="font-normal text-gray-600 italic">| {exp.role}</span>
                </span>
                <span className="text-gray-500 font-mono text-[11px]">{exp.start} – Present | {exp.location}</span>
              </div>
              <ul className="list-disc ml-4 mt-0.5 text-xs text-gray-800 space-y-0.5 font-sans">
                <li>
                  Engineered and shipped production features across company web platform, LMS (<a href="https://learn.shapenxt.com" className="text-blue-700 underline">learn.shapenxt.com</a>), and internal CRM using Next.js, TypeScript, and PostgreSQL.
                </li>
                <li>
                  Rebuilt company marketing infrastructure from scratch, owning full-stack implementation, performance tuning, and automated deployment pipelines.
                </li>
                <li>
                  Architected in-platform blog content authoring and publishing system for the LMS, enabling autonomous course marketing without engineering dependencies.
                </li>
              </ul>
            </div>
          </section>
        )}

        {/* Featured Projects */}
        <section className="mt-3.5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-900 border-b border-gray-800 pb-0.5 font-sans">
            Featured Engineering Projects
          </h2>

          <div className="mt-2 space-y-2.5">
            {/* Project 1 */}
            <div>
              <div className="flex justify-between items-baseline font-sans text-xs">
                <span className="font-bold text-gray-950 text-xs">
                  InstaRide <span className="font-normal text-gray-600 italic">| C++20, Redis Lua, PR-Quadtree, SIMD AVX-512, Docker, WebSockets</span>
                </span>
                <span className="text-gray-500 font-mono text-[11px]">2026</span>
              </div>
              <ul className="list-disc ml-4 mt-0.5 text-xs text-gray-800 space-y-0.5">
                <li>
                  Engineered a sub-millisecond spatial dispatch kernel in <strong>C++20</strong>, processing <strong>3.88M ops/sec</strong> spatial ingestion with <strong>16.5 µs</strong> p99 k-NN query latency (75x faster than PostGIS baselines).
                </li>
                <li>
                  Designed a Point-Region Quadtree with Struct-of-Arrays (SoA) layout and vectorized <strong>AVX-512</strong> bounding box pruning evaluating 16 coordinates per clock cycle with zero heap allocations.
                </li>
                <li>
                  Eliminated distributed double-booking anomalies using single-roundtrip atomic <strong>Redis Lua</strong> scripts handling <strong>71.9k lock acquisitions/sec</strong> with zero race collisions under chaos testing.
                </li>
                <li>
                  Hardened engine against singularity spatial clustering (50,000 drivers on 1 coordinate) via depth-clamped bucket overflow; verified 0 segfaults under ASan/Valgrind.
                </li>
              </ul>
            </div>

            {/* Project 2 */}
            <div>
              <div className="flex justify-between items-baseline font-sans text-xs">
                <span className="font-bold text-gray-950 text-xs">
                  Distributed Full-Text Search Engine <span className="font-normal text-gray-600 italic">| TypeScript, SQLite FTS5, Turso libSQL, BM25 Ranking</span>
                </span>
                <span className="text-gray-500 font-mono text-[11px]">2026</span>
              </div>
              <ul className="list-disc ml-4 mt-0.5 text-xs text-gray-800 space-y-0.5">
                <li>
                  Built an inverted index search core supporting full-text retrieval across 100,000+ documents with sub-<strong>5ms</strong> search response times and tokenized trigram query routing.
                </li>
                <li>
                  Implemented custom <strong>BM25</strong> relevance scoring with dynamic term frequency saturation and document length normalization for high-precision query evaluation.
                </li>
                <li>
                  Constructed edge database replica sync using Turso libSQL, reducing p95 query latency by <strong>65%</strong> for distributed multi-region clients.
                </li>
              </ul>
            </div>

            {/* Project 3 */}
            <div>
              <div className="flex justify-between items-baseline font-sans text-xs">
                <span className="font-bold text-gray-950 text-xs">
                  High-Throughput Webhook Relay Fabric <span className="font-normal text-gray-600 italic">| Apache Kafka, Redis, Circuit Breakers, Node.js</span>
                </span>
                <span className="text-gray-500 font-mono text-[11px]">2026</span>
              </div>
              <ul className="list-disc ml-4 mt-0.5 text-xs text-gray-800 space-y-0.5">
                <li>
                  Architected an at-least-once distributed event ingestion fabric sustaining <strong>120,000 req/sec</strong> ingress with durable stream buffering.
                </li>
                <li>
                  Engineered partitioned <strong>Apache Kafka</strong> topic pipelines with automated exponential backoff retries and Dead-Letter Queues (DLQ) to isolate failing subscriber endpoints.
                </li>
                <li>
                  Integrated distributed token-bucket rate limiters in <strong>Redis</strong> with sliding-window accounting to defend downstream webhooks from traffic storms.
                </li>
              </ul>
            </div>

            {/* Project 4 */}
            <div>
              <div className="flex justify-between items-baseline font-sans text-xs">
                <span className="font-bold text-gray-950 text-xs">
                  Atomic Event Ticket Reservation Engine <span className="font-normal text-gray-600 italic">| PostgreSQL, Redis, Distributed Locking, Node.js</span>
                </span>
                <span className="text-gray-500 font-mono text-[11px]">2026</span>
              </div>
              <ul className="list-disc ml-4 mt-0.5 text-xs text-gray-800 space-y-0.5">
                <li>
                  Designed a high-concurrency seat reservation system sustaining <strong>1,000+ RPS</strong> concurrent burst traffic under Locust stress testing with <strong>0.000%</strong> over-allocation.
                </li>
                <li>
                  Combined Redis temporary reservation TTL leases with PostgreSQL MVCC and optimistic row locking to guarantee strict transactional consistency under heavy contention.
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Education */}
        <section className="mt-3.5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-900 border-b border-gray-800 pb-0.5 font-sans">
            Education
          </h2>
          <div className="mt-1.5 font-sans text-xs">
            <div className="flex justify-between items-baseline">
              <span className="font-bold text-gray-950">Bachelor of Technology in Computer Science & Engineering</span>
              <span className="text-gray-500 font-mono text-[11px]">Kolkata, India | 2026</span>
            </div>
            <p className="mt-0.5 text-gray-700">
              <strong className="font-semibold text-gray-950">Relevant Coursework:</strong> Operating Systems, Distributed Systems, Computer Networks, Database Internals, Data Structures & Algorithms, Object-Oriented System Design.
            </p>
          </div>
        </section>

        {/* Engineering Strengths */}
        <section className="mt-3.5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-900 border-b border-gray-800 pb-0.5 font-sans">
            Engineering Strengths & Verification
          </h2>
          <ul className="list-disc ml-4 mt-1 text-xs text-gray-800 space-y-0.5 font-sans">
            <li>
              <strong>Code Volume & Reliability:</strong> Authored 48,000+ lines of production code across 5 distributed architectures with zero memory safety violations.
            </li>
            <li>
              <strong>Chaos Testing:</strong> Engineered custom load injection harnesses simulating network partitions, split-brain nodes, and packet drops under continuous Locust profiling.
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
