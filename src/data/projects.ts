import { Project } from "@/types/portfolio";

export const PROJECTS: Project[] = [
  {
    id: "instaride",
    slug: "instaride",
    title: "InstaRide",
    tagline: "Dual-Engine Spatial Proximity & Distributed Concurrency Dispatch Engine",
    role: "Core Systems Architect",
    category: "distributed",
    statusBadge: "PRODUCTION v1.0.0",
    tags: ["C++14 (-O3)", "TypeScript (V8)", "PR-QuadTree", "Redis Lua", "Fastify WS", "Atomic CAS"],
    summary:
      "A high-throughput, dual-engine spatial ride-matching system and interactive dashboard. Combines a compiled native C++14 (-O3) PR-QuadTree accelerator with an in-memory TypeScript PR-QuadTree connected via zero-dependency Stdio IPC, atomic CAS lock leases, and a deterministic 7-stage trip state machine to guarantee zero double-dispatch collisions under extreme concurrency—completely free of managed geospatial databases.",
    problemStatement:
      "At urban transit hubs, thousands of simultaneous GPS telematics updates create severe geographic clustering. Naive linear array scans block Node.js single-threaded event loops, while standard spatial databases (PostGIS, Redis Geo) incur high serialization latency and multi-step race conditions where concurrent riders are offered the same driver, generating double-dispatch errors and catastrophic tail latencies.",
    architectureHops: [
      {
        step: "01",
        title: "Fastify Gateway & Multiplexed WS",
        description: "Ingests real-time driver telemetry heartbeats, rider bookings, and simulation control over a multiplexed WebSocket server (/ws) with role separation (rider, driver, observer) and origin guards.",
        latencyOrThroughput: "Sub-millisecond WS frame routing // Zero external DB",
        badge: "Fastify WS"
      },
      {
        step: "02",
        title: "Dual-Engine PR-QuadTree Index",
        description: "Recursively partitions 2D geographic space into quadrants (NW, NE, SW, SE). Evaluates branch-and-bound k-NN search using MinHeap priority queues and Haversine distance pruning, indexing only available drivers.",
        latencyOrThroughput: "16.5 µs median latency // 56.4k qps @ 1M fleet",
        badge: "C++14 (-O3)"
      },
      {
        step: "03",
        title: "Atomic CAS & Redis Distributed Leases",
        description: "Acquires a 15-second atomic lease token (SET driver_lock:{id} {reqId} NX PX 15000). Immediately un-indexes candidate from Quadtree in O(1), backed by steal-proof atomic Lua release and stale-state healing.",
        latencyOrThroughput: "71.9k locks/sec // 0.000% double-dispatch",
        badge: "Atomic CAS"
      },
      {
        step: "04",
        title: "Deterministic 7-Stage Trip FSM",
        description: "Drives strict lifecycle progression (IDLE -> MATCHING -> MATCHED -> ARRIVED -> IN_PROGRESS -> COMPLETED). Enforces passenger onboard fraud protection, accept/cancel rollback, and candidate fallback cascade.",
        latencyOrThroughput: "< 15s deadman lease // Auto-cascade",
        badge: "Strict FSM"
      }
    ],
    benchmarks: [
      {
        metric: "Top-k k-NN Latency (p50 / Median)",
        customEngine: "16.5 µs",
        naiveBaseline: "1,250 µs",
        industryAlternative: "8,200 µs (PostGIS R-Tree)",
        delta: "75x faster"
      },
      {
        metric: "p99 Tail Latency @ 1M Fleet",
        customEngine: "31.4 µs",
        naiveBaseline: "3,850 µs",
        industryAlternative: "14,500 µs (Redis Geo)",
        delta: "122x faster (GC-immune)"
      },
      {
        metric: "Spatial Query Throughput",
        customEngine: "56,450 queries/sec",
        naiveBaseline: "800 queries/sec",
        industryAlternative: "6,800 queries/sec (PostGIS)",
        delta: "+730% throughput"
      },
      {
        metric: "GPS Telemetry Updates (RAM)",
        customEngine: "3.88M ops/sec",
        naiveBaseline: "68k ops/sec",
        industryAlternative: "18k ops/sec (Database UPDATE)",
        delta: "57x faster"
      },
      {
        metric: "Double-Dispatch Collision Rate",
        customEngine: "0.000%",
        naiveBaseline: "14.200%",
        industryAlternative: "2.100% (Pessimistic DB lock)",
        delta: "Eliminated (0% race)"
      },
      {
        metric: "Memory Footprint (1M entities)",
        customEngine: "221 MB (C++) / 513 MB (TS)",
        naiveBaseline: "1.8 GB",
        industryAlternative: "1.2 GB (PostGIS/Redis Geo)",
        delta: "81.5% RAM reduction"
      }
    ],
    chaosScenarios: [
      {
        name: "Singularity Clumping",
        adversarialAttack: "50,000 concurrent simulated drivers clustered on identical lat/long coordinates (density explosion at urban airport hub).",
        mitigation: "Quadtree node split depth clamped to max depth 10 with capacity B=8 and linked bucket overflow.",
        result: "Zero memory explosion; deterministic search traversal preserved without recursion stack overflow.",
        status: "SURVIVED"
      },
      {
        name: "Coordinate Poisoning & Boundary Bouncing",
        adversarialAttack: "Malformed coordinates injected: NaN, Infinity, -999.0, and GPS ticks overshooting geographic bounding boxes.",
        mitigation: "Strict std::isnan/std::isinf pre-validation and fast-path bounds checks preventing out-of-bounds entity dropping.",
        result: "100% invalid payloads rejected, 0 segfaults, zero driver dropouts on region boundary bouncing.",
        status: "PASSED"
      },
      {
        name: "Concurrency Carnage (Double-Dispatch Race)",
        adversarialAttack: "2,000 simultaneous asynchronous ride requests competing for the exact same nearest driver at the exact same millisecond.",
        mitigation: "Synchronous single-process CAS critical section + Redis SET NX PX distributed lease with atomic Lua release.",
        result: "0.000% duplicate dispatch rate; exactly 1 trip matched and remaining requests gracefully cascaded.",
        status: "ZERO_FAILURES"
      },
      {
        name: "Stale Lock-State Healing & Deadman Recovery",
        adversarialAttack: "Client crash / simulator region reset mid-trip leaving orphaned Redis locks and stale busy states.",
        mitigation: "Self-healing reconciliation routine in acquireLock clearing unleased flags, backed by 15s deadman lease expiration.",
        result: "100% orphaned locks automatically reclaimed with zero stranded drivers.",
        status: "SURVIVED"
      }
    ],
    codeSnippets: [
      {
        title: "PR-Quadtree Branch-and-Bound Best-First k-NN (C++14 -O3)",
        language: "cpp",
        code: "// Best-First Branch-and-Bound k-NN using Min-Priority Queue & Haversine Pruning\nstd::vector<CandidateDriver> KNearestNeighBors(double queryLat, double queryLng, int k, double maxSearchRadiusMeters = 50000.0) {\n    std::vector<CandidateDriver> candidates;\n    if (k <= 0 || std::isnan(queryLat) || std::isnan(queryLng)) return candidates;\n\n    struct NodeCandidate {\n        QuadtreeNode *node;\n        double minDist;\n        bool operator>(const NodeCandidate &other) const { return minDist > other.minDist; }\n    };\n    std::priority_queue<NodeCandidate, std::vector<NodeCandidate>, std::greater<NodeCandidate>> PQ;\n\n    double rootMinDist = minDistanceToBox(queryLat, queryLng, root->bounds);\n    if (rootMinDist <= maxSearchRadiusMeters) PQ.push({root, rootMinDist});\n\n    while (!PQ.empty()) {\n        NodeCandidate current = PQ.top();\n        PQ.pop();\n\n        // Branch-and-bound pruning: stop if closest possible node border is farther than k-th candidate\n        if ((int)candidates.size() == k && current.minDist >= candidates.back().distance) {\n            break;\n        }\n\n        QuadtreeNode *node = current.node;\n        for (const auto *pt : node->point) {\n            double d = haversineDistance(queryLat, queryLng, pt->lat, pt->lng);\n            if (d <= maxSearchRadiusMeters) {\n                if ((int)candidates.size() < k || d < candidates.back().distance) {\n                    CandidateDriver cd{pt->id, pt->lat, pt->lng, d};\n                    auto pos = std::lower_bound(candidates.begin(), candidates.end(), cd,\n                        [](const CandidateDriver &a, const CandidateDriver &b) { return a.distance < b.distance; });\n                    candidates.insert(pos, cd);\n                    if ((int)candidates.size() > k) candidates.pop_back();\n                }\n            }\n        }\n\n        if (node->isDivided) {\n            QuadtreeNode *children[4] = {node->nw, node->ne, node->sw, node->se};\n            for (int i = 0; i < 4; i++) {\n                if (children[i]) {\n                    double dist = minDistanceToBox(queryLat, queryLng, children[i]->bounds);\n                    if (dist <= maxSearchRadiusMeters) PQ.push({children[i], dist});\n                }\n            }\n        }\n    }\n    return candidates;\n}",
        description: "Priority-queue branch-and-bound expands closest geographic quadrants first and prunes subtrees exceeding the k-th candidate distance. Scales O(log N), keeping p99 under 31.4 µs across 1,000,000 drivers."
      },
      {
        title: "Fast-Path GPS Pointer Dereference (O(1) In-Place Telemetry Update)",
        language: "cpp",
        code: "bool update(const std::string &id, double lat, double lng) {\n    auto it = driverIndex.find(id);\n    if (it == driverIndex.end() || !it->second.leaf) return false;\n\n    // Fast path: driver remains within same leaf bounding box (90%+ of GPS ticks)\n    if (contains(it->second.leaf->bounds, lat, lng)) {\n        it->second.point->lat = lat;\n        it->second.point->lng = lng;\n        return true; // Zero tree restructuring, pure pointer dereference\n    }\n\n    // Slow path: bounds check before re-indexing to prevent silent entity drop\n    if (!contains(root->bounds, lat, lng)) return false;\n    remove(id);\n    return insert(id, lat, lng);\n}",
        description: "DriverRecord caches direct Point* pointers and QuadtreeNode leaf references. 90%+ of moving vehicle updates mutate memory in-place in nanoseconds without tree traversal or memory allocations."
      },
      {
        title: "Atomic Distributed Lease Release & Steal-Proofing (Redis Lua)",
        language: "lua",
        code: "-- Atomic: only delete driver lease if caller owns the matching token\n-- Prevents late TTL expiry from releasing a subsequent rider's lock\nif redis.call(\"GET\", KEYS[1]) == ARGV[1] then\n    return redis.call(\"DEL\", KEYS[1])\nelse\n    return 0\nend",
        description: "Atomic Lua script enforcing CAS check-and-delete semantics on 15s driver leases. Guarantees zero lock stealing and 0.000% duplicate dispatch across distributed worker nodes."
      }
    ],
    githubUrl: "https://github.com/Souma061/InstaRide",
    featured: true
  },
  {
    id: "search-engine",
    slug: "search-engine",
    title: "Full-Text Search Engine",
    tagline: "SQLite FTS5 & BM25 Vectorized Query Retrieval Core",
    role: "Database & Search Architect",
    category: "search",
    statusBadge: "STABLE v2.1.0",
    tags: ["TypeScript", "SQLite FTS5", "Turso libSQL", "BM25", "Edge DB"],
    summary:
      "A zero-overhead full-text search indexing engine built on SQLite FTS5 and Turso libSQL edge replicas. Implements sub-10ms BM25 ranking, trigram tokenization, prefix matching, and instant autocomplete across massive corpora.",
    problemStatement:
      "Heavy search frameworks (Elasticsearch, OpenSearch) require multi-GB JVM heaps, complex cluster topology, and high infrastructure overhead. For embedded edge architectures, search needs sub-10ms response times without heap overhead or cold-start penalties.",
    architectureHops: [
      {
        step: "01",
        title: "Text Ingestion & Tokenizer",
        description: "Unicode61 tokenizer with stemmer, case folding, and custom stop-word pruning.",
        latencyOrThroughput: "12,000 docs/sec // Zero heap",
        badge: "Tokenizer"
      },
      {
        step: "02",
        title: "FTS5 Inverted Index",
        description: "B-Tree packed inverted index with column-weight multipliers for title and body matches.",
        latencyOrThroughput: "O(log N) term lookup",
        badge: "Inverted Index"
      },
      {
        step: "03",
        title: "BM25 Scoring & Ranking",
        description: "Native C SQLite extension scoring query relevancy with document length normalization.",
        latencyOrThroughput: "< 4.2ms p99 query latency",
        badge: "Sub-5ms"
      }
    ],
    benchmarks: [
      {
        metric: "Query Retrieval Latency (p99)",
        customEngine: "4.2 ms",
        naiveBaseline: "142.0 ms (LIKE '%term%')",
        industryAlternative: "28.0 ms (Elasticsearch cold)",
        delta: "33x faster"
      },
      {
        metric: "Memory Footprint",
        customEngine: "24 MB",
        naiveBaseline: "120 MB",
        industryAlternative: "1,400 MB (Elasticsearch JVM)",
        delta: "98.2% reduction"
      }
    ],
    chaosScenarios: [
      {
        name: "Wildcard Term Explosion",
        adversarialAttack: "10,000 concurrent fuzzy wildcard queries injected.",
        mitigation: "Trigram prefix index clamping max edit distance with bounded query execution timeouts.",
        result: "Zero thread starvation; max query time clamped to 20ms.",
        status: "SURVIVED"
      }
    ],
    codeSnippets: [
      {
        title: "FTS5 Schema & BM25 Scoring Query",
        language: "sql",
        code: "CREATE VIRTUAL TABLE search_corpus USING fts5(title, content, tags, tokenize='unicode61 remove_diacritics 2');\nSELECT title, bm25(search_corpus, 10.0, 1.0, 3.0) as score FROM search_corpus WHERE search_corpus MATCH :query ORDER BY score ASC LIMIT 20;",
        description: "Leverages native SQLite FTS5 tokenization with custom column weighting to retrieve ranked results in under 5 milliseconds."
      }
    ],
    githubUrl: "https://github.com/Souma061/search-engine",
    featured: true
  },
  {
    id: "webhook-relay",
    slug: "webhook-relay",
    title: "Webhook Relay Engine",
    tagline: "Resilient Ingestion, Kafka Partitioning & Dead-Letter Replay Queue",
    role: "Distributed Systems Engineer",
    category: "distributed",
    statusBadge: "PRODUCTION v1.4.0",
    tags: ["FastAPI", "Apache Kafka", "Redis", "PostgreSQL", "DLQ"],
    summary:
      "A fault-tolerant distributed webhook event delivery engine capable of buffering thousands of inbound payloads/sec. Employs Kafka message partitioning, backpressure regulation, exponential backoff retries, and dead-letter queues (DLQ).",
    problemStatement:
      "When external webhooks arrive at sudden 10x traffic spikes, downstream services collapse from backpressure. Dropped notifications cause lost payments, orphaned transactions, and severe data inconsistency.",
    architectureHops: [
      {
        step: "01",
        title: "Ingestion Gateway",
        description: "Async FastAPI gateway verifying HMAC SHA-256 signatures in 0.8ms.",
        latencyOrThroughput: "15,000 req/sec // 2ms",
        badge: "HMAC Signed"
      },
      {
        step: "02",
        title: "Kafka Partitioning",
        description: "Tenant-keyed Kafka topic partitioning preventing cross-customer noisy neighbor starvation.",
        latencyOrThroughput: "Sub-10ms delivery",
        badge: "Ordered"
      }
    ],
    benchmarks: [
      {
        metric: "Ingestion Capacity",
        customEngine: "15,200 req/sec",
        naiveBaseline: "450 req/sec (Sync DB)",
        industryAlternative: "2,800 req/sec (Standard Celery)",
        delta: "+440%"
      }
    ],
    chaosScenarios: [
      {
        name: "Downstream Target Outage",
        adversarialAttack: "100% of recipient destination endpoints simulate HTTP 503 for 30 minutes.",
        mitigation: "Circuit breaker trips; events backed up in Kafka & Redis buffer without dropping single frame.",
        result: "0 lost webhooks; all 250,000 buffered payloads successfully flushed upon recovery.",
        status: "SURVIVED"
      }
    ],
    codeSnippets: [
      {
        title: "HMAC Signature Verification & Kafka Producer",
        language: "python",
        code: "def verify_signature(secret: bytes, body: bytes, signature: str) -> bool:\n    expected = hmac.new(secret, body, hashlib.sha256).hexdigest()\n    return hmac.compare_digest(expected, signature)",
        description: "Constant-time HMAC verification defends against timing attacks before delegating payload directly into partitioned Kafka stream."
      }
    ],
    githubUrl: "https://github.com/Souma061/webhook-relay",
    featured: true
  },
  {
    id: "event-booking",
    slug: "event-booking",
    title: "High-Concurrency Event Booking",
    tagline: "Atomic Distributed Seat Locking & Locust Load Testing Suite",
    role: "Backend Concurrency Engineer",
    category: "distributed",
    statusBadge: "PRODUCTION v1.2.0",
    tags: ["FastAPI", "Redis Distributed Locks", "PostgreSQL", "Locust", "Docker"],
    summary:
      "A distributed ticket reservation and concurrency control system built to survive viral concert ticket drops. Evaluated under Locust load testing simulating 1,000+ concurrent requests/sec with zero seat double-booking.",
    problemStatement:
      "During flash ticket sales, tens of thousands of users attempt to purchase the same inventory within milliseconds. Relational database row locks create deadlocks and connection pool exhaustion.",
    architectureHops: [
      {
        step: "01",
        title: "Rate Limit Token Bucket",
        description: "Redis sliding-window rate limiter blocking DDoS traffic before hitting application layer.",
        latencyOrThroughput: "5,000 req/sec limit",
        badge: "Token Bucket"
      },
      {
        step: "02",
        title: "Atomic Inventory Reservation",
        description: "Redis atomic decrement (DECR) and seat-level distributed lock with automatic lease release.",
        latencyOrThroughput: "< 2.1ms reservation",
        badge: "Zero Overbook"
      }
    ],
    benchmarks: [
      {
        metric: "Locust Sustained Concurrency",
        customEngine: "1,013 RPS",
        naiveBaseline: "85 RPS",
        industryAlternative: "240 RPS (Standard Django)",
        delta: "12x throughput"
      }
    ],
    chaosScenarios: [
      {
        name: "Seat Contention Stampede",
        adversarialAttack: "1,000 users attempting to reserve seat 'A1' in the exact same millisecond.",
        mitigation: "Redis Redlock atomic compare-and-swap with immediate lock rejection for competing threads.",
        result: "Exactly 1 user booked seat A1, 999 users cleanly received 'Seat unavailable' in 1.4ms.",
        status: "SURVIVED"
      }
    ],
    codeSnippets: [
      {
        title: "Redis Distributed Lock with Auto-TTL",
        language: "python",
        code: "async def reserve_seat(seat_id: str, user_id: str, timeout_sec: int = 300) -> bool:\n    lock_key = f'seat_lock:{seat_id}'\n    acquired = await redis_client.set(lock_key, user_id, nx=True, ex=timeout_sec)\n    return bool(acquired)",
        description: "Atomically guarantees single-occupancy reservations while providing a 5-minute fallback TTL."
      }
    ],
    githubUrl: "https://github.com/Souma061/event-booking",
    featured: true
  },
  {
    id: "skribble",
    slug: "skribble",
    title: "Skribble Real-Time Collaborative Canvas",
    tagline: "Binary Stroke WebSocket Streaming & Low-Latency Canvas Sync",
    role: "Full-Stack Realtime Engineer",
    category: "realtime",
    statusBadge: "STABLE v2.0.0",
    tags: ["Node.js", "Socket.IO", "Prisma", "WebSockets", "Canvas API"],
    summary:
      "A multiplayer real-time drawing and brainstorming platform built with binary stroke compression, delta synchronization, and sub-30ms canvas rendering across concurrent artists.",
    problemStatement:
      "Streaming raw JSON mouse events (x, y, color, pressure) across hundreds of users floods network sockets with massive JSON serialization overhead, causing canvas lag and frame drops.",
    architectureHops: [
      {
        step: "01",
        title: "Binary Stroke Packing",
        description: "Packed binary ArrayBuffer encoding x, y, brush size, and color into 8 bytes instead of 120-byte JSON.",
        latencyOrThroughput: "93% bandwidth reduction",
        badge: "Binary ArrayBuffer"
      }
    ],
    benchmarks: [
      {
        metric: "Per-Stroke Payload Size",
        customEngine: "8 Bytes",
        naiveBaseline: "128 Bytes (JSON)",
        industryAlternative: "72 Bytes",
        delta: "16x smaller"
      }
    ],
    chaosScenarios: [
      {
        name: "Concurrent Scribble Flood",
        adversarialAttack: "100 participants drawing continuous spirals simultaneously on single canvas.",
        mitigation: "Client-side bezier smoothing combined with server-side rate sampling.",
        result: "Zero server thread stall; steady 60 FPS client rendering maintained.",
        status: "SURVIVED"
      }
    ],
    codeSnippets: [
      {
        title: "Binary ArrayBuffer Stroke Serialization",
        language: "typescript",
        code: "function packStroke(x: number, y: number, size: number, r: number, g: number, b: number): ArrayBuffer {\n  const buffer = new ArrayBuffer(8);\n  const view = new DataView(buffer);\n  view.setUint16(0, Math.round(x));\n  view.setUint16(2, Math.round(y));\n  view.setUint8(4, Math.min(size, 255));\n  view.setUint8(5, r);\n  view.setUint8(6, g);\n  view.setUint8(7, b);\n  return buffer;\n}",
        description: "Reduces network bandwidth by 93% by packing continuous mouse points into compact 8-byte ArrayBuffers."
      }
    ],
    githubUrl: "https://github.com/Souma061/skribble",
    featured: true
  }
];
