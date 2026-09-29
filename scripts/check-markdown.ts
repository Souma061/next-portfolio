import assert from "node:assert/strict";
import { markdownToHtml, parseBlocks, applyInline } from "../src/lib/markdown.ts";

let checks = 0;
const eq = (actual: unknown, expected: unknown, label: string) => {
  assert.deepEqual(actual, expected, `${label}\n  actual:   ${JSON.stringify(actual)}\n  expected: ${JSON.stringify(expected)}`);
  checks++;
};

eq(markdownToHtml("hello world"), "<p>hello world</p>", "paragraph");
eq(markdownToHtml("## Title"), "<h2>Title</h2>", "heading level preserved");
eq(applyInline("a **bold** and *em*"), "a <strong>bold</strong> and <em>em</em>", "inline emphasis");
eq(applyInline("use `int main()`"), "use <code>int main()</code>", "inline code");
eq(applyInline("[docs](https://x.dev)"), '<a href="https://x.dev">docs</a>', "link");
eq(
  markdownToHtml("```cpp\nint x = 1;\n```"),
  '<pre><code class="language-cpp">int x = 1;</code></pre>',
  "fenced code keeps language tag"
);
eq(
  markdownToHtml("- one\n- two"),
  "<ul><li>one</li><li>two</li></ul>",
  "unordered list"
);
eq(
  markdownToHtml("1. one\n2. two"),
  "<ol><li>one</li><li>two</li></ol>",
  "ordered list"
);
eq(markdownToHtml("> quoted"), "<blockquote><p>quoted</p></blockquote>", "blockquote");
eq(markdownToHtml("---"), "<hr />", "horizontal rule");
eq(
  markdownToHtml("a * b * c"),
  "<p>a * b * c</p>",
  "lone asterisks are not emphasis"
);
eq(
  markdownToHtml("<script>alert(1)</script>"),
  "<p>&lt;script&gt;alert(1)&lt;/script&gt;</p>",
  "raw html is escaped, not injected"
);
eq(
  markdownToHtml("`<img onerror=x>`"),
  "<p><code>&lt;img onerror=x&gt;</code></p>",
  "html inside code span stays escaped"
);
eq(
  parseBlocks("```\n# not a heading\n```\n# real heading").map((b) => b.kind),
  ["code", "h"],
  "fence contents are not parsed as markdown"
);
eq(markdownToHtml(""), "", "empty input is empty output");

console.log(`markdown: ${checks} checks passed`);
