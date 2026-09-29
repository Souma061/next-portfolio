import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, Calendar, User } from "lucide-react";
import { getPublishedPost } from "@/lib/posts";
import { tiptapToHtml, estimateReadingTime } from "@/lib/richtext";
import { TechBadge } from "@/components/ui/TechBadge";

export const revalidate = 60;

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params;
  try {
    const post = await getPublishedPost(slug);
    if (!post) return { title: "Not found" };
    return {
      title: `${post.title} // Soumabrata Ghosh`,
      description: post.excerpt,
    };
  } catch {
    return { title: "Not found" };
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;

  let post = null;
  try {
    post = await getPublishedPost(slug);
  } catch {
    notFound();
  }

  if (!post) {
    notFound();
  }

  return (
    <div className="relative pt-32 pb-24">
      <div className="pointer-events-none absolute top-20 left-1/2 -translate-x-1/2 h-80 w-[600px] rounded-full bg-[#e86b1c]/10 blur-3xl" />

      <article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 font-mono text-xs text-[#b8aba0] hover:text-[#e86b1c] transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>BACK TO ALL ARTICLES</span>
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
              Soumabrata Ghosh
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              {(post.publishedAt ?? post.createdAt).slice(0, 10)}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5 text-emerald-400">
              <Clock className="h-3.5 w-3.5" />
              {estimateReadingTime(post.content)} min read
            </span>
          </div>
        </header>

        {post.excerpt ? (
          <div className="mb-8 p-4 rounded-xl bg-[#121822] border border-[#232e40] text-sm text-[#b8aba0] font-mono italic">
            {post.excerpt}
          </div>
        ) : null}

        <div
          className="prose prose-invert max-w-none prose-headings:font-sans prose-headings:tracking-tight prose-a:text-[#e86b1c] prose-a:no-underline hover:prose-a:underline prose-pre:bg-[#0b1017] prose-pre:border prose-pre:border-[#232e40] prose-code:text-[#e86b1c] prose-blockquote:border-l-[#e86b1c] prose-blockquote:text-[#b8aba0] prose-li:text-[#f3e6d5] prose-hr:border-[#232e40] prose-strong:text-[#f3e6d5] prose-img:rounded-xl prose-img:border prose-img:border-[#232e40] text-sm sm:text-base leading-relaxed text-[#f3e6d5]"
          dangerouslySetInnerHTML={{ __html: tiptapToHtml(post.content) }}
        />

        <div className="mt-16 rounded-2xl bg-[#121822] border border-[#232e40] p-6 font-mono text-xs">
          <div className="font-bold text-[#f3e6d5] text-sm">Soumabrata Ghosh</div>
          <p className="text-[11px] text-[#7f756d] mt-0.5">
            Systems engineer researching low-latency kernels and distributed message fabrics.
          </p>
        </div>
      </article>
    </div>
  );
}
