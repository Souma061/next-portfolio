import React from "react";
import { SKILL_CATEGORIES } from "@/data/skills";
import { Spotlight } from "@/components/ui/Spotlight";
import { Terminal, Cpu, Database, Server, GitFork } from "lucide-react";

export const SkillsSection: React.FC = () => {
  const categoryIcons: Record<string, React.ElementType> = {
    "01_SYS": Cpu,
    "02_DIST": Server,
    "03_DATA": Database,
    "04_INFRA": GitFork,
  };

  return (
    <section id="skills" className="relative py-24 scroll-mt-24">
      <div className="mb-12">
        <div className="flex items-center gap-3 font-mono text-xs text-[#e86b1c] tracking-widest uppercase mb-2">
          <span className="flex h-2 w-2 rounded-full bg-[#e86b1c]" />
          <span>03 {"//"} KERNEL & DISTRIBUTED STACK</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[#f3e6d5]">
          Engineering Competencies & Tooling
        </h2>
        <p className="mt-2 text-sm text-[#b8aba0] max-w-2xl leading-relaxed">
          Specialized in systems engineering where latency is counted in microseconds and memory footprints are packed into cache lines without GC pauses.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {SKILL_CATEGORIES.map((cat) => {
          const Icon = categoryIcons[cat.code] || Terminal;
          return (
            <Spotlight
              key={cat.code}
              className="p-6 md:p-8 rounded-2xl bg-[#121822] border border-[#232e40] hover:border-[#e86b1c]/50 transition-all duration-300"
            >
              <div className="flex items-center justify-between pb-4 border-b border-[#1f2a3a]">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#e86b1c]/15 text-[#e86b1c] border border-[#e86b1c]/30">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-mono text-sm font-bold text-[#f3e6d5]">
                      {cat.title}
                    </h3>
                  </div>
                </div>
                <span className="font-mono text-xs font-semibold text-[#7f756d]">
                  {cat.code}
                </span>
              </div>

              <div className="mt-5 space-y-3">
                {cat.skills.map((skill) => (
                  <div
                    key={skill.name}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 p-2 rounded-lg bg-[#151d2a]/60 border border-[#212c3d] hover:border-[#e86b1c]/40 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-semibold text-white">
                        {skill.name}
                      </span>
                      {skill.highlight && (
                        <span className="flex h-1.5 w-1.5 rounded-full bg-[#e86b1c]" />
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {skill.note && (
                        <span className="text-[11px] font-mono text-[#7f756d]">
                          {skill.note}
                        </span>
                      )}
                      <span
                        className={`font-mono text-[9px] uppercase px-1.5 py-0.5 rounded ${
                          skill.level === "core"
                            ? "bg-[#e86b1c]/15 text-[#e86b1c] border border-[#e86b1c]/30"
                            : "bg-[#1f2838] text-[#b8aba0]"
                        }`}
                      >
                        {skill.level}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Spotlight>
          );
        })}
      </div>
    </section>
  );
};
