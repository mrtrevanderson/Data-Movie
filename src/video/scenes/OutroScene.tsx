import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";

interface OutroSceneProps {
  companyName: string;
  tagline: string;
  enterProgress: number;
}

export const OutroScene: React.FC<OutroSceneProps> = ({
  companyName,
  tagline,
  enterProgress,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const sceneOpacity = interpolate(enterProgress, [0, 1], [0, 1], {
    extrapolateRight: "clamp",
  });

  const logoOpacity = interpolate(frame, [0, fps * 0.8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const logoY = interpolate(frame, [0, fps * 0.8], [60, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const subtitleOpacity = interpolate(frame, [fps * 0.4, fps * 1.1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const lineScale = interpolate(frame, [fps * 0.6, fps * 1.3], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const tagOpacity = interpolate(frame, [fps * 1.0, fps * 1.8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const loopFade = interpolate(
    frame,
    [durationInFrames - fps * 2.5, durationInFrames],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <div style={{ position: "absolute", inset: 0, opacity: sceneOpacity }}>
      {/* Main background — identical to Intro for seamless loop */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse at 50% 40%, #001A3A 0%, ${theme.bg} 70%)`,
        }}
      />

      {/* Loop-fade overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse at 50% 40%, #001A3A 0%, ${theme.bg} 70%)`,
          opacity: loopFade,
        }}
      />

      {/* Background grid */}
      <svg style={{ position: "absolute", inset: 0, opacity: 0.05 }} width="100%" height="100%">
        <defs>
          <pattern id="gridOutro" width="120" height="120" patternUnits="userSpaceOnUse">
            <path d="M 120 0 L 0 0 0 120" fill="none" stroke={theme.hyundaiBlue} strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#gridOutro)" />
      </svg>

      {/* Decorative rings */}
      <svg
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          opacity: 0.15,
          width: 1400,
          height: 1400,
        }}
        viewBox="0 0 1400 1400"
      >
        <circle cx="700" cy="700" r="600" fill="none" stroke={theme.hyundaiBlue} strokeWidth="1.5" strokeDasharray="24 18" />
        <circle cx="700" cy="700" r="500" fill="none" stroke={theme.accentSilver} strokeWidth="1" strokeDasharray="12 28" />
        <circle cx="700" cy="700" r="380" fill="none" stroke={theme.hyundaiBlue} strokeWidth="0.5" strokeDasharray="6 20" />
      </svg>

      {/* Content */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            opacity: logoOpacity,
            transform: `translateY(${logoY}px)`,
            fontFamily: theme.fontFamily,
            fontSize: theme.fontSize.hero,
            fontWeight: 800,
            color: theme.white,
            letterSpacing: "-0.03em",
            lineHeight: theme.lineHeight.tight,
            textAlign: "center",
            textShadow: `0 0 160px ${theme.hyundaiBlue}88`,
          }}
        >
          {companyName}
        </div>

        <div
          style={{
            marginTop: 44,
            height: 5,
            width: 700,
            background: `linear-gradient(90deg, transparent, ${theme.hyundaiBlue}, ${theme.accentSilver}, transparent)`,
            transform: `scaleX(${lineScale})`,
            transformOrigin: "center",
            borderRadius: 3,
          }}
        />

        <div
          style={{
            marginTop: 52,
            opacity: subtitleOpacity,
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

        <div
          style={{
            marginTop: 64,
            opacity: tagOpacity,
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
    </div>
  );
};
