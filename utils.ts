import { KPIItem, Niveles } from './types';

export const parseDate = (dateStr: string): Date => {
  if (!dateStr) return new Date();
  if (dateStr.includes('T')) dateStr = dateStr.split('T')[0];
  const [y, m, d] = dateStr.split('-').map(Number);
  // UTC to avoid timezone issues affecting the grid visualization
  return new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
};

export const formatDisplayDate = (dateStr: string): string => {
  if (!dateStr) return "";
  if (dateStr.includes('T')) dateStr = dateStr.split('T')[0];
  const [y, m, d] = dateStr.split('-');
  return `${d}/${m}/${y}`;
};

export const daysBetween = (d1: Date, d2: Date): number => {
  const oneDay = 24 * 60 * 60 * 1000;
  return Math.round(Math.abs((d1.getTime() - d2.getTime()) / oneDay));
};

export const formatValue = (val: string | number, kpi: KPIItem): string | number => {
  const num = parseFloat(String(val));
  if (isNaN(num) || val === "") return val || "-";
  
  const context = (kpi.sub_kpi + kpi.formula + kpi.kpi_global).toLowerCase();
  const isPercentage = context.includes('porcentaje') || context.includes('tasa') || context.includes('%') || context.includes('rate');
  
  // Logic: treat as % only if it's a decimal <= 1 (e.g. 0.99)
  if (isPercentage && Math.abs(num) <= 1 && num !== 0 && !Number.isInteger(num)) {
      return Math.round(num * 100) + '%';
  }
  
  if (Number.isInteger(num)) return num;
  return val;
};

/**
 * Robustly cleans a value string to extract the number.
 */
const cleanAndParse = (val: string | number): number => {
  if (val === null || val === undefined) return NaN;
  if (typeof val === 'number') return val;
  // Remove everything that isn't a digit, a dot, or a minus sign
  const cleaned = String(val).replace(/[^0-9.-]/g, '');
  return parseFloat(cleaned);
};

export const calculateNivel = (kpi: KPIItem): { nivel: number; texto: string } => {
  // 1. PREFER BACKEND CALCULATION (If available)
  // This ensures the robust Google Apps Script logic is the source of truth
  if (typeof kpi.calculated_level === 'number') {
    const lvl = kpi.calculated_level;
    const txt = lvl > 0 ? `Nivel ${lvl}` : (kpi.tipo_target === 'Binario' ? 'Pendiente' : 'Fuera de rango');
    // Special text override for binary completed
    if (kpi.tipo_target === 'Binario' && lvl === 3) return { nivel: 3, texto: "Completado" };
    return { nivel: lvl, texto: txt };
  }

  // 2. FALLBACK FRONTEND LOGIC (Legacy support)
  if (kpi.tipo_target === 'Binario') {
    if (kpi.logro_val === 'Liberado') return { nivel: 3, texto: "Completado" };
    return { nivel: 1, texto: "Pendiente" };
  }
  
  let logro = cleanAndParse(kpi.logro_val);
  if (isNaN(logro) && kpi.logro_val !== 0 && kpi.logro_val !== '0') return { nivel: 0, texto: "N/A" };

  const niveles: Record<number, number> = {};
  let validKeys: number[] = [];
  
  for (let i = 1; i <= 5; i++) {
    const key = `n${i}` as keyof Niveles;
    let val = cleanAndParse(kpi.niveles[key]);
    if (!isNaN(val)) { 
      niveles[i] = val; 
      validKeys.push(i); 
    }
  }
  
  if (validKeys.length < 2) return { nivel: 0, texto: "N/A" };

  // --- Normalization Fix for Frontend Fallback ---
  // If we have mixed 0.99 and 95, scale the small ones.
  const allValues = [logro, ...Object.values(niveles)];
  const maxVal = Math.max(...allValues);
  
  const normalize = (v: number) => (maxVal > 5 && v <= 1 && v >= -1) ? v * 100 : v;
  
  logro = normalize(logro);
  validKeys.forEach(key => { niveles[key] = normalize(niveles[key]); });

  const first = niveles[validKeys[0]];
  const last = niveles[validKeys[validKeys.length - 1]];
  const higherIsBetter = last >= first; 
  let currentNivel = 0;

  if (higherIsBetter) {
    for (let i = validKeys.length - 1; i >= 0; i--) {
      let k = validKeys[i];
      if (logro >= niveles[k]) { currentNivel = k; break; }
    }
  } else {
    for (let i = validKeys.length - 1; i >= 0; i--) {
      let k = validKeys[i];
      if (logro <= niveles[k]) { currentNivel = k; break; }
    }
  }
  
  return { nivel: currentNivel, texto: currentNivel > 0 ? `Nivel ${currentNivel}` : "Fuera de rango" };
};