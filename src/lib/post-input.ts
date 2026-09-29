import type { TiptapNode } from "./richtext";

export interface PostInput {
  slug: string;
  title: string;
  excerpt: string;
  tags: string[];
  content: TiptapNode;
  status: "draft" | "published";
}

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
// C0 controls, DEL and C1. Newlines matter: they let a title forge extra
// frontmatter keys in the mirrored markdown file.
const CONTROL = /[\u0000-\u001F\u007F-\u009F]/;

export const LIMITS = {
  title: 200,
  excerpt: 400,
  tag: 40,
  tags: 12,
} as const;

function checkText(
  value: string,
  label: string,
  max: number,
  errors: string[],
  { required = false }: { required?: boolean } = {}
) {
  if (required && !value.trim()) {
    errors.push(`${label} is required.`);
    return;
  }
  if (CONTROL.test(value)) {
    errors.push(`${label} must not contain newlines or control characters.`);
  }
  if (value.length > max) {
    errors.push(`${label} must be ${max} characters or fewer.`);
  }
}

export function validatePostInput(input: PostInput): string[] {
  const errors: string[] = [];

  checkText(input.title, "Title", LIMITS.title, errors, { required: true });
  checkText(input.excerpt, "Excerpt", LIMITS.excerpt, errors);

  if (!SLUG.test(input.slug)) {
    errors.push("Slug must be lowercase words separated by single hyphens.");
  }
  if (input.slug.length > 80) {
    errors.push("Slug must be 80 characters or fewer.");
  }

  if (input.tags.length > LIMITS.tags) {
    errors.push(`At most ${LIMITS.tags} tags.`);
  }
  for (const tag of input.tags) {
    if (CONTROL.test(tag)) {
      errors.push("Tags must not contain newlines or control characters.");
      break;
    }
    if (!tag.trim() || tag.length > LIMITS.tag) {
      errors.push(`Each tag must be 1-${LIMITS.tag} characters.`);
      break;
    }
  }

  if (input.status !== "draft" && input.status !== "published") {
    errors.push("Status must be draft or published.");
  }
  if (!input.content || typeof input.content !== "object") {
    errors.push("Content must be a document object.");
  }

  return errors;
}
