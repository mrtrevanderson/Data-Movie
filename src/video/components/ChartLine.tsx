import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";

interface ChartLineProps {
  points: number[];
  width: number;
  height: number;
  startFrame: number;
  durationFrames: number;
  color?: string;
  label?: string;
}

function buildPath(points: number[], w: number, h: number): string {
  const minVal = Math.min(...points);
  const maxVal = Math.max(...points);
  const range = maxVal - minVal || 1;
  const padX = 40;
  const padY = 60;
  const innerW = w - padX * 2;
  const innerH = h - padY * 2;

  const coords = points.map((p, i) => {
    const x = padX + (i / (points.length - 1)) * innerW;
    const y = padY + innerH - ((p - minVal) / range) * innerH;
    return { x, y };
  });

  let d = `M ${coords[0].x} ${coords[0].y}`;
  for (let i = 1; i < coords.length; i++) {
    const prev = coords[i - 1];
    const curr = coords[i];
    const cpx = (prev.x + curr.x) / 2;
    d += ` C ${cpx} ${prev.y}, ${cpx} ${curr.y}, ${curr.x} ${curr.y}`;
  }
  return d;
}

function getPathLength(points: number[], w: number, h: number): number {
  // Approximate total path length for dashoffset animation
  // We'll use a rough estimate based on segment distances
  const minVal = Math.min(...points);
  const maxVal = Math.max(...points);
  const range = maxVal - minVal || 1;
  const padX = 40;
  const padY = 60;
  const innerW = w - padX * 2;
  const innerH = h - padY * 2;

  const coords = points.map((p, i) => ({
    x: padX + (i / (points.length - 1)) * innerW,
    y: padY + innerH - ((p - minVal) / range) * innerH,
  }));

  let length = 0;
  for (let i = 1; i < coords.length; i++) {
    const dx = coords[i].x - coords[i - 1].x;
    const dy = coords[i].y - coords[i - 1].y;
    length += Math.sqrt(dx * dx + dy * dy);
  }
  return length * 1.15; // slight overestimate for curves
}

function buildAreaPath(points: number[], w: number, h: number): string {
  const minVal = Math.min(...points);
  const maxVal = Math.max(...points);
  const range = maxVal - minVal || 1;
  const padX = 40;
  const padY = 60;
  const innerW = w - padX * 2;
  const innerH = h - padY * 2;

  const coords = points.map((p, i) => ({
    x: padX + (i / (points.length - 1)) * innerW,
    y: padY + innerH - ((p - minVal) / range) * innerH,
  }));

  let d = `M ${coords[0].x} ${h - padY}`;
  d += ` L ${coords[0].x} ${coords[0].y}`;
  for (let i = 1; i < coords.length; i++) {
    const prev = coords[i - 1];
    const curr = coords[i];
    const cpx = (prev.x + curr.x) / 2;
    d += ` C ${cpx} ${prev.y}, ${cpx} ${curr.y}, ${curr.x} ${curr.y}`;
  }
  d += ` L ${coords[coords.length - 1].x} ${h - padY} Z`;
  return d;
}

function getDotCoords(
  points: number[],
  w: number,
  h: number
): { x: number; y: number }[] {
  const minVal = Math.min(...points);
  const maxVal = Math.max(...points);
  const range = maxVal - minVal || 1;
  const padX = 40;
  const padY = 60;
  const innerW = w - padX * 2;
  const innerH = h - padY * 2;
  return points.map((p, i) => ({
    x: padX + (i / (points.length - 1)) * innerW,
    y: padY + innerH - ((p - minVal) / range) * innerH,
  }));
}

export const ChartLine: React.FC<ChartLineProps> = ({
  points,
  width,
  height,
  startFrame,
  durationFrames,
  color = theme.accent,
  label,
}) => {
  const frame = useCurrentFrame();

  const progress = interpolate(
    frame,
    [startFrame, startFrame + durationFrames],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const pathD = buildPath(points, width, height);
  const areaD = buildAreaPath(points, width, height);
  const totalLength = getPathLength(points, width, height);
  const dashOffset = totalLength * (1 - progress);

  const dots = getDotCoords(points, width, height);
  const lastDotIndex = Math.floor(progress * (points.length - 1));

  const labelOpacity = interpolate(
    frame,
    [startFrame + durationFrames * 0.8, startFrame + durationFrames],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const areaOpacity = interpolate(
    frame,
    [startFrame, startFrame + durationFrames * 0.5],
    [0, 0.15],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Y-axis labels
  const minVal = Math.min(...points);
  const maxVal = Math.max(...points);

  return (
    <svg width={width} height={height} style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.4" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Grid lines */}
      {[0, 0.25, 0.5, 0.75, 1].map((t) => {
        const y = 60 + (height - 120) * (1 - t);
        const val = Math.round(minVal + (maxVal - minVal) * t);
        return (
          <g key={t}>
            <line
              x1={40}
              y1={y}
              x2={width - 20}
              y2={y}
              stroke={theme.whiteAlpha10}
              strokeWidth={2}
            />
            <text
              x={20}
              y={y + 6}
              fill={theme.whiteAlpha30}
              fontSize={24}
              textAnchor="end"
              fontFamily={theme.fontFamily}
            >
              {val}
            </text>
          </g>
        );
      })}

      {/* Area fill */}
      <path d={areaD} fill="url(#areaGrad)" opacity={areaOpacity} />

      {/* Main line */}
      <path
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth={8}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={totalLength}
        strokeDashoffset={dashOffset}
        filter="url(#glow)"
      />

      {/* Dots for each data point that has been "drawn" */}
      {dots.map((dot, i) => {
        const dotProgress = interpolate(
          frame,
          [
            startFrame + (i / points.length) * durationFrames,
            startFrame + ((i + 0.5) / points.length) * durationFrames,
          ],
          [0, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );
        return (
          <circle
            key={i}
            cx={dot.x}
            cy={dot.y}
            r={10}
            fill={color}
            opacity={dotProgress}
            filter="url(#glow)"
          />
        );
      })}

      {/* Callout label on last point */}
      {label && (
        <g
          opacity={labelOpacity}
          transform={`translate(${dots[dots.length - 1].x + 20}, ${dots[dots.length - 1].y - 20})`}
        >
          <rect
            x={0}
            y={-34}
            width={label.length * 18 + 32}
            height={48}
            rx={10}
            fill={color}
            opacity={0.9}
          />
          <text
            x={16}
            y={0}
            fill={theme.bg}
            fontSize={28}
            fontWeight={700}
            fontFamily={theme.fontFamily}
          >
            {label}
          </text>
        </g>
      )}
    </svg>
  );
};
