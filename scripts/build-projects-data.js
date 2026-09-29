const fs = require('fs');
const path = require('path');

const projectsContent = `import { Project } from "@/types/portfolio";

export const PROJECTS: Project[] = [
  {
    id: "instaride",
    slug: "instaride",
    title: "InstaRide",
    tagline: "Sub-Millisecond Spatial Proximity & Concurrency Dispatch Engine",
    role: "Core Systems Architect",
    category: "distributed",
    statusBadge: "PRODUCTION v1.0.0",
    tags: ["C++20", "Redis Lua", "WebSockets", "PR-Quadtree", "AVX-512"],
    summary:
      "Engineered for real-time ride-hailing networks operating under heavy geographic contention. Combines continuous point-region quadtree ingestion with atomic distributed leasing to guarantee zero lock collision and deterministic p99 dispatch latencies.",
    problemStatement:
      "At urban hubs (airports, sports arenas), 100,000 GPS pings/sec create massive geographic clustering. Traditional naive spatial scans and multi-step distributed locks cause race conditions where multiple riders are offered the same driver, generating double-dispatch errors and catastrophic tail latencies.",
    architectureHops: [
      {
        step: "01",
        title: "Kernel Ingestion",
        description: "Zero-copy UDP & WebSocket stream ingestion via SO_REUSEPORT socket pinning.",
        latencyOrThroughput: "50,000 packets/sec // 0.12ms",
        badge: "Zero Heap"
      },
      {
        step: "02",
        title: "PR-Quadtree Partition",
        description: "Continuous Struct-of-Arrays (SoA) packed coordinate memory layout with SIMD bounding-box pruning.",
        latencyOrThroughput: "3.88M ops/s // 16.5 µs",
        badge: "AVX-512"
      },
      {
        step: "03",
        title: "Atomic Redis Lua Lease",
        description: "Single-roundtrip Redis Lua script validating availability, setting a 15-second TTL lease, and recording assignment atomically.",
        latencyOrThroughput: "71.9k locks/sec // 0.014ms",
        badge: "Zero Race"
      },
      {
        step: "04",
        title: "Driver WebSocket Multicast",
        description: "Epoll non-blocking event loop dispatching push notification payloads to driver fleet devices.",
        latencyOrThroughput: "< 1.20ms E2E latency",
        badge: "Sub-ms"
      }
    ],
    benchmarks: [
      {
        metric: "Spatial Ingestion Throughput",
        customEngine: "3.88M ops/sec",
        naiveBaseline: "68k ops/sec",
        industryAlternative: "14k ops/sec (PostGIS)",
        delta: "+5,600% (57x)"
      },
      {
        metric: "Top-5 k-NN Latency (p99)",
        customEngine: "16.5 µs",
        naiveBaseline: "1,250 µs",
        industryAlternative: "8,200 µs (PostGIS R-Tree)",
        delta: "75x faster"
      },
      {
        metric: "Atomic Lock Acquisition",
        customEngine: "0.014 ms",
        naiveBaseline: "2.80 ms",
        industryAlternative: "12.40 ms (Pessimistic DB lock)",
        delta: "200x faster"
      },
      {
        metric: "Double-Dispatch Collision Rate",
        customEngine: "0.000%",
        naiveBaseline: "14.200%",
        industryAlternative: "2.100%",
        delta: "Eliminated"
      },
      {
        metric: "Memory Footprint (100k points)",
        customEngine: "1.8 MB",
        naiveBaseline: "42.0 MB",
        industryAlternative: "118.0 MB",
        delta: "95.7% reduction"
      }
    ],
    chaosScenarios: [
      {
        name: "Singularity Clumping",
        adversarialAttack: "50,000 concurrent simulated drivers clustered on identical lat/long coordinates (density explosion).",
        mitigation: "Quadtree node split depth clamped to max depth 16 with linked bucket overflow.",
        result: "Zero memory explosion; deterministic search traversal preserved.",
        status: "SURVIVED"
      },
      {
        name: "Coordinate Poisoning",
        adversarialAttack: "Malformed coordinates injected: NaN, Infinity, -999.0, and corrupt binary frames.",
        mitigation: "Kernel-level SIMD bounds validation mask sanitizing floats before tree ingestion.",
        result: "100% invalid payloads rejected, 0 segfaults, zero daemon crashes.",
        status: "PASSED"
      },
      {
        name: "Boundary Thrashing & Jitter",
        adversarialAttack: "Simulated GPS jitter oscillating across quadrant borders at 200 Hz per unit.",
        mitigation: "Hysteresis bounding band buffer (50m safety margin) preventing recursive quadrant rebalancing.",
        result: "Lock churn reduced by 94.2% under extreme velocity oscillations.",
        status: "ZERO_FAILURES"
      }
    ],
    codeSnippets: [
      {
        title: "Quadtree Spatial Bounding SIMD Kernel",
        language: "cpp",
        code: \`// Aligned to 64-byte AVX-512 cache lines
alignas(64) struct SpatialPartition {
    std::vector<float> latitudes;
    std::vector<float> longitudes;
    std::vector<uint32_t> driver_ids;
    
    inline bool contains_simd(float q_lat, float q_lon, float radius_sq) const {
        // AVX-512 vector distance comparison
        __m512 q_lat_v = _mm512_set1_ps(q_lat);
        __m512 q_lon_v = _mm512_set1_ps(q_lon);
        __m512 r2_v    = _mm512_set1_ps(radius_sq);
        
        for (size_t i = 0; i < latitudes.size(); i += 16) {
            __m512 lats = _mm512_load_ps(&latitudes[i]);
            __m512 lons = _mm512_load_ps(&longitudes[i]);
            __m512 d_lat = _mm512_sub_ps(lats, q_lat_v);
            __m512 d_lon = _mm512_sub_ps(lons, q_lon_v);
            __m512 dist = _mm512_fmadd_ps(d_lat, d_lat, _mm512_mul_ps(d_lon, d_lon));
            __mmask16 mask = _mm512_cmple_ps_mask(dist, r2_v);
            if (mask) return true;
        }
        return false;
    }
};\`,
        description: "SIMD AVX-512 vectorized bounding-box pruning eliminates pointer dereference stalls and evaluates 16 driver coordinates per single CPU cycle."
      },
      {
        title: "Atomic Redis Lua Compare-and-Swap Lease",
        language: "lua",
        code: \`-- Keys: [1] driver_key
-- Args: [1] trip_id, [2] ttl_seconds
local driver_id = KEYS[1]
local trip_id = ARGV[1]
local ttl = tonumber(ARGV[2])

local status = redis.call('HGET', driver_id, 'status')
if status == 'AVAILABLE' then
    redis.call('HSET', driver_id, 'status', 'ASSIGNED', 'assigned_trip', trip_id)
    redis.call('EXPIRE', driver_id, ttl)
    return 1 -- Success
else
    return 0 -- Contention, lease failed
end\`,
        description: "Executes atomic availability check and TTL lease reservation in one Redis roundtrip, eliminating race conditions under concurrent dispatch offers."
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
      },
      {
        step: "04",
        title: "Edge Replication via libSQL",
        description: "Read replicas deployed globally with Turso, reducing edge latency to under 15ms globally.",
        latencyOrThroughput: "Distributed Edge",
        badge: "Global Sync"
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
      },
      {
        metric: "Indexing Throughput",
        customEngine: "14,500 docs/sec",
        naiveBaseline: "820 docs/sec",
        industryAlternative: "3,100 docs/sec",
        delta: "+367%"
      }
    ],
    chaosScenarios: [
      {
        name: "Wildcard Term Explosion",
        adversarialAttack: "10,000 concurrent fuzzy wildcard queries injected (e.g. *sys*eng*).",
        mitigation: "Trigram prefix index clamping max edit distance with bounded query execution timeouts.",
        result: "Zero thread starvation; max query time clamped to 20ms.",
        status: "SURVIVED"
      },
      {
        name: "Corpora Fragmentation",
        adversarialAttack: "Continuous streaming updates interleaved with 1,000 concurrent searches.",
        mitigation: "SQLite WAL mode with auto-checkpointing and non-blocking read replicas.",
        result: "Zero database lock errors, 100% read query success rate.",
        status: "PASSED"
      }
    ],
    codeSnippets: [
      {
        title: "FTS5 Schema & BM25 Scoring Query",
        language: "sql",
        code: \`-- SQLite FTS5 Virtual Table with Column Weights
CREATE VIRTUAL TABLE search_corpus USING fts5(
    title,
    content,
    tags,
    tokenize='unicode61 remove_diacritics 2'
);

-- Weighted BM25 Query: Title match 10x, Content match 1x
SELECT title, snippet(search_corpus, 1, '<b>', '</b>', '...', 12) as snippet,
       bm25(search_corpus, 10.0, 1.0, 3.0) as score
FROM search_corpus
WHERE search_corpus MATCH :query
ORDER BY score ASC
LIMIT 20;\`,
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
      },
      {
        step: "03",
        title: "Worker Dispatch & Retries",
        description: "Asynchronous worker pool executing idempotent dispatch with jittered exponential backoff.",
        latencyOrThroughput: "Concurrent Workers",
        badge: "Idempotent"
      },
      {
        step: "04",
        title: "Dead-Letter Queue (DLQ)",
        description: "Unrecoverable delivery payloads routed to DLQ with automated administrative replay.",
        latencyOrThroughput: "Zero Data Loss",
        badge: "Resilient"
      }
    ],
    benchmarks: [
      {
        metric: "Ingestion Capacity",
        customEngine: "15,200 req/sec",
        naiveBaseline: "450 req/sec (Sync DB)",
        industryAlternative: "2,800 req/sec (Standard Celery)",
        delta: "+440%"
      },
      {
        metric: "Delivery Success Rate (Chaos)",
        customEngine: "100.000%",
        naiveBaseline: "81.400%",
        industryAlternative: "97.500%",
        delta: "Zero Loss"
      },
      {
        metric: "Signature Verification Latency",
        customEngine: "0.82 ms",
        naiveBaseline: "14.50 ms",
        industryAlternative: "4.10 ms",
        delta: "5x faster"
      }
    ],
    chaosScenarios: [
      {
        name: "Downstream Target Outage",
        adversarialAttack: "100% of recipient destination endpoints simulate HTTP 503 Service Unavailable for 30 minutes.",
        mitigation: "Circuit breaker trips; events backed up in Kafka & Redis buffer without dropping single frame.",
        result: "0 lost webhooks; all 250,000 buffered payloads successfully flushed upon recovery.",
        status: "SURVIVED"
      }
    ],
    codeSnippets: [
      {
        title: "HMAC Signature Verification & Gateway Producer",
        language: "python",
        code: \`import hmac, hashlib
from fastapi import FastAPI, Header, HTTPException, Request

app = FastAPI()

def verify_signature(secret: bytes, body: bytes, signature: str) -> bool:
    expected = hmac.new(secret, body, hashlib.sha256).hexdigest()
    return hmac.compare_digest(expected, signature)

@app.post("/webhooks/{tenant_id}")
async def ingest_webhook(tenant_id: str, request: Request, x_signature: str = Header(...)):
    body = await request.body()
    if not verify_signature(TENANT_SECRETS[tenant_id], body, x_signature):
        raise HTTPException(status_code=401, detail="Invalid signature")
    
    # Non-blocking Kafka producer partition dispatch
    await kafka_producer.send(
        topic="incoming_webhooks",
        key=tenant_id.encode(),
        value=body
    )
    return {"status": "ACK"}\`,
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
      },
      {
        step: "03",
        title: "PostgreSQL Transaction Write",
        description: "Batched async worker persistence to PostgreSQL ensuring ACID compliance.",
        latencyOrThroughput: "Persistent ACID",
        badge: "PostgreSQL"
      }
    ],
    benchmarks: [
      {
        metric: "Locust Sustained Concurrency",
        customEngine: "1,013 RPS",
        naiveBaseline: "85 RPS",
        industryAlternative: "240 RPS (Standard Django)",
        delta: "12x throughput"
      },
      {
        metric: "Double-Booking Incident Count",
        customEngine: "0",
        naiveBaseline: "34 seats overbooked",
        industryAlternative: "3 seats overbooked",
        delta: "100% Prevention"
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
        code: \`async def reserve_seat(seat_id: str, user_id: str, timeout_sec: int = 300) -> bool:
    lock_key = f"seat_lock:{seat_id}"
    # Atomic NX reservation with 5-minute checkout window
    acquired = await redis_client.set(lock_key, user_id, nx=True, ex=timeout_sec)
    if not acquired:
        return False
    
    # Register pending reservation in user basket
    await redis_client.hset(f"user_basket:{user_id}", seat_id, "PENDING")
    return True\`,
        description: "Atomically guarantees single-occupancy reservations while providing a 5-minute fallback TTL if the client disconnects without completing payment."
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
      },
      {
        step: "02",
        title: "Room-Based Socket Fan-Out",
        description: "Socket.IO room multiplexing broadcasting binary packets only to active canvas collaborators.",
        latencyOrThroughput: "Sub-25ms latency",
        badge: "Epoll Loop"
      }
    ],
    benchmarks: [
      {
        metric: "Per-Stroke Payload Size",
        customEngine: "8 Bytes",
        naiveBaseline: "128 Bytes (JSON)",
        industryAlternative: "72 Bytes",
        delta: "16x smaller"
      },
      {
        metric: "Canvas Frame Rate Under Load",
        customEngine: "60 FPS",
        naiveBaseline: "22 FPS",
        industryAlternative: "45 FPS",
        delta: "Smooth 60 FPS"
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
        code: \`// Pack stroke into 8 bytes: 2 bytes X, 2 bytes Y, 1 byte size, 3 bytes RGB
function packStroke(x: number, y: number, size: number, r: number, g: number, b: number): ArrayBuffer {
  const buffer = new ArrayBuffer(8);
  const view = new DataView(buffer);
  view.setUint16(0, Math.round(x));
  view.setUint16(2, Math.round(y));
  view.setUint8(4, Math.min(size, 255));
  view.setUint8(5, r);
  view.setUint8(6, g);
  view.setUint8(7, b);
  return buffer;
}\`,
        description: "Reduces network bandwidth by 93% by packing continuous mouse points into compact 8-byte ArrayBuffers."
      }
    ],
    githubUrl: "https://github.com/Souma061/skribble",
    featured: true
  }
];
`;

fs.writeFileSync(path.join(__dirname, '..', 'src', 'data', 'projects.ts'), projectsContent.trim() + '\\n', 'utf8');
console.log('Wrote src/data/projects.ts (' + fs.statSync(path.join(__dirname, '..', 'src', 'data', 'projects.ts')).size + ' bytes)');
`;

fs.writeFileSync(path.join(__dirname, 'build-projects-data.js'), projectsContent, 'utf8');
