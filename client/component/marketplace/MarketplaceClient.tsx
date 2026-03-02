"use client";

import { useState } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import FilterSideBar from '@/component/marketplace/FilterSideBar';
import HorseCard from '@/component/marketplace/HorseCard';

interface Horse {
  ID: number;
  NAME: string;
  AGE: number;
  BREED: string;
  DISCIPLINE: string;
  LOCATION: string;
  PRICE: number;
  STATUS: string;
  SELLER_NAME: string;
  SELLER_VERIFIED: string;
  MAIN_PHOTO: string;
}

// Recibimos los caballos desde el servidor a través de las "props"
export default function MarketplaceClient({ initialHorses }: { initialHorses: Horse[] }) {
  
  // 1. EL ESTADO CENTRAL DE LOS FILTROS
  const defaultFilters = {
    minPrice: '',
    maxPrice: '',
    breed: 'Todas las Razas',
    disciplines: [] as string[],
    location: '',
    verifiedOnly: false
  };

  const [filters, setFilters] = useState(defaultFilters);

  const [sortBy, setSortBy] = useState('nuevos');

  const clearFilters = () => setFilters(defaultFilters);

  // 2. MOTOR DE FILTRADO 
  const filteredHorses = initialHorses.filter(horse => {

    if (filters.minPrice !== '' && horse.PRICE < Number(filters.minPrice)) return false;
    
    if (filters.maxPrice !== '' && horse.PRICE > Number(filters.maxPrice)) return false;
    
    if (
      filters.breed !== 'Todas las Razas' && 
      horse.BREED.toLowerCase().trim() !== filters.breed.toLowerCase().trim()
    ) {
      return false;
    }

    if (filters.disciplines.length > 0 && !filters.disciplines.includes(horse.DISCIPLINE)) return false;
    
    if (filters.location && !horse.LOCATION.toLowerCase().includes(filters.location.toLowerCase())) return false;
    
    if (filters.verifiedOnly && horse.SELLER_VERIFIED !== 'verified') return false;
    
    return true;
  });

  const sortedHorses = [...filteredHorses].sort((a, b) => {
    if (sortBy === 'precio_asc') {
      return a.PRICE - b.PRICE; 
    }
    if (sortBy === 'precio_desc') {
      return b.PRICE - a.PRICE; 
    }
    return b.ID - a.ID; 
  });

  return (
    <main className="mx-auto flex max-w-[1440px] px-6 py-8 lg:px-12 gap-8 bg-equestrian-sand min-h-screen">
      
      <FilterSideBar 
        filters={filters} 
        setFilters={setFilters} 
        clearFilters={clearFilters} 
      />

      <div className="flex-1">
        {/* Toolbar Superior */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Colecciones de Lujo</h1>
            <p className="text-slate-500 font-medium mt-1">
              {sortedHorses.length} caballos disponibles
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-slate-500">Ordenar por:</span>
            <div className="relative min-w-[180px]">

              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full appearance-none rounded-lg border-none bg-white py-2 pl-4 pr-10 text-sm font-semibold shadow-sm focus:ring-2 focus:ring-equestrian-navy/10 outline-none cursor-pointer"
              >
                <option value="nuevos">Nuevos Ingresos</option>
                <option value="precio_asc">Precio: Menor a Mayor</option>
                <option value="precio_desc">Precio: Mayor a Menor</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* RENDERIZADO */}
        {sortedHorses.length === 0 ? (
          <div className="text-center py-20 text-slate-500 font-medium border-2 border-dashed border-slate-200 rounded-xl">
            No se encontraron ejemplares con los filtros seleccionados.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {/* MAPEAR LA LISTA ORDENADA */}
            {sortedHorses.map(horse => (
              <HorseCard key={horse.ID} horse={horse} />
            ))}
          </div>
        )}
        
        {/* Paginación */}
        {sortedHorses.length > 0 && (
          <div className="mt-12 flex items-center justify-center gap-2">
            <button className="size-10 flex items-center justify-center rounded-lg border border-equestrian-navy/10 hover:bg-equestrian-navy/5 transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="size-10 flex items-center justify-center rounded-lg bg-equestrian-navy text-white font-bold text-sm">1</button>
            <button className="size-10 flex items-center justify-center rounded-lg border border-equestrian-navy/10 hover:bg-equestrian-navy/5 transition-colors font-bold text-sm">2</button>
            <span className="px-2 text-slate-400">...</span>
            <button className="size-10 flex items-center justify-center rounded-lg border border-equestrian-navy/10 hover:bg-equestrian-navy/5 transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
    
      </div>
    </main>
  );
}