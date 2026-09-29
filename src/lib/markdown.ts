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

export function applyInline(text: string): string {
  return text
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*(\S(?:[^*]*\S)?)\*\*/g, "<strong>$1</strong>")
    .replace(/(^|[^*])\*(\S(?:[^*\n]*\S)?)\*/g, "$1<em>$2</em>")
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

export function blocksToHtml(blocks: Block[]): string {
  return blocks
    .map((b) => {
      switch (b.kind) {
        case "h":
          return `<h${b.level}>${applyInline(b.value)}</h${b.level}>`;
        case "text":
          return `<p>${applyInline(b.value)}</p>`;
        case "quote":
          return `<blockquote><p>${applyInline(b.value)}</p></blockquote>`;
        case "ul":
          return `<ul>${b.items.map((i) => `<li>${applyInline(i)}</li>`).join("")}</ul>`;
        case "ol":
          return `<ol>${b.items.map((i) => `<li>${applyInline(i)}</li>`).join("")}</ol>`;
        case "hr":
          return "<hr />";
        case "code":
          return `<pre><code${b.lang ? ` class="language-${b.lang}"` : ""}>${b.value}</code></pre>`;
      }
    })
    .join("\n");
}

export function markdownToHtml(md: string): string {
  return blocksToHtml(parseBlocks(md));
}

function inlineToMd(el: Element): string {
  return Array.from(el.childNodes)
    .map((node) => {
      if (node.nodeType === 3) return (node.textContent ?? "").replace(/\s+/g, " ");
      if (node.nodeType !== 1) return "";
      const el = node as Element;
      const kids = () => inlineToMd(el);
      switch (el.tagName) {
        case "STRONG":
        case "B":
          return `**${kids().trim()}**`;
        case "EM":
        case "I":
          return `*${kids().trim()}*`;
        case "CODE":
          return `\`${(el.textContent ?? "").trim()}\``;
        case "A":
          return `[${kids().trim()}](${el.getAttribute("href") ?? ""})`;
        case "BR":
          return "  \n";
        default:
          return kids();
      }
    })
    .join("");
}

function blockToMd(el: Element): string {
  const tag = el.tagName;
  const kids = () => blockToMd(el);

  if (/^H[1-6]$/.test(tag)) {
    return `${"#".repeat(Number(tag[1]))} ${inlineToMd(el).trim()}\n`;
  }
  if (tag === "P") {
    const t = inlineToMd(el).trim();
    return t ? `${t}\n` : "";
  }
  if (tag === "PRE") {
    const code = el.querySelector("code");
    const lang = (code?.getAttribute("class") ?? "").replace(/^language-/, "");
    return `\`\`\`${lang}\n${(code?.textContent ?? el.textContent ?? "").replace(/\n$/, "")}\n\`\`\`\n`;
  }
  if (tag === "UL" || tag === "OL") {
    const ordered = tag === "OL";
    const items = Array.from(el.children)
      .filter((c) => c.tagName === "LI")
      .map((c, i) => `${ordered ? `${i + 1}.` : "-"} ${inlineToMd(c).trim()}\n`)
      .join("");
    return `${items}\n`;
  }
  if (tag === "BLOCKQUOTE") {
    return `> ${inlineToMd(el).trim()}\n`;
  }
  if (tag === "HR") {
    return "---\n";
  }
  if (tag === "DIV" || tag === "SECTION") {
    return kids();
  }
  return `${inlineToMd(el).trim()}\n`;
}

export function htmlToMarkdown(html: string): string {
  if (typeof DOMParser === "undefined") {
    throw new Error("htmlToMarkdown requires a browser environment (DOMParser).");
  }
  const doc = new DOMParser().parseFromString(`<body>${html}</body>`, "text/html");
  return Array.from(doc.body.children)
    .map(blockToMd)
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
