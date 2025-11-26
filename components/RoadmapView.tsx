import React from 'react';
import { KPIItem, ThemeColors } from '../types';
import { parseDate, daysBetween } from '../utils';
import { ChevronRight } from 'lucide-react';

interface RoadmapViewProps {
  kpis: KPIItem[];
  getColor: (kpiGlobal: string) => ThemeColors;
  onProjectClick: (kpi: KPIItem) => void;
}

const RoadmapView: React.FC<RoadmapViewProps> = ({ kpis, getColor, onProjectClick }) => {
  if (kpis.length === 0) return <div className="p-8 text-center text-muted-foreground">No hay datos disponibles</div>;

  // Calculate timeline bounds
  const dates = kpis.flatMap(p => [parseDate(p.inicio), parseDate(p.entrega)]);
  let minDate = new Date(Math.min(...dates.map(d => d.getTime())));
  let maxDate = new Date(Math.max(...dates.map(d => d.getTime())));

  // Pad to full months
  minDate = new Date(Date.UTC(minDate.getUTCFullYear(), minDate.getUTCMonth(), 1));
  maxDate = new Date(Date.UTC(maxDate.getUTCFullYear(), maxDate.getUTCMonth() + 1, 0));

  const totalDays = daysBetween(minDate, maxDate) + 1;

  // Generate Month Headers
  const months = [];
  let cur = new Date(minDate);
  const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

  while (cur <= maxDate) {
    let nextMonth = new Date(Date.UTC(cur.getUTCFullYear(), cur.getUTCMonth() + 1, 1));
    let monthEnd = nextMonth > maxDate ? maxDate : new Date(nextMonth.getTime() - 86400000);
    
    const daysInMonth = daysBetween(cur, monthEnd) + 1;
    const widthPct = (daysInMonth / totalDays) * 100;
    
    if (widthPct > 0) {
      months.push({ 
        name: `${monthNames[cur.getUTCMonth()]} '${String(cur.getUTCFullYear()).slice(2)}`, 
        width: widthPct 
      });
    }
    cur = nextMonth;
  }

  return (
    <div className="bg-muted/30 rounded-xl border border-border overflow-hidden shadow-sm animate-in fade-in duration-500">
      <div className="overflow-x-auto custom-scrollbar">
        <div className="relative min-w-[1000px] lg:min-w-[1200px]">
          
          {/* Header */}
          <div className="sticky top-0 z-20 bg-background/95 backdrop-blur shadow-sm border-b border-border grid grid-cols-[280px_1fr]">
            <div className="px-4 py-3 text-xs font-bold uppercase tracking-wider border-r border-border bg-muted/20 flex items-center text-muted-foreground">
              Proyecto / KPI
            </div>
            <div className="flex w-full bg-muted/20">
              {months.map((m, idx) => (
                <div 
                  key={idx} 
                  style={{ width: `${m.width}%` }} 
                  className="flex-shrink-0 text-center text-xs font-semibold py-3 border-l border-border first:border-l-0 uppercase tracking-wider text-muted-foreground overflow-hidden text-ellipsis whitespace-nowrap"
                >
                  {m.name}
                </div>
              ))}
            </div>
          </div>

          {/* Grid Lines Background (Absolute) */}
          <div className="absolute inset-0 top-[45px] left-[280px] pointer-events-none flex">
             {months.map((m, idx) => (
                <div 
                  key={idx} 
                  style={{ width: `${m.width}%` }} 
                  className="h-full border-l border-border border-dashed first:border-l-0 opacity-40"
                />
             ))}
          </div>

          {/* Rows */}
          <div className="relative">
            {kpis.map((kpi) => {
              const theme = getColor(kpi.kpi_global);
              const start = parseDate(kpi.inicio);
              const end = parseDate(kpi.entrega);
              
              const left = (daysBetween(minDate, start) / totalDays) * 100;
              const width = ((daysBetween(start, end) + 1) / totalDays) * 100;
              
              return (
                <div 
                  key={kpi.id} 
                  className="grid grid-cols-[280px_1fr] border-b border-border hover:bg-muted/30 transition-colors h-14 group relative"
                  onClick={() => onProjectClick(kpi)}
                >
                  {/* Label Column */}
                  <div className="px-4 flex flex-col justify-center border-r border-border relative z-10 bg-transparent">
                    <div className="flex items-center justify-between">
                         <span className={`border text-sm font-semibold px-2 py-1 rounded-full w-fit ${theme.chip}`}>
                          {kpi.kpi_global}
                        </span>
                        <ChevronRight className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1" />
                    </div>
                   
                    <span className="text-xs font-medium truncate pr-2 text-foreground mt-1" title={kpi.sub_kpi}>
                      {kpi.sub_kpi}
                    </span>
                  </div>

                  {/* Bar Column */}
                  <div className="relative w-full h-full">
                    <div 
                      className={`absolute top-1/2 -translate-y-1/2 h-6 rounded-md shadow-sm cursor-pointer hover:shadow-md hover:scale-[1.01] transition-all ${theme.bar}`}
                      style={{ 
                        left: `${left}%`, 
                        width: `${Math.max(width, 0.5)}%` // Ensure at least tiny visibility
                      }}
                    >
                        {/* Tooltip on hover */}
                        <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-[10px] rounded whitespace-nowrap pointer-events-none">
                             {daysBetween(start, end)} días
                        </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
};

export default RoadmapView;