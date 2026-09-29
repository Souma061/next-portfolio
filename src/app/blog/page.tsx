import React from "react";
import Link from "next/link";
import { ArrowRight, Clock, Calendar, Mail } from "lucide-react";
import { listPublishedPosts, Post } from "@/lib/posts";
import { estimateReadingTime } from "@/lib/richtext";
import { PERSONAL_INFO } from "@/data/socialLinks";
import { TechBadge } from "@/components/ui/TechBadge";

export const revalidate = 60;

const day = (iso: string | null) => (iso ? iso.slice(0, 10) : "");

export default async function BlogIndexPage() {
  let posts: Post[] = [];
  try {
    posts = await listPublishedPosts();
  } catch {
    posts = [];
  }

  return (
    <div className="relative pt-32 pb-24">
      <div className="pointer-events-none absolute top-20 left-1/2 -translate-x-1/2 h-80 w-[600px] rounded-full bg-[#e86b1c]/10 blur-3xl" />

      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 relative z-10">
        <header className="mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#1e2838] border border-[#232e40] px-3.5 py-1 text-xs font-mono text-[#e86b1c]">
            <span>TECHNICAL WRITING // {posts.length} ARTICLES</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#f3e6d5] leading-tight">
            Engineering Notes
          </h1>
          <p className="text-sm text-[#b8aba0] leading-relaxed max-w-2xl">
            Post-mortems and deep dives on spatial indexing, distributed concurrency,
            and the failure modes that only show up under load.
          </p>
        </header>

        <div className="space-y-5">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group block rounded-2xl bg-[#121822] border border-[#232e40] p-6 hover:border-[#e86b1c]/50 transition-colors"
            >
              <div className="flex flex-wrap items-center gap-4 text-[11px] font-mono text-[#7f756d] mb-3">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-[#e86b1c]" />
                  {day(post.publishedAt)}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <Clock className="h-3.5 w-3.5" />
                  {estimateReadingTime(post.content)} min read
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-[#f3e6d5] group-hover:text-[#e86b1c] transition-colors leading-snug">
                {post.title}
              </h2>

              <p className="mt-3 text-sm text-[#b8aba0] leading-relaxed">
                {post.excerpt}
              </p>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <TechBadge key={tag} variant="amber" size="sm">
                      {tag}
                    </TechBadge>
                  ))}
                </div>
                <span className="inline-flex items-center gap-1 font-mono text-[11px] text-[#e86b1c]">
                  Read
                  <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 rounded-2xl bg-[#121822] border border-[#232e40] p-6 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs">
          <p className="text-[11px] text-[#7f756d]">
            Have a topic you want broken down?
          </p>
          <a
            href={`mailto:${PERSONAL_INFO.email}`}
            className="inline-flex items-center gap-1.5 rounded-full bg-[#e86b1c] px-4 py-2 font-semibold text-white hover:bg-[#b84a0f] transition-all shrink-0"
          >
            <Mail className="h-3.5 w-3.5" />
            <span>Get in touch</span>
          </a>
        </div>
      </div>
    </div>
  );
}
