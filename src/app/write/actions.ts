"use server";

import fs from "node:fs/promises";
import path from "node:path";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { COOKIE, verifyToken } from "@/lib/session";
import { Post, PostInput, getPostForEdit, savePost } from "@/lib/posts";
import { TiptapNode, tiptapToHtml, estimateReadingTime } from "@/lib/richtext";
import { createUploadTarget, providerConfigured, validateImage } from "@/lib/uploads";

const CONTENT_DIR = path.join(process.cwd(), "content", "blog");

export interface DraftPayload {
  slug?: string;
  title?: string;
  excerpt?: string;
  tags?: string[];
  content?: TiptapNode;
}

export interface ActionResult {
  ok: boolean;
  message: string;
  savedAt: string | null;
  slug: string | null;
}

const fail = (message: string): ActionResult => ({ ok: false, message, savedAt: null, slug: null });

async function requireSession() {
  if (!verifyToken((await cookies()).get(COOKIE)?.value)) {
    throw new Error("Not authorised.");
  }
}

function toInput(payload: DraftPayload, status: "draft" | "published"): PostInput {
  return {
    slug: String(payload.slug ?? "").trim(),
    title: String(payload.title ?? ""),
    excerpt: String(payload.excerpt ?? ""),
    tags: Array.isArray(payload.tags) ? payload.tags.map((t) => String(t)) : [],
    content: payload.content && typeof payload.content === "object"
      ? (payload.content as TiptapNode)
      : { type: "doc", content: [] },
    status,
  };
}

/** Best effort git mirror. Read-only serverless filesystems are expected, not an error. */
async function mirrorToMarkdown(post: Post): Promise<{ ok: boolean; detail: string }> {
  const q = (s: string) => s.replace(/"/g, '\\"');
  const file = [
    "---",
    `title: "${q(post.title)}"`,
    `slug: "${post.slug}"`,
    `date: "${(post.publishedAt ?? post.updatedAt).slice(0, 10)}"`,
    `author: "Soumabrata Ghosh"`,
    `tags: [${post.tags.map((t) => `"${q(t)}"`).join(", ")}]`,
    `readingTime: "${estimateReadingTime(post.content)} min read"`,
    `featured: false`,
    `excerpt: "${q(post.excerpt)}"`,
    "---",
    "",
    htmlToMarkdownish(tiptapToHtml(post.content)),
    "",
  ].join("\n");

  try {
    await fs.mkdir(CONTENT_DIR, { recursive: true });
    await fs.writeFile(path.join(CONTENT_DIR, `${post.slug}.md`), file, "utf8");
    return { ok: true, detail: `mirrored to content/blog/${post.slug}.md` };
  } catch (error) {
    return { ok: false, detail: `git mirror skipped: ${(error as Error).message.slice(0, 60)}` };
  }
}

/** Lossy on purpose: the markdown file is a backup mirror, not the source of truth. */
function htmlToMarkdownish(html: string): string {
  return html
    .replace(/<h([1-6])>/g, (_m, l) => `${"#".repeat(Number(l))} `)
    .replace(/<\/h[1-6]>/g, "\n")
    .replace(/<li>/g, "- ")
    .replace(/<\/li>/g, "")
    .replace(/<\/(p|blockquote)>/g, "\n\n")
    .replace(/<blockquote>/g, "> ")
    .replace(/<pre><code([^>]*)>/g, (_m, a) => `\`\`\`${/language-([\w+#-]+)/.exec(a)?.[1] ?? ""}\n`)
    .replace(/<\/code><\/pre>/g, "\n```")
    .replace(/<strong>/g, "**")
    .replace(/<\/strong>/g, "**")
    .replace(/<em>/g, "*")
    .replace(/<\/em>/g, "*")
    .replace(/<code>/g, "`")
    .replace(/<\/code>/g, "`")
    .replace(/<hr \/>/g, "\n---\n")
    .replace(/<a href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/g, "[$2]($1)")
    .replace(/<[^>]+>/g, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export async function saveDraft(payload: DraftPayload): Promise<ActionResult> {
  await requireSession();
  try {
    const post = await savePost(toInput(payload, "draft"));
    return { ok: true, message: "Draft saved", savedAt: post.updatedAt, slug: post.slug };
  } catch (error) {
    return fail((error as Error).message);
  }
}

export async function publishPost(payload: DraftPayload): Promise<ActionResult> {
  await requireSession();
  try {
    const input = toInput(payload, "published");
    if (!input.content.content?.length) {
      return fail("Nothing to publish: the post body is empty.");
    }
    const post = await savePost(input);
    const mirror = await mirrorToMarkdown(post);

    revalidatePath("/blog");
    revalidatePath(`/blog/${post.slug}`);

    return {
      ok: true,
      message: mirror.ok ? "Published" : `Published, ${mirror.detail}`,
      savedAt: post.updatedAt,
      slug: post.slug,
    };
  } catch (error) {
    return fail((error as Error).message);
  }
}

export async function requestUploadTarget(
  filename: string,
  contentType: string,
  size: number
): Promise<{ ok: true; target: Awaited<ReturnType<typeof createUploadTarget>> } | { ok: false; message: string }> {
  await requireSession();
  try {
    if (!providerConfigured()) {
      throw new Error("No upload provider configured. Set UPLOAD_PROVIDER and its keys.");
    }
    const invalid = validateImage(contentType, size);
    if (invalid) throw new Error(invalid);

    const target = await createUploadTarget(
      String(filename || "image").slice(0, 80),
      contentType
    );
    return { ok: true, target };
  } catch (error) {
    return { ok: false, message: (error as Error).message };
  }
}

export async function unpublishPost(slug: string): Promise<ActionResult> {
  await requireSession();
  try {
    const post = await getPostForEdit(slug);
    if (!post) return fail("Post not found.");
    await savePost({
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      tags: post.tags,
      content: post.content,
      status: "draft",
    });
    revalidatePath("/blog");
    revalidatePath(`/blog/${post.slug}`);
    return { ok: true, message: "Moved back to draft", savedAt: new Date().toISOString(), slug };
  } catch (error) {
    return fail((error as Error).message);
  }
}
