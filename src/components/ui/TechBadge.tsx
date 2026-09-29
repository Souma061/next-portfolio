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
