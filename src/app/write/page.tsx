import React from "react";
import Link from "next/link";
import { ArrowLeft, PenTool } from "lucide-react";
import { TiptapEditor } from "@/components/editor/TiptapEditor";
import { getPostBySlug } from "@/lib/blog";

export const metadata = {
  title: "Authoring Studio // Soumabrata Ghosh",
  description: "In-platform technical writing and MDX engineering studio.",
};

export default async function WritePage({
  searchParams,
}: {
  searchParams: Promise<{ slug?: string }>;
}) {
  const { slug } = await searchParams;
  const post = slug ? getPostBySlug(slug) : undefined;

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
            <span>{post ? "EDITING POST" : "AUTHORING STUDIO"}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#f3e6d5]">
            {post ? post.title : "Engineering Notebook & Draft Studio"}
          </h1>
          <p className="mt-2 text-sm text-[#b8aba0]">
            {post ? (
              <>
                Editing <code className="text-[#e86b1c]">{post.slug}</code>. Changes autosave to this
                browser. Export the <code className="text-[#e86b1c]">.md</code> file into{" "}
                <code className="text-[#e86b1c]">content/blog/</code> and push to publish.
              </>
            ) : (
              "Author systems engineering articles, technical post-mortems, and architectural decision records. Supports live reading time calculation, formatted syntax, and direct MDX/Markdown export."
            )}
          </p>
        </div>

        <TiptapEditor
          initialPost={
            post
              ? {
                  title: post.title,
                  slug: post.slug,
                  excerpt: post.excerpt,
                  tags: post.tags,
                  content: post.content,
                }
              : undefined
          }
        />
      </div>
    </div>
  );
}
