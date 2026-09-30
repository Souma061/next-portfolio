# SOUMABRATA GHOSH
**Kolkata, India** | [soumabrataghosh57@gmail.com](mailto:soumabrataghosh57@gmail.com) | [github.com/Souma061](https://github.com/Souma061) | [linkedin.com/in/soumabrata-ghosh](https://linkedin.com/in/soumabrata-ghosh) | [souma.dev](https://souma.dev)

---

## TECHNICAL SKILLS
- **Languages:** C++20, C, TypeScript, JavaScript, Python, SQL, POSIX Shell/Bash
- **Distributed Systems:** Redis Lua atomic leases, Apache Kafka (partitioning, consumer groups), Distributed Locks (Redlock), WebSockets, Circuit Breakers, Dead-Letter Queues
- **Databases & Storage:** SQLite FTS5 / BM25, Turso libSQL, PostgreSQL (MVCC, Index Optimization), MongoDB, Redis Streams & Pub/Sub
- **Infrastructure & Tooling:** Docker containerization, Linux eBPF/perf, Locust Load Testing, Git, Next.js, CI/CD pipelines

---

## WORK EXPERIENCE

### ShapeNext — Full-Stack Software Engineer Intern
*Jul 2026 – Present | Remote*
- Engineered and shipped production features across company web platform, LMS ([learn.shapenxt.com](https://learn.shapenxt.com)), and internal CRM using Next.js, TypeScript, and PostgreSQL.
- Rebuilt company marketing infrastructure from scratch, owning full-stack implementation, performance tuning, and automated deployment pipelines.
- Architected in-platform blog content authoring and publishing system for the LMS, enabling autonomous course marketing without engineering dependencies.

---

## FEATURED ENGINEERING PROJECTS

### InstaRide — Real-Time Spatial Proximity & Concurrency Dispatch Engine (2026)
*C++20, Redis Lua, PR-Quadtree, SIMD AVX-512, Docker, WebSockets*
- Engineered a sub-millisecond spatial dispatch kernel in **C++20**, achieving **3.88M ops/sec** spatial ingestion and **16.5 µs** p99 k-NN query latency (75x faster than standard PostGIS baselines).
- Designed a custom Point-Region Quadtree with Struct-of-Arrays (SoA) memory alignment and vectorized **AVX-512** bounding box pruning to evaluate 16 coordinates per clock cycle.
- Eliminated distributed double-booking anomalies with single-roundtrip atomic **Redis Lua** scripts processing **71.9k lock acquisitions/sec** with zero data collisions.
- Hardened engine against network chaos and singularity spatial clustering (50,000 drivers on 1 coordinate) with depth-clamped bucket overflow; verified 0 segfaults under ASan/Valgrind.

### Distributed Full-Text Search Engine (2026)
*TypeScript, SQLite FTS5, Turso libSQL, BM25 Ranking*
- Built an inverted index search core supporting full-text retrieval across 100,000+ documents with sub-**5ms** search response time and tokenized trigram query routing.
- Implemented custom **BM25** relevance scoring with dynamic term frequency saturation and document length normalization for high-precision retrieval.
- Constructed edge database replica sync using Turso libSQL, reducing p95 query latency by **65%** for distributed multi-region clients.

### High-Throughput Webhook Relay Fabric (2026)
*Apache Kafka, Redis, Circuit Breakers, Node.js*
- Architected a distributed event ingestion fabric sustaining **120,000 req/sec** ingress with at-least-once delivery guarantees.
- Engineered partitioned **Apache Kafka** topic pipelines with automated exponential backoff retries and Dead-Letter Queues (DLQ) to isolate failing subscriber endpoints.
- Integrated distributed token-bucket rate limiters in **Redis** with sliding-window accounting to defend downstream webhooks from traffic storms.

### Atomic Event Ticket Reservation Engine (2026)
*PostgreSQL, Redis, Distributed Locking, Node.js*
- Designed a high-concurrency seat reservation system sustaining **1,000+ RPS** concurrent burst traffic under Locust stress testing with **0.000%** over-allocation.
- Combined Redis temporary reservation TTL leases with PostgreSQL MVCC and optimistic row locking to guarantee strict transactional consistency under heavy contention.

---

## EDUCATION
**Bachelor of Technology in Computer Science & Engineering** — Kolkata, India | 2026
- **Relevant Coursework:** Operating Systems, Distributed Systems, Computer Networks, Database Management Systems, Data Structures & Algorithms, Object-Oriented System Design.

---

## ACHIEVEMENTS & ENGINEERING STRENGTHS
- **Code Volume & Reliability:** Authored 48,000+ lines of production code across 5 distributed architectures with zero memory safety violations.
- **Chaos Testing:** Engineered custom load injection harnesses simulating network partitions, split-brain nodes, and packet drops under continuous Locust profiling.
