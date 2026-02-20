import React from "react";
import { Composition } from "remotion";
import { LobbyVideo, LobbyVideoProps } from "./LobbyVideo";
import { LobbyData } from "../data/types";

const defaultData: LobbyData = {
  company_name: "Hyundai Motor America",
  tagline: "New Thinking. New Possibilities.",
  kpis: [
    { label: "YTD Revenue",     value: 9_840_000_000, format: "currency" },
    { label: "Vehicles Sold",   value: 742_819,       format: "integer"  },
    { label: "EV Mix",          value: 0.187,         format: "percent"  },
  ],
  trend: {
    label: "Monthly Unit Sales",
    points: [64200, 67800, 66100, 70400, 72300, 75100, 73800, 76500, 74900, 79200, 81400, 84600],
  },
  regions: [
    { id: "west",      label: "West",      units: 58_400, revenue: 2_480_000_000 },
    { id: "southwest", label: "Southwest", units: 41_200, revenue: 1_620_000_000 },
    { id: "midwest",   label: "Midwest",   units: 49_700, revenue: 1_890_000_000 },
    { id: "southeast", label: "Southeast", units: 62_100, revenue: 2_210_000_000 },
    { id: "northeast", label: "Northeast", units: 53_800, revenue: 2_040_000_000 },
  ],
  last_updated: new Date().toISOString(),
};

export const Root: React.FC = () => {
  return (
    <Composition
      id="LobbyDisplay"
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      component={LobbyVideo as any}
      durationInFrames={900}
      fps={30}
      width={3840}
      height={2160}
      defaultProps={{ data: defaultData }}
    />
  );
};
