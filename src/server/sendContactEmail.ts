/* ============================================================
   SHARED — Contact form submission handler
   Server-side ONLY. Do NOT import from frontend code.
   ============================================================ */

/// <reference types="node" />

import { Resend } from "resend";

/* ---------- Types (exact fields from src/components/Contact.tsx) ---------- */

export interface ContactSubmissionPayload {
  fullName: string;
  email: string;
  phone?: string;
  company?: string;
  subject: string;
  message: string;
  /** Honeypot — only bots fill this; silently discard. */
  _gotcha?: string;
}

export interface ContactSendResult {
  ok: boolean;
  reason?: string;
}

/* ---------- Sanitization ---------- */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_LEN_NAME = 120;
const MAX_LEN_EMAIL = 160;
const MAX_LEN_PHONE = 40;
const MAX_LEN_COMPANY = 160;
const MAX_LEN_SUBJECT = 160;
const MAX_LEN_MESSAGE = 8000;

function stripHtml(value: string): string {
  return value
    .replace(/<[^>]*>/g, "")
    .replace(/javascript:/gi, "")
    .replace(/data:/gi, "")
    .replace(/on\w+\s*=/gi, "");
}

function sanitize(input: string, max: number): string {
  return stripHtml(input.replace(/\0/g, ""))
    .trim()
    .slice(0, max);
}

export function validateAndNormalize(raw: unknown):
  | { ok: true; data: ContactSubmissionPayload }
  | { ok: false; reason: string } {
  if (!raw || typeof raw !== "object") {
    return { ok: false, reason: "Invalid payload" };
  }
  const r = raw as Record<string, unknown>;

  // Honeypot check first — if filled, silently accept (don't send, report success).
  const gotcha = typeof r._gotcha === "string" ? r._gotcha : "";
  if (gotcha.trim().length > 0) {
    return {
      ok: true,
      data: {
        fullName: "",
        email: "",
        subject: "",
        message: "",
        _gotcha: gotcha,
      },
    };
  }

  const fullName = sanitize(String(r.fullName ?? ""), MAX_LEN_NAME);
  const email = sanitize(String(r.email ?? ""), MAX_LEN_EMAIL).toLowerCase();
  const phone = sanitize(String(r.phone ?? ""), MAX_LEN_PHONE);
  const company = sanitize(String(r.company ?? ""), MAX_LEN_COMPANY);
  const subject = sanitize(String(r.subject ?? ""), MAX_LEN_SUBJECT);
  const message = sanitize(String(r.message ?? ""), MAX_LEN_MESSAGE);

  if (fullName.length < 1) return { ok: false, reason: "Name is required" };
  if (!EMAIL_RE.test(email)) return { ok: false, reason: "Valid email is required" };
  if (subject.length < 1) return { ok: false, reason: "Subject is required" };
  if (message.length < 1) return { ok: false, reason: "Message is required" };

  // Prevent header-injection via newlines in short single-line fields.
  const noNewlines = (s: string) => s.replace(/[\r\n]+/g, " ");
  const cleanEmail = email.replace(/[\r\n\s]+/g, "");

  return {
    ok: true,
    data: {
      fullName: noNewlines(fullName),
      email: cleanEmail,
      phone: noNewlines(phone),
      company: noNewlines(company),
      subject: noNewlines(subject),
      message,
    },
  };
}

/* ---------- Email body (exact form field order) ----------
   Existing Contact form field order on the website:
     1. Full Name
     2. Email Address
     3. Phone Number
     4. Company / Organization
     5. Subject
     6. Message
   We MUST reproduce this exact order and labels in the email.
-------------------------------------------------------------- */

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function buildPlainTextBody(d: ContactSubmissionPayload): string {
  const line = "----------------------------------------";
  const rows: string[] = [];
  rows.push(line);
  rows.push("DESIGNTECH ENGINEERING");
  rows.push("CONTACT ENQUIRY");
  rows.push(line);
  rows.push("");
  rows.push("Name");
  rows.push(d.fullName);
  rows.push("");
  rows.push("Email");
  rows.push(d.email);
  rows.push("");
  rows.push("Phone");
  rows.push(d.phone || "—");
  rows.push("");
  rows.push("Company");
  rows.push(d.company || "—");
  rows.push("");
  rows.push("Subject");
  rows.push(d.subject);
  rows.push("");
  rows.push("Message");
  rows.push(d.message);
  rows.push("");
  rows.push(line);
  rows.push("");
  rows.push("Submitted from: Designtech Engineering Website");
  return rows.join("\n");
}

export function buildHtmlBody(d: ContactSubmissionPayload): string {
  const h = escapeHtml;
  return `
    <div style="font-family: Manrope, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif; color:#202124; background:#F7F5F0; padding:24px;">
      <div style="max-width:640px; margin:0 auto; background:#FFFFFF; border:1px solid #D9D5CC; border-radius:4px; overflow:hidden;">
        <div style="background:#FFFFFF; padding:22px 26px; border-bottom:1px solid #D9D5CC;">
          <div style="color:#A87524; font-family:'DM Mono', monospace; letter-spacing:3px; font-size:11px; font-weight:600; margin-bottom:4px;">DESIGNTECH ENGINEERING</div>
          <div style="font-size:20px; font-weight:800; letter-spacing:-0.01em;">CONTACT ENQUIRY</div>
          <div style="height:1px; background:#A87524; opacity:0.3; margin-top:14px;"></div>
        </div>
        <div style="padding:18px 26px 24px;">
          <div style="display:flex; flex-direction:column; gap:14px;">
            <div>
              <div style="font-family:'DM Mono', monospace; font-size:11px; letter-spacing:0.12em; color:#687078; margin-bottom:4px; font-weight:600;">NAME</div>
              <div style="font-size:16px; color:#202124; font-weight:600;">${h(d.fullName)}</div>
            </div>
            <div>
              <div style="font-family:'DM Mono', monospace; font-size:11px; letter-spacing:0.12em; color:#687078; margin-bottom:4px; font-weight:600;">EMAIL</div>
              <div style="font-size:16px; color:#202124; font-weight:500;">${h(d.email)}</div>
            </div>
            <div>
              <div style="font-family:'DM Mono', monospace; font-size:11px; letter-spacing:0.12em; color:#687078; margin-bottom:4px; font-weight:600;">PHONE</div>
              <div style="font-size:16px; color:#202124; font-weight:500;">${h(d.phone || "—")}</div>
            </div>
            <div>
              <div style="font-family:'DM Mono', monospace; font-size:11px; letter-spacing:0.12em; color:#687078; margin-bottom:4px; font-weight:600;">COMPANY</div>
              <div style="font-size:16px; color:#202124; font-weight:500;">${h(d.company || "—")}</div>
            </div>
            <div>
              <div style="font-family:'DM Mono', monospace; font-size:11px; letter-spacing:0.12em; color:#687078; margin-bottom:4px; font-weight:600;">SUBJECT</div>
              <div style="font-size:16px; color:#202124; font-weight:600;">${h(d.subject)}</div>
            </div>
            <div>
              <div style="font-family:'DM Mono', monospace; font-size:11px; letter-spacing:0.12em; color:#687078; margin-bottom:4px; font-weight:600;">MESSAGE</div>
              <div style="font-size:15px; line-height:1.65; color:#202124; white-space:pre-wrap; background:#FAF8F5; border:1px solid #E6E2D9; padding:14px 16px; border-radius:2px;">${h(d.message)}</div>
            </div>
          </div>
          <div style="height:1px; background:#D9D5CC; margin:22px 0 14px;"></div>
          <div style="font-family:'DM Mono', monospace; font-size:11px; color:#687078; letter-spacing:0.06em;">
            Reply to this email to respond directly to <span style="color:#A87524; font-weight:600;">${h(d.email)}</span>
            <br />Submitted from: Designtech Engineering Website
          </div>
        </div>
      </div>
    </div>
  `;
}

/* ---------- Sender (uses verified Resend domain + brand) ---------- */

const DEFAULT_FROM_NAME = "Designtech Engineering Website";
const DEFAULT_FROM_EMAIL_LOCAL = "enquiries";
/**
 * Resend requires a verified sender domain. For production, set a verified
 * sender in RESEND_FROM (e.g. "Designtech Engineering <enquiries@designtecheng.in>").
 * If the env is not set, we fall back to the `onboarding@resend.dev` test sender
 * (which only delivers to the single CONTACT_EMAIL target during testing).
 */
function resolveFrom(): string {
  if (process.env.RESEND_FROM) return process.env.RESEND_FROM;
  const contactEmail = process.env.CONTACT_EMAIL || "designtecheng.team@gmail.com";
  const domainMatch = contactEmail.match(/@([^@]+)$/);
  const domain = domainMatch ? domainMatch[1] : "resend.dev";
  if (domain === "resend.dev" || domain === "gmail.com") {
    return `${DEFAULT_FROM_NAME} <onboarding@resend.dev>`;
  }
  return `${DEFAULT_FROM_NAME} <${DEFAULT_FROM_EMAIL_LOCAL}@${domain}>`;
}

/* ---------- Send via Resend ---------- */

export async function sendContactEmail(payload: ContactSubmissionPayload): Promise<ContactSendResult> {
  // Honeypot-filled — silently succeed (don't send email).
  if (payload._gotcha && payload._gotcha.trim().length > 0) {
    return { ok: true };
  }

  const contactEmail =
    (process.env.CONTACT_EMAIL as string | undefined)?.trim() ||
    "designtecheng.team@gmail.com";

  const resendKey = (process.env.RESEND_API_KEY as string | undefined)?.trim();

  if (!resendKey) {
    // Missing credentials — in dev we still succeed with a log so UI flow works;
    // in production this should be caught by the server entrypoint (handled there).
    // eslint-disable-next-line no-console
    console.warn("[sendContactEmail] RESEND_API_KEY not set. Email NOT sent.");
    return { ok: true, reason: "no-api-key-dev-only" };
  }

  const from = resolveFrom();
  const subjectLine = `New Website Enquiry — ${payload.subject}`;
  const replyTo = payload.email;
  const to = [contactEmail];

  const plain = buildPlainTextBody(payload);
  const html = buildHtmlBody(payload);

  try {
    const resend = new Resend(resendKey);
    const resp = await resend.emails.send({
      from,
      to,
      replyTo: replyTo,
      subject: subjectLine,
      text: plain,
      html,
    });

    if ((resp as unknown as { error?: unknown }).error) {
      const err = (resp as unknown as { error: { message?: string } }).error;
      const msg = typeof err === "object" && err ? err.message : String(err);
      // eslint-disable-next-line no-console
      console.error("[sendContactEmail] Resend error:", msg);
      return { ok: false, reason: "resend_error" };
    }

    return { ok: true };
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("[sendContactEmail] Exception during send:", err);
    return { ok: false, reason: "exception" };
  }
}
