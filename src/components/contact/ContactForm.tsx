"use client";

import { submitContact } from "@/app/contact/actions";
import { ContactResult } from "@/lib/contact";
import { Mail, Send } from "lucide-react";
import React, { useActionState, useRef } from "react";
import { useFormStatus } from "react-dom";

function SendButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#e86b1c] px-6 py-3 font-mono text-xs font-bold text-white shadow-lg shadow-[#e86b1c]/25 transition-all hover:bg-[#b84a0f] disabled:cursor-not-allowed disabled:opacity-60"
    >
      <Send className="h-3.5 w-3.5" />
      <span>{pending ? "SENDING..." : "Transmit Inquiry"}</span>
    </button>
  );
}

const field =
  "w-full rounded-xl bg-[#0e141d] border border-[#232e40] px-4 py-3 text-sm text-[#f3e6d5] placeholder:text-[#7f756d] focus:border-[#e86b1c] focus:outline-none transition-colors";

export const ContactForm: React.FC = () => {
  const [state, action] = useActionState<ContactResult, FormData>(
    submitContact,
    {
      ok: false,
      errors: {},
      message: "",
    },
  );
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action={async (formData) => {
        await action(formData);
        if (formRef.current) formRef.current.reset();
      }}
      className="space-y-4 text-left"
    >
      {/* Honeypot. Hidden from humans, irresistible to bots. */}
      <div
        className="absolute h-0 w-0 overflow-hidden opacity-0"
        aria-hidden="true"
      >
        <label htmlFor="company">Company</label>
        <input
          id="company"
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="name"
            className="block font-mono text-[10px] uppercase text-[#7f756d] mb-1"
          >
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            maxLength={80}
            autoComplete="name"
            placeholder="Your name"
            aria-invalid={Boolean(state.errors.name)}
            className={field}
          />
          {state.errors.name ? (
            <p role="alert" className="mt-1 font-mono text-[11px] text-red-400">
              {state.errors.name}
            </p>
          ) : null}
        </div>

        <div>
          <label
            htmlFor="email"
            className="block font-mono text-[10px] uppercase text-[#7f756d] mb-1"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            maxLength={200}
            autoComplete="email"
            placeholder="you@company.com"
            aria-invalid={Boolean(state.errors.email)}
            className={field}
          />
          {state.errors.email ? (
            <p role="alert" className="mt-1 font-mono text-[11px] text-red-400">
              {state.errors.email}
            </p>
          ) : null}
        </div>
      </div>

      <div>
        <label
          htmlFor="message"
          className="block font-mono text-[10px] uppercase text-[#7f756d] mb-1"
        >
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          maxLength={4000}
          placeholder="What are you building, and where does it hurt?"
          aria-invalid={Boolean(state.errors.message)}
          className={`${field} resize-y`}
        />
        {state.errors.message ? (
          <p role="alert" className="mt-1 font-mono text-[11px] text-red-400">
            {state.errors.message}
          </p>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center gap-4 pt-1">
        <SendButton />
        <p className="font-mono text-[11px] text-[#7f756d]">
          Goes straight to my inbox via Resend. No third-party tracking.
        </p>
      </div>

      {state.message ? (
        <p
          role="status"
          className={`rounded-xl border px-4 py-2.5 font-mono text-xs ${
            state.ok
              ? "border-emerald-500/30 bg-emerald-950/25 text-emerald-300"
              : "border-red-500/40 bg-red-950/30 text-red-300"
          }`}
        >
          <span className="inline-flex items-center gap-2">
            {state.ok ? <Mail className="h-3.5 w-3.5" /> : null}
            {state.message}
          </span>
        </p>
      ) : null}
    </form>
  );
};
