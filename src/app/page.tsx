import React from "react";
import Link from "next/link";
import { HeroSection } from "@/components/home/HeroSection";
import { HeroLogoMarquee } from "@/components/home/HeroLogoMarquee";
import { HardwareReceiptsSection } from "@/components/home/HardwareReceiptsSection";
import { ProjectsSection } from "@/components/home/ProjectsSection";
import { SkillsSection } from "@/components/home/SkillsSection";
import { PERSONAL_INFO } from "@/data/socialLinks";
import { Mail, ArrowRight, Cpu } from "lucide-react";
import { GithubIcon } from "@/components/ui/Icons";

export default function HomePage() {
  return (
    <div className="relative">
      <HeroSection />
      <HeroLogoMarquee />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <HardwareReceiptsSection />
        <ProjectsSection />
        <SkillsSection />

        <section className="my-24 rounded-3xl bg-gradient-to-b from-[#161e2c] to-[#10151f] border border-[#232e40] p-8 md:p-14 text-center relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#1e2838] border border-[#232e40] px-3.5 py-1 text-xs font-mono text-[#e86b1c]">
              <Cpu className="h-3.5 w-3.5" />
              <span>SYSTEMS ARCHITECT {"//"} OPEN FOR ENGAGEMENT</span>
            </div>

            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-[#f3e6d5]">
              Let&apos;s engineer infrastructure that does not fail under load.
            </h2>

            <p className="text-sm md:text-base text-[#b8aba0] leading-relaxed">
              Seeking systems engineering and distributed backend opportunities. Available for discussions on kernel-level optimization, high-throughput streaming, and low-latency database architectures.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4 font-mono text-xs">
              <a
                href={PERSONAL_INFO.email ? `mailto:${PERSONAL_INFO.email}` : "#"}
                className="inline-flex items-center gap-2 rounded-full bg-[#e86b1c] px-6 py-3 font-bold text-white shadow-lg shadow-[#e86b1c]/30 hover:bg-[#b84a0f] transition-all"
              >
                <Mail className="h-4 w-4" />
                <span>Transmit Inquiries</span>
              </a>

              <a
                href={PERSONAL_INFO.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[#18212e] px-6 py-3 font-semibold text-[#f3e6d5] border border-[#232e40] hover:border-[#e86b1c] hover:text-[#e86b1c] transition-all"
              >
                <GithubIcon className="h-4 w-4" />
                <span>Inspect GitHub (Souma061)</span>
              </a>

              <Link
                href="/write"
                className="inline-flex items-center gap-2 rounded-full bg-[#141b26] px-5 py-3 text-[#b8aba0] border border-[#232e40] hover:text-[#f3e6d5] hover:border-[#e86b1c]/50 transition-all"
              >
                <span>Authoring Studio</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
