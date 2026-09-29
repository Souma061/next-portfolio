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
