import React from 'react';
import { KPIItem, ThemeColors, Niveles } from '../types';
import { formatValue, calculateNivel } from '../utils';
import { LEVEL_COLORS, LOGRO_TEXT_COLORS } from '../constants';
import { Info } from 'lucide-react';

interface KpiCardProps {
  kpi: KPIItem;
  themeColor: ThemeColors;
  isDark: boolean;
}

const KpiCard: React.FC<KpiCardProps> = ({ kpi, themeColor, isDark }) => {
  const nivelInfo = calculateNivel(kpi);
  const colors = isDark ? LEVEL_COLORS.dark : LEVEL_COLORS.light;
  const inactiveColor = isDark ? LEVEL_COLORS.inactive.dark : LEVEL_COLORS.inactive.light;
  
  const kpiGlobalName = kpi.kpi_global;

  const renderLevels = () => {
    if (kpi.tipo_target === 'Gradual') {
      return (
        <div className="grid grid-cols-5 gap-1.5 mt-3">
          {[1, 2, 3, 4, 5].map((n) => {
            const key = `n${n}` as keyof Niveles;
            const val = kpi.niveles[key];
            if (val === undefined || val === "") return <div key={n} />;
            
            const active = n <= nivelInfo.nivel;
            // @ts-ignore
            const levelColorObj = colors[n];
            const cls = active 
              ? `${levelColorObj.bg} ${levelColorObj.text}` 
              : `${inactiveColor}`;
            
            return (
              <div key={n} className={`flex flex-col items-center justify-center text-center p-1.5 rounded-md ${cls} transition-all duration-300`}>
                <span className="text-[9px] font-bold uppercase opacity-80">N{n}</span>
                <span className="text-xs font-bold truncate w-full" title={String(val)}>
                  {formatValue(val, kpi)}
                </span>
              </div>
            );
          })}
        </div>
      );
    } else {
      // Binario
      // @ts-ignore
      const n1 = nivelInfo.nivel === 1 ? `${colors[1].bg} ${colors[1].text}` : inactiveColor;
      // @ts-ignore
      const n3 = nivelInfo.nivel === 3 ? `${colors[3].bg} ${colors[3].text}` : inactiveColor;
      
      return (
        <div className="grid grid-cols-2 gap-2 mt-3">
          <div className={`flex flex-col items-center p-2 rounded-md ${n1}`}>
            <span className="text-[10px] font-bold opacity-90">N1</span>
            <span className="text-xs font-bold">Pendiente</span>
          </div>
          <div className={`flex flex-col items-center p-2 rounded-md ${n3}`}>
            <span className="text-[10px] font-bold opacity-90">N3</span>
            <span className="text-xs font-bold">Liberado</span>
          </div>
        </div>
      );
    }
  };

  // Determine actual achievement text color
  // @ts-ignore
  const textColors = isDark ? LOGRO_TEXT_COLORS.dark : LOGRO_TEXT_COLORS.light;
  // @ts-ignore
  const achievementTextColor = nivelInfo.nivel > 0 ? textColors[nivelInfo.nivel] : 'text-foreground';

  return (
    <div className="card bg-transparent rounded-xl flex flex-col relative border border-border transition-all duration-300 z-0 hover:z-10 hover:border-foreground/40">
      
      {/* Top Section */}
      <div className="p-6 pb-4">
        {/* Chip without bottom margin, title has top margin - matching original */}
        <span className={`inline-block border text-[11px] font-bold px-2.5 py-0.5 rounded-full ${themeColor.chip}`}>
          {kpiGlobalName}
        </span>
        
        <div className="relative flex items-start justify-between mt-3">
          <h3 className="font-bold text-lg leading-snug pr-6">
            {kpi.sub_kpi}
          </h3>
          <div className="relative group/tooltip flex-shrink-0 mt-0.5">
            <Info className="w-4 h-4 text-muted-foreground opacity-60 cursor-help hover:text-foreground hover:opacity-100 transition-all" />
            <div className="absolute bottom-full right-0 mb-2 w-64 bg-[rgba(15,23,42,0.95)] text-white text-xs p-3 rounded-lg shadow-xl opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all duration-200 z-50 pointer-events-none border border-slate-700">
               {kpi.formula || 'Sin descripción.'}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-1 text-[11px] mt-3 text-muted-foreground font-medium">
            <div className="flex justify-between items-center">
                <span>Responsable:</span>
                <span className="text-foreground">{kpi.stakeholder}</span>
            </div>
            <div className="flex justify-between items-center">
                <span>Área:</span>
                <span className="text-foreground">{kpi.area}</span>
            </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-border p-6 flex-grow flex flex-col justify-between">
        <div>
          {kpi.tipo_target !== 'Binario' && (
            <div className="grid grid-cols-2 gap-4 mb-4 pb-3 border-b border-border border-dashed">
              <div>
                <span className="block text-[10px] text-muted-foreground uppercase tracking-wider font-semibold mb-0.5">Baseline</span>
                <span className="font-mono text-sm font-medium">{formatValue(kpi.baseline, kpi)}</span>
              </div>
              <div className="text-right">
                <span className="block text-[10px] text-muted-foreground uppercase tracking-wider font-semibold mb-0.5">Target</span>
                <span className="font-mono text-sm font-medium">{formatValue(kpi.target, kpi)}</span>
              </div>
            </div>
          )}

          <div className="flex justify-between items-end mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1 block">Logro Actual</span>
            <span className={`text-2xl font-black ${achievementTextColor}`}>
              {formatValue(kpi.logro_display, kpi)}
            </span>
          </div>
        </div>

        <div>
           <div className="flex items-center">
                <h4 className="font-semibold text-[10px] uppercase tracking-wider text-muted-foreground opacity-80">Niveles de Logro</h4>
           </div>
           {renderLevels()}
        </div>
      </div>
    </div>
  );
};

export default KpiCard;