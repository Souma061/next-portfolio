const fs = require('fs');
const path = require('path');

function ensureDir(filePath) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function write(relPath, content) {
  const fullPath = path.join(__dirname, '..', relPath);
  ensureDir(fullPath);
  fs.writeFileSync(fullPath, content.trim() + '\n', 'utf8');
  console.log(`Wrote ${relPath} (${fs.statSync(fullPath).size} bytes)`);
}

// 1. src/components/ui/Icons.tsx
write('src/components/ui/Icons.tsx', `
import React from "react";

export const GithubIcon: React.FC<{ className?: string }> = ({ className = "h-4 w-4" }) => (
  <svg
    role="img"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export const LinkedinIcon: React.FC<{ className?: string }> = ({ className = "h-4 w-4" }) => (
  <svg
    role="img"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);
`);

// 2. src/components/ui/TechBadge.tsx
write('src/components/ui/TechBadge.tsx', `
import React from "react";
import { cn } from "@/lib/utils";

interface TechBadgeProps {
  children: React.ReactNode;
  variant?: "default" | "amber" | "outline" | "ghost" | "status";
  size?: "sm" | "md";
  className?: string;
}

export const TechBadge: React.FC<TechBadgeProps> = ({
  children,
  variant = "default",
  size = "sm",
  className,
}) => {
  const baseClasses =
    "inline-flex items-center gap-1.5 font-mono tracking-tight transition-all duration-200";

  const sizeClasses = {
    sm: "px-2 py-0.5 text-[11px] rounded-md",
    md: "px-3 py-1 text-xs rounded-lg",
  };

  const variantClasses = {
    default:
      "bg-[#141b26] text-[#b8aba0] border border-[#232e40] hover:border-[#e86b1c]/50 hover:text-[#f3e6d5]",
    amber:
      "bg-[#e86b1c]/10 text-[#e86b1c] border border-[#e86b1c]/30 shadow-xs shadow-[#e86b1c]/10",
    outline:
      "bg-transparent text-[#b8aba0] border border-[#232e40] hover:border-zinc-500",
    ghost: "bg-transparent text-[#7f756d] hover:text-[#f3e6d5]",
    status:
      "bg-emerald-950/40 text-emerald-400 border border-emerald-500/30",
  };

  return (
    <span
      className={cn(
        baseClasses,
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  );
};
`);

// 3. src/components/ui/Spotlight.tsx
write('src/components/ui/Spotlight.tsx', `
"use client";

import React, { useRef } from "react";
import { cn } from "@/lib/utils";

interface SpotlightProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export const Spotlight: React.FC<SpotlightProps> = ({
  children,
  className,
  ...props
}) => {
  const divRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    divRef.current.style.setProperty("--mouse-x", \`\${x}px\`);
    divRef.current.style.setProperty("--mouse-y", \`\${y}px\`);
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      className={cn("spotlight-card rounded-xl transition-all duration-300", className)}
      {...props}
    >
      {children}
    </div>
  );
};
`);

// 4. src/components/ui/Sparkline.tsx
write('src/components/ui/Sparkline.tsx', `
"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  className?: string;
}

export const Sparkline: React.FC<SparklineProps> = ({
  data,
  width = 120,
  height = 36,
  color = "#e86b1c",
  className,
}) => {
  if (!data || data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const padding = 2;
  const usableWidth = width - padding * 2;
  const usableHeight = height - padding * 2;

  const points = data.map((val, idx) => {
    const x = padding + (idx / (data.length - 1)) * usableWidth;
    const y = height - padding - ((val - min) / range) * usableHeight;
    return \`\${x.toFixed(1)},\${y.toFixed(1)}\`;
  });

  const pathD = \`M \${points.join(" L ")}\`;
  const areaD = \`\${pathD} L \${width - padding},\${height} L \${padding},\${height} Z\`;

  return (
    <div className={cn("inline-flex items-center", className)}>
      <svg
        width={width}
        height={height}
        viewBox={\`0 0 \${width} \${height}\`}
        className="overflow-visible"
      >
        <path d={areaD} fill={color} fillOpacity="0.15" />
        <path
          d={pathD}
          fill="none"
          stroke={color}
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};
`);

// 5. src/components/ui/SlideToOpenCTA.tsx
write('src/components/ui/SlideToOpenCTA.tsx', `
"use client";

import React, { useState } from "react";
import { Terminal, Check, ArrowRight, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

interface SlideToOpenCTAProps {
  command?: string;
  className?: string;
}

export const SlideToOpenCTA: React.FC<SlideToOpenCTAProps> = ({
  command = "npx soumabrata",
  className,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2800);
  };

  return (
    <div
      onClick={handleCopy}
      className={cn(
        "group relative flex items-center justify-between cursor-pointer select-none",
        "h-13 w-full max-w-md rounded-full px-2 py-1.5",
        "bg-[#101621] border border-[#232e40] hover:border-[#e86b1c]/60 shadow-lg shadow-black/40",
        "transition-all duration-300",
        className
      )}
      title="Click to copy CLI command"
    >
      <div className={cn(
        "relative z-10 flex h-9.5 w-9.5 items-center justify-center rounded-full text-white shadow-md transition-colors",
        copied ? "bg-emerald-600 shadow-emerald-500/30" : "bg-gradient-to-br from-[#e86b1c] to-[#b84a0f] shadow-[#e86b1c]/30 group-hover:scale-105"
      )}>
        {copied ? <Check className="h-4.5 w-4.5" /> : <Terminal className="h-4.5 w-4.5" />}
      </div>

      <div className="relative z-10 flex-1 px-3 text-left">
        <div className="flex items-center gap-2 font-mono text-xs md:text-sm">
          <span className="text-[#e86b1c] font-bold select-none">$</span>
          <span className="font-semibold tracking-wide text-[#f3e6d5] group-hover:text-white transition-colors">
            {command}
          </span>
        </div>
        <p className="font-mono text-[10px] text-[#7f756d] uppercase tracking-wider">
          {copied ? "Copied to clipboard!" : "Click to copy terminal portfolio"}
        </p>
      </div>

      <div className="relative z-10 pr-2">
        {copied ? (
          <span className="rounded-full bg-emerald-950/80 border border-emerald-500/40 px-2.5 py-0.5 font-mono text-[10px] font-semibold text-emerald-400">
            COPIED
          </span>
        ) : (
          <div className="flex items-center gap-1 text-[#7f756d] group-hover:text-[#e86b1c] transition-colors">
            <Copy className="h-3.5 w-3.5" />
            <ArrowRight className="h-3.5 w-3.5 transform group-hover:translate-x-1 transition-transform" />
          </div>
        )}
      </div>
    </div>
  );
};
`);

// 6. src/components/layout/SiteHeader.tsx
write('src/components/layout/SiteHeader.tsx', `
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Terminal, FileText, PenTool, ExternalLink, Cpu } from "lucide-react";
import { GithubIcon } from "@/components/ui/Icons";
import { PERSONAL_INFO } from "@/data/socialLinks";
import { cn } from "@/lib/utils";

export const SiteHeader: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollProgress((window.scrollY / totalScroll) * 100);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Systems", href: "/#projects" },
    { label: "Hardware Receipts", href: "/#benchmarks" },
    { label: "Stack", href: "/#skills" },
    { label: "Studio", href: "/write", highlight: true, icon: PenTool },
  ];

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 h-[3px] bg-transparent">
        <div
          className="h-full bg-gradient-to-r from-[#b84a0f] via-[#e86b1c] to-amber-300 shadow-[0_0_12px_#e86b1c] transition-all duration-75"
          style={{ width: \`\${scrollProgress}%\` }}
        />
      </div>

      <header className="fixed top-5 left-0 right-0 z-40 mx-auto w-[92%] max-w-5xl">
        <div className="flex items-center justify-between rounded-full bg-[#10151f]/85 px-4 py-2.5 backdrop-blur-xl border border-[#232e40] shadow-2xl shadow-black/60 transition-all duration-300 hover:border-[#e86b1c]/40">
          <Link
            href="/"
            className="group flex items-center gap-2.5 font-mono text-sm tracking-tight text-[#f3e6d5]"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#e86b1c]/15 border border-[#e86b1c]/40 text-[#e86b1c] group-hover:scale-105 transition-transform">
              <Cpu className="h-4 w-4" />
            </div>
            <span className="font-bold tracking-wider group-hover:text-white transition-colors">
              SOUMA<span className="text-[#e86b1c]">.</span>DEV
            </span>
            <span className="hidden md:inline-block rounded-md bg-[#161e2b] px-2 py-0.5 text-[10px] text-[#7f756d] border border-[#232e40]">
              C++20 // DISTRIBUTED
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1 text-xs font-mono">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-200",
                    isActive
                      ? "bg-[#e86b1c]/15 text-[#e86b1c] border border-[#e86b1c]/40"
                      : link.highlight
                      ? "text-[#e86b1c] hover:bg-[#e86b1c]/10"
                      : "text-[#b8aba0] hover:text-[#f3e6d5] hover:bg-[#161e2b]"
                  )}
                >
                  {Icon && <Icon className="h-3 w-3" />}
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 rounded-full bg-emerald-950/40 border border-emerald-500/30 px-2.5 py-1 font-mono text-[10px] text-emerald-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="hidden lg:inline">{PERSONAL_INFO.statusMessage}</span>
              <span className="lg:hidden">ACTIVE</span>
            </div>

            <a
              href={PERSONAL_INFO.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-[#161e2b] border border-[#232e40] text-[#b8aba0] hover:text-white hover:border-[#e86b1c] transition-all"
              title="GitHub Profile"
            >
              <GithubIcon className="h-3.5 w-3.5" />
            </a>

            <a
              href={PERSONAL_INFO.resumePath}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 rounded-full bg-[#e86b1c] px-3.5 py-1.5 font-mono text-xs font-semibold text-white shadow-md shadow-[#e86b1c]/25 hover:bg-[#b84a0f] transition-all"
            >
              <FileText className="h-3 w-3" />
              <span>Resume</span>
            </a>
          </div>
        </div>
      </header>
    </>
  );
};
`);

// 7. src/components/layout/Footer.tsx
write('src/components/layout/Footer.tsx', `
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
                    href={\`/projects/\${proj.slug}\`}
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
`);

// 8. src/components/home/HeroLogoMarquee.tsx
write('src/components/home/HeroLogoMarquee.tsx', `
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
`);

// 9. src/components/home/HeroSection.tsx
write('src/components/home/HeroSection.tsx', `
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
`);

// 10. src/components/home/HardwareReceiptsSection.tsx
write('src/components/home/HardwareReceiptsSection.tsx', `
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
`);

// 11. src/components/home/ProjectsSection.tsx
write('src/components/home/ProjectsSection.tsx', `
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
            <span>02 // PRODUCTION SYSTEMS</span>
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

                <Link href={\`/projects/\${project.slug}\`} className="block group-hover:text-[#e86b1c] transition-colors">
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
                  href={\`/projects/\${project.slug}\`}
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
`);

// 12. src/components/home/SkillsSection.tsx
write('src/components/home/SkillsSection.tsx', `
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
          <span>03 // KERNEL & DISTRIBUTED STACK</span>
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
                        className={\`font-mono text-[9px] uppercase px-1.5 py-0.5 rounded \${
                          skill.level === "core"
                            ? "bg-[#e86b1c]/15 text-[#e86b1c] border border-[#e86b1c]/30"
                            : "bg-[#1f2838] text-[#b8aba0]"
                        }\`}
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
`);

// 13. src/components/editor/TiptapEditor.tsx
write('src/components/editor/TiptapEditor.tsx', `
"use client";

import React, { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import LinkExtension from "@tiptap/extension-link";
import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Code,
  Quote,
  Download,
  Copy,
  Check,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";

const INITIAL_CONTENT = \`
<h2>Architectural Thesis: Zero-Heap Spatial Quadtrees in C++20</h2>
<p>Modern ride-hailing and spatial dispatch meshes frequently bottleneck on geographic lookups during peak demand spikes. When 100,000 drivers broadcast GPS coordinates concurrently, conventional point-in-polygon queries degrade rapidly.</p>

<h3>1. Struct-of-Arrays (SoA) Vectorization</h3>
<p>By restructuring coordinate memory into contiguous float arrays aligned to 64-byte cache lines, SIMD AVX-512 instructions can evaluate 16 spatial bounding boxes simultaneously with zero cache thrashing.</p>

<h3>2. Atomic Redis Lua State Machine</h3>
<p>Distributed concurrency locks fail under tail latency jitter. Moving lease validation directly into Redis via Lua scripts yields deterministic CAS (Compare-And-Swap) execution in 14 microseconds.</p>
\`;

export const TiptapEditor: React.FC = () => {
  const [title, setTitle] = useState("Designing Sub-Microsecond Spatial PR-Quadtrees in C++20");
  const [slug, setSlug] = useState("designing-sub-microsecond-spatial-quadtrees");
  const [tags, setTags] = useState("C++20, Redis Lua, AVX-512, Quadtree");
  const [savedStatus, setSavedStatus] = useState("SAVED LOCALLY");
  const [copiedMDX, setCopiedMDX] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Placeholder.configure({
        placeholder: "Write systems architecture documentation or technical post...",
      }),
      LinkExtension.configure({
        openOnClick: false,
      }),
    ],
    content: INITIAL_CONTENT,
    editorProps: {
      attributes: {
        class:
          "prose prose-invert max-w-none focus:outline-none min-h-[420px] font-sans text-sm md:text-base leading-relaxed text-[#f3e6d5]",
      },
    },
    onUpdate: () => {
      setSavedStatus("SAVING...");
      setTimeout(() => {
        setSavedStatus("SAVED LOCALLY");
      }, 600);
    },
  });

  const wordCount = editor?.getText().split(/\\s+/).filter(Boolean).length || 0;
  const readingTime = Math.ceil(wordCount / 200) || 1;

  const handleExportMarkdown = () => {
    if (!editor) return;
    const markdownContent = \`---
title: "\${title}"
slug: "\${slug}"
date: "\${new Date().toISOString().split("T")[0]}"
tags: [\${tags.split(",").map((t) => \`"\${t.trim()}"\`).join(", ")}]
readingTime: "\${readingTime} min read"
author: "Soumabrata Ghosh"
---

# \${title}

\${editor.getText()}
\`;

    const blob = new Blob([markdownContent], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = \`\${slug || "post"}.md\`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyMDX = () => {
    if (!editor) return;
    const markdownContent = \`---
title: "\${title}"
slug: "\${slug}"
tags: [\${tags.split(",").map((t) => \`"\${t.trim()}"\`).join(", ")}]
---

# \${title}

\${editor.getText()}
\`;
    navigator.clipboard.writeText(markdownContent);
    setCopiedMDX(true);
    setTimeout(() => setCopiedMDX(false), 2500);
  };

  if (!editor) {
    return (
      <div className="py-20 text-center font-mono text-sm text-[#7f756d]">
        INITIALIZING TIPTAP ENGINE...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-[#121822] border border-[#232e40] p-4 font-mono text-xs">
        <div className="flex items-center gap-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#e86b1c]/15 text-[#e86b1c] border border-[#e86b1c]/40">
            <FileText className="h-4 w-4" />
          </div>
          <div>
            <span className="font-bold text-[#f3e6d5]">TIPTAP STUDIO // </span>
            <span className="text-[#e86b1c] font-semibold">{savedStatus}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[#7f756d] hidden sm:inline">
            {wordCount} words • ~{readingTime} min read
          </span>

          <button
            onClick={handleCopyMDX}
            className="flex items-center gap-1.5 rounded-lg bg-[#18212e] px-3 py-1.5 text-[#f3e6d5] border border-[#232e40] hover:border-[#e86b1c] transition-colors"
          >
            {copiedMDX ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copiedMDX ? "Copied" : "Copy MDX"}</span>
          </button>

          <button
            onClick={handleExportMarkdown}
            className="flex items-center gap-1.5 rounded-lg bg-[#e86b1c] px-3 py-1.5 font-semibold text-white hover:bg-[#b84a0f] transition-colors shadow-sm shadow-[#e86b1c]/25"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export .md</span>
          </button>
        </div>
      </div>

      <div className="rounded-2xl bg-[#121822] border border-[#232e40] p-6 space-y-4">
        <div>
          <label className="block font-mono text-[10px] uppercase text-[#7f756d] mb-1">
            Article Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
            }}
            placeholder="Article Title..."
            className="w-full rounded-xl bg-[#0e141d] border border-[#232e40] px-4 py-2.5 text-lg font-bold text-[#f3e6d5] focus:border-[#e86b1c] focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
          <div>
            <label className="block text-[10px] uppercase text-[#7f756d] mb-1">
              URL Slug
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full rounded-lg bg-[#0e141d] border border-[#232e40] px-3 py-2 text-[#b8aba0] focus:border-[#e86b1c] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase text-[#7f756d] mb-1">
              Tags (comma separated)
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full rounded-lg bg-[#0e141d] border border-[#232e40] px-3 py-2 text-[#b8aba0] focus:border-[#e86b1c] focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div className="sticky top-20 z-20 flex flex-wrap items-center gap-1 rounded-xl bg-[#141b26]/95 border border-[#232e40] p-2 backdrop-blur-md">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={cn(
            "p-2 rounded-lg text-xs font-mono transition-colors",
            editor.isActive("bold")
              ? "bg-[#e86b1c] text-white"
              : "text-[#b8aba0] hover:bg-[#1f2838] hover:text-[#f3e6d5]"
          )}
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={cn(
            "p-2 rounded-lg text-xs font-mono transition-colors",
            editor.isActive("italic")
              ? "bg-[#e86b1c] text-white"
              : "text-[#b8aba0] hover:bg-[#1f2838] hover:text-[#f3e6d5]"
          )}
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </button>

        <div className="h-5 w-[1px] bg-[#283548] mx-1" />

        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={cn(
            "p-2 rounded-lg text-xs font-mono transition-colors",
            editor.isActive("heading", { level: 1 })
              ? "bg-[#e86b1c] text-white"
              : "text-[#b8aba0] hover:bg-[#1f2838] hover:text-[#f3e6d5]"
          )}
          title="Heading 1"
        >
          <Heading1 className="h-4 w-4" />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={cn(
            "p-2 rounded-lg text-xs font-mono transition-colors",
            editor.isActive("heading", { level: 2 })
              ? "bg-[#e86b1c] text-white"
              : "text-[#b8aba0] hover:bg-[#1f2838] hover:text-[#f3e6d5]"
          )}
          title="Heading 2"
        >
          <Heading2 className="h-4 w-4" />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={cn(
            "p-2 rounded-lg text-xs font-mono transition-colors",
            editor.isActive("heading", { level: 3 })
              ? "bg-[#e86b1c] text-white"
              : "text-[#b8aba0] hover:bg-[#1f2838] hover:text-[#f3e6d5]"
          )}
          title="Heading 3"
        >
          <Heading3 className="h-4 w-4" />
        </button>

        <div className="h-5 w-[1px] bg-[#283548] mx-1" />

        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={cn(
            "p-2 rounded-lg text-xs font-mono transition-colors",
            editor.isActive("bulletList")
              ? "bg-[#e86b1c] text-white"
              : "text-[#b8aba0] hover:bg-[#1f2838] hover:text-[#f3e6d5]"
          )}
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={cn(
            "p-2 rounded-lg text-xs font-mono transition-colors",
            editor.isActive("orderedList")
              ? "bg-[#e86b1c] text-white"
              : "text-[#b8aba0] hover:bg-[#1f2838] hover:text-[#f3e6d5]"
          )}
          title="Numbered List"
        >
          <ListOrdered className="h-4 w-4" />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={cn(
            "p-2 rounded-lg text-xs font-mono transition-colors",
            editor.isActive("codeBlock")
              ? "bg-[#e86b1c] text-white"
              : "text-[#b8aba0] hover:bg-[#1f2838] hover:text-[#f3e6d5]"
          )}
          title="Code Block"
        >
          <Code className="h-4 w-4" />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={cn(
            "p-2 rounded-lg text-xs font-mono transition-colors",
            editor.isActive("blockquote")
              ? "bg-[#e86b1c] text-white"
              : "text-[#b8aba0] hover:bg-[#1f2838] hover:text-[#f3e6d5]"
          )}
          title="Blockquote"
        >
          <Quote className="h-4 w-4" />
        </button>
      </div>

      <div className="rounded-2xl bg-[#0e141d] border border-[#232e40] p-6 md:p-8 min-h-[480px]">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};
`);

// 14. src/app/globals.css
write('src/app/globals.css', `
@import "tailwindcss";

@layer base {
  :root {
    --color-amber-primary: #e86b1c;
    --color-amber-shadow: #b84a0f;
    --color-amber-glow: rgba(232, 107, 28, 0.25);
    --color-amber-subtle: rgba(232, 107, 28, 0.08);

    --color-navy-void: #0b0f15;
    --color-navy-surface: #10151f;
    --color-navy-card: #161e2b;
    --color-navy-elevated: #1e2838;
    --color-navy-border: #283548;

    --color-cream-text: #f3e6d5;
    --color-cream-muted: #b8aba0;
    --color-cream-dim: #7f756d;
  }

  body {
    background-color: #0b0f15;
    color: #f3e6d5;
    overflow-x: hidden;
  }
}

.bg-starfield {
  background-color: #0b0f15;
  background-image: 
    radial-gradient(1.5px 1.5px at 40px 60px, rgba(243, 230, 213, 0.35), transparent),
    radial-gradient(1px 1px at 150px 120px, rgba(232, 107, 28, 0.5), transparent),
    radial-gradient(1.5px 1.5px at 280px 240px, rgba(243, 230, 213, 0.3), transparent),
    radial-gradient(1px 1px at 450px 90px, rgba(243, 230, 213, 0.25), transparent),
    radial-gradient(1.5px 1.5px at 600px 320px, rgba(232, 107, 28, 0.4), transparent),
    radial-gradient(1px 1px at 750px 180px, rgba(243, 230, 213, 0.3), transparent),
    radial-gradient(1.5px 1.5px at 900px 420px, rgba(243, 230, 213, 0.25), transparent),
    radial-gradient(1px 1px at 1100px 150px, rgba(232, 107, 28, 0.45), transparent),
    linear-gradient(rgba(24, 31, 44, 0.15) 1px, transparent 1px),
    linear-gradient(90deg, rgba(24, 31, 44, 0.15) 1px, transparent 1px);
  background-size: 1200px 600px, 1200px 600px, 1200px 600px, 1200px 600px, 1200px 600px, 1200px 600px, 1200px 600px, 1200px 600px, 48px 48px, 48px 48px;
}

.spotlight-card {
  position: relative;
  background-color: #121822;
  border: 1px solid #232e40;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.spotlight-card::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: radial-gradient(
    600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
    rgba(232, 107, 28, 0.08),
    transparent 50%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.spotlight-card:hover::before {
  opacity: 1;
}

.spotlight-card:hover {
  border-color: rgba(232, 107, 28, 0.45);
}

::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: #0b0f15;
}

::-webkit-scrollbar-thumb {
  background: #232e40;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #e86b1c;
}

@keyframes marquee {
  0% { transform: translateX(0%); }
  100% { transform: translateX(-50%); }
}

.animate-marquee {
  display: flex;
  width: max-content;
  animation: marquee 35s linear infinite;
}

.animate-marquee:hover {
  animation-play-state: paused;
}
`);

// 15. src/app/layout.tsx
write('src/app/layout.tsx', `
import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Soumabrata Ghosh // Systems & Distributed Infrastructure",
  description:
    "Editorial portfolio of Soumabrata Ghosh (Souma061). High-throughput C++20 kernels, PR-Quadtree spatial proximity, atomic Redis Lua distributed state, Apache Kafka event relays, and low-latency search engines.",
  keywords: [
    "Soumabrata Ghosh",
    "Systems Engineer",
    "C++20",
    "Distributed Systems",
    "Redis Lua",
    "Kafka",
    "PR-Quadtree"
  ],
  authors: [{ name: "Soumabrata Ghosh", url: "https://github.com/Souma061" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="min-h-screen bg-starfield text-[#f3e6d5] antialiased selection:bg-[#e86b1c]/30 selection:text-white">
        <SiteHeader />
        <main className="relative flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
`);

// 16. src/app/page.tsx
write('src/app/page.tsx', `
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
              <span>SYSTEMS ARCHITECT // OPEN FOR ENGAGEMENT</span>
            </div>

            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-[#f3e6d5]">
              Let's engineer infrastructure that does not fail under load.
            </h2>

            <p className="text-sm md:text-base text-[#b8aba0] leading-relaxed">
              Seeking systems engineering and distributed backend opportunities. Available for discussions on kernel-level optimization, high-throughput streaming, and low-latency database architectures.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4 font-mono text-xs">
              <a
                href={PERSONAL_INFO.email ? \`mailto:\${PERSONAL_INFO.email}\` : "#"}
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
`);

// 17. src/app/write/page.tsx
write('src/app/write/page.tsx', `
import React from "react";
import Link from "next/link";
import { ArrowLeft, PenTool } from "lucide-react";
import { TiptapEditor } from "@/components/editor/TiptapEditor";

export const metadata = {
  title: "Authoring Studio // Soumabrata Ghosh",
  description: "In-platform technical writing and MDX engineering studio.",
};

export default function WritePage() {
  return (
    <div className="relative pt-32 pb-24">
      <div className="pointer-events-none absolute top-20 left-1/2 -translate-x-1/2 h-72 w-[550px] rounded-full bg-[#e86b1c]/10 blur-3xl" />

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-mono text-xs text-[#b8aba0] hover:text-[#e86b1c] transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>RETURN TO PORTFOLIO</span>
          </Link>
        </div>

        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs font-mono text-[#e86b1c] uppercase tracking-wider mb-2">
            <PenTool className="h-3.5 w-3.5" />
            <span>AUTHORING STUDIO</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#f3e6d5]">
            Engineering Notebook & Draft Studio
          </h1>
          <p className="mt-2 text-sm text-[#b8aba0]">
            Author systems engineering articles, technical post-mortems, and architectural decision records. Supports live reading time calculation, formatted syntax, and direct MDX/Markdown export.
          </p>
        </div>

        <TiptapEditor />
      </div>
    </div>
  );
}
`);
