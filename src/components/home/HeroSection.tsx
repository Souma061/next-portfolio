import React from "react";
import { ArrowDown, FileText } from "lucide-react";
import { PERSONAL_INFO } from "@/data/socialLinks";
import { SlideToOpenCTA } from "@/components/ui/SlideToOpenCTA";

export const HeroSection: React.FC = () => {
  return (
    <section className="relative pt-36 pb-20 md:pt-44 md:pb-28">
      <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-96 w-[700px] rounded-full bg-gradient-to-b from-[#e86b1c]/15 via-[#b84a0f]/5 to-transparent blur-3xl" />

      <div className="relative mx-auto max-w-4xl text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-[#121822] border border-[#232e40] px-4 py-1.5 text-xs font-mono text-[#b8aba0] mb-8 shadow-inner hover:border-[#e86b1c]/50 transition-colors">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[#f3e6d5] font-semibold">{PERSONAL_INFO.name}</span>
          <span className="text-[#7f756d]">///</span>
          <span className="text-[#e86b1c] font-medium">{PERSONAL_INFO.title}</span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-[#f3e6d5] leading-[1.08]">
          HIGH-THROUGHPUT SYSTEMS<span className="text-[#e86b1c]">.</span>
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e86b1c] via-[#ff9b50] to-[#f3e6d5]">
            SUB-MICROSECOND
          </span>{" "}
          LATENCY<span className="text-[#e86b1c]">.</span>
        </h1>

        <p className="mt-6 text-base sm:text-lg md:text-xl text-[#b8aba0] max-w-2xl mx-auto leading-relaxed font-normal">
          {PERSONAL_INFO.tagline}
        </p>

        <div className="mt-10 mx-auto max-w-2xl rounded-2xl bg-[#121822]/80 border border-[#232e40] p-4 backdrop-blur-md">
          <div className="grid grid-cols-3 divide-x divide-[#232e40] text-center font-mono">
            <div className="px-3">
              <div className="text-[10px] text-[#7f756d] uppercase tracking-wider">Spatial Pipeline</div>
              <div className="text-lg md:text-2xl font-black text-white mt-1">3.88M <span className="text-xs text-[#e86b1c]">ops/s</span></div>
              <div className="text-[10px] text-emerald-400 mt-0.5">AVX-512 SIMD</div>
            </div>
            <div className="px-3">
              <div className="text-[10px] text-[#7f756d] uppercase tracking-wider">p99 k-NN Latency</div>
              <div className="text-lg md:text-2xl font-black text-[#e86b1c] mt-1">16.5 <span className="text-xs">µs</span></div>
              <div className="text-[10px] text-[#b8aba0] mt-0.5">75x vs PostGIS</div>
            </div>
            <div className="px-3">
              <div className="text-[10px] text-[#7f756d] uppercase tracking-wider">Distributed Races</div>
              <div className="text-lg md:text-2xl font-black text-white mt-1">0.000%</div>
              <div className="text-[10px] text-emerald-400 mt-0.5">Atomic Lua CAS</div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-center gap-4">
          <SlideToOpenCTA command={PERSONAL_INFO.npxCommand} />

          <div className="flex items-center gap-3 font-mono text-xs pt-2">
            <a
              href="#projects"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#18212e] text-[#f3e6d5] border border-[#232e40] hover:border-[#e86b1c] hover:text-[#e86b1c] transition-all"
            >
              <span>Explore 5 Systems</span>
              <ArrowDown className="h-3.5 w-3.5" />
            </a>

            <a
              href={PERSONAL_INFO.resumePath}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#18212e] text-[#b8aba0] border border-[#232e40] hover:text-white hover:border-zinc-500 transition-all"
            >
              <FileText className="h-3.5 w-3.5" />
              <span>Resume PDF</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
