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
