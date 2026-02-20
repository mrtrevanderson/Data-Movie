import * as fs from "fs";
import * as path from "path";
import { LobbyData, RegionData } from "./types";

function randomInRange(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateTrendPoints(count: number, baseValue: number): number[] {
  const points: number[] = [];
  let current = baseValue;
  for (let i = 0; i < count; i++) {
    const delta = randomInRange(-150, 600);
    current = Math.max(500, current + delta);
    points.push(current);
  }
  return points;
}

function generateRegions(): RegionData[] {
  const defs = [
    { id: "west",      label: "West"      },
    { id: "southwest", label: "Southwest" },
    { id: "midwest",   label: "Midwest"   },
    { id: "southeast", label: "Southeast" },
    { id: "northeast", label: "Northeast" },
  ];
  return defs.map(({ id, label }) => {
    const units = randomInRange(18_000, 62_000);
    const avgPrice = randomInRange(28_000, 52_000);
    return { id, label, units, revenue: units * avgPrice };
  });
}

const data: LobbyData = {
  company_name: "Automotive America",
  tagline: "New Thinking. New Possibilities.",
  kpis: [
    {
      label: "YTD Revenue",
      value: randomInRange(8_200_000_000, 11_400_000_000),
      format: "currency",
    },
    {
      label: "Vehicles Sold",
      value: randomInRange(680_000, 920_000),
      format: "integer",
    },
    {
      label: "EV Mix",
      value: parseFloat((Math.random() * 0.18 + 0.12).toFixed(4)),
      format: "percent",
    },
  ],
  trend: {
    label: "Monthly Unit Sales",
    points: generateTrendPoints(12, randomInRange(62_000, 72_000)),
  },
  regions: generateRegions(),
  last_updated: new Date().toISOString(),
};

const outputPath = path.join(process.cwd(), "data.json");
fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
console.log(`[fetchData] data.json written to ${outputPath}`);
console.log(`[fetchData] company_name  : ${data.company_name}`);
console.log(`[fetchData] last_updated  : ${data.last_updated}`);
console.log(`[fetchData] regions       : ${data.regions.map((r) => r.label).join(", ")}`);
