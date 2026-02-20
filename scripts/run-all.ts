import { execSync } from "child_process";
import path from "path";

function run(label: string, cmd: string) {
  console.log(`\n${"─".repeat(50)}`);
  console.log(`▶  ${label}`);
  console.log(`─`.repeat(50));
  execSync(cmd, { stdio: "inherit", cwd: process.cwd() });
}

console.log("\n╔══════════════════════════════════════════════════╗");
console.log("║   Lobby Display — Full Pipeline                  ║");
console.log("╚══════════════════════════════════════════════════╝");
console.log(`   Started: ${new Date().toLocaleString()}\n`);

const tsNode = `npx ts-node --project ${path.join(process.cwd(), "tsconfig.json")}`;

run(
  "Step 1 / 2 — Fetch Data",
  `${tsNode} ${path.join(process.cwd(), "src/data/fetchData.ts")}`
);

run(
  "Step 2 / 2 — Render Video",
  `${tsNode} ${path.join(process.cwd(), "scripts/render.ts")}`
);

console.log("\n╔══════════════════════════════════════════════════╗");
console.log("║   ✓ Pipeline complete!                           ║");
console.log("║   Output: dist/lobby.mp4                         ║");
console.log("╚══════════════════════════════════════════════════╝\n");
