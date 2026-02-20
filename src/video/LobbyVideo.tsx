import React from "react";
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { LobbyData } from "../data/types";
import { IntroScene } from "./scenes/IntroScene";
import { KPIScene } from "./scenes/KPIScene";
import { TrendScene } from "./scenes/TrendScene";
import { USRegionScene } from "./scenes/USRegionScene";
import { OutroScene } from "./scenes/OutroScene";
import { theme } from "./theme";

/**
 * Scene timing at 30 fps / 900 total frames (30 s):
 *
 *   Intro     :   0 – 180  (6 s)
 *   KPI       : 150 – 390  (8 s, enters at 150 with 30f crossfade)
 *   Trend     : 360 – 600  (8 s, enters at 360 with 30f crossfade)
 *   USRegion  : 570 – 810  (8 s, enters at 570 with 30f crossfade)
 *   Outro     : 780 – 900  (6 s, enters at 780 with 30f crossfade)
 *
 * Crossfade window = 30 frames (1 s)
 */

const CROSSFADE = 30;

const INTRO_START   = 0;
const KPI_START     = 150;
const TREND_START   = 360;
const REGION_START  = 570;
const OUTRO_START   = 780;

export interface LobbyVideoProps {
  data: LobbyData;
}

export const LobbyVideo: React.FC<LobbyVideoProps> = ({ data }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  function enterProgress(sceneStart: number) {
    return interpolate(frame, [sceneStart, sceneStart + CROSSFADE], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  }

  function exitProgress(nextSceneStart: number) {
    return interpolate(frame, [nextSceneStart, nextSceneStart + CROSSFADE], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  }

  const introVisible  = frame < KPI_START + CROSSFADE;
  const kpiVisible    = frame >= KPI_START    && frame < TREND_START  + CROSSFADE;
  const trendVisible  = frame >= TREND_START  && frame < REGION_START + CROSSFADE;
  const regionVisible = frame >= REGION_START && frame < OUTRO_START  + CROSSFADE;
  const outroVisible  = frame >= OUTRO_START;

  return (
    <AbsoluteFill style={{ background: theme.bg }}>
      {introVisible && (
        <IntroScene
          companyName={data.company_name}
          tagline={data.tagline}
          exitProgress={exitProgress(KPI_START)}
        />
      )}

      {kpiVisible && (
        <Sequence from={KPI_START} layout="none">
          <KPIScene
            kpis={data.kpis}
            lastUpdated={data.last_updated}
            enterProgress={enterProgress(KPI_START)}
            exitProgress={exitProgress(TREND_START)}
          />
        </Sequence>
      )}

      {trendVisible && (
        <Sequence from={TREND_START} layout="none">
          <TrendScene
            trend={data.trend}
            enterProgress={enterProgress(TREND_START)}
            exitProgress={exitProgress(REGION_START)}
          />
        </Sequence>
      )}

      {regionVisible && (
        <Sequence from={REGION_START} layout="none">
          <USRegionScene
            regions={data.regions}
            enterProgress={enterProgress(REGION_START)}
            exitProgress={exitProgress(OUTRO_START)}
          />
        </Sequence>
      )}

      {outroVisible && (
        <Sequence from={OUTRO_START} layout="none">
          <OutroScene
            companyName={data.company_name}
            tagline={data.tagline}
            enterProgress={enterProgress(OUTRO_START)}
          />
        </Sequence>
      )}
    </AbsoluteFill>
  );
};
