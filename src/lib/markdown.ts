type Block =
  | { kind: "text"; value: string }
  | { kind: "code"; value: string; lang?: string }
  | { kind: "h"; level: number; value: string }
  | { kind: "quote"; value: string }
  | { kind: "ul"; items: string[] }
  | { kind: "ol"; items: string[] }
  | { kind: "hr" };

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Inline rules for already-escaped text. Only call with parseBlocks output. */
export function applyInline(text: string): string {
  return text
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*(\S(?:[^*]*\S)?)\*\*/g, "<strong>$1</strong>")
    .replace(/(^|[^*])\*([^*\s](?:[^*\n]*[^*\s])?)\*/g, "$1<em>$2</em>")
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2">$1</a>');
}
export function parseBlocks(md: string): Block[] {
  const lines = escapeHtml(md).replace(/\r\n/g, "\n").split("\n");
  const blocks: Block[] = [];
  let para: string[] = [];
  let list: string[] = [];
  let listOrdered = false;

  const flushPara = () => {
    if (para.length) {
      blocks.push({ kind: "text", value: para.join(" ") });
      para = [];
    }
  };
  const flushList = () => {
    if (list.length) {
      blocks.push(listOrdered ? { kind: "ol", items: list } : { kind: "ul", items: list });
      list = [];
    }
  };
  const flushAll = () => {
    flushPara();
    flushList();
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed.startsWith("```")) {
      flushAll();
      const lang = trimmed.slice(3).trim() || undefined;
      const buf: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        buf.push(lines[i]);
        i++;
      }
      blocks.push({ kind: "code", value: buf.join("\n"), lang });
      continue;
    }

    if (!trimmed) {
      flushAll();
      continue;
    }

    let m: RegExpMatchArray | null;

    if ((m = trimmed.match(/^(#{1,6})\s+(.*)$/))) {
      flushAll();
      blocks.push({ kind: "h", level: m[1].length, value: m[2] });
      continue;
    }

    if (/^(-{3,}|\*{3,}|_{3,})$/.test(trimmed)) {
      flushAll();
      blocks.push({ kind: "hr" });
      continue;
    }

    if ((m = trimmed.match(/^&gt;\s?(.*)$/))) {
      flushAll();
      blocks.push({ kind: "quote", value: m[1] });
      continue;
    }

    if ((m = line.match(/^\s*[-*]\s+(.*)$/))) {
      flushPara();
      if (listOrdered) flushList();
      listOrdered = false;
      list.push(m[1]);
      continue;
    }

    if ((m = line.match(/^\s*\d+[.)]\s+(.*)$/))) {
      flushPara();
      if (!listOrdered) flushList();
      listOrdered = true;
      list.push(m[1]);
      continue;
    }

    flushList();
    para.push(trimmed);
  }

  flushAll();
  return blocks;
}
