import { Search, Award } from 'lucide-react';
import Image from 'next/image';

export default function HeroSection() {
  return (
    <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
      {/* Imagen de fondo */}
      <div className="absolute inset-0">
        <Image 
            src="/img/hero-bg.webp" 
            alt="Fondo ecuestre premium"
            fill
            priority
            className="object-cover object-center"
        />
        </div>
      <div className="absolute inset-0 hero-gradient" />
      
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <span className="inline-block py-1 px-4 rounded-full bg-equestrian-gold/20 text-equestrian-gold text-[10px] font-bold uppercase tracking-[0.2em] mb-6 border border-equestrian-gold/30 backdrop-blur-sm">
          Red Ecuestre Exclusiva
        </span>
        <h1 className="text-5xl md:text-7xl font-serif italic text-white leading-tight mb-6">
          Confianza <span className="text-equestrian-gold not-italic font-bold">Inquebrantable</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
          Un destino selecto para adquisiciones equinas de élite, donde cada pedigrí y registro de salud es auditado por expertos.
        </p>
        
        {/* Buscador Rápido */}
        <div className="bg-white/10 backdrop-blur-md p-1.5 rounded-2xl shadow-2xl max-w-3xl mx-auto border border-white/20">
          <div className="bg-white dark:bg-equestrian-navy p-1 rounded-xl flex flex-col md:flex-row items-stretch gap-1">
            <div className="flex-1 flex items-center px-4 py-3 border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-800">
              <Search className="text-slate-400 mr-2 w-5 h-5" />
              <input className="w-full border-0 focus:ring-0 bg-transparent text-sm font-medium outline-none placeholder:text-slate-400" placeholder="Raza o Linaje" type="text" />
            </div>
            <div className="flex-1 flex items-center px-4 py-3 border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-800">
              <Award className="text-slate-400 mr-2 w-5 h-5" />
              <input className="w-full border-0 focus:ring-0 bg-transparent text-sm font-medium outline-none placeholder:text-slate-400" placeholder="Disciplina" type="text" />
            </div>
            <button className="bg-equestrian-green hover:bg-equestrian-navy text-white font-bold py-3.5 px-8 rounded-lg transition-all flex items-center justify-center gap-2">
              Explorar
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}