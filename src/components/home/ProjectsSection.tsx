"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { GithubIcon } from "@/components/ui/Icons";
import { PROJECTS } from "@/data/projects";
import { Spotlight } from "@/components/ui/Spotlight";
import { TechBadge } from "@/components/ui/TechBadge";
import { cn } from "@/lib/utils";

export const ProjectsSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const categories = [
    { id: "all", label: "All Systems", count: PROJECTS.length },
    { id: "distributed", label: "Distributed & Low-Latency", count: PROJECTS.filter(p => p.category === "distributed").length },
    { id: "search", label: "Search & Inverted Index", count: PROJECTS.filter(p => p.category === "search").length },
    { id: "realtime", label: "Realtime Fabrics", count: PROJECTS.filter(p => p.category === "realtime").length },
  ];

  const filteredProjects = activeCategory === "all"
    ? PROJECTS
    : PROJECTS.filter((p) => p.category === activeCategory);

  return (
    <section id="projects" className="relative py-24 scroll-mt-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <div className="flex items-center gap-3 font-mono text-xs text-[#e86b1c] tracking-widest uppercase mb-2">
            <span className="flex h-2 w-2 rounded-full bg-[#e86b1c]" />
            <span>02 // FEATURED SYSTEMS</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[#f3e6d5]">
            Featured Architecture Case Studies
          </h2>
          <p className="mt-2 text-sm text-[#b8aba0] max-w-xl">
            Click any project card to inspect deep architectural hops, benchmark deltas against standard baselines, chaos test suites, and core engine code.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                "px-3.5 py-1.5 rounded-full font-mono text-xs transition-all duration-200 cursor-pointer",
                activeCategory === cat.id
                  ? "bg-[#e86b1c] text-white shadow-md shadow-[#e86b1c]/30 font-semibold"
                  : "bg-[#141b26] text-[#b8aba0] border border-[#232e40] hover:text-[#f3e6d5] hover:border-[#e86b1c]/40"
              )}
            >
              {cat.label} <span className="opacity-60 text-[10px]">({cat.count})</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {filteredProjects.map((project, index) => {
          const isFlagship = project.id === "instaride";
          const colSpan = isFlagship ? "lg:col-span-12" : "lg:col-span-6";

          return (
            <Spotlight
              key={project.id}
              className={cn(
                "group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-[#121822] border border-[#232e40] p-6 md:p-8 transition-all duration-300 hover:border-[#e86b1c]/60",
                colSpan
              )}
            >
              <div>
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#e86b1c]">
                      SYS-0{index + 1} //
                    </span>
                    <TechBadge variant="status" size="sm">
                      {project.statusBadge}
                    </TechBadge>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg bg-[#18212e] text-[#b8aba0] hover:text-white hover:border-[#e86b1c] transition-colors border border-[#232e40]"
                      title="Inspect GitHub Repository"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <GithubIcon className="h-4 w-4" />
                    </a>
                  </div>
                </div>

                <Link href={`/projects/${project.slug}`} className="block group-hover:text-[#e86b1c] transition-colors">
                  <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#f3e6d5] group-hover:text-[#e86b1c] transition-colors flex items-center gap-2">
                    <span>{project.title}</span>
                    <ArrowRight className="h-5 w-5 transform opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-[#e86b1c]" />
                  </h3>
                </Link>

                <p className="mt-1 font-mono text-xs text-[#e86b1c]">
                  {project.tagline}
                </p>

                <p className="mt-4 text-xs md:text-sm text-[#b8aba0] leading-relaxed line-clamp-3">
                  {project.summary}
                </p>

                {isFlagship ? (
                  <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 border-y border-[#1e293b] py-4">
                    <div>
                      <div className="text-[10px] font-mono text-[#7f756d] uppercase">Ingestion</div>
                      <div className="text-xl font-bold font-mono text-white">3.88M <span className="text-xs text-[#e86b1c]">ops/s</span></div>
                    </div>
                    <div>
                      <div className="text-[10px] font-mono text-[#7f756d] uppercase">p99 Latency</div>
                      <div className="text-xl font-bold font-mono text-white">16.5 <span className="text-xs text-[#e86b1c]">µs</span></div>
                    </div>
                    <div>
                      <div className="text-[10px] font-mono text-[#7f756d] uppercase">Atomic Locks</div>
                      <div className="text-xl font-bold font-mono text-white">71.9k <span className="text-xs text-[#e86b1c]">locks/s</span></div>
                    </div>
                    <div>
                      <div className="text-[10px] font-mono text-[#7f756d] uppercase">Race Collision</div>
                      <div className="text-xl font-bold font-mono text-emerald-400">0.000%</div>
                    </div>
                  </div>
                ) : (
                  <div className="mt-6 flex flex-wrap gap-4 border-t border-[#1e293b] pt-4">
                    {project.benchmarks.slice(0, 2).map((bm, i) => (
                      <div key={i} className="font-mono">
                        <span className="text-[10px] text-[#7f756d] block uppercase">{bm.metric}</span>
                        <span className="text-sm font-bold text-white">{bm.customEngine}</span>
                        <span className="text-[10px] text-emerald-400 ml-1.5 font-semibold">({bm.delta})</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-[#1e293b] flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap gap-1.5">
                  {project.tags.map((tag) => (
                    <TechBadge key={tag} variant="default" size="sm">
                      {tag}
                    </TechBadge>
                  ))}
                </div>

                <Link
                  href={`/projects/${project.slug}`}
                  className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-[#e86b1c] hover:text-white transition-colors"
                >
                  <span>Explore Case Study</span>
                  <ArrowRight className="h-3.5 w-3.5 transform group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </Spotlight>
          );
        })}
      </div>
    </section>
  );
};
