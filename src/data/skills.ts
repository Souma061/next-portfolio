export interface SkillCategory {
  title: string;
  code: string;
  skills: {
    name: string;
    level: "core" | "advanced" | "proficient";
    highlight?: boolean;
    note?: string;
  }[];
}

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    title: "Low-Level & Systems Programming",
    code: "01_SYS",
    skills: [
      { name: "C++20", level: "core", highlight: true, note: "Memory models, SIMD, RAII" },
      
      { name: "Linux Epoll / Sockets", level: "core", note: "Non-blocking event-driven I/O" },
      { name: "PR-Quadtree & Spatial Indexing", level: "core", highlight: true, note: "O(log N) geometric partitioning" },
      { name: "Multi-threading & Mutex Primitives", level: "advanced", note: "Atomics, lock-free queues" },
      { name: "Memory Profiling (Valgrind / ASan)", level: "proficient", note: "Leak detection, zero-copy buffers" }
    ]
  },
  {
    title: "Distributed Systems & Ingestion",
    code: "02_DIST",
    skills: [
      { name: "Redis & Lua Scripting", level: "core", highlight: true, note: "Atomic distributed state & CAS leases" },
      { name: "Apache Kafka", level: "core", highlight: true, note: "Partitioning, exactly-once, consumer groups" },
      { name: "FastAPI / Asynchronous Python", level: "core", note: "High-throughput ASGI services" },
      { name: "WebSockets & Binary Streams", level: "core", note: "Real-time state synchronization" },
      { name: "Dead-Letter Queues & Circuit Breakers", level: "advanced", note: "Backpressure & automated replay" },
      { name: "Distributed Rate Limiting", level: "advanced", note: "Sliding window token buckets" }
    ]
  },
  {
    title: "Search, Data & Storage Engines",
    code: "03_DATA",
    skills: [
      { name: "SQLite FTS5 / BM25", level: "core", highlight: true, note: "Tokenization, ranking, inverted index" },
      { name: "PostgreSQL & libSQL / Turso", level: "core", note: "ACID transactions & edge replicas" },
      { name: "Distributed Locks (Redlock / Leases)", level: "core", note: "Locust 1,000+ RPS concurrency validated" },
      { name: "Redis Streams & Pub/Sub", level: "advanced", note: "Sub-millisecond fan-out bus" },
      { name: "Prisma & SQL Query Optimization", level: "proficient", note: "Composite indexing, explain analyze" }
    ]
  },
  {
    title: "Engineering Infrastructure & Web",
    code: "04_INFRA",
    skills: [
      { name: "Docker & Container Orchestration", level: "core", note: "Multi-stage builds, rootless containers" },
      { name: "TypeScript & Next.js", level: "core", note: "Full-stack telemetry & editorial UI" },
      { name: "Locust Concurrency Benchmarking", level: "core", note: "Stress, spike & chaos load injection" },
      { name: "Git & Submodule Architecture", level: "core", note: "Trunk-based workflow" },
      { name: "Linux Bash & CI/CD Pipelines", level: "proficient", note: "Automated regression validation" }
    ]
  }
];
