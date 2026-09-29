import fs from "node:fs";
import path from "node:path";
import { BlogPost } from "@/types/blog";

const CONTENT_DIR = path.join(process.cwd(), "content", "blog");

export function parseFrontmatter(raw: string): {
  data: Record<string, string | string[] | boolean>;
  body: string;
} {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { data: {}, body: raw.trim() };

  const data: Record<string, string | string[] | boolean> = {};

  for (const line of match[1].split(/\r?\n/)) {
    const kv = line.match(/^(\w+):\s*(.*)$/);
    if (!kv) continue;
    const key = kv[1];
    const value = kv[2].trim();

    if (value.startsWith("[") && value.endsWith("]")) {
      data[key] = value
        .slice(1, -1)
        .split(",")
        .map((v) => v.trim().replace(/^["']|["']$/g, ""))
        .filter(Boolean);
    } else if (value === "true" || value === "false") {
      data[key] = value === "true";
    } else {
      data[key] = value.replace(/^["']|["']$/g, "");
    }
  }

  return { data, body: match[2].trim() };
}

export function serializePost(post: Omit<BlogPost, "content"> & { content: string }): string {
  const tags = post.tags.map((t) => `"${t}"`).join(", ");
  return [
    "---",
    `title: "${post.title.replace(/"/g, '\\"')}"`,
    `slug: "${post.slug}"`,
    `date: "${post.date}"`,
    `author: "${post.author}"`,
    `tags: [${tags}]`,
    `readingTime: "${post.readingTime}"`,
    `featured: ${post.featured}`,
    `excerpt: "${post.excerpt.replace(/"/g, '\\"')}"`,
    "---",
    "",
    post.content.trim(),
    "",
  ].join("\n");
}

function toPost(slug: string, raw: string): BlogPost {
  const { data, body } = parseFrontmatter(raw);
  return {
    slug: (data.slug as string) ?? slug,
    title: (data.title as string) ?? slug,
    date: (data.date as string) ?? "1970-01-01",
    author: (data.author as string) ?? "Soumabrata Ghosh",
    readingTime: (data.readingTime as string) ?? "1 min read",
    tags: (data.tags as string[]) ?? [],
    featured: data.featured === true,
    excerpt: (data.excerpt as string) ?? "",
    content: body,
  };
}

export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];

  return fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => toPost(f.replace(/\.md$/, ""), fs.readFileSync(path.join(CONTENT_DIR, f), "utf8")))
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  const file = path.join(CONTENT_DIR, `${slug}.md`);
  if (!fs.existsSync(file)) return undefined;
  return toPost(slug, fs.readFileSync(file, "utf8"));
}
