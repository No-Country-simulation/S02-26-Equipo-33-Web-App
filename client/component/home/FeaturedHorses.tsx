import Link from 'next/link';
import { ArrowRight, BadgeCheck, MapPin } from 'lucide-react';

async function getHorses() {
  try {
    const res = await fetch('https://s02-26-e33-horse-trust-api.vercel.app/api/horses', {
      next: { revalidate: 60 } 
    });

    if (!res.ok) {
      throw new Error('Error al traer los caballos');
    }

    const jsonResponse = await res.json();
    
    console.log("Respuesta del backend:", jsonResponse);
    
    const horsesArray = Array.isArray(jsonResponse) ? jsonResponse : jsonResponse.data;

    if (!horsesArray || !Array.isArray(horsesArray)) {
       console.log("La API no devolvió una lista válida de caballos.");
       return [];
    }
    
    return horsesArray.slice(0, 3);
  } catch (error) {
    console.error("Hubo un problema conectando con el backend:", error);
    return []; 
  }
}

export default async function FeaturedHorses() {
  const realHorses = await getHorses();

  return (
    <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-color-background-light dark:bg-color-background-dark">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16 border-b border-slate-200 dark:border-slate-800 pb-8">
        <div className="max-w-xl">
          <h2 className="text-sm font-bold text-equestrian-gold uppercase tracking-[0.3em] mb-4">La Colección</h2>
          <h3 className="text-4xl md:text-5xl font-serif text-equestrian-navy dark:text-white leading-tight">Caballos Destacados</h3>
        </div>
        <Link href="/marketplace" className="group text-equestrian-navy dark:text-slate-300 font-bold flex items-center gap-2 text-sm uppercase tracking-widest hover:text-equestrian-gold transition-colors">
          Ver catálogo completo <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
      
      {realHorses.length === 0 ? (
        <div className="text-center py-10 text-slate-500">
          <p>No se encontraron caballos destacados en este momento.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {realHorses.map((horse: any) => (
            <div key={horse.ID} className="luxury-card-hover group bg-white dark:bg-equestrian-navy border border-slate-100 dark:border-slate-800 rounded-lg overflow-hidden flex flex-col h-full shadow-sm">
              <div className="relative h-[400px] overflow-hidden">
                
                <img 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
                  alt={horse.NAME} 
                  src={horse.MAIN_PHOTO || "https://images.unsplash.com/photo-1598974357801-cbca100e65d3?q=80&w=800"} 
                />
                
                {horse.SELLER_VERIFIED === 'verified' && (
                  <div className="absolute top-6 left-6">
                    <div className="flex items-center gap-2 bg-white/90 dark:bg-equestrian-navy/90 backdrop-blur-md py-1.5 px-3 rounded-full border border-white/20 shadow-lg">
                      <BadgeCheck className="text-equestrian-green w-4 h-4" />
                      <span className="text-[10px] font-bold text-equestrian-navy dark:text-white uppercase tracking-wider">Verificado</span>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="p-8 flex flex-col flex-1">
                <div className="mb-6">
                  <h4 className="text-2xl font-serif text-equestrian-navy dark:text-white mb-1 group-hover:text-equestrian-gold transition-colors leading-tight">
                    {horse.NAME}
                  </h4>
                  <div className="flex items-center gap-2 text-slate-400">
                    <span className="text-xs font-medium uppercase tracking-widest">{horse.BREED} • {horse.AGE} años</span>
                  </div>
                  <div className="mt-2 text-sm text-slate-500 font-medium">
                    Disciplina: {horse.DISCIPLINE}
                  </div>
                </div>
                
                <div className="mt-auto space-y-4">
                  <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-6">
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <MapPin className="w-4 h-4" />
                      <span className="text-xs font-medium truncate max-w-[120px]">{horse.LOCATION}</span>
                    </div>
                    <div className="text-xl font-bold text-equestrian-green">
                      ${Number(horse.PRICE).toLocaleString('es-AR')}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}