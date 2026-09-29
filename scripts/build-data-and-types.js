const fs = require('fs');
const path = require('path');

function ensureDir(filePath) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function write(relPath, content) {
  const fullPath = path.join(__dirname, '..', relPath);
  ensureDir(fullPath);
  fs.writeFileSync(fullPath, content.trim() + '\n', 'utf8');
  console.log(`Wrote ${relPath} (${fs.statSync(fullPath).size} bytes)`);
}

// 1. src/lib/utils.ts
write('src/lib/utils.ts', `
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
`);

// 2. src/types/portfolio.ts
write('src/types/portfolio.ts', `
export interface ArchitectureHop {
  step: string;
  title: string;
  description: string;
  latencyOrThroughput: string;
  badge?: string;
}

export interface BenchmarkComparison {
  metric: string;
  customEngine: string;
  naiveBaseline: string;
  industryAlternative?: string;
  delta: string;
}

export interface ChaosTestScenario {
  name: string;
  adversarialAttack: string;
  mitigation: string;
  result: string;
  status: 'SURVIVED' | 'PASSED' | 'ZERO_FAILURES';
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  role: string;
  category: 'distributed' | 'search' | 'realtime' | 'infra';
  statusBadge: string;
  tags: string[];
  summary: string;
  problemStatement: string;
  architectureHops: ArchitectureHop[];
  benchmarks: BenchmarkComparison[];
  chaosScenarios: ChaosTestScenario[];
  codeSnippets: {
    title: string;
    language: string;
    code: string;
    description: string;
  }[];
  githubUrl: string;
  liveUrl?: string;
  stars?: string;
  featured: boolean;
}

export interface HardwareReceipt {
  id: string;
  number: string;
  title: string;
  metric: string;
  metricSubtext: string;
  badge: string;
  badgeType: 'optimal' | 'verified' | 'neutral';
  description: string;
  sparklineData?: number[];
}
`);

// 3. src/types/blog.ts
write('src/types/blog.ts', `
export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readingTime: string;
  tags: string[];
  author: string;
  featured: boolean;
  content: string;
  jsonContent?: Record<string, unknown>;
}

export interface PostDraft {
  id: string;
  title: string;
  slug: string;
  tags: string[];
  excerpt: string;
  content: string;
  updatedAt: string;
}
`);

// 4. src/data/benchmarks.ts
write('src/data/benchmarks.ts', `
import { HardwareReceipt } from "@/types/portfolio";

export const HARDWARE_RECEIPTS: HardwareReceipt[] = [
  {
    id: "spatial-ingest",
    number: "01",
    title: "SPATIAL INGESTION THROUGHPUT",
    metric: "3.88M",
    metricSubtext: "ops/sec",
    badge: "AVX-512",
    badgeType: "optimal",
    description: "C++ Struct-of-Arrays (SoA) packed points with memory prefetching and SIMD vector alignment.",
    sparklineData: [45, 52, 58, 64, 72, 79, 85, 91, 88, 94, 98, 100]
  },
  {
    id: "knn-latency",
    number: "02",
    title: "TOP-5 k-NN PROXIMITY LATENCY",
    metric: "16.5",
    metricSubtext: "µs (p99)",
    badge: "OPTIMAL",
    badgeType: "optimal",
    description: "PR-Quadtree bounded traversal with branch pruning. 75x faster than naive spatial scans.",
    sparklineData: [90, 85, 80, 70, 55, 40, 30, 25, 20, 18, 17, 16]
  },
  {
    id: "atomic-locks",
    number: "03",
    title: "ATOMIC LEASE CONCURRENCY",
    metric: "71.9k",
    metricSubtext: "locks/sec",
    badge: "0.000% RACE",
    badgeType: "verified",
    description: "Single-lease Redis Lua state machine with instant compare-and-swap reservation.",
    sparklineData: [30, 38, 45, 52, 60, 68, 71, 70, 72, 71, 72, 72]
  },
  {
    id: "chaos-resilience",
    number: "04",
    title: "CHAOS TEST SUITE RESILIENCE",
    metric: "50k / 0",
    metricSubtext: "Drivers / Crashes",
    badge: "CERTIFIED",
    badgeType: "verified",
    description: "Survived 50,000 driver singularity attacks, coordinate poisoning, and boundary thrashing without failure.",
    sparklineData: [100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100]
  }
];
`);

// 5. src/data/socialLinks.ts
write('src/data/socialLinks.ts', `
export interface SocialLink {
  label: string;
  url: string;
  icon: string;
  badge?: string;
  isExternal: boolean;
}

export const PERSONAL_INFO = {
  name: "Soumabrata Ghosh",
  handle: "Souma061",
  title: "Systems & Distributed Infrastructure Engineer",
  tagline: "High-throughput kernels, lock-free concurrency, spatial indices, and distributed message fabrics.",
  status: "ONLINE",
  statusMessage: "OPEN FOR SYSTEMS ROLES",
  location: "Kolkata, IN // UTC+05:30",
  email: "soumabrataghosh061@gmail.com",
  npxCommand: "npx soumabrata",
  github: "https://github.com/Souma061",
  linkedin: "https://linkedin.com/in/soumabrata-ghosh",
  resumePath: "/resume.pdf",
  stats: {
    peakOps: "3.88M ops/s",
    p99Latency: "16.5 µs",
    raceConditions: "0.000%",
    projectsShipped: 5,
    chaosPassRate: "100%"
  }
};

export const SOCIAL_LINKS: SocialLink[] = [
  {
    label: "GitHub",
    url: "https://github.com/Souma061",
    icon: "github",
    badge: "5 Repos",
    isExternal: true
  },
  {
    label: "LinkedIn",
    url: "https://linkedin.com/in/soumabrata-ghosh",
    icon: "linkedin",
    isExternal: true
  },
  {
    label: "Email",
    url: "mailto:soumabrataghosh061@gmail.com",
    icon: "mail",
    badge: "Direct PGP",
    isExternal: true
  },
  {
    label: "Resume",
    url: "/resume.pdf",
    icon: "file-text",
    badge: "PDF v2026",
    isExternal: true
  }
];
`);

// 6. src/data/skills.ts
write('src/data/skills.ts', `
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
      { name: "SIMD / AVX-512", level: "core", highlight: true, note: "Vectorized search & SoA layout" },
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
`);

// 7. src/data/blogPosts.ts
write('src/data/blogPosts.ts', `
import { BlogPost } from "@/types/blog";

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "zero-heap-spatial-quadtrees-cpp20",
    title: "Zero-Heap Spatial PR-Quadtrees in C++20 for Real-Time Dispatch",
    excerpt:
      "How Struct-of-Arrays (SoA) vectorization and AVX-512 memory alignment reduced urban k-NN spatial lookup latency from 1.25ms to 16.5µs under 100,000 GPS coordinates/second.",
    date: "2026-03-15",
    readingTime: "6 min read",
    tags: ["C++20", "Spatial Indices", "AVX-512", "Low Latency"],
    author: "Soumabrata Ghosh",
    featured: true,
    content: "Urban ride-hailing networks process massive bursts of spatial telematics. By reorganizing into Struct-of-Arrays aligned to AVX-512 64-byte boundaries, a single _mm512_cmp_ps_mask instruction tests 16 coordinate pairs against the query bounding rectangle in a single clock cycle."
  },
  {
    slug: "atomic-distributed-leases-redis-lua",
    title: "Eliminating Double-Dispatch: Atomic Redis Lua Leases under 100k RPS",
    excerpt:
      "Why multi-roundtrip distributed locking fails under network jitter, and how a single-phase Redis Lua Compare-and-Swap state machine achieves 71,900 leases/sec with 0.000% race collision.",
    date: "2026-02-28",
    readingTime: "5 min read",
    tags: ["Redis", "Distributed Systems", "Concurrency", "Lua"],
    author: "Soumabrata Ghosh",
    featured: true,
    content: "Under high geographic concurrency, multi-step locks lead to race conditions. Because Redis evaluates Lua scripts atomically in a single thread context, we can evaluate availability, set expiration TTL, and register the match in one zero-race network roundtrip."
  }
];
`);
