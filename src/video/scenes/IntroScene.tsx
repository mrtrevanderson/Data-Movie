import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";

interface IntroSceneProps {
  companyName: string;
  tagline: string;
  exitProgress?: number;
}

export const IntroScene: React.FC<IntroSceneProps> = ({
  companyName,
  tagline,
  exitProgress = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoOpacity = interpolate(frame, [0, fps * 0.8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const logoY = interpolate(frame, [0, fps * 0.8], [60, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const subtitleOpacity = interpolate(frame, [fps * 0.5, fps * 1.2], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const subtitleY = interpolate(frame, [fps * 0.5, fps * 1.2], [40, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const taglineOpacity = interpolate(frame, [fps * 0.9, fps * 1.6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const lineScaleX = interpolate(frame, [fps * 0.7, fps * 1.4], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const ringOpacity = interpolate(frame, [fps * 1.0, fps * 1.8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const masterOpacity = 1 - exitProgress;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: `radial-gradient(ellipse at 50% 40%, #001A3A 0%, ${theme.bg} 70%)`,
        opacity: masterOpacity,
      }}
    >
      {/* Background grid */}
      <svg style={{ position: "absolute", inset: 0, opacity: 0.05 }} width="100%" height="100%">
        <defs>
          <pattern id="grid" width="120" height="120" patternUnits="userSpaceOnUse">
            <path d="M 120 0 L 0 0 0 120" fill="none" stroke={theme.hyundaiBlue} strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Decorative rings */}
      <svg
        style={{ position: "absolute", opacity: ringOpacity * 0.18, width: 1400, height: 1400 }}
        viewBox="0 0 1400 1400"
      >
        <circle cx="700" cy="700" r="600" fill="none" stroke={theme.hyundaiBlue} strokeWidth="1.5" strokeDasharray="24 18" />
        <circle cx="700" cy="700" r="500" fill="none" stroke={theme.accentSilver} strokeWidth="1" strokeDasharray="12 28" />
        <circle cx="700" cy="700" r="380" fill="none" stroke={theme.hyundaiBlue} strokeWidth="0.5" strokeDasharray="6 20" />
      </svg>

      {/* Company name */}
      <div
        style={{
          opacity: logoOpacity,
          transform: `translateY(${logoY}px)`,
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily: theme.fontFamily,
            fontSize: theme.fontSize.hero,
            fontWeight: 800,
            color: theme.white,
            letterSpacing: "-0.03em",
            lineHeight: theme.lineHeight.tight,
            textShadow: `0 0 160px ${theme.hyundaiBlue}88`,
          }}
        >
          {companyName}
        </div>
      </div>

      {/* Accent line */}
      <div
        style={{
          marginTop: 44,
          height: 5,
          width: 700,
          background: `linear-gradient(90deg, transparent, ${theme.hyundaiBlue}, ${theme.accentSilver}, transparent)`,
          transform: `scaleX(${lineScaleX})`,
          transformOrigin: "center",
          borderRadius: 3,
        }}
      />

      {/* Subtitle */}
      <div
        style={{
          marginTop: 52,
          opacity: subtitleOpacity,
          transform: `translateY(${subtitleY}px)`,
          fontFamily: theme.fontFamily,
          fontSize: theme.fontSize.h3,
          fontWeight: 300,
          color: theme.whiteAlpha60,
          letterSpacing: "0.25em",
          textTransform: "uppercase",
        }}
      >
        Sales Performance Dashboard
      </div>

      {/* Tagline */}
      <div
        style={{
          marginTop: 64,
          opacity: taglineOpacity,
          fontFamily: theme.fontFamily,
          fontSize: theme.fontSize.body,
          fontWeight: 300,
          color: theme.hyundaiBlue,
          letterSpacing: "0.12em",
          fontStyle: "italic",
        }}
      >
        {tagline}
      </div>
    </div>
  );
};
