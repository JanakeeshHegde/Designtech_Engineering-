/* ──────────────────────────────────────────────────────────────
   UPSCALE hero.mp4 1280×720 → 1920×1080
   High-quality Lanczos + 2-pass libx264 + web-optimized faststart
   ────────────────────────────────────────────────────────────── */
const fs = require("fs");
const path = require("path");
const { spawnSync, spawn } = require("child_process");

const ffmpegPath = require("ffmpeg-static");

const ROOT = path.resolve(__dirname, "..");
const INPUT = path.join(ROOT, "public", "hero.mp4");
const PASS_LOG = path.join(ROOT, "tmp_ffmpeg2pass");
const OUT_TMP = path.join(ROOT, "public", "hero-1080-tmp.mp4");
const BACKUP = path.join(ROOT, "public", "hero-original-720p.mp4");
const FINAL = path.join(ROOT, "public", "hero.mp4");

/* ── Parameters ── */
const TARGET_W = 1920;
const TARGET_H = 1080;
const FPS = 24;
const VIDEO_BITRATE = "14M";
const MAX_BITRATE  = "20M";
const BUF_SIZE     = "28M";

const scaleFilter =
  `scale=${TARGET_W}:${TARGET_H}:flags=lanczos+accurate_rnd+full_chroma_int+full_chroma_inp`;

const baseVideoArgs = [
  "-i", INPUT,
  "-an",
  "-vf", scaleFilter,
  "-r", FPS,
  "-c:v", "libx264",
  "-preset", "veryslow",
  "-tune", "film",
  "-profile:v", "high",
  "-level", "4.0",
  "-pix_fmt", "yuv420p",
  "-b:v", VIDEO_BITRATE,
  "-maxrate", MAX_BITRATE,
  "-bufsize", BUF_SIZE,
  "-g", 48, // keyframe every 2s @ 24fps
  "-keyint_min", 24,
  "-sc_threshold", 0,
  "-color_primaries", "bt709",
  "-color_trc", "bt709",
  "-colorspace", "bt709",
  "-x264-params",
    "aq-mode=3:aq-strength=0.8:deblock=-1,-1:merange=32:psy-rd=0.8,0.2:no-dct-decimate=1:no-fast-pskip=1",
];

function run(args, passLabel, extraEnv) {
  return new Promise((resolve, reject) => {
    console.log(`\n▶ ${passLabel} — ffmpeg ${args.join(" ")}`);
    const proc = spawn(ffmpegPath, args, {
      stdio: ["ignore", "inherit", "inherit"],
      env: { ...process.env, ...(extraEnv || {}) },
    });
    proc.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${passLabel} exited with code ${code}`));
    });
    proc.on("error", reject);
  });
}

async function main() {
  if (!fs.existsSync(INPUT)) throw new Error(`Input not found: ${INPUT}`);
  console.log("Source:", INPUT, fs.statSync(INPUT).size, "bytes");

  // Clean prior pass files / temp output
  for (const p of [PASS_LOG + "-0.log", PASS_LOG + "-0.log.mbtree", OUT_TMP]) {
    if (fs.existsSync(p)) fs.unlinkSync(p);
  }

  // ── Pass 1 ────────────────────────────────────────────────
  await run(
    [
      "-y",
      ...baseVideoArgs,
      "-pass", "1",
      "-passlogfile", PASS_LOG,
      "-f", "mp4",
      // Disable output file for pass 1? No — x264 pass 1 expects an output; use NUL
      process.platform === "win32" ? "NUL" : "/dev/null",
    ],
    "PASS 1/2 (analysis, Lanczos upscale, 14 Mbps 2-pass first pass)"
  );

  // ── Pass 2 ────────────────────────────────────────────────
  await run(
    [
      "-y",
      ...baseVideoArgs,
      "-pass", "2",
      "-passlogfile", PASS_LOG,
      "-movflags", "+faststart",
      "-f", "mp4",
      OUT_TMP,
    ],
    "PASS 2/2 (encode, libx264 veryslow film tune, +faststart moov-at-front)"
  );

  // Validate output exists and non-empty
  if (!fs.existsSync(OUT_TMP) || fs.statSync(OUT_TMP).size < 1024 * 256) {
    throw new Error("Upscaled output missing or too small.");
  }
  console.log("✓ Upscaled file generated:", OUT_TMP, fs.statSync(OUT_TMP).size, "bytes");

  // Back up original 720p (only once; don't overwrite existing backup)
  if (!fs.existsSync(BACKUP)) {
    fs.copyFileSync(INPUT, BACKUP);
    console.log("✓ Original 720p backed up →", BACKUP);
  }

  // Swap: rename new file → hero.mp4
  fs.renameSync(OUT_TMP, FINAL);
  console.log("✓ Swapped hero.mp4 → 1920×1080 upscale");

  // Clean pass logs
  for (const p of [PASS_LOG + "-0.log", PASS_LOG + "-0.log.mbtree"]) {
    if (fs.existsSync(p)) fs.unlinkSync(p);
  }
  console.log("✓ Cleaned 2-pass log files");

  console.log("\nDONE. Run `ffprobe` verification next.");
}

main().catch((e) => {
  console.error("FATAL:", e);
  process.exit(1);
});
