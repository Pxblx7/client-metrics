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
  
  // Refined Logic: 
  // Only treat as percentage if it looks like a decimal ratio (0 <= x <= 1) AND is NOT an integer.
  // This prevents inputs like "1" (meaning 1 issue) from becoming "100%" just because formula mentions %.
  if (isPercentage && Math.abs(num) <= 1 && num !== 0 && !Number.isInteger(num)) {
      return Math.round(num * 100) + '%';
  }
  
  if (Number.isInteger(num)) return num;
  return val;
};

export const calculateNivel = (kpi: KPIItem): { nivel: number; texto: string } => {
  if (kpi.tipo_target === 'Binario') {
    if (kpi.logro_val === 'Liberado') return { nivel: 3, texto: "Completado" };
    return { nivel: 1, texto: "Pendiente" };
  }
  
  let logro = parseFloat(String(kpi.logro_val));
  if (isNaN(logro) && kpi.logro_val !== 0 && kpi.logro_val !== '0') return { nivel: 0, texto: "N/A" };

  const niveles: Record<number, number> = {};
  let validKeys: number[] = [];
  
  for (let i = 1; i <= 5; i++) {
    const key = `n${i}` as keyof Niveles;
    let val = parseFloat(String(kpi.niveles[key]));
    if (!isNaN(val)) { 
      niveles[i] = val; 
      validKeys.push(i); 
    }
  }
  
  if (validKeys.length < 2) return { nivel: 0, texto: "N/A" };

  const first = niveles[validKeys[0]];
  const last = niveles[validKeys[validKeys.length - 1]];
  const higherIsBetter = last > first; 
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
  
  // Logic Fix: If strictly worse than N1, return 0 (inactive), do NOT default to N1.
  if (currentNivel === 0) {
     if (higherIsBetter && logro < first) return { nivel: 0, texto: "Fuera de rango" };
     if (!higherIsBetter && logro > first) return { nivel: 0, texto: "Fuera de rango" };
     
     // If it's 0 and logic didn't catch it, return 0.
     return { nivel: 0, texto: "Fuera de rango" };
  }

  return { nivel: currentNivel, texto: currentNivel > 0 ? `Nivel ${currentNivel}` : "Fuera de rango" };
};