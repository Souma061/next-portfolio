import React from "react";
import Link from "next/link";
import { ArrowRight, Cpu } from "lucide-react";
import { PROJECTS } from "@/data/projects";
import { TechBadge } from "@/components/ui/TechBadge";

export default function ProjectsIndexPage() {
  return (
    <div className="relative pt-32 pb-24">
      <div className="pointer-events-none absolute top-20 left-1/2 -translate-x-1/2 h-80 w-[600px] rounded-full bg-[#e86b1c]/10 blur-3xl" />

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 relative z-10">
        <header className="mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#1e2838] border border-[#232e40] px-3.5 py-1 text-xs font-mono text-[#e86b1c]">
            <Cpu className="h-3.5 w-3.5" />
            <span>SYSTEMS ARCHITECTURE // {PROJECTS.length} ENGINES</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#f3e6d5] leading-tight">
            Distributed Systems
          </h1>
          <p className="text-sm text-[#b8aba0] leading-relaxed max-w-2xl">
            Every engine below ships with measured benchmarks and a chaos suite. Open
            one for the architecture, the numbers, and the source.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {PROJECTS.map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.slug}`}
              className="group flex flex-col rounded-2xl bg-[#121822] border border-[#232e40] p-6 hover:border-[#e86b1c]/50 transition-colors"
            >
              <span className="self-start rounded-md bg-[#e86b1c]/15 border border-[#e86b1c]/40 px-2 py-0.5 font-mono text-[9px] text-[#e86b1c]">
                {project.statusBadge}
              </span>

              <h2 className="mt-4 text-xl font-bold text-[#f3e6d5] group-hover:text-[#e86b1c] transition-colors">
                {project.title}
              </h2>
              <p className="mt-1 font-mono text-[11px] text-[#7f756d]">
                {project.tagline}
              </p>

              <p className="mt-4 text-sm text-[#b8aba0] leading-relaxed flex-1">
                {project.summary}
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {project.tags.slice(0, 4).map((tag) => (
                  <TechBadge key={tag} variant="amber" size="sm">
                    {tag}
                  </TechBadge>
                ))}
              </div>

              <span className="mt-5 inline-flex items-center gap-1 font-mono text-[11px] text-[#e86b1c]">
                Inspect Architecture
                <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
