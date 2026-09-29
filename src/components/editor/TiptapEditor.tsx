"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
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
  Undo2,
  Check,
  FileText,
  Rocket,
  Globe,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { TiptapNode, docText, estimateReadingTime } from "@/lib/richtext";
import { saveDraft, publishPost, unpublishPost, requestUploadTarget } from "@/app/write/actions";

const IMAGE_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/gif",
  "image/webp",
  "image/avif",
]);

async function uploadImage(file: File): Promise<string> {
  const grant = await requestUploadTarget(file.name, file.type, file.size);
  if (grant.ok !== true) throw new Error(grant.message);
  const { provider, method, url, publicUrl, headers, fields } = grant.target;

  if (provider === "cloudinary") {
    const body = new FormData();
    for (const [k, v] of Object.entries(fields)) body.append(k, v);
    body.append("file", file);
    const res = await fetch(url, { method: "POST", body });
    if (!res.ok) throw new Error(`Upload failed (${res.status})`);
    const json = (await res.json()) as { secure_url?: string };
    if (!json.secure_url) throw new Error("Cloudinary returned no URL.");
    return json.secure_url;
  }

  const res = await fetch(url, { method, headers, body: file });
  if (!res.ok) throw new Error(`Upload failed (${res.status})`);
  return publicUrl;
}

export interface EditablePost {
  slug: string;
  title: string;
  excerpt: string;
  tags: string[];
  content: TiptapNode;
  status: "draft" | "published";
}

type State = "idle" | "saving" | "saved" | "error";

const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const clock = (iso: string | null) =>
  iso ? new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "";

export const TiptapEditor: React.FC<{ initialPost?: EditablePost }> = ({ initialPost }) => {
  const router = useRouter();

  const [title, setTitle] = useState(initialPost?.title ?? "");
  const [slug, setSlug] = useState(initialPost?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(initialPost?.slug));
  const [excerpt, setExcerpt] = useState(initialPost?.excerpt ?? "");
  const [tags, setTags] = useState((initialPost?.tags ?? []).join(", "));
  const [status, setStatus] = useState<"draft" | "published">(initialPost?.status ?? "draft");

  const [state, setState] = useState<State>("idle");
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [uploads, setUploads] = useState(0);
  const [uploadError, setUploadError] = useState("");

  const insertImages = useRef<(files: File[]) => void>(() => {});

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      Image.configure({ inline: false, allowBase64: false }),
      Placeholder.configure({
        placeholder: "Write systems architecture documentation or technical post...",
      }),
      LinkExtension.configure({ openOnClick: false }),
    ],
    content: initialPost?.content ?? { type: "doc", content: [] },
    editorProps: {
      attributes: {
        class:
          "prose prose-invert max-w-none focus:outline-none min-h-[420px] font-sans text-sm md:text-base leading-relaxed text-[#f3e6d5]",
      },
      handlePaste: (_view, event) => {
        const files = Array.from(event.clipboardData?.files ?? []).filter((f) =>
          IMAGE_TYPES.has(f.type)
        );
        if (!files.length) return false;
        event.preventDefault();
        insertImages.current(files);
        return true;
      },
      handleDrop: (_view, event) => {
        const files = Array.from(event.dataTransfer?.files ?? []).filter((f) =>
          IMAGE_TYPES.has(f.type)
        );
        if (!files.length) return false;
        event.preventDefault();
        insertImages.current(files);
        return true;
      },
    },
  });

  insertImages.current = async (files: File[]) => {
    if (!editor) return;
    setUploadError("");
    setUploads((n) => n + files.length);
    for (const file of files) {
      try {
        const url = await uploadImage(file);
        const alt = window.prompt("Alt text for this image (describe it for screen readers):", file.name);
        if (alt === null) continue;
        editor.chain().focus().setImage({ src: url, alt }).run();
      } catch (error) {
        setUploadError(`Upload failed: ${(error as Error).message}`);
      } finally {
        setUploads((n) => n - 1);
      }
    }
  };

  const payload = useCallback(
    () => ({
      title,
      slug: slug || slugify(title),
      excerpt,
      tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      content: (editor?.getJSON() ?? { type: "doc", content: [] }) as TiptapNode,
    }),
    [title, slug, excerpt, tags, editor]
  );

  const dirty = useRef(false);
  useEffect(() => {
    const mark = () => {
      dirty.current = true;
    };
    if (!editor) return;
    editor.on("update", mark);
    return () => {
      editor.off("update", mark);
    };
  }, [editor]);

  useEffect(() => {
    if (!editor || !dirty.current || !title.trim()) return;

    setState("saving");
    const timer = setTimeout(async () => {
      const result = await saveDraft(payload());
      if (result.ok) {
        setSavedAt(result.savedAt);
        setState("saved");
        if (result.slug && result.slug !== slug) {
          setSlug(result.slug);
          setSlugTouched(true);
          router.replace(`/write?slug=${result.slug}`, { scroll: false });
        }
      } else {
        setState("error");
        setMessage(result.message);
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [title, slug, excerpt, tags, editor, payload, router]);

  const handlePublish = async () => {
    setBusy(true);
    setMessage("");
    const result = await publishPost(payload());
    setBusy(false);
    setMessage(result.message);
    if (result.ok) {
      setStatus("published");
      setSavedAt(result.savedAt);
      setState("saved");
      if (result.slug && result.slug !== slug) {
        setSlug(result.slug);
        router.replace(`/write?slug=${result.slug}`, { scroll: false });
      }
      router.refresh();
    } else {
      setState("error");
    }
  };

  const handleUnpublish = async () => {
    setBusy(true);
    const result = await unpublishPost(slug);
    setBusy(false);
    setMessage(result.message);
    if (result.ok) {
      setStatus("draft");
      router.refresh();
    }
  };

  const words = editor ? docText(editor.getJSON() as TiptapNode).trim().split(/\s+/).filter(Boolean).length : 0;
  const readingTime = estimateReadingTime((editor?.getJSON() ?? { type: "doc" }) as TiptapNode);

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
            <span
              className={cn(
                "font-semibold",
                state === "error" ? "text-red-400" : "text-[#e86b1c]"
              )}
            >
              {state === "saving"
                ? "SAVING..."
                : state === "error"
                  ? "SAVE FAILED"
                  : state === "saved"
                    ? `SAVED ${clock(savedAt)}`
                    : "READY"}
            </span>
            <span
              className={cn(
                "ml-2 rounded border px-1.5 py-0.5 text-[9px]",
                status === "published"
                  ? "border-emerald-500/40 text-emerald-400"
                  : "border-[#283548] text-[#b8aba0]"
              )}
            >
              {status.toUpperCase()}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[#7f756d] hidden sm:inline">
            {words} words • ~{readingTime} min read
          </span>
          {status === "published" ? (
            <button
              onClick={handleUnpublish}
              disabled={busy}
              className="flex items-center gap-1.5 rounded-lg bg-[#18212e] px-3 py-1.5 text-[#f3e6d5] border border-[#232e40] hover:border-amber-400 transition-colors disabled:opacity-50"
            >
              <Globe className="h-3.5 w-3.5" />
              <span>Unpublish</span>
            </button>
          ) : null}
          <button
            onClick={handlePublish}
            disabled={busy}
            className="flex items-center gap-1.5 rounded-lg bg-[#e86b1c] px-3 py-1.5 font-semibold text-white hover:bg-[#b84a0f] transition-colors shadow-sm shadow-[#e86b1c]/25 disabled:opacity-50"
          >
            <Rocket className="h-3.5 w-3.5" />
            <span>{busy ? "WORKING..." : "Publish"}</span>
          </button>
        </div>
      </div>

      {uploads > 0 ? (
        <p role="status" className="rounded-xl border border-[#e86b1c]/40 bg-[#e86b1c]/10 px-4 py-2.5 font-mono text-xs text-[#e86b1c]">
          UPLOADING {uploads} IMAGE{uploads > 1 ? "S" : ""}...
        </p>
      ) : null}

      {uploadError ? (
        <p role="alert" className="rounded-xl border border-red-500/40 bg-red-950/30 px-4 py-2.5 font-mono text-xs text-red-300">
          {uploadError}
        </p>
      ) : null}

      {message ? (
        <p
          role="status"
          className={cn(
            "rounded-xl border px-4 py-2.5 font-mono text-xs",
            state === "error"
              ? "border-red-500/40 bg-red-950/30 text-red-300"
              : "border-emerald-500/30 bg-emerald-950/25 text-emerald-300"
          )}
        >
          {message}
        </p>
      ) : null}

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
              if (!slugTouched) setSlug(slugify(e.target.value));
            }}
            placeholder="Article Title..."
            className="w-full rounded-xl bg-[#0e141d] border border-[#232e40] px-4 py-2.5 text-lg font-bold text-[#f3e6d5] focus:border-[#e86b1c] focus:outline-none"
          />
        </div>

        <div>
          <label className="block font-mono text-[10px] uppercase text-[#7f756d] mb-1">
            Excerpt
          </label>
          <textarea
            rows={2}
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="One or two sentences shown on the blog index..."
            className="w-full resize-y rounded-xl bg-[#0e141d] border border-[#232e40] px-4 py-2.5 text-sm text-[#f3e6d5] focus:border-[#e86b1c] focus:outline-none"
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
              onChange={(e) => {
                setSlugTouched(true);
                setSlug(slugify(e.target.value));
              }}
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
        {(
          [
            { label: "Bold", Icon: Bold, run: () => editor.chain().focus().toggleBold().run(), active: editor.isActive("bold") },
            { label: "Italic", Icon: Italic, run: () => editor.chain().focus().toggleItalic().run(), active: editor.isActive("italic") },
            { label: "Heading 1", Icon: Heading1, run: () => editor.chain().focus().toggleHeading({ level: 1 }).run(), active: editor.isActive("heading", { level: 1 }) },
            { label: "Heading 2", Icon: Heading2, run: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), active: editor.isActive("heading", { level: 2 }) },
            { label: "Heading 3", Icon: Heading3, run: () => editor.chain().focus().toggleHeading({ level: 3 }).run(), active: editor.isActive("heading", { level: 3 }) },
            { label: "Bullet List", Icon: List, run: () => editor.chain().focus().toggleBulletList().run(), active: editor.isActive("bulletList") },
            { label: "Numbered List", Icon: ListOrdered, run: () => editor.chain().focus().toggleOrderedList().run(), active: editor.isActive("orderedList") },
            { label: "Code Block", Icon: Code, run: () => editor.chain().focus().toggleCodeBlock().run(), active: editor.isActive("codeBlock") },
            { label: "Blockquote", Icon: Quote, run: () => editor.chain().focus().toggleBlockquote().run(), active: editor.isActive("blockquote") },
          ] as const
        ).map(({ label, Icon, run, active }, i) => (
          <React.Fragment key={label}>
            {(i === 2 || i === 5 || i === 8) && <div className="h-5 w-px bg-[#283548] mx-1" />}
            <button
              onClick={run}
              className={cn(
                "p-2 rounded-lg text-xs font-mono transition-colors",
                active
                  ? "bg-[#e86b1c] text-white"
                  : "text-[#b8aba0] hover:bg-[#1f2838] hover:text-[#f3e6d5]"
              )}
              title={label}
              aria-label={label}
            >
              <Icon className="h-4 w-4" />
            </button>
          </React.Fragment>
        ))}
        <div className="h-5 w-px bg-[#283548] mx-1" />
        <button
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="p-2 rounded-lg text-xs font-mono text-[#b8aba0] hover:bg-[#1f2838] hover:text-[#f3e6d5] disabled:opacity-30 transition-colors"
          title="Undo"
          aria-label="Undo"
        >
          <Undo2 className="h-4 w-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="p-2 rounded-lg text-xs font-mono text-[#b8aba0] hover:bg-[#1f2838] hover:text-[#f3e6d5] disabled:opacity-30 transition-colors"
          title="Redo"
          aria-label="Redo"
        >
          <Check className="h-4 w-4 rotate-90" />
        </button>
      </div>

      <div className="rounded-2xl bg-[#0e141d] border border-[#232e40] p-6 md:p-8 min-h-[480px]">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};
