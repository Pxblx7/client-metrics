
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Sun, Moon, ExternalLink, CircleAlert, RefreshCw 
} from 'lucide-react';

import { INITIAL_DATA, KPI_COLORS, API_URL } from './constants.ts';
import { KPIData, KPIItem, ViewMode } from './types.ts';
import KpiCard from './components/KpiCard.tsx';
import RoadmapView from './components/RoadmapView.tsx';
import ProjectModal from './components/ProjectModal.tsx';

function App() {
  const [isDark, setIsDark] = useState(true);
  const [view, setView] = useState<ViewMode>('roadmap');
  const [data, setData] = useState<KPIData>(INITIAL_DATA);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedKpi, setSelectedKpi] = useState<KPIItem | null>(null);

  useEffect(() => {
    const html = document.documentElement;
    if (isDark) {
      html.classList.add('dark');
      html.classList.remove('light');
    } else {
      html.classList.add('light');
      html.classList.remove('dark');
    }
  }, [isDark]);

  const fetchData = useCallback(() => {
    setIsLoading(true);
    setError(null);

    window.loadDashboardData = (response: any) => {
      if (response && !response.error) {
        setData(response);
      } else {
        setError(response?.error || 'Error desconocido al cargar datos.');
      }
      setIsLoading(false);
    };

    const script = document.createElement('script');
    const url = new URL(API_URL);
    url.searchParams.set('callback', 'loadDashboardData');
    url.searchParams.set('ts', new Date().getTime().toString());

    script.src = url.toString();
    script.onerror = () => {
        setError('Error de conexión con Google Sheets.');
        setIsLoading(false);
    };

    document.body.appendChild(script);
    return () => {
        if(document.body.contains(script)) {
            document.body.removeChild(script);
        }
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const kpiColorMap = useMemo(() => {
    const uniqueKpis: string[] = Array.from(new Set(data.kpis.map(k => k.kpi_global)));
    const map: Record<string, number> = {};
    uniqueKpis.forEach((k, i) => {
      map[k] = i % KPI_COLORS.length;
    });
    return map;
  }, [data]);

  const getColor = (kpiGlobal: string) => {
    const idx = kpiColorMap[kpiGlobal] ?? 0;
    return isDark ? KPI_COLORS[idx].dark : KPI_COLORS[idx].light;
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-[1600px] mx-auto font-sans transition-colors duration-300">
      <div className="sticky top-[-1rem] sm:top-[-1.5rem] md:top-[-2rem] z-30 bg-background pt-4 sm:pt-6 md:pt-8 pb-4 transition-colors duration-300 border-b border-transparent">
        <header className="mb-6 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Dashboard de Proyectos Ze-commerce
            </h1>
            <div className="flex flex-wrap items-center gap-4 mt-2">
              <p className="text-lg text-muted-foreground">
                Seguimiento de KPIs y entregables.
              </p>
              <button 
                onClick={fetchData}
                disabled={isLoading}
                className={`flex items-center gap-3 px-4 py-2 rounded-full border transition-all ${
                    isLoading 
                    ? 'bg-amber-500/10 border-amber-500/30 cursor-wait' 
                    : 'bg-muted/50 border-border hover:bg-muted cursor-pointer'
                }`}
              >
                <span className="relative flex h-3 w-3">
                  {isLoading ? (
                     <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                  ) : (
                    <>
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                    </>
                  )}
                </span>
                <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  {isLoading ? 'Sincronizando...' : `Actualizado: ${new Date(data.metadata.generated_at).toLocaleDateString()}`}
                  {!isLoading && <RefreshCw className="w-4 h-4 ml-1 opacity-50" />}
                </p>
              </button>
            </div>
          </div>

          <button 
            onClick={() => setIsDark(!isDark)}
            className="p-2.5 rounded-lg border border-border text-muted-foreground hover:bg-muted hover:text-foreground transition-colors focus:outline-none"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </header>

        <div className="border-b border-border">
            <nav className="-mb-px flex space-x-8">
                <button
                    onClick={() => setView('roadmap')}
                    className={`pb-3 px-1 border-b-2 font-semibold text-sm transition-all duration-200 ${
                        view === 'roadmap' 
                        ? 'border-foreground text-foreground' 
                        : 'border-transparent text-muted-foreground hover:text-foreground'
                    }`}
                >
                    Roadmap
                </button>
                <button
                    onClick={() => setView('cards')}
                    className={`pb-3 px-1 border-b-2 font-semibold text-sm transition-all duration-200 ${
                        view === 'cards' 
                        ? 'border-foreground text-foreground' 
                        : 'border-transparent text-muted-foreground hover:text-foreground'
                    }`}
                >
                    Proyectos y KPIs
                </button>
            </nav>
        </div>
      </div>

      <main className="mt-6">
        {error && (
             <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg flex items-center gap-3 shadow-sm">
                <CircleAlert className="w-5 h-5" />
                <div>
                    <p className="text-sm font-bold">Error de Conexión</p>
                    <p className="text-xs opacity-90">{error}</p>
                </div>
             </div>
        )}

        {isLoading && data.kpis.length === 0 && (
            <div className="flex flex-col items-center justify-center h-64 text-muted-foreground space-y-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-current"></div>
                <p className="text-sm">Cargando datos...</p>
            </div>
        )}

        {(!isLoading || data.kpis.length > 0) && (
            view === 'roadmap' ? (
              <RoadmapView 
                kpis={data.kpis} 
                getColor={getColor} 
                onProjectClick={setSelectedKpi}
              />
            ) : (
              <div className="animate-in fade-in duration-300">
                <div className="mb-8 flex justify-end">
                    <a href="https://docs.google.com/spreadsheets/d/1lDevcsKJ8EiPH-rxBE0MnrtxTAUIVjF7ZLdXffKji_0/edit?usp=sharing" target="_blank" className="inline-flex items-center justify-center rounded-lg text-xs font-semibold transition-colors bg-emerald-600 text-white hover:bg-emerald-700 h-8 px-3 gap-2">
                        <ExternalLink className="w-3.5 h-3.5" />
                        Ver Base de Datos
                    </a>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {data.kpis.map((kpi) => (
                    <div key={kpi.id} onClick={() => setSelectedKpi(kpi)} className="cursor-pointer">
                        <KpiCard kpi={kpi} themeColor={getColor(kpi.kpi_global)} isDark={isDark} />
                    </div>
                  ))}
                </div>
              </div>
            )
        )}
      </main>

      <ProjectModal isOpen={!!selectedKpi} onClose={() => setSelectedKpi(null)} kpi={selectedKpi} />
    </div>
  );
}

export default App;
