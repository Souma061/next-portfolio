import { parseBlocks } from "./markdown.ts";

export interface TiptapNode {
  type: string;
  attrs?: Record<string, unknown>;
  content?: TiptapNode[];
  text?: string;
  marks?: { type: string; attrs?: Record<string, unknown> }[];
}

export const EMPTY_DOC: TiptapNode = { type: "doc", content: [] };

export function isEmptyDoc(doc: unknown): boolean {
  const text = (d: TiptapNode): string =>
    d.text ?? (d.content ?? []).map(text).join("");
  if (!doc || typeof doc !== "object") return true;
  return text(doc as TiptapNode).trim().length === 0;
}

export function docText(doc: TiptapNode): string {
  const text = (d: TiptapNode): string =>
    d.text ?? (d.content ?? []).map(text).join("");
  return text(doc);
}

export function estimateReadingTime(doc: TiptapNode): number {
  const words = docText(doc).trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function safeHref(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const href = raw.trim();
  if (href.startsWith("/") || href.startsWith("#")) return href;
  if (/^https?:\/\//i.test(href)) return href;
  if (/^mailto:/i.test(href)) return href;
  return null;
}

/** Images are stricter than links: no data:, no javascript:, http(s) or relative only. */
export function safeImageSrc(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const src = raw.trim();
  if (!src) return null;
  if (/^\//.test(src) && !/^\/\//.test(src)) return src;
  if (/^https:\/\//i.test(src)) return src;
  return null;
}

function renderMarks(text: string, marks?: TiptapNode["marks"]): string {
  if (!marks?.length) return esc(text);
  return marks.reduce((acc, mark) => {
    switch (mark.type) {
      case "bold":
      case "strong":
        return `<strong>${acc}</strong>`;
      case "italic":
      case "em":
        return `<em>${acc}</em>`;
      case "strike":
        return `<s>${acc}</s>`;
      case "code":
        return `<code>${acc}</code>`;
      case "link": {
        const href = safeHref(mark.attrs?.href);
        return href ? `<a href="${esc(href)}" rel="noopener noreferrer">${acc}</a>` : acc;
      }
      default:
        return acc;
    }
  }, esc(text));
}

/**
 * Renders a Tiptap document to HTML. Node types are allow-listed and all text
 * is escaped, so unknown nodes are dropped rather than passed through.
 */
export function tiptapToHtml(doc: TiptapNode): string {
  function renderNode(node: TiptapNode): string {
    if (node.type === "text") return renderMarks(node.text ?? "", node.marks);

    const kids = () => (node.content ?? []).map(renderNode).join("");

    switch (node.type) {
      case "doc":
        return kids();
      case "paragraph":
        return `<p>${kids()}</p>`;
      case "heading": {
        const raw = Number(node.attrs?.level ?? 2);
        const level = Math.min(6, Math.max(1, Number.isFinite(raw) ? raw : 2));
        return `<h${level}>${kids()}</h${level}>`;
      }
      case "bulletList":
        return `<ul>${kids()}</ul>`;
      case "orderedList":
        return `<ol>${kids()}</ol>`;
      case "listItem":
        return `<li>${kids()}</li>`;
      case "blockquote":
        return `<blockquote>${kids()}</blockquote>`;
      case "codeBlock": {
        const lang = node.attrs?.language;
        const cls = typeof lang === "string" && /^[a-z0-9+#-]{1,20}$/i.test(lang)
          ? ` class="language-${lang}"`
          : "";
        return `<pre><code${cls}>${kids()}</code></pre>`;
      }
      case "horizontalRule":
        return "<hr />";
      case "hardBreak":
        return "<br />";
      case "image": {
        const src = safeImageSrc(node.attrs?.src);
        if (!src) return "";
        const alt = typeof node.attrs?.alt === "string" ? node.attrs.alt : "";
        const title = typeof node.attrs?.title === "string" ? node.attrs.title : "";
        return `<img src="${esc(src)}" alt="${esc(alt)}"${title ? ` title="${esc(title)}"` : ""} loading="lazy" decoding="async" />`;
      }
      default:
        return kids();
    }
  }

  return renderNode(doc);
}

/**
 * Converts the limited Markdown used by content/blog/*.md into a Tiptap doc.
 * Only the constructs the parser understands are produced.
 */
export function markdownToTiptap(md: string): TiptapNode {
  const inlineToNodes = (text: string): TiptapNode[] => {
    const nodes: TiptapNode[] = [];
    const pattern =
      /(`[^`]+`)|(\*\*[^*]+\*\*)|(\*[^*\n]+\*)|(\[[^\]]+\]\([^)\s]+\))/g;
    let last = 0;
    let m: RegExpExecArray | null;

    while ((m = pattern.exec(text)) !== null) {
      if (m.index > last) {
        nodes.push({ type: "text", text: text.slice(last, m.index) });
      }
      const token = m[0];
      if (token.startsWith("`")) {
        nodes.push({ type: "text", text: token.slice(1, -1), marks: [{ type: "code" }] });
      } else if (token.startsWith("**")) {
        nodes.push({ type: "text", text: token.slice(2, -2), marks: [{ type: "bold" }] });
      } else if (token.startsWith("[")) {
        const link = /^\[([^\]]+)\]\(([^)\s]+)\)$/.exec(token);
        const href = link?.[2] ?? "";
        const safe = /^(https?:\/\/|mailto:|\/|#)/i.test(href) ? href : null;
        nodes.push({
          type: "text",
          text: link?.[1] ?? token,
          marks: safe ? [{ type: "link", attrs: { href: safe } }] : undefined,
        });
      } else {
        nodes.push({ type: "text", text: token.slice(1, -1), marks: [{ type: "italic" }] });
      }
      last = m.index + token.length;
    }
    if (last < text.length) {
      nodes.push({ type: "text", text: text.slice(last) });
    }
    return nodes;
  };

  const content: TiptapNode[] = [];

  for (const block of parseBlocks(md)) {
    switch (block.kind) {
      case "h":
        content.push({
          type: "heading",
          attrs: { level: Math.min(3, Math.max(1, block.level)) },
          content: inlineToNodes(unescapeMd(block.value)),
        });
        break;
      case "text":
        content.push({ type: "paragraph", content: inlineToNodes(unescapeMd(block.value)) });
        break;
      case "quote":
        content.push({
          type: "blockquote",
          content: [{ type: "paragraph", content: inlineToNodes(unescapeMd(block.value)) }],
        });
        break;
      case "ul":
      case "ol":
        content.push({
          type: block.kind === "ul" ? "bulletList" : "orderedList",
          content: block.items.map((item) => ({
            type: "listItem",
            content: [{ type: "paragraph", content: inlineToNodes(unescapeMd(item)) }],
          })),
        });
        break;
      case "hr":
        content.push({ type: "horizontalRule" });
        break;
      case "code":
        content.push({
          type: "codeBlock",
          attrs: { language: block.lang ?? null },
          content: block.value ? [{ type: "text", text: block.value }] : [],
        });
        break;
    }
  }

  return { type: "doc", content };
}

const unescapeMd = (s: string) =>
  s
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&");
