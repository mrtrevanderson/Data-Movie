import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";
import { KpiCard } from "../components/KpiCard";
import { Kpi } from "../../data/types";

interface KPISceneProps {
  kpis: Kpi[];
  lastUpdated: string;
  enterProgress: number; // 0..1 fade-in from previous scene
  exitProgress: number;  // 0..1 fade-out to next scene
}

const CARD_COLORS = [theme.accent, theme.accentGold, theme.accentGreen];

export const KPIScene: React.FC<KPISceneProps> = ({
  kpis,
  lastUpdated,
  enterProgress,
  exitProgress,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const masterOpacity = Math.min(
    interpolate(enterProgress, [0, 1], [0, 1], { extrapolateRight: "clamp" }),
    interpolate(exitProgress, [0, 0.6, 1], [1, 1, 0], { extrapolateRight: "clamp" })
  );

  const titleOpacity = interpolate(frame, [0, fps * 0.5], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const titleY = interpolate(frame, [0, fps * 0.5], [-30, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const lastUpdatedDate = new Date(lastUpdated);
  const formatted = lastUpdatedDate.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const timestampOpacity = interpolate(frame, [fps * 1.5, fps * 2], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: `radial-gradient(ellipse at 30% 70%, #0A1A2E 0%, ${theme.bg} 60%)`,
        opacity: masterOpacity,
        padding: 160,
        boxSizing: "border-box",
      }}
    >
      {/* Background glow spots */}
      <div
        style={{
          position: "absolute",
          left: "10%",
          top: "20%",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: theme.accent,
          opacity: 0.04,
          filter: "blur(120px)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          right: "5%",
          bottom: "15%",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: theme.accentGold,
          opacity: 0.04,
          filter: "blur(100px)",
          pointerEvents: "none",
        }}
      />

      {/* Section heading */}
      <div
        style={{
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
          fontFamily: theme.fontFamily,
          fontSize: theme.fontSize.h2,
          fontWeight: 700,
          color: theme.white,
          letterSpacing: "0.04em",
          textTransform: "uppercase",
          marginBottom: 80,
          alignSelf: "flex-start",
        }}
      >
        Key Metrics
        <div
          style={{
            marginTop: 16,
            height: 4,
            width: 200,
            background: `linear-gradient(90deg, ${theme.accent}, transparent)`,
            borderRadius: 2,
          }}
        />
      </div>

      {/* KPI Cards row */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 60,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {kpis.map((kpi, i) => (
          <KpiCard
            key={kpi.label}
            kpi={kpi}
            delay={Math.round(i * 0.25 * 30)}
            accentColor={CARD_COLORS[i % CARD_COLORS.length]}
          />
        ))}
      </div>

      {/* Last updated timestamp */}
      <div
        style={{
          marginTop: 80,
          opacity: timestampOpacity,
          fontFamily: theme.fontFamily,
          fontSize: theme.fontSize.small,
          color: theme.whiteAlpha30,
          letterSpacing: "0.08em",
          alignSelf: "flex-end",
        }}
      >
        LAST UPDATED: {formatted}
      </div>
    </div>
  );
};
