import React from "react";
import { Cpu, Zap, Database, GitBranch, Layers, ShieldCheck, Activity, Terminal } from "lucide-react";

const MARQUEE_ITEMS = [
  { text: "C++20 SYSTEMS KERNEL", icon: Cpu },
  { text: "PR-QUADTREE SPATIAL PARTITIONING", icon: Layers },
  { text: "3.88M OPS/SEC SIMD PIPELINE", icon: Zap },
  { text: "REDIS ATOMIC LUA STATE MACHINE", icon: Database },
  { text: "APACHE KAFKA DEAD-LETTER QUEUES", icon: GitBranch },
  { text: "AVX-512 VECTORIZED BOUNDS CHECK", icon: Activity },
  { text: "SQLITE FTS5 BM25 SEARCH ENGINE", icon: Terminal },
  { text: "LOCUST 1,013 RPS CONCURRENCY CERTIFIED", icon: ShieldCheck },
  { text: "ZERO-LOCK DISPATCH MESH", icon: Zap },
  { text: "BINARY STROKE SOCKET STREAMING", icon: Layers },
];

export const HeroLogoMarquee: React.FC = () => {
  return (
    <div className="relative w-full overflow-hidden border-y border-[#232e40] bg-[#0d121a]/80 py-3 backdrop-blur-md">
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#0b0f15] to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#0b0f15] to-transparent z-10" />

      <div className="animate-marquee flex items-center gap-8">
        {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="flex items-center gap-2.5 font-mono text-xs uppercase tracking-wider text-[#b8aba0] transition-colors hover:text-[#e86b1c]"
            >
              <Icon className="h-3.5 w-3.5 text-[#e86b1c]" />
              <span className="whitespace-nowrap font-medium">{item.text}</span>
              <span className="text-[#232e40] select-none pl-4">///</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
