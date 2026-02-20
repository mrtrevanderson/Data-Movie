import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";
import { ChartLine } from "../components/ChartLine";
import { Trend } from "../../data/types";

interface TrendSceneProps {
  trend: Trend;
  enterProgress: number;
  exitProgress: number;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                 "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export const TrendScene: React.FC<TrendSceneProps> = ({
  trend,
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

  const chartOpacity = interpolate(frame, [fps * 0.3, fps * 0.8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Chart draw starts at fps * 0.8 and runs for fps * 3 seconds
  const CHART_START = Math.round(fps * 0.8);
  const CHART_DURATION = Math.round(fps * 2.8);

  // Month labels appear after chart starts drawing
  const monthLabelOpacity = interpolate(
    frame,
    [fps * 1.0, fps * 1.6],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const chartW = 3000;
  const chartH = 900;

  // Compute last point value for callout
  const lastVal = trend.points[trend.points.length - 1];
  const firstVal = trend.points[0];
  const growthPct = (((lastVal - firstVal) / firstVal) * 100).toFixed(1);

  const calloutOpacity = interpolate(
    frame,
    [fps * 3.0, fps * 3.6],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const calloutScale = interpolate(
    frame,
    [fps * 3.0, fps * 3.6],
    [0.8, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: `radial-gradient(ellipse at 70% 30%, #0A1E1A 0%, ${theme.bg} 65%)`,
        opacity: masterOpacity,
        padding: 160,
        boxSizing: "border-box",
      }}
    >
      {/* Background glow */}
      <div
        style={{
          position: "absolute",
          right: "15%",
          top: "10%",
          width: 800,
          height: 800,
          borderRadius: "50%",
          background: theme.accentGreen,
          opacity: 0.04,
          filter: "blur(150px)",
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
          marginBottom: 60,
          alignSelf: "flex-start",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          {trend.label}
          <div
            style={{
              marginTop: 16,
              height: 4,
              width: 200,
              background: `linear-gradient(90deg, ${theme.accentGreen}, transparent)`,
              borderRadius: 2,
            }}
          />
        </div>

        {/* Growth callout badge */}
        <div
          style={{
            opacity: calloutOpacity,
            transform: `scale(${calloutScale})`,
            transformOrigin: "right center",
            background: `linear-gradient(135deg, ${theme.accentGreen}33, ${theme.accentGreen}11)`,
            border: `2px solid ${theme.accentGreen}66`,
            borderRadius: 20,
            padding: "20px 48px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            style={{
              fontFamily: theme.fontFamily,
              fontSize: theme.fontSize.kpiLabel,
              fontWeight: 300,
              color: theme.whiteAlpha60,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            YTD Growth
          </div>
          <div
            style={{
              fontFamily: theme.fontFamily,
              fontSize: theme.fontSize.h1,
              fontWeight: 800,
              color: theme.accentGreen,
              letterSpacing: "-0.02em",
            }}
          >
            +{growthPct}%
          </div>
        </div>
      </div>

      {/* Chart */}
      <div
        style={{
          opacity: chartOpacity,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <ChartLine
          points={trend.points}
          width={chartW}
          height={chartH}
          startFrame={CHART_START}
          durationFrames={CHART_DURATION}
          color={theme.accentGreen}
          label={`+${growthPct}%`}
        />

        {/* Month labels */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            width: chartW - 80,
            marginTop: 16,
            opacity: monthLabelOpacity,
          }}
        >
          {MONTHS.slice(0, trend.points.length).map((m) => (
            <div
              key={m}
              style={{
                fontFamily: theme.fontFamily,
                fontSize: theme.fontSize.caption,
                color: theme.whiteAlpha30,
                letterSpacing: "0.05em",
                textAlign: "center",
                flex: 1,
              }}
            >
              {m}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
