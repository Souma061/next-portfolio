import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, Calendar, User, ArrowRight } from "lucide-react";
import { BLOG_POSTS } from "@/data/blogPosts";
import { TechBadge } from "@/components/ui/TechBadge";

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="relative pt-32 pb-24">
      <div className="pointer-events-none absolute top-20 left-1/2 -translate-x-1/2 h-80 w-[600px] rounded-full bg-[#e86b1c]/10 blur-3xl" />

      <article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-8">
          <Link
            href="/write"
            className="inline-flex items-center gap-2 font-mono text-xs text-[#b8aba0] hover:text-[#e86b1c] transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>RETURN TO STUDIO / ARTICLES</span>
          </Link>
        </div>

        <header className="border-b border-[#232e40] pb-8 mb-10 space-y-4">
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <TechBadge key={tag} variant="amber" size="sm">
                {tag}
              </TechBadge>
            ))}
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#f3e6d5] leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[#7f756d] pt-2">
            <span className="flex items-center gap-1.5 text-[#b8aba0]">
              <User className="h-3.5 w-3.5 text-[#e86b1c]" />
              {post.author}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              {post.date}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5 text-emerald-400">
              <Clock className="h-3.5 w-3.5" />
              {post.readingTime}
            </span>
          </div>
        </header>

        <div className="prose prose-invert max-w-none font-sans text-[#f3e6d5] leading-relaxed space-y-6">
          <div className="p-4 rounded-xl bg-[#121822] border border-[#232e40] text-sm text-[#b8aba0] font-mono italic">
            {post.excerpt}
          </div>

          <div className="space-y-4 whitespace-pre-line text-sm sm:text-base leading-relaxed text-[#f3e6d5]">
            {post.content}
          </div>
        </div>

        <div className="mt-16 rounded-2xl bg-[#121822] border border-[#232e40] p-6 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs">
          <div>
            <div className="font-bold text-[#f3e6d5] text-sm">Soumabrata Ghosh</div>
            <p className="text-[11px] text-[#7f756d] mt-0.5">
              Systems engineer researching low-latency kernels and distributed message fabrics.
            </p>
          </div>
          <Link
            href="/write"
            className="inline-flex items-center gap-1.5 rounded-full bg-[#e86b1c] px-4 py-2 font-semibold text-white hover:bg-[#b84a0f] transition-all shrink-0"
          >
            <span>Open Studio</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </article>
    </div>
  );
}
