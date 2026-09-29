import React from "react";
import Link from "next/link";
import { Terminal, Mail, FileText, ArrowUpRight, Cpu } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/Icons";
import { PERSONAL_INFO, SOCIAL_LINKS } from "@/data/socialLinks";
import { PROJECTS } from "@/data/projects";

export const Footer: React.FC = () => {
  return (
    <footer className="relative mt-28 border-t border-[#232e40] bg-[#0b0f15]/95 text-[#b8aba0] font-mono text-xs">
      <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-[#e86b1c]/80 to-transparent" />

      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2 text-[#f3e6d5] font-bold text-sm">
              <Cpu className="h-4 w-4 text-[#e86b1c]" />
              <span>SOUMABRATA GHOSH</span>
            </div>
            <p className="text-[11px] leading-relaxed text-[#7f756d]">
              Building high-throughput kernels, spatial partitioning trees, lock-free concurrency engines, and distributed streaming fabrics.
            </p>
            <div className="inline-flex items-center gap-2 rounded-md bg-[#121822] border border-[#232e40] px-2.5 py-1 text-[10px] text-[#e86b1c]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#e86b1c] animate-pulse" />
              <span>LOC: 48,200+ // ZERO SEGV</span>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#f3e6d5]">
              Systems Architecture
            </h4>
            <ul className="space-y-2 text-[11px]">
              {PROJECTS.map((proj) => (
                <li key={proj.id}>
                  <Link
                    href={`/projects/${proj.slug}`}
                    className="hover:text-[#e86b1c] transition-colors flex items-center justify-between group"
                  >
                    <span>{proj.title}</span>
                    <span className="text-[9px] text-[#7f756d] group-hover:text-[#e86b1c]">
                      {proj.tags[0]}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#f3e6d5]">
              Platform & Tools
            </h4>
            <ul className="space-y-2 text-[11px]">
              <li>
                <Link href="/write" className="hover:text-[#e86b1c] transition-colors flex items-center gap-1.5">
                  <span>Authoring Studio (/write)</span>
                  <span className="rounded bg-[#e86b1c]/15 px-1 py-0.2 text-[9px] text-[#e86b1c]">NEW</span>
                </Link>
              </li>
              <li>
                <a href="#benchmarks" className="hover:text-[#e86b1c] transition-colors">
                  Hardware Receipts (3.88M ops/s)
                </a>
              </li>
              <li>
                <a href="#skills" className="hover:text-[#e86b1c] transition-colors">
                  Kernel & Distributed Stack
                </a>
              </li>
              <li>
                <a
                  href={PERSONAL_INFO.resumePath}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#e86b1c] transition-colors flex items-center gap-1"
                >
                  <span>Curriculum Vitae (PDF)</span>
                  <ArrowUpRight className="h-3 w-3" />
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#f3e6d5]">
              Terminal Inspection
            </h4>
            <div className="rounded-lg bg-[#121822] border border-[#232e40] p-3 text-[11px]">
              <div className="text-[#7f756d] mb-1"># Run interactive CLI:</div>
              <div className="text-[#e86b1c] font-semibold flex items-center gap-1.5">
                <Terminal className="h-3.5 w-3.5" />
                <span>$ {PERSONAL_INFO.npxCommand}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              {SOCIAL_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#141b26] border border-[#232e40] text-[#b8aba0] hover:text-[#e86b1c] hover:border-[#e86b1c]/40 transition-all"
                  title={link.label}
                >
                  {link.icon === "github" && <GithubIcon className="h-3.5 w-3.5" />}
                  {link.icon === "linkedin" && <LinkedinIcon className="h-3.5 w-3.5" />}
                  {link.icon === "mail" && <Mail className="h-3.5 w-3.5" />}
                  {link.icon === "file-text" && <FileText className="h-3.5 w-3.5" />}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-[#1a2332] flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] text-[#7f756d]">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              STATUS: ALL SYSTEMS NOMINAL
            </span>
            <span>•</span>
            <span>COMMIT: a7f8e42</span>
            <span>•</span>
            <span>HOST: VERCEL EDGE RUNTIME</span>
          </div>
          <div>
            © {new Date().getFullYear()} Soumabrata Ghosh. Engineered with Next.js 15, C++20 spirit & Tailwind CSS.
          </div>
        </div>
      </div>
    </footer>
  );
};
