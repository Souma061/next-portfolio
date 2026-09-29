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
