import "server-only";
import { serverSupabase } from "./supabase";

/**
 * Every provider implements one thing: hand the browser somewhere to PUT/POST
 * the bytes, and tell it the public URL those bytes will live at.
 *
 * The browser never sees a service_role key and the bytes never touch Next.
 * Adding a provider means adding one function that returns this shape.
 */
export type UploadTarget = {
  provider: "supabase" | "cloudinary";
  method: "PUT" | "POST";
  url: string;
  publicUrl: string;
  headers: Record<string, string>;
  fields: Record<string, string>;
};

/**
 * SVG is deliberately excluded. A public bucket serves it as image/svg+xml,
 * and opening that URL directly would run any script inside it on the storage
 * origin. Raster formats only.
 */
const ALLOWED = new Map<string, string>([
  ["image/png", "png"],
  ["image/jpeg", "jpg"],
  ["image/gif", "gif"],
  ["image/webp", "webp"],
  ["image/avif", "avif"],
]);

const MAX_BYTES = 8 * 1024 * 1024;

export function extensionFor(contentType: string): string | null {
  return ALLOWED.get(contentType.toLowerCase()) ?? null;
}

export function validateImage(contentType: string, size: number): string | null {
  if (!extensionFor(contentType)) return "Unsupported image type.";
  if (size > MAX_BYTES) return "Image must be 8 MB or smaller.";
  return null;
}

function safeName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(-60);
}

const stamp = () => new Date().toISOString().slice(0, 10);

export function providerName(): string {
  return (process.env.UPLOAD_PROVIDER ?? "supabase").toLowerCase();
}

export function providerConfigured(): boolean {
  if (providerName() === "cloudinary") {
    return Boolean(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_UPLOAD_PRESET);
  }
  return Boolean(process.env.SUPABASE_STORAGE_BUCKET);
}

async function supabaseTarget(filename: string, contentType: string): Promise<UploadTarget> {
  const bucket = process.env.SUPABASE_STORAGE_BUCKET;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!bucket || !anonKey) {
    throw new Error("Set SUPABASE_STORAGE_BUCKET to enable the supabase uploader.");
  }

  const supabase = serverSupabase();
  const key = `posts/${stamp()}/${crypto.randomUUID()}-${safeName(filename)}`;
  const { data, error } = await supabase.storage.from(bucket).createSignedUploadUrl(key);

  if (error || !data) {
    throw new Error(`Could not sign upload: ${error?.message ?? "unknown error"}`);
  }

  const { data: pub } = supabase.storage.from(bucket).getPublicUrl(key);

  // createSignedUploadUrl returns a path relative to the storage API root.
  const signed = data.signedUrl.startsWith("http")
    ? data.signedUrl
    : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1${data.signedUrl}`;

  return {
    provider: "supabase",
    method: "PUT",
    url: signed,
    publicUrl: pub.publicUrl,
    headers: {
      "content-type": contentType,
      authorization: `Bearer ${anonKey}`,
      "x-upsert": "true",
    },
    fields: {},
  };
}

async function cloudinaryTarget(filename: string): Promise<UploadTarget> {
  const cloud = process.env.CLOUDINARY_CLOUD_NAME;
  const preset = process.env.CLOUDINARY_UPLOAD_PRESET;
  if (!cloud || !preset) {
    throw new Error("Set CLOUDINARY_CLOUD_NAME and CLOUDINARY_UPLOAD_PRESET to enable cloudinary.");
  }

  // Unsigned preset: the preset name is the capability, and it is deliberately
  // public. Scope the preset to a folder and write-only in the Cloudinary UI.
  const folder = process.env.CLOUDINARY_FOLDER ?? "souma/blog";
  return {
    provider: "cloudinary",
    method: "POST",
    url: `https://api.cloudinary.com/v1_1/${cloud}/image/upload`,
    publicUrl: "",
    fields: {
      upload_preset: preset,
      folder,
      // Cloudinary derives the public URL from its response, so publicUrl is
      // filled in by the client after the POST.
      filename_override: safeName(filename),
    },
    headers: {},
  };
}

export async function createUploadTarget(
  filename: string,
  contentType: string
): Promise<UploadTarget> {
  const ext = extensionFor(contentType);
  if (!ext) throw new Error("Unsupported image type.");

  return providerName() === "cloudinary"
    ? cloudinaryTarget(filename)
    : supabaseTarget(filename, contentType);
}
