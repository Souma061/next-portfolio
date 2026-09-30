import React from "react";
import { EXPERIENCE, ExperienceRole } from "@/data/experience";
import { Spotlight } from "@/components/ui/Spotlight";
import { TechBadge } from "@/components/ui/TechBadge";
import { Briefcase, ArrowUpRight, MapPin } from "lucide-react";

const RoleCard: React.FC<{ role: ExperienceRole }> = ({ role }) => (
  <Spotlight className="rounded-2xl bg-[#121822] border border-[#232e40] hover:border-[#e86b1c]/50 transition-all duration-300 overflow-hidden">
    <div className="p-6 md:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#e86b1c]/15 text-[#e86b1c] border border-[#e86b1c]/30">
            <Briefcase className="h-5 w-5" />
          </div>
          <div>
            <a
              href={role.companyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-1.5 font-mono text-lg font-bold text-[#f3e6d5] hover:text-[#e86b1c] transition-colors"
            >
              {role.company}
              <ArrowUpRight className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
            </a>
            <p className="mt-0.5 text-sm font-semibold text-[#b8aba0]">{role.role}</p>
          </div>
        </div>

        <div className="text-right font-mono text-xs">
          <div className="font-semibold text-[#f3e6d5]">
            {role.start} — {role.end ?? "Present"}
          </div>
          <div className="mt-1 flex items-center justify-end gap-1.5 text-[#7f756d]">
            <MapPin className="h-3 w-3" />
            <span>{role.location}</span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2 font-mono text-[10px] uppercase">
        <span className="rounded border border-emerald-500/30 bg-emerald-950/30 px-2 py-0.5 text-emerald-400">
          {role.employmentType}
        </span>
      </div>

      <p className="mt-5 text-sm leading-relaxed text-[#b8aba0]">{role.summary}</p>

      {role.properties.length ? (
        <div className="mt-5">
          <p className="mb-2 font-mono text-[10px] uppercase tracking-wider text-[#7f756d]">
            Properties worked on
          </p>
          <div className="flex flex-wrap gap-2">
            {role.properties.map((prop) => {
              const inner = (
                <span className="rounded-lg border border-[#232e40] bg-[#151d2a]/60 px-2.5 py-1 font-mono text-[11px] text-[#b8aba0]">
                  {prop.name}
                </span>
              );
              return prop.url ? (
                <a
                  key={prop.name}
                  href={prop.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:border-[#e86b1c]/50 hover:text-[#e86b1c]"
                >
                  {inner}
                </a>
              ) : (
                <span key={prop.name}>{inner}</span>
              );
            })}
          </div>
        </div>
      ) : null}

      <ul className="mt-6 space-y-4 border-t border-[#1f2a3a] pt-6">
        {role.highlights.map((h) => (
          <li key={h.title} className="flex gap-3">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#e86b1c]" />
            <div>
              <p className="font-mono text-xs font-bold text-[#f3e6d5]">{h.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-[#b8aba0]">{h.detail}</p>
            </div>
          </li>
        ))}
      </ul>

      {role.stack.length ? (
        <div className="mt-6 flex flex-wrap gap-2 border-t border-[#1f2a3a] pt-6">
          {role.stack.map((tech) => (
            <TechBadge key={tech} variant="amber" size="sm">
              {tech}
            </TechBadge>
          ))}
        </div>
      ) : null}
    </div>
  </Spotlight>
);

export const ExperienceSection: React.FC = () => (
  <section id="experience" className="relative scroll-mt-24 py-24">
    <div className="mb-12">
      <div className="mb-2 flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-[#e86b1c]">
        <span className="flex h-2 w-2 rounded-full bg-[#e86b1c]" />
        <span>01 // WHERE I&apos;VE WORKED</span>
      </div>
      <h2 className="text-3xl font-extrabold tracking-tight text-[#f3e6d5] md:text-4xl">
        Professional Experience
      </h2>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#b8aba0]">
        Production work on a live platform, not only personal repositories.
      </p>
    </div>

    <div className="space-y-6">
      {EXPERIENCE.map((role) => (
        <RoleCard key={`${role.company}-${role.start}`} role={role} />
      ))}
    </div>
  </section>
);
