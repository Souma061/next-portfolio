"use client";

import React, { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import LinkExtension from "@tiptap/extension-link";
import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Code,
  Quote,
  Download,
  Copy,
  Check,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";

const INITIAL_CONTENT = `
<h2>Architectural Thesis: Zero-Heap Spatial Quadtrees in C++20</h2>
<p>Modern ride-hailing and spatial dispatch meshes frequently bottleneck on geographic lookups during peak demand spikes. When 100,000 drivers broadcast GPS coordinates concurrently, conventional point-in-polygon queries degrade rapidly.</p>

<h3>1. Struct-of-Arrays (SoA) Vectorization</h3>
<p>By restructuring coordinate memory into contiguous float arrays aligned to 64-byte cache lines, SIMD AVX-512 instructions can evaluate 16 spatial bounding boxes simultaneously with zero cache thrashing.</p>

<h3>2. Atomic Redis Lua State Machine</h3>
<p>Distributed concurrency locks fail under tail latency jitter. Moving lease validation directly into Redis via Lua scripts yields deterministic CAS (Compare-And-Swap) execution in 14 microseconds.</p>
`;

export const TiptapEditor: React.FC = () => {
  const [title, setTitle] = useState("Designing Sub-Microsecond Spatial PR-Quadtrees in C++20");
  const [slug, setSlug] = useState("designing-sub-microsecond-spatial-quadtrees");
  const [tags, setTags] = useState("C++20, Redis Lua, AVX-512, Quadtree");
  const [savedStatus, setSavedStatus] = useState("SAVED LOCALLY");
  const [copiedMDX, setCopiedMDX] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Placeholder.configure({
        placeholder: "Write systems architecture documentation or technical post...",
      }),
      LinkExtension.configure({
        openOnClick: false,
      }),
    ],
    content: INITIAL_CONTENT,
    editorProps: {
      attributes: {
        class:
          "prose prose-invert max-w-none focus:outline-none min-h-[420px] font-sans text-sm md:text-base leading-relaxed text-[#f3e6d5]",
      },
    },
    onUpdate: () => {
      setSavedStatus("SAVING...");
      setTimeout(() => {
        setSavedStatus("SAVED LOCALLY");
      }, 600);
    },
  });

  const wordCount = editor?.getText().split(/\s+/).filter(Boolean).length || 0;
  const readingTime = Math.ceil(wordCount / 200) || 1;

  const handleExportMarkdown = () => {
    if (!editor) return;
    const markdownContent = `---
title: "${title}"
slug: "${slug}"
date: "${new Date().toISOString().split("T")[0]}"
tags: [${tags.split(",").map((t) => `"${t.trim()}"`).join(", ")}]
readingTime: "${readingTime} min read"
author: "Soumabrata Ghosh"
---

# ${title}

${editor.getText()}
`;

    const blob = new Blob([markdownContent], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${slug || "post"}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyMDX = () => {
    if (!editor) return;
    const markdownContent = `---
title: "${title}"
slug: "${slug}"
tags: [${tags.split(",").map((t) => `"${t.trim()}"`).join(", ")}]
---

# ${title}

${editor.getText()}
`;
    navigator.clipboard.writeText(markdownContent);
    setCopiedMDX(true);
    setTimeout(() => setCopiedMDX(false), 2500);
  };

  if (!editor) {
    return (
      <div className="py-20 text-center font-mono text-sm text-[#7f756d]">
        INITIALIZING TIPTAP ENGINE...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-[#121822] border border-[#232e40] p-4 font-mono text-xs">
        <div className="flex items-center gap-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#e86b1c]/15 text-[#e86b1c] border border-[#e86b1c]/40">
            <FileText className="h-4 w-4" />
          </div>
          <div>
            <span className="font-bold text-[#f3e6d5]">TIPTAP STUDIO // </span>
            <span className="text-[#e86b1c] font-semibold">{savedStatus}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[#7f756d] hidden sm:inline">
            {wordCount} words • ~{readingTime} min read
          </span>

          <button
            onClick={handleCopyMDX}
            className="flex items-center gap-1.5 rounded-lg bg-[#18212e] px-3 py-1.5 text-[#f3e6d5] border border-[#232e40] hover:border-[#e86b1c] transition-colors"
          >
            {copiedMDX ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copiedMDX ? "Copied" : "Copy MDX"}</span>
          </button>

          <button
            onClick={handleExportMarkdown}
            className="flex items-center gap-1.5 rounded-lg bg-[#e86b1c] px-3 py-1.5 font-semibold text-white hover:bg-[#b84a0f] transition-colors shadow-sm shadow-[#e86b1c]/25"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export .md</span>
          </button>
        </div>
      </div>

      <div className="rounded-2xl bg-[#121822] border border-[#232e40] p-6 space-y-4">
        <div>
          <label className="block font-mono text-[10px] uppercase text-[#7f756d] mb-1">
            Article Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
            }}
            placeholder="Article Title..."
            className="w-full rounded-xl bg-[#0e141d] border border-[#232e40] px-4 py-2.5 text-lg font-bold text-[#f3e6d5] focus:border-[#e86b1c] focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
          <div>
            <label className="block text-[10px] uppercase text-[#7f756d] mb-1">
              URL Slug
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full rounded-lg bg-[#0e141d] border border-[#232e40] px-3 py-2 text-[#b8aba0] focus:border-[#e86b1c] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase text-[#7f756d] mb-1">
              Tags (comma separated)
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full rounded-lg bg-[#0e141d] border border-[#232e40] px-3 py-2 text-[#b8aba0] focus:border-[#e86b1c] focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div className="sticky top-20 z-20 flex flex-wrap items-center gap-1 rounded-xl bg-[#141b26]/95 border border-[#232e40] p-2 backdrop-blur-md">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={cn(
            "p-2 rounded-lg text-xs font-mono transition-colors",
            editor.isActive("bold")
              ? "bg-[#e86b1c] text-white"
              : "text-[#b8aba0] hover:bg-[#1f2838] hover:text-[#f3e6d5]"
          )}
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={cn(
            "p-2 rounded-lg text-xs font-mono transition-colors",
            editor.isActive("italic")
              ? "bg-[#e86b1c] text-white"
              : "text-[#b8aba0] hover:bg-[#1f2838] hover:text-[#f3e6d5]"
          )}
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </button>

        <div className="h-5 w-[1px] bg-[#283548] mx-1" />

        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={cn(
            "p-2 rounded-lg text-xs font-mono transition-colors",
            editor.isActive("heading", { level: 1 })
              ? "bg-[#e86b1c] text-white"
              : "text-[#b8aba0] hover:bg-[#1f2838] hover:text-[#f3e6d5]"
          )}
          title="Heading 1"
        >
          <Heading1 className="h-4 w-4" />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={cn(
            "p-2 rounded-lg text-xs font-mono transition-colors",
            editor.isActive("heading", { level: 2 })
              ? "bg-[#e86b1c] text-white"
              : "text-[#b8aba0] hover:bg-[#1f2838] hover:text-[#f3e6d5]"
          )}
          title="Heading 2"
        >
          <Heading2 className="h-4 w-4" />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={cn(
            "p-2 rounded-lg text-xs font-mono transition-colors",
            editor.isActive("heading", { level: 3 })
              ? "bg-[#e86b1c] text-white"
              : "text-[#b8aba0] hover:bg-[#1f2838] hover:text-[#f3e6d5]"
          )}
          title="Heading 3"
        >
          <Heading3 className="h-4 w-4" />
        </button>

        <div className="h-5 w-[1px] bg-[#283548] mx-1" />

        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={cn(
            "p-2 rounded-lg text-xs font-mono transition-colors",
            editor.isActive("bulletList")
              ? "bg-[#e86b1c] text-white"
              : "text-[#b8aba0] hover:bg-[#1f2838] hover:text-[#f3e6d5]"
          )}
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={cn(
            "p-2 rounded-lg text-xs font-mono transition-colors",
            editor.isActive("orderedList")
              ? "bg-[#e86b1c] text-white"
              : "text-[#b8aba0] hover:bg-[#1f2838] hover:text-[#f3e6d5]"
          )}
          title="Numbered List"
        >
          <ListOrdered className="h-4 w-4" />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={cn(
            "p-2 rounded-lg text-xs font-mono transition-colors",
            editor.isActive("codeBlock")
              ? "bg-[#e86b1c] text-white"
              : "text-[#b8aba0] hover:bg-[#1f2838] hover:text-[#f3e6d5]"
          )}
          title="Code Block"
        >
          <Code className="h-4 w-4" />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={cn(
            "p-2 rounded-lg text-xs font-mono transition-colors",
            editor.isActive("blockquote")
              ? "bg-[#e86b1c] text-white"
              : "text-[#b8aba0] hover:bg-[#1f2838] hover:text-[#f3e6d5]"
          )}
          title="Blockquote"
        >
          <Quote className="h-4 w-4" />
        </button>
      </div>

      <div className="rounded-2xl bg-[#0e141d] border border-[#232e40] p-6 md:p-8 min-h-[480px]">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};
