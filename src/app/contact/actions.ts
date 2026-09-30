"use server";

import { PERSONAL_INFO } from "@/data/socialLinks";
import {
  ContactResult,
  sendContactEmail,
  validateContact,
} from "@/lib/contact";

/** Honeypot: bots fill every input, humans never see this one. */
const trap = "company";

export async function submitContact(
  _prev: ContactResult,
  formData: FormData
): Promise<ContactResult> {
  if (String(formData.get(trap) ?? "").length > 0) {
    // Pretend it worked so a bot learns nothing.
    return { ok: true, errors: {}, message: "Message sent. I will reply shortly." };
  }

  const raw = {
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
  };

  const { errors } = validateContact(raw);
  if (Object.keys(errors).length) {
    return { ok: false, errors, message: "Please fix the highlighted fields." };
  }

  return sendContactEmail(raw, PERSONAL_INFO.email);
}
