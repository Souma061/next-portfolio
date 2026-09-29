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
          style={{ width: `${scrollProgress}%` }}
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
