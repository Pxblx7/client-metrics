import React from 'react';
import { KPIItem } from '../types';
import { formatDisplayDate } from '../utils';
import { X, Calendar, Calculator } from 'lucide-react';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  kpi: KPIItem | null;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ isOpen, onClose, kpi }) => {
  if (!isOpen || !kpi) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-card text-card-foreground w-full max-w-lg rounded-xl shadow-2xl border border-border overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-5 border-b border-border bg-muted/20 flex justify-between items-start">
          <h3 className="text-xl font-bold leading-6 pr-4">
            {kpi.sub_kpi}
          </h3>
          <button 
            onClick={onClose}
            className="rounded-full p-1 hover:bg-muted/50 transition-colors text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="px-6 py-6 space-y-6">
          <div className="bg-muted/40 rounded-lg p-4 border border-border">
            <div className="flex items-center gap-2 mb-2">
                <Calculator className="w-4 h-4 text-emerald-500" />
                <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider">
                    Descripción / Fórmula
                </span>
            </div>
            <p className="text-sm leading-relaxed opacity-90">
                {kpi.formula || "Sin descripción disponible."}
            </p>
          </div>

          <div className="flex items-center gap-3 text-sm text-muted-foreground bg-muted/20 px-4 py-3 rounded-lg w-fit border border-border/50">
            <Calendar className="w-4 h-4 text-sky-500" />
            <span className="font-mono text-xs font-semibold">
                {formatDisplayDate(kpi.inicio)} — {formatDisplayDate(kpi.entrega)}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
             <div>
                <span className="block text-xs text-muted-foreground mb-1">Responsable</span>
                <span className="font-medium text-foreground">{kpi.stakeholder}</span>
             </div>
             <div>
                <span className="block text-xs text-muted-foreground mb-1">Área</span>
                <span className="font-medium text-foreground">{kpi.area}</span>
             </div>
          </div>
        </div>
        
        <div className="bg-muted/50 px-6 py-4 flex flex-row-reverse border-t border-border">
          <button 
            type="button" 
            onClick={onClose}
            className="inline-flex justify-center rounded-lg border border-border shadow-sm px-4 py-2 bg-card text-sm font-medium hover:bg-muted focus:outline-none transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;