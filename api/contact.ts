/* ============================================================
   Vercel-style Serverless API — POST /api/contact
   Use this for production deployments on Vercel / Netlify
   (any platform that supports the Node Vercel handler format).

   Local development & preview use the Vite plugin in
   vite.config.ts instead, which invokes the same shared handler.
   ============================================================ */

import {
  validateAndNormalize,
  sendContactEmail,
  type ContactSubmissionPayload,
} from "../../src/server/sendContactEmail";

const IS_DEV = process.env.NODE_ENV !== "production";

interface VercelRequestLike {
  method?: string;
  body?: unknown;
  headers?: Record<string, string | string[] | undefined>;
}

interface VercelResponseLike {
  setHeader(name: string, value: string | string[]): void;
  status(code: number): this;
  send(body?: unknown): void;
  json(body: unknown): void;
}

type VercelHandler = (req: VercelRequestLike, res: VercelResponseLike) => Promise<void> | void;

const handler: VercelHandler = async (req, res) => {
  // Strict allowlist: only POST
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST,OPTIONS");
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    if (req.method === "OPTIONS") {
      res.status(204).send("");
      return;
    }
    res.status(405).json({ ok: false, error: "Method Not Allowed" });
    return;
  }

  // Basic CSRF-ish / JSON-only: require Content-Type application/json
  const ct = (req.headers && (req.headers["content-type"] as string | undefined)) || "";
  if (!/application\/json/i.test(ct)) {
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.status(400).json({ ok: false, error: "Invalid Content-Type" });
    return;
  }

  // Read body (serverless platforms have already parsed JSON, but guard just in case)
  let raw: unknown = req.body;
  if (typeof raw === "string" && raw.length > 0) {
    try {
      raw = JSON.parse(raw);
    } catch {
      res.status(400).json({ ok: false, error: "Invalid JSON body" });
      return;
    }
  }

  // Server-side validate + sanitize (exact field order validation)
  const normalized = validateAndNormalize(raw as ContactSubmissionPayload);
  if (!normalized.ok) {
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.status(400).json({ ok: false, error: normalized.reason || "Invalid payload" });
    return;
  }

  // Honeypot-filled submissions pretend to succeed so bots don't retry.
  // sendContactEmail already short-circuits for _gotcha filled; we still
  // return the same success envelope.

  const result = await sendContactEmail(normalized.data);

  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");

  if (result.ok) {
    const body: { ok: true; note?: string } = { ok: true };
    if (result.reason === "no-api-key-dev-only" && IS_DEV) {
      body.note =
        "RESEND_API_KEY not configured — mail not sent. Set RESEND_API_KEY + CONTACT_EMAIL in .env to enable delivery.";
    }
    res.status(200).json(body);
    return;
  }

  res.status(502).json({ ok: false, error: "Unable to send enquiry" });
};

export default handler;
