import { ShieldCheck, HeartPulse } from 'lucide-react';
import Image from 'next/image';

export default function SecuritySection() {
  return (
    <>
      {/* SECCIÓN SEGURIDAD */}
      <section className="bg-equestrian-navy py-32 relative overflow-hidden">
        {/* Detalle de diseño de fondo */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-white/5 skew-x-12 translate-x-32" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            
            {/* Textos y viñetas */}
            <div>
              <h2 className="text-equestrian-gold font-bold uppercase tracking-[0.4em] text-sm mb-6">
                Seguridad y Garantía
              </h2>
              <h3 className="text-4xl md:text-5xl font-serif text-white mb-8 leading-tight">
                El Motor de Verificación <br/>de HorseTrust
              </h3>
              <p className="text-slate-400 text-lg mb-12 leading-relaxed max-w-lg">
                Hemos redefinido el comercio de caballos de alto valor implementando un proceso de auditoría riguroso para cada publicación, protegiendo tanto al vendedor como al comprador.
              </p>
              
              <div className="grid sm:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-full border border-equestrian-gold/30 flex items-center justify-center text-equestrian-gold">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h4 className="text-white font-bold">Auditoría de Propiedad</h4>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    Títulos legales y documentos de identidad de los vendedores (KYC) verificados por autenticidad.
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-full border border-equestrian-gold/30 flex items-center justify-center text-equestrian-gold">
                    <HeartPulse className="w-6 h-6" />
                  </div>
                  <h4 className="text-white font-bold">Historial Clínico</h4>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    Acceso directo a historiales veterinarios, vacunas y certificados obligatorios.
                  </p>
                </div>
              </div>
            </div>

            {/* Imagen destacada */}
            <div className="relative group">
                <Image 
                    src="/img/caballo-security-section.webp" 
                    alt="Caballo viendo a la cámara" 
                    width={800}
                    height={1000}
                    className="rounded-2xl shadow-2xl grayscale hover:grayscale-0 transition-all duration-700 aspect-[4/5] object-cover" 
                />
                <div className="absolute -bottom-10 -left-10 bg-white dark:bg-slate-800 p-10 rounded-2xl shadow-2xl max-w-xs border border-slate-100 dark:border-slate-700">
                    <p className="text-5xl font-serif text-equestrian-navy dark:text-white mb-2">2.4k</p>
                    <p className="text-xs font-bold text-equestrian-gold uppercase tracking-widest">
                    Caballos Asegurados
                    </p>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* CALL TO ACTION (CTA) */}
      <section className="py-32 px-4 bg-color-background-light dark:bg-color-background-dark">
        <div className="max-w-6xl mx-auto bg-equestrian-green rounded-[2rem] p-16 text-center text-white relative overflow-hidden shadow-xl border border-equestrian-gold/20">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-serif italic mb-8">
              Comienza tu búsqueda con <br/>
              <span className="not-italic font-bold text-equestrian-gold">total confianza</span>
            </h2>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button className="bg-equestrian-gold text-equestrian-navy px-10 py-5 rounded-lg font-bold text-sm uppercase tracking-widest hover:brightness-110 transition-all shadow-xl shadow-equestrian-gold/20">
                Acceder al Mercado
              </button>
              <button className="bg-transparent border border-white/30 text-white px-10 py-5 rounded-lg font-bold text-sm uppercase tracking-widest hover:bg-white/10 transition-all">
                Registrarme como Vendedor
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}