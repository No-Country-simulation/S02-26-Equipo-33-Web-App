"use client";

import { ChevronDown, MapPin, Verified } from 'lucide-react';

interface FilterProps {
  filters: {
    minPrice: string;
    maxPrice: string;
    breed: string;
    disciplines: string[];
    location: string;
    verifiedOnly: boolean;
  };
  setFilters: React.Dispatch<React.SetStateAction<any>>;
  clearFilters: () => void;
}

export default function FilterSideBar({ filters, setFilters, clearFilters }: FilterProps) {
  
  // Función auxiliar para manejar los checkboxes de disciplina
  const handleDisciplineToggle = (disc: string) => {
    setFilters((prev: any) => {
      const current = prev.disciplines;
      const updated = current.includes(disc) 
        ? current.filter((d: string) => d !== disc) 
        : [...current, disc];
      return { ...prev, disciplines: updated };
    });
  };

  return (
    <aside className="hidden lg:block w-1/4 space-y-8 shrink-0">
      <div className="sticky top-24">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-900">Filtros</h3>
          <button 
            onClick={clearFilters}
            className="text-xs font-semibold text-equestrian-navy underline hover:text-equestrian-gold transition-colors"
          >
            Limpiar Todo
          </button>
        </div>

        {/* 1. Rango de Precio */}
        <div className="space-y-4 pb-6 border-b border-equestrian-navy/10">
        <label className="text-sm font-semibold uppercase tracking-wider text-slate-500">Inversión (USD)</label>
        <div className="flex items-center gap-3">
            <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
            <input 
                type="number" 
                placeholder="Mínimo"
                value={filters.minPrice}
                onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                className="w-full rounded-lg border border-equestrian-navy/10 bg-white py-2 pl-7 pr-3 text-sm focus:border-equestrian-navy focus:ring-0 outline-none"
            />
            </div>
            <span className="text-slate-300 font-bold">-</span>
            <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
            <input 
                type="number" 
                placeholder="Máximo"
                value={filters.maxPrice}
                onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                className="w-full rounded-lg border border-equestrian-navy/10 bg-white py-2 pl-7 pr-3 text-sm focus:border-equestrian-navy focus:ring-0 outline-none"
            />
            </div>
        </div>
        </div>

        {/* 2. Raza */}
        <div className="py-6 border-b border-equestrian-navy/10 space-y-4">
          <label className="text-sm font-semibold uppercase tracking-wider text-slate-500">Raza</label>
          <div className="relative">
            <select 
              value={filters.breed}
              onChange={(e) => setFilters({ ...filters, breed: e.target.value })}
              className="w-full appearance-none rounded-lg border border-equestrian-navy/10 bg-white py-2.5 pl-3 pr-10 text-sm focus:border-equestrian-navy focus:ring-0 outline-none"
            >
              <option value="Todas las Razas">Todas las Razas</option>
              <option value="Pura Sangre">Pura Sangre</option>
              <option value="Árabe">Árabe</option>
              <option value="Cuarto de Milla">Cuarto de Milla</option>
              <option value="Criollo">Criollo</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
          </div>
        </div>

        {/* 3. Disciplinas */}
        <div className="py-6 border-b border-equestrian-navy/10 space-y-4">
          <label className="text-sm font-semibold uppercase tracking-wider text-slate-500">Disciplina</label>
          <div className="space-y-3">
            {['Salto', 'Adiestramiento', 'Polo', 'Carreras'].map((disc) => (
              <label key={disc} className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={filters.disciplines.includes(disc)}
                  onChange={() => handleDisciplineToggle(disc)}
                  className="rounded border-equestrian-navy/20 text-equestrian-navy focus:ring-equestrian-navy/20 size-5 cursor-pointer" 
                />
                <span className="text-sm text-slate-700 group-hover:text-equestrian-navy transition-colors">{disc}</span>
              </label>
            ))}
          </div>
        </div>

        {/* 4. Ubicación */}
        <div className="py-6 space-y-4">
          <label className="text-sm font-semibold uppercase tracking-wider text-slate-500">Ubicación</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text"
              placeholder="Ej: Colombia, Argentina..."
              value={filters.location}
              onChange={(e) => setFilters({ ...filters, location: e.target.value })}
              className="w-full rounded-lg border border-equestrian-navy/10 bg-white py-2.5 pl-9 pr-4 text-sm focus:border-equestrian-navy focus:ring-0 outline-none" 
            />
          </div>
        </div>

        {/* 5. Switch de Verificados */}
        <div className="bg-equestrian-navy/5 p-4 rounded-xl border border-equestrian-navy/10 mt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Verified className="text-equestrian-navy w-5 h-5" />
              <span className="text-sm font-bold text-equestrian-navy">Solo Verificados</span>
            </div>
            <button 
              onClick={() => setFilters({ ...filters, verifiedOnly: !filters.verifiedOnly })}
              className={`w-10 h-5 rounded-full relative transition-colors duration-300 ${filters.verifiedOnly ? 'bg-equestrian-navy' : 'bg-slate-300'}`}
            >
              <div className={`absolute top-0.5 size-4 bg-white rounded-full transition-all duration-300 ${filters.verifiedOnly ? 'right-0.5' : 'left-0.5'}`}></div>
            </button>
          </div>
        </div>
        
      </div>
    </aside>
  );
}