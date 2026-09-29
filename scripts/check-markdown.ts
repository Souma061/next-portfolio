import assert from "node:assert/strict";
import { parseBlocks, applyInline } from "../src/lib/markdown.ts";

let checks = 0;
const eq = (actual: unknown, expected: unknown, label: string) => {
  assert.deepEqual(actual, expected, `${label}\n  actual:   ${JSON.stringify(actual)}\n  expected: ${JSON.stringify(expected)}`);
  checks++;
};

const kinds = (md: string) => parseBlocks(md).map((b) => b.kind);

// --- block parsing ---
eq(kinds("hello world"), ["text"], "single paragraph");
eq(kinds("a\nb"), ["text"], "soft line breaks join into one paragraph");
eq(kinds("a\n\nb"), ["text", "text"], "blank line splits paragraphs");
eq(kinds("## Title"), ["h"], "h2");
eq(kinds("###### Deep"), ["h"], "h6");
eq(kinds("- one\n- two"), ["ul"], "bullet list");
eq(kinds("1. one\n2. two"), ["ol"], "ordered list");
eq(kinds("> quoted"), ["quote"], "blockquote");
eq(kinds("---"), ["hr"], "thematic break");
eq(kinds("***"), ["hr"], "star thematic break");
eq(parseBlocks("## T")[0], { kind: "h", level: 2, value: "T" }, "heading level and text");
eq(parseBlocks("- a\n- b")[0], { kind: "ul", items: ["a", "b"] }, "list items");
eq(parseBlocks("1. a\n2. b")[0], { kind: "ol", items: ["a", "b"] }, "ordered items");
eq(parseBlocks(""), [], "empty input yields no blocks");

// Fences must swallow their contents so inner markdown is not parsed.
eq(kinds("```\n# not a heading\n```\n# real"), ["code", "h"], "fence contents are not parsed");
eq(parseBlocks("```cpp\nint x = 1;\n```")[0], { kind: "code", value: "int x = 1;", lang: "cpp" }, "fence keeps language and body");
eq(parseBlocks("```\nplain\n```")[0], { kind: "code", value: "plain", lang: undefined }, "bare fence has no language");
eq(kinds("- a\n\n- b"), ["ul", "ul"], "blank line splits lists");

// Escaping: raw html must never survive parsing as markup.
eq(parseBlocks("<script>alert(1)</script>")[0], { kind: "text", value: "&lt;script&gt;alert(1)&lt;/script&gt;" }, "raw html is escaped");

// --- inline ---
eq(applyInline("a **bold** and *em*"), "a <strong>bold</strong> and <em>em</em>", "bold and em");
eq(applyInline("use `int main()`"), "use <code>int main()</code>", "inline code");
eq(applyInline("[docs](https://x.dev)"), '<a href="https://x.dev">docs</a>', "link");
eq(applyInline("a * b * c"), "a * b * c", "lone asterisks are not emphasis");
eq(applyInline("** spaced **"), "** spaced **", "spaced delimiters are not bold");
eq(applyInline("plain"), "plain", "plain text untouched");
// applyInline assumes pre-escaped input (parseBlocks escapes first, and that
// is the only caller). Entities pass through untouched.
eq(applyInline("`&lt;`"), "<code>&lt;</code>", "already-escaped entity passes through code span");
eq(applyInline("a &amp; b"), "a &amp; b", "ampersand entity preserved");

// Escaping is parseBlocks' job, since it runs before any inline rule.
eq(parseBlocks("<b>x</b>")[0], { kind: "text", value: "&lt;b&gt;x&lt;/b&gt;" }, "raw inline html escaped at parse time");
eq(parseBlocks("a <b>b</b> c")[0], { kind: "text", value: "a &lt;b&gt;b&lt;/b&gt; c" }, "inline html inside a paragraph escaped");

console.log(`markdown: ${checks} checks passed`);
