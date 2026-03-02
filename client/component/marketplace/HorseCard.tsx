import { MapPin, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

interface HorseProps {
  horse: {
    ID: number;
    NAME: string;
    AGE: number;
    BREED: string;
    DISCIPLINE: string;
    LOCATION: string;
    PRICE: number;
    SELLER_VERIFIED: string;
    MAIN_PHOTO: string;
  };
}

export default function HorseCard({ horse }: HorseProps) {
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(horse.PRICE);

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group border border-slate-100">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img 
          src={horse.MAIN_PHOTO} 
          alt={horse.NAME} 
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" 
        />
        
        {/* Badge de Verificación */}
        {horse.SELLER_VERIFIED === 'verified' && (
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded flex items-center gap-1">
            <ShieldCheck className="text-equestrian-navy w-4 h-4" />
            <span className="text-[10px] font-bold text-equestrian-navy uppercase tracking-wider">Verificado</span>
          </div>
        )}
      </div>

      {/* Contenido */}
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-slate-900">{horse.NAME}</h3>
          <span className="text-lg font-black text-equestrian-navy">{formattedPrice}</span>
        </div>
        
        {/* Etiquetas (Raza, Edad, Disciplina) */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="text-[11px] font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded-full">{horse.BREED}</span>
          <span className="text-[11px] font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded-full">{horse.AGE} años</span>
          <span className="text-[11px] font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded-full">{horse.DISCIPLINE}</span>
        </div>
        
        {/* Ubicación */}
        <div className="flex items-center gap-1 text-slate-400 text-xs mb-4">
          <MapPin className="w-4 h-4" />
          <span>{horse.LOCATION}</span>
        </div>
        
        {/* Botón de Acción */}
        <Link 
          href={`/marketplace/${horse.ID}`}
          className="w-full bg-equestrian-navy/5 text-equestrian-navy font-bold py-2.5 rounded-lg hover:bg-equestrian-navy hover:text-white transition-colors"
        >
          Ver Detalles
        </Link>
      </div>
    </div>
  );
}