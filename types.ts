export interface Niveles {
  n1: string | number;
  n2: string | number;
  n3: string | number;
  n4: string | number;
  n5: string | number;
}

export interface KPIItem {
  id: number;
  sub_kpi: string;
  kpi_global: string;
  formula: string;
  inicio: string; // Date string "YYYY-MM-DD"
  entrega: string; // Date string "YYYY-MM-DD"
  baseline: number | string;
  target: number | string;
  logro_val: number | string;
  logro_display: number | string;
  tipo_target: 'Gradual' | 'Binario';
  comentarios: string;
  area: string;
  stakeholder: string;
  niveles: Niveles;
}

export interface KPIData {
  metadata: {
    generated_at: string;
    count: number;
    version: string;
  };
  kpis: KPIItem[];
}

export interface ThemeColors {
  bar: string;
  chip: string;
  text: string;
  border: string;
}

export type ViewMode = 'roadmap' | 'cards';

export interface ColorPalette {
  light: ThemeColors;
  dark: ThemeColors;
}

// Extend Window interface for JSONP callback
declare global {
  interface Window {
    loadDashboardData: (data: any) => void;
  }
}