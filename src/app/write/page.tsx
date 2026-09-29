import React from "react";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ArrowLeft, PenTool, Lock } from "lucide-react";
import { getPostForEdit } from "@/lib/posts";
import { isSupabaseConfigured } from "@/lib/supabase";
import { COOKIE, MAX_AGE_SECONDS, issueToken, passwordMatches, verifyToken } from "@/lib/session";

export const metadata = {
  title: "Authoring Studio // Soumabrata Ghosh",
  description: "In-platform technical writing and Markdown engineering studio.",
  robots: { index: false, follow: false },
};

async function unlock(formData: FormData) {
  "use server";
  if (!passwordMatches(String(formData.get("password") ?? ""))) {
    redirect(`/write?error=1&slug=${encodeURIComponent(String(formData.get("slug") ?? ""))}`);
  }
  (await cookies()).set(COOKIE, issueToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
  redirect(`/write?slug=${encodeURIComponent(String(formData.get("slug") ?? ""))}`);
}

async function lock() {
  "use server";
  (await cookies()).delete(COOKIE);
  redirect("/write");
}

function Gate({ slug, failed }: { slug?: string; failed: boolean }) {
  return (
    <form action={unlock} className="space-y-4">
      <input type="hidden" name="slug" value={slug ?? ""} />
      <label
        htmlFor="password"
        className="block font-mono text-[10px] uppercase text-[#7f756d] mb-1"
      >
        Author Password
      </label>
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          autoFocus
          placeholder="••••••••••••"
          className="flex-1 rounded-xl bg-[#0e141d] border border-[#232e40] px-4 py-3 text-sm text-[#f3e6d5] focus:border-[#e86b1c] focus:outline-none"
        />
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#e86b1c] px-5 py-3 font-mono text-xs font-semibold text-white hover:bg-[#b84a0f] transition-colors"
        >
          <Lock className="h-3.5 w-3.5" />
          <span>Unlock</span>
        </button>
      </div>
      {failed ? (
        <p role="alert" className="font-mono text-xs text-red-400">
          Incorrect password.
        </p>
      ) : null}
      <p className="font-mono text-[11px] text-[#7f756d]">
        Private page. Drafts stay in this browser; publishing means committing the exported{" "}
        <code className="text-[#e86b1c]">.md</code> file.
      </p>
    </form>
  );
}

export default async function WritePage({
  searchParams,
}: {
  searchParams: Promise<{ slug?: string; error?: string }>;
}) {
  const { slug, error } = await searchParams;
  const authed = verifyToken((await cookies()).get(COOKIE)?.value);

  let post = null;
  if (authed && slug && isSupabaseConfigured()) {
    try {
      post = await getPostForEdit(slug);
    } catch {
      post = null;
    }
  }

  const { TiptapEditor } = authed && isSupabaseConfigured()
    ? await import("@/components/editor/TiptapEditor")
    : { TiptapEditor: null };

  return (
    <div className="relative pt-32 pb-24">
      <div className="pointer-events-none absolute top-20 left-1/2 -translate-x-1/2 h-72 w-[550px] rounded-full bg-[#e86b1c]/10 blur-3xl" />

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-mono text-xs text-[#b8aba0] hover:text-[#e86b1c] transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>RETURN TO PORTFOLIO</span>
          </Link>
          {authed ? (
            <form action={lock}>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-[#7f756d] hover:text-[#e86b1c] transition-colors"
              >
                <Lock className="h-3 w-3" />
                <span>Lock</span>
              </button>
            </form>
          ) : null}
        </div>

        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs font-mono text-[#e86b1c] uppercase tracking-wider mb-2">
            {authed ? <PenTool className="h-3.5 w-3.5" /> : <Lock className="h-3.5 w-3.5" />}
            <span>
              {authed ? (post ? "EDITING POST" : "NEW POST") : "PRIVATE"}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#f3e6d5]">
            {authed
              ? post
                ? post.title
                : "Engineering Notebook & Draft Studio"
              : "Author Access Required"}
          </h1>
          {authed ? (
            <p className="mt-2 text-sm text-[#b8aba0]">
              {post
                ? `Editing ${post.slug}. Drafts autosave to the database.`
                : "Drafts autosave as you type. Hit Publish when it is live."}
            </p>
          ) : null}
        </div>

        {authed && !isSupabaseConfigured() ? (
          <div className="rounded-2xl border border-amber-500/40 bg-amber-950/20 p-5 font-mono text-xs text-amber-200">
            <p className="font-bold mb-2">SUPABASE NOT CONFIGURED</p>
            <p>
              Add <code>NEXT_PUBLIC_SUPABASE_URL</code>,{" "}
              <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> and{" "}
              <code>SUPABASE_SERVICE_ROLE_KEY</code> to{" "}
              <code>.env.local</code>, run <code>supabase/schema.sql</code> in the Supabase SQL
              editor, then seed with <code>pnpm seed</code>.
            </p>
          </div>
        ) : null}

        {authed && isSupabaseConfigured() && TiptapEditor ? (
          <TiptapEditor
            initialPost={
              post
                ? {
                    slug: post.slug,
                    title: post.title,
                    excerpt: post.excerpt,
                    tags: post.tags,
                    content: post.content,
                    status: post.status,
                  }
                : undefined
            }
          />
        ) : authed ? null : (
          <Gate slug={slug} failed={error === "1"} />
        )}
      </div>
    </div>
  );
}
