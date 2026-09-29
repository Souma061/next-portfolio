import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ExternalLink, ShieldCheck, Zap, Cpu, Activity, CheckCircle, Terminal, Layers } from "lucide-react";
import { GithubIcon } from "@/components/ui/Icons";
import { PROJECTS } from "@/data/projects";
import { TechBadge } from "@/components/ui/TechBadge";

interface ProjectPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return PROJECTS.map((p) => ({
    slug: p.slug,
  }));
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = PROJECTS.find((p) => p.slug === slug);

  if (!project) {
    notFound();
  }

  const currentIndex = PROJECTS.findIndex((p) => p.slug === slug);
  const prevProject = currentIndex > 0 ? PROJECTS[currentIndex - 1] : null;
  const nextProject = currentIndex < PROJECTS.length - 1 ? PROJECTS[currentIndex + 1] : null;

  return (
    <div className="relative pt-32 pb-24">
      <div className="pointer-events-none absolute top-20 left-1/2 -translate-x-1/2 h-80 w-[600px] rounded-full bg-[#e86b1c]/10 blur-3xl" />

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-8">
          <Link
            href="/#projects"
            className="inline-flex items-center gap-2 font-mono text-xs text-[#b8aba0] hover:text-[#e86b1c] transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>RETURN TO SYSTEMS DIRECTORY</span>
          </Link>
        </div>

        <div className="space-y-4 border-b border-[#232e40] pb-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-bold text-[#e86b1c]">
                SYS-0{currentIndex + 1} // CASE STUDY
              </span>
              <TechBadge variant="status" size="sm">
                {project.statusBadge}
              </TechBadge>
            </div>

            <div className="flex items-center gap-3">
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[#18212e] px-4 py-2 font-mono text-xs font-medium text-[#f3e6d5] border border-[#232e40] hover:border-[#e86b1c] hover:text-[#e86b1c] transition-all"
              >
                <GithubIcon className="h-4 w-4" />
                <span>GitHub Repository</span>
              </a>

              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-[#e86b1c] px-4 py-2 font-mono text-xs font-semibold text-white shadow-md shadow-[#e86b1c]/25 hover:bg-[#b84a0f] transition-all"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>Live System</span>
                </a>
              )}
            </div>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[#f3e6d5]">
            {project.title}
          </h1>

          <p className="text-base sm:text-lg font-mono text-[#e86b1c]">
            {project.tagline}
          </p>

          <div className="flex flex-wrap gap-2 pt-2">
            {project.tags.map((tag) => (
              <TechBadge key={tag} variant="amber" size="md">
                {tag}
              </TechBadge>
            ))}
          </div>
        </div>

        <div className="py-12 grid grid-cols-1 md:grid-cols-2 gap-8 border-b border-[#232e40]">
          <div className="space-y-3">
            <div className="font-mono text-xs font-bold text-[#e86b1c] uppercase tracking-wider">
              01 // Architectural Thesis
            </div>
            <p className="text-sm sm:text-base text-[#f3e6d5] leading-relaxed">
              {project.summary}
            </p>
          </div>

          <div className="space-y-3 rounded-2xl bg-[#121822] border border-[#232e40] p-6">
            <div className="font-mono text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
              <Activity className="h-4 w-4 text-[#e86b1c]" />
              <span>Contention & Failure Mode</span>
            </div>
            <p className="text-xs sm:text-sm text-[#b8aba0] leading-relaxed">
              {project.problemStatement}
            </p>
          </div>
        </div>

        <div className="py-14 border-b border-[#232e40]">
          <div className="mb-8">
            <div className="font-mono text-xs text-[#e86b1c] uppercase tracking-widest mb-1">
              02 // PIPELINE DATAFLOW
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#f3e6d5]">
              End-to-End Execution Sequence
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {project.architectureHops.map((hop) => (
              <div
                key={hop.step}
                className="relative rounded-xl bg-[#121822] border border-[#232e40] p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-xs font-black text-[#e86b1c]">
                      HOP {hop.step}
                    </span>
                    {hop.badge && (
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#1c2635] text-[#b8aba0] border border-[#283548]">
                        {hop.badge}
                      </span>
                    )}
                  </div>
                  <h3 className="font-mono text-sm font-bold text-[#f3e6d5] mb-2">
                    {hop.title}
                  </h3>
                  <p className="text-xs text-[#b8aba0] leading-relaxed">
                    {hop.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-[#1c2635] font-mono text-[11px] text-[#e86b1c] font-semibold">
                  {hop.latencyOrThroughput}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="py-14 border-b border-[#232e40]">
          <div className="mb-8">
            <div className="font-mono text-xs text-[#e86b1c] uppercase tracking-widest mb-1">
              03 // HARDWARE RECEIPTS
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#f3e6d5]">
              Benchmark Versus Naive & Standard Alternatives
            </h2>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-[#232e40] bg-[#10151f]">
            <table className="w-full text-left font-mono text-xs">
              <thead className="border-b border-[#232e40] bg-[#141b26] text-[#b8aba0] uppercase text-[11px]">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">Performance Metric</th>
                  <th className="py-3.5 px-4 font-semibold text-[#e86b1c]">Custom Engine</th>
                  <th className="py-3.5 px-4 font-semibold">Naive Baseline</th>
                  <th className="py-3.5 px-4 font-semibold">Standard Alternative</th>
                  <th className="py-3.5 px-4 font-semibold text-emerald-400">Delta / Gain</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e2838]">
                {project.benchmarks.map((bm, idx) => (
                  <tr key={idx} className="hover:bg-[#161e2b]/50 transition-colors">
                    <td className="py-3 px-4 font-medium text-white">{bm.metric}</td>
                    <td className="py-3 px-4 font-bold text-[#e86b1c] bg-[#e86b1c]/5">
                      {bm.customEngine}
                    </td>
                    <td className="py-3 px-4 text-[#7f756d]">{bm.naiveBaseline}</td>
                    <td className="py-3 px-4 text-[#b8aba0]">{bm.industryAlternative || "N/A"}</td>
                    <td className="py-3 px-4 font-bold text-emerald-400">{bm.delta}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="py-14 border-b border-[#232e40]">
          <div className="mb-8">
            <div className="font-mono text-xs text-[#e86b1c] uppercase tracking-widest mb-1">
              04 // ADVERSARIAL STRESS TESTING
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#f3e6d5]">
              Chaos Injection Scenarios
            </h2>
          </div>

          <div className="space-y-4">
            {project.chaosScenarios.map((scenario, idx) => (
              <div
                key={idx}
                className="rounded-xl bg-[#121822] border border-[#232e40] p-5 hover:border-[#e86b1c]/40 transition-colors"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-400" />
                    <span className="font-mono text-sm font-bold text-[#f3e6d5]">
                      {scenario.name}
                    </span>
                  </div>
                  <span className="font-mono text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 font-semibold">
                    {scenario.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="font-mono text-[10px] text-[#7f756d] uppercase block mb-1">
                      Adversarial Attack
                    </span>
                    <p className="text-[#b8aba0]">{scenario.adversarialAttack}</p>
                  </div>
                  <div>
                    <span className="font-mono text-[10px] text-[#7f756d] uppercase block mb-1">
                      Mitigation Strategy
                    </span>
                    <p className="text-[#f3e6d5]">{scenario.mitigation}</p>
                  </div>
                  <div>
                    <span className="font-mono text-[10px] text-[#7f756d] uppercase block mb-1">
                      Verification Result
                    </span>
                    <p className="text-emerald-400 font-mono">{scenario.result}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="py-14 border-b border-[#232e40]">
          <div className="mb-8">
            <div className="font-mono text-xs text-[#e86b1c] uppercase tracking-widest mb-1">
              05 // SOURCE CODE SNIPPET
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#f3e6d5]">
              Core Algorithm Implementation
            </h2>
          </div>

          <div className="space-y-6">
            {project.codeSnippets.map((snippet, idx) => (
              <div
                key={idx}
                className="overflow-hidden rounded-2xl border border-[#232e40] bg-[#0c1017]"
              >
                <div className="flex items-center justify-between bg-[#141a24] px-4 py-2.5 border-b border-[#232e40] text-xs font-mono">
                  <div className="flex items-center gap-2 text-[#f3e6d5]">
                    <Terminal className="h-3.5 w-3.5 text-[#e86b1c]" />
                    <span className="font-semibold">{snippet.title}</span>
                  </div>
                  <span className="text-[10px] uppercase text-[#7f756d] bg-[#1a2332] px-2 py-0.5 rounded">
                    {snippet.language}
                  </span>
                </div>

                <pre className="p-4 text-xs font-mono text-[#f3e6d5] overflow-x-auto leading-relaxed">
                  <code>{snippet.code}</code>
                </pre>

                <div className="bg-[#10151f] p-4 border-t border-[#1e2838] text-xs text-[#b8aba0]">
                  <strong className="text-white font-mono">Rationale: </strong>
                  {snippet.description}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-12 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs">
          {prevProject ? (
            <Link
              href={`/projects/${prevProject.slug}`}
              className="flex items-center gap-2 text-[#b8aba0] hover:text-[#e86b1c] transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>PREV: {prevProject.title}</span>
            </Link>
          ) : (
            <div />
          )}

          {nextProject ? (
            <Link
              href={`/projects/${nextProject.slug}`}
              className="flex items-center gap-2 text-[#b8aba0] hover:text-[#e86b1c] transition-colors"
            >
              <span>NEXT: {nextProject.title}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          ) : (
            <div />
          )}
        </div>
      </div>
    </div>
  );
}
