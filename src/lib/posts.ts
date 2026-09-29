import "server-only";
import { publicSupabase, serverSupabase } from "./supabase";
import { EMPTY_DOC, TiptapNode } from "./richtext";
import { PostInput, validatePostInput } from "./post-input";

export type { PostInput };
export { validatePostInput };

export interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: TiptapNode;
  tags: string[];
  status: "draft" | "published";
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
}

interface PostRow {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: TiptapNode | null;
  tags: string[] | null;
  status: "draft" | "published";
  created_at: string;
  updated_at: string;
  published_at: string | null;
}

const toPost = (row: PostRow): Post => ({
  id: row.id,
  slug: row.slug,
  title: row.title,
  excerpt: row.excerpt ?? "",
  content: row.content ?? EMPTY_DOC,
  tags: row.tags ?? [],
  status: row.status,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
  publishedAt: row.published_at,
});

const COLUMNS =
  "id, slug, title, excerpt, content, tags, status, created_at, updated_at, published_at";

/** Public read path. Uses the anon key, so RLS limits this to published rows. */
export async function listPublishedPosts(): Promise<Post[]> {
  const { data, error } = await publicSupabase()
    .from("posts")
    .select(COLUMNS)
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error) throw new Error(`listPublishedPosts: ${error.message}`);
  return (data as PostRow[]).map(toPost);
}

export async function getPublishedPost(slug: string): Promise<Post | null> {
  const { data, error } = await publicSupabase()
    .from("posts")
    .select(COLUMNS)
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error) throw new Error(`getPublishedPost: ${error.message}`);
  return data ? toPost(data as PostRow) : null;
}

/** Server path. Callers must have verified the write session. */
export async function getPostForEdit(slug: string): Promise<Post | null> {
  const { data, error } = await serverSupabase()
    .from("posts")
    .select(COLUMNS)
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw new Error(`getPostForEdit: ${error.message}`);
  return data ? toPost(data as PostRow) : null;
}

/**
 * Inserts or updates by slug. A draft never clobbers published_at, and an
 * already-published post keeps its published_at unless it is being re-published.
 */
export async function savePost(input: PostInput): Promise<Post> {
  const errors = validatePostInput(input);
  if (errors.length) throw new Error(errors.join(" "));

  const supabase = serverSupabase();
  const { data: existing } = await supabase
    .from("posts")
    .select("id, status, published_at")
    .eq("slug", input.slug)
    .maybeSingle();

  const publishedAt =
    input.status === "published"
      ? (existing as { published_at?: string | null } | null)?.published_at ?? new Date().toISOString()
      : null;

  const row = {
    slug: input.slug,
    title: input.title.trim(),
    excerpt: input.excerpt.trim(),
    content: input.content,
    tags: input.tags,
    status: input.status,
    published_at: publishedAt,
  };

  const { data, error } = await supabase
    .from("posts")
    .upsert(row, { onConflict: "slug" })
    .select(COLUMNS)
    .single();

  if (error) throw new Error(`savePost: ${error.message}`);
  return toPost(data as PostRow);
}
