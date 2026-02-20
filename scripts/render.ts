import path from "path";
import fs from "fs";
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import { LobbyData } from "../src/data/types";

async function main() {
  console.log("\n═══════════════════════════════════════════════");
  console.log("  Lobby Display — Remotion Render");
  console.log("═══════════════════════════════════════════════\n");

  // ── 1. Load data.json ────────────────────────────────────────────────────
  const dataPath = path.join(process.cwd(), "data.json");
  if (!fs.existsSync(dataPath)) {
    console.error("[render] ERROR: data.json not found. Run `npm run data` first.");
    process.exit(1);
  }
  const data: LobbyData = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
  console.log(`[render] Loaded data.json`);
  console.log(`         company_name : ${data.company_name}`);
  console.log(`         last_updated : ${data.last_updated}`);
  console.log(`         kpis         : ${data.kpis.map((k) => k.label).join(", ")}`);
  console.log(`         trend points : ${data.trend.points.length}`);

  // ── 2. Ensure dist/ exists ───────────────────────────────────────────────
  const distDir = path.join(process.cwd(), "dist");
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
    console.log(`[render] Created dist/ directory`);
  }

  const outputPath = path.join(distDir, "lobby.mp4");

  // ── 3. Bundle the Remotion composition ──────────────────────────────────
  console.log("\n[render] Bundling Remotion composition...");
  const bundleStart = Date.now();

  const entryPoint = path.join(process.cwd(), "src", "video", "index.ts");
  const bundled = await bundle({
    entryPoint,
    webpackOverride: (config) => config,
  });

  console.log(`[render] Bundle complete in ${((Date.now() - bundleStart) / 1000).toFixed(1)}s`);

  // ── 4. Select composition ────────────────────────────────────────────────
  console.log("[render] Selecting composition 'LobbyDisplay'...");
  const composition = await selectComposition({
    serveUrl: bundled,
    id: "LobbyDisplay",
    inputProps: { data },
  });

  console.log(
    `[render] Composition: ${composition.width}×${composition.height} @ ${composition.fps}fps, ` +
      `${composition.durationInFrames} frames (${(composition.durationInFrames / composition.fps).toFixed(0)}s)`
  );

  // ── 5. Render ─────────────────────────────────────────────────────────────
  console.log(`\n[render] Rendering to ${outputPath}`);
  console.log(`[render] This may take several minutes for 4K...\n`);

  const renderStart = Date.now();
  let lastLoggedPct = -1;

  await renderMedia({
    composition,
    serveUrl: bundled,
    codec: "h264",
    outputLocation: outputPath,
    inputProps: { data },
    imageFormat: "jpeg",
    jpegQuality: 90,
    onProgress: ({ progress }) => {
      const pct = Math.round(progress * 100);
      if (pct !== lastLoggedPct && pct % 5 === 0) {
        const bar = "█".repeat(pct / 5) + "░".repeat(20 - pct / 5);
        process.stdout.write(`\r[render] [${bar}] ${pct}%`);
        lastLoggedPct = pct;
      }
    },
  });

  const elapsed = ((Date.now() - renderStart) / 1000).toFixed(1);
  const size = (fs.statSync(outputPath).size / (1024 * 1024)).toFixed(1);

  console.log(`\n\n[render] ✓ Done in ${elapsed}s`);
  console.log(`[render] ✓ Output : ${outputPath}`);
  console.log(`[render] ✓ Size   : ${size} MB`);
  console.log("\n═══════════════════════════════════════════════\n");
}

main().catch((err) => {
  console.error("\n[render] FATAL:", err);
  process.exit(1);
});
