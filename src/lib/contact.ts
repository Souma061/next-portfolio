const MAX = { name: 80, email: 200, message: 4000 } as const;

// Local part: dot-separated atoms, no leading/trailing/double dots, no specials
// that could be used to smuggle a second recipient or a header.
const EMAIL =
  /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-z0-9]([a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+$/i;
const CONTROL = /[\u0000-\u001F\u007F-\u009F]/;

export interface ContactErrors {
  name?: string;
  email?: string;
  message?: string;
}

export interface ContactResult {
  ok: boolean;
  errors: ContactErrors;
  message: string;
}

export const LIMITS = MAX;

const clean = (v: unknown) => String(v ?? "").trim();

/**
 * Pure validation so it can be asserted without touching the network.
 * The recipient is never derived from user input.
 */
export function validateContact(input: {
  name?: unknown;
  email?: unknown;
  message?: unknown;
}): { errors: ContactErrors; clean: { name: string; email: string; message: string } } {
  const name = clean(input.name);
  const email = clean(input.email);
  const message = clean(input.message);
  const errors: ContactErrors = {};

  if (!name) errors.name = "Name is required.";
  else if (CONTROL.test(name) || name.length > MAX.name) {
    errors.name = `Name must be 1-${MAX.name} characters with no line breaks.`;
  }

  if (!email) errors.email = "Email is required.";
  else if (!EMAIL.test(email) || email.length > MAX.email) {
    errors.email = "Enter a valid email address.";
  }

  if (!message) errors.message = "Message is required.";
  else if (CONTROL.test(message.replace(/\r?\n/g, "")) || message.length > MAX.message) {
    errors.message = `Message must be ${MAX.message} characters or fewer.`;
  } else if (message.length < 10) {
    errors.message = "Message is a little too short.";
  }

  return { errors, clean: { name, email, message } };
}

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Best-effort throttle. Honest limit: this is per-instance in-memory state, so
 * on serverless it only throttles per warm container. The honeypot and Resend's
 * own rate limits are the real backstops.
 */
const recent = new Map<string, number>();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 3;

export function rateLimited(key: string, now = Date.now()): boolean {
  const last = recent.get(key) ?? 0;
  if (now - last < WINDOW_MS) {
    const hits = (recent.get(`${key}:count`) ?? 0) + 1;
    recent.set(`${key}:count`, hits);
    return hits > MAX_PER_WINDOW;
  }
  recent.set(key, now);
  recent.set(`${key}:count`, 1);
  return false;
}

export function resetThrottle(): void {
  recent.clear();
}

export async function sendContactEmail(
  input: { name?: unknown; email?: unknown; message?: unknown },
  recipient: string
): Promise<ContactResult> {
  const { errors, clean: data } = validateContact(input);
  if (Object.keys(errors).length) {
    return { ok: false, errors, message: "Please fix the highlighted fields." };
  }

  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(recipient)) {
    return {
      ok: false,
      errors: {},
      message: "Email is not configured on this deployment.",
    };
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM;
  if (!apiKey || !from) {
    return {
      ok: false,
      errors: {},
      message: "Email is not configured on this deployment.",
    };
  }

  if (rateLimited("contact")) {
    return {
      ok: false,
      errors: {},
      message: "Too many messages sent. Please try again in a minute.",
    };
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      // Recipient is fixed in code, never taken from the request body.
      to: [recipient],
      from,
      reply_to: data.email,
      subject: `Portfolio inquiry from ${data.name}`,
      text: `${data.message}\n\n---\nFrom: ${data.name}\nReply to: ${data.email}`,
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    console.error("resend failed", res.status, detail.slice(0, 300));
    return {
      ok: false,
      errors: {},
      message: "Could not send. Please email me directly instead.",
    };
  }

  return { ok: true, errors: {}, message: "Message sent. I will reply shortly." };
}

export const EMPTY_CONTACT: ContactResult = { ok: false, errors: {}, message: "" };
