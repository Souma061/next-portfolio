"use client";

import React from "react";
import { HARDWARE_RECEIPTS } from "@/data/benchmarks";
import { Spotlight } from "@/components/ui/Spotlight";
import { Sparkline } from "@/components/ui/Sparkline";
import { TechBadge } from "@/components/ui/TechBadge";
import { Shield, ArrowUpRight } from "lucide-react";

export const HardwareReceiptsSection: React.FC = () => {
  return (
    <section id="benchmarks" className="relative py-24 scroll-mt-24">
      <div className="mb-12">
        <div className="flex items-center gap-3 font-mono text-xs text-[#e86b1c] tracking-widest uppercase mb-2">
          <span className="flex h-2 w-2 rounded-full bg-[#e86b1c]" />
          <span>01 // BENCHMARK RECEIPTS</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[#f3e6d5]">
          Verified Throughput & Tail Latency
        </h2>
        <p className="mt-3 max-w-2xl text-sm md:text-base text-[#b8aba0] leading-relaxed">
          No hypothetical architectures or vanity metrics. Real benchmark runs executed on physical hardware, measured against standard baseline alternatives with adversarial load.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {HARDWARE_RECEIPTS.map((receipt) => (
          <Spotlight
            key={receipt.id}
            className="flex flex-col justify-between p-6 rounded-2xl bg-[#121822]/90 border border-[#232e40] hover:border-[#e86b1c]/50 transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-[#7f756d]">
                // {receipt.number}
              </span>
              <TechBadge
                variant={receipt.badgeType === "optimal" ? "amber" : "status"}
                size="sm"
              >
                {receipt.badge}
              </TechBadge>
            </div>

            <div className="my-6">
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-3xl lg:text-4xl font-black text-white tracking-tight">
                  {receipt.metric}
                </span>
                <span className="font-mono text-xs text-[#e86b1c] font-medium">
                  {receipt.metricSubtext}
                </span>
              </div>

              <div className="mt-2 text-xs font-mono font-bold text-[#f3e6d5] uppercase tracking-wide">
                {receipt.title}
              </div>

              {receipt.sparklineData && (
                <div className="mt-4 pt-3 border-t border-[#1c2635] flex items-center justify-between">
                  <span className="text-[10px] font-mono text-[#7f756d]">12-SAMPLE RUN:</span>
                  <Sparkline
                    data={receipt.sparklineData}
                    width={110}
                    height={28}
                    color="#e86b1c"
                  />
                </div>
              )}
            </div>

            <div className="pt-2 text-xs leading-relaxed text-[#b8aba0] border-t border-[#1c2635]/60">
              {receipt.description}
            </div>
          </Spotlight>
        ))}
      </div>

      <div className="mt-6 rounded-xl bg-[#0f151f] border border-[#232e40] p-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono">
        <div className="flex items-center gap-3 text-[#b8aba0]">
          <Shield className="h-4 w-4 text-[#e86b1c] shrink-0" />
          <span>
            Profiling harness: <strong className="text-white">perf, Valgrind ASan, and Locust 2.15</strong> across AMD Ryzen 9 16-Core / Linux 6.8 kernel.
          </span>
        </div>
        <div className="flex items-center gap-2 text-[#e86b1c] hover:underline cursor-pointer">
          <span>Inspect verification logs</span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </div>
      </div>
    </section>
  );
};
