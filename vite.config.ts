import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react-swc'

/* ------------------------------------------------------------
   LOCAL API PLUGIN — POST /api/contact
   Hooks into Vite dev server (configureServer) and Vite
   preview server (configurePreviewServer) so the email route
   works identically in npm run dev / npm run preview.

   Shared server handler: src/server/sendContactEmail.ts

   In production: uses Vercel-style /api/contact.ts at the repo
   root (deployed as a serverless function).
-------------------------------------------------------------- */

async function readJsonBody(stream: NodeJS.ReadableStream & { on: any; removeListener: any }): Promise<unknown> {
  return await new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    let done = false;
    const onData = (c: Buffer) => chunks.push(c);
    const onEnd = (err?: Error) => {
      if (done) return;
      done = true;
      (stream as any).removeListener("data", onData);
      (stream as any).removeListener("end", onEnd);
      (stream as any).removeListener("error", onEnd);
      if (err) return reject(err);
      const raw = Buffer.concat(chunks).toString("utf8");
      if (!raw) return resolve({});
      try {
        resolve(JSON.parse(raw));
      } catch (e) {
        reject(e);
      }
    };
    (stream as any).on("data", onData);
    (stream as any).on("end", () => onEnd());
    (stream as any).on("error", onEnd);
  });
}

function contactApiPlugin(): Plugin {
  const PATH = "/api/contact";

  async function handle(req: any, res: any): Promise<boolean> {
    if (req.url !== PATH && !req.url?.startsWith(PATH + "?")) return false;

    // OPTIONS preflight for browser / external consumers
    if (req.method === "OPTIONS") {
      res.statusCode = 204;
      res.setHeader("Allow", "POST,OPTIONS");
      res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type, Accept");
      res.end();
      return true;
    }

    if (req.method !== "POST") {
      res.statusCode = 405;
      res.setHeader("Allow", "POST,OPTIONS");
      res.setHeader("Content-Type", "application/json; charset=utf-8");
      res.end(JSON.stringify({ ok: false, error: "Method Not Allowed" }));
      return true;
    }

    // Guard JSON-only Content-Type
    const ct: string = req.headers["content-type"] || "";
    if (!/application\/json/i.test(ct)) {
      res.statusCode = 400;
      res.setHeader("Content-Type", "application/json; charset=utf-8");
      res.end(JSON.stringify({ ok: false, error: "Invalid Content-Type" }));
      return true;
    }

    // Dynamic import keeps module node-only (never bundled by Vite client).
    const mod = await import("./src/server/sendContactEmail.ts");
    const { validateAndNormalize, sendContactEmail } = mod;

    let rawBody: unknown;
    try {
      rawBody = await readJsonBody(req);
    } catch (e) {
      res.statusCode = 400;
      res.setHeader("Content-Type", "application/json; charset=utf-8");
      res.end(JSON.stringify({ ok: false, error: "Invalid JSON body" }));
      return true;
    }

    const normalized = validateAndNormalize(rawBody);
    if (!normalized.ok) {
      res.statusCode = 400;
      res.setHeader("Content-Type", "application/json; charset=utf-8");
      res.end(JSON.stringify({ ok: false, error: normalized.reason || "Invalid payload" }));
      return true;
    }

    let result: { ok: boolean; reason?: string };
    try {
      result = await sendContactEmail(normalized.data);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error("[contact api] sendContactEmail threw:", e);
      result = { ok: false, reason: "exception" };
    }

    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.setHeader("Cache-Control", "no-store");

    if (result.ok) {
      const body: { ok: true; note?: string } = { ok: true };
      if (result.reason === "no-api-key-dev-only") {
        body.note =
          "RESEND_API_KEY not configured — mail not delivered. Set RESEND_API_KEY and CONTACT_EMAIL in .env to enable live email delivery to the company inbox.";
      }
      res.statusCode = 200;
      res.end(JSON.stringify(body));
      return true;
    }

    res.statusCode = 502;
    res.end(JSON.stringify({ ok: false, error: "Unable to send enquiry" }));
    return true;
  }

  return {
    name: "contact-api-local",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        try {
          const handled = await handle(req, res);
          if (!handled) next();
        } catch (e) {
          next(e as any);
        }
      });
    },
    configurePreviewServer(server) {
      server.middlewares.use(async (req, res, next) => {
        try {
          const handled = await handle(req, res);
          if (!handled) next();
        } catch (e) {
          next(e as any);
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), contactApiPlugin()],
  server: {
    // Serve index.html for all routes (SPA fallback)
    historyApiFallback: true,
    host: '127.0.0.1',
    port: 5190,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react-router')) return 'router';
          if (id.includes('node_modules/gsap')) return 'gsap';
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) return 'vendor';
        },
      },
    },
  },
})
