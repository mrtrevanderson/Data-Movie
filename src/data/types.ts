export type KpiFormat = "currency" | "integer" | "percent";

export interface Kpi {
  label: string;
  value: number;
  format: KpiFormat;
}

export interface Trend {
  label: string;
  points: number[];
}

export interface RegionData {
  id: string;       // e.g. "northeast"
  label: string;    // e.g. "Northeast"
  units: number;    // vehicles sold
  revenue: number;  // dollars
}

export interface LobbyData {
  company_name: string;
  tagline: string;
  kpis: Kpi[];
  trend: Trend;
  regions: RegionData[];
  last_updated: string;
}
