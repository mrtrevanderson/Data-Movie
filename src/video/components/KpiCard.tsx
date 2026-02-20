import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";
import { Kpi } from "../../data/types";

interface KpiCardProps {
  kpi: Kpi;
  delay: number; // frame offset
  accentColor: string;
}

function formatValue(value: number, format: Kpi["format"], progress: number): string {
  const animated = value * progress;
  if (format === "currency") {
    if (animated >= 1_000_000) {
      return "$" + (animated / 1_000_000).toFixed(2) + "M";
    }
    return "$" + Math.round(animated).toLocaleString();
  }
  if (format === "percent") {
    return (animated * 100).toFixed(2) + "%";
  }
  return Math.round(animated).toLocaleString();
}

export const KpiCard: React.FC<KpiCardProps> = ({ kpi, delay, accentColor }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const startFrame = delay;
  const endFrame = delay + fps * 1.2;

  const cardOpacity = interpolate(frame, [startFrame, startFrame + fps * 0.4], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const cardY = interpolate(frame, [startFrame, startFrame + fps * 0.5], [80, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const countProgress = interpolate(frame, [startFrame + fps * 0.3, endFrame], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const glowOpacity = interpolate(
    frame,
    [startFrame, startFrame + fps * 0.8, startFrame + fps * 1.5],
    [0, 0.6, 0.3],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <div
      style={{
        opacity: cardOpacity,
        transform: `translateY(${cardY}px)`,
        width: theme.card.width,
        height: theme.card.height,
        background: theme.cardBg,
        border: `2px solid ${accentColor}44`,
        borderRadius: theme.card.radius,
        padding: theme.card.padding,
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Top accent bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 6,
          background: `linear-gradient(90deg, ${accentColor}, ${accentColor}00)`,
          opacity: glowOpacity,
        }}
      />

      {/* Glow blob */}
      <div
        style={{
          position: "absolute",
          top: -100,
          right: -100,
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: accentColor,
          opacity: glowOpacity * 0.08,
          filter: "blur(80px)",
          pointerEvents: "none",
        }}
      />

      {/* Label */}
      <div
        style={{
          fontFamily: theme.fontFamily,
          fontSize: theme.fontSize.kpiLabel,
          fontWeight: 500,
          color: theme.whiteAlpha60,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}
      >
        {kpi.label}
      </div>

      {/* Value */}
      <div
        style={{
          fontFamily: theme.fontFamily,
          fontSize: theme.fontSize.kpiValue,
          fontWeight: 700,
          color: theme.white,
          letterSpacing: "-0.02em",
          lineHeight: theme.lineHeight.tight,
        }}
      >
        {formatValue(kpi.value, kpi.format, countProgress)}
      </div>

      {/* Bottom accent line */}
      <div
        style={{
          height: 2,
          background: `linear-gradient(90deg, ${accentColor}, transparent)`,
          opacity: 0.5,
        }}
      />
    </div>
  );
};
