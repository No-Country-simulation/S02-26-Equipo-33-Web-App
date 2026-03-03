"use client";

import { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, MapPin, ShieldCheck, Mail, Calendar, 
  CheckCircle, FileText, Activity, PlayCircle
} from 'lucide-react';

import { startConversation } from '@/app/actions/chat';
import { useRouter } from 'next/navigation';

export default function HorseDetailClient({ horse, vetRecord }: { horse: any, vetRecord: any }) {

  const router = useRouter();

  const handleContact = async () => {
    const recipientId = horse.seller_id?.id || horse.seller_id?.ID || horse.seller_id?._id;
    const horseId = horse.id || horse.ID || horse._id;

    if (!recipientId || !horseId) {
      console.error("DATOS INCOMPLETOS:", { recipientId, horseId, sellerObj: horse.seller_id });
      alert("El backend no está mandando el ID del vendedor.");
      return;
    }

    const result = await startConversation(Number(recipientId), Number(horseId));
    
    if (result.error) {
      alert("Error del servidor: " + result.error);
    } else if (result.id || result._id || result.ID) {
      router.push(`/chat?id=${result.id || result._id || result.ID}`);
    }
  };

  const [activeImage, setActiveImage] = useState<string>(
    horse?.photos?.length > 0 ? horse.photos[0].url : ''
  );

  const formatPrice = (price: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('es-AR', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  };

  return (
    <main className="min-h-screen bg-equestrian-sand font-sans flex flex-col">
      {/* Topbar */}
      <header className=" w-full">
        <div className="mx-auto flex h-16 max-w-[1440px] items-center px-6 lg:px-12">
          <Link href="/marketplace" className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-equestrian-navy transition-colors">
            <ArrowLeft className="w-4 h-4" /> Volver al Catálogo
          </Link>
        </div>
      </header>

      <div className="flex-grow w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-8">
        {/* Breadcrumbs */}
        <nav className="flex mb-6 text-sm text-slate-500 font-medium">
          <Link href="/marketplace" className="hover:text-equestrian-navy transition-colors">Marketplace</Link>
          <span className="mx-2">/</span>
          <span className="hover:text-equestrian-navy transition-colors">{horse.breed}</span>
          <span className="mx-2">/</span>
          <span className="text-equestrian-navy font-black">{horse.name}</span>
        </nav>

        {/* Grilla Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* COLUMNA IZQUIERDA: Galería y Detalles */}
          <div className="lg:col-span-8 space-y-8">
            {/* Galería Multimedia */}
            <div className="space-y-4">
              <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden shadow-sm bg-slate-200 border border-slate-100">
                {activeImage ? (
                  <img src={activeImage} alt={horse.name} className="w-full h-full object-cover transition-opacity duration-300" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">Sin imagen</div>
                )}
                
                {horse.seller_id?.seller_profile?.is_verified_badge && (
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur px-3 py-1.5 rounded flex items-center gap-1.5 shadow-sm">
                    <ShieldCheck className="text-equestrian-navy w-4 h-4" />
                    <span className="text-xs font-black text-equestrian-navy uppercase tracking-wider">Vendedor Verificado</span>
                  </div>
                )}
              </div>

              {/* Miniaturas */}
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {horse.photos?.map((photo: any, index: number) => (
                  <button 
                    key={index}
                    onClick={() => setActiveImage(photo.url)}
                    className={`flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border-2 transition-all ${activeImage === photo.url ? 'border-equestrian-navy ring-2 ring-equestrian-navy/20 opacity-100' : 'border-transparent opacity-60 hover:opacity-100'}`}
                  >
                    <img src={photo.url} alt={`Miniatura ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
                
                {horse.videos && horse.videos.length > 0 && (
                  <a 
                    href={horse.videos[0].url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex-shrink-0 w-24 h-24 rounded-lg border border-slate-200 bg-white flex items-center justify-center opacity-80 hover:opacity-100 transition-all text-equestrian-navy group"
                    title="Ver Video Completo"
                  >
                    <PlayCircle className="w-8 h-8 group-hover:scale-110 transition-transform" />
                  </a>
                )}
              </div>
            </div>

            {/* Pedigree */}
            <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm">
              <div className="flex items-center gap-3 mb-4 border-b border-slate-100 pb-4">
                <div className="bg-equestrian-gold/10 p-2 rounded-lg text-equestrian-gold">
                  <Activity className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-slate-900">Genealogía / Pedigree</h3>
              </div>
              <p className="text-slate-600 font-medium leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-100">
                {horse.pedigree || "Información de pedigree no especificada por el vendedor."}
              </p>
            </div>

           {/* Pasaporte Sanitario */}
            {vetRecord ? (
              <div className="bg-equestrian-navy rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white/10 rounded-lg">
                        <FileText className="w-6 h-6 text-equestrian-gold" />
                      </div>
                      <div>
                        <h3 className="font-serif text-2xl font-bold">Pasaporte Sanitario</h3>
                        <p className="text-white/60 text-sm font-medium">Revisión Veterinaria Oficial</p>
                      </div>
                    </div>
                    
                    {vetRecord.validation_status === 'validated' && (
                      <div className="flex items-center gap-2 px-4 py-2 bg-equestrian-gold text-equestrian-navy rounded-full shadow-lg font-black text-xs uppercase tracking-wider">
                        <CheckCircle className="w-4 h-4" /> Validado por Plataforma
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <p className="text-xs uppercase tracking-widest text-white/50 mb-1 font-bold">Última Revisión</p>
                      <p className="font-medium text-lg">{formatDate(vetRecord.review_date)}</p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <p className="text-xs uppercase tracking-widest text-white/50 mb-1 font-bold">Estado de Salud</p>
                      <p className="font-medium text-lg text-equestrian-gold">{vetRecord.health_status}</p>
                    </div>
                  </div>

                  {vetRecord.notes && (
                    <div className="mb-6 bg-white/5 rounded-xl p-4 border border-white/10">
                      <p className="text-xs font-black text-white/50 uppercase tracking-widest mb-2">Observaciones Clínicas</p>
                      <p className="text-white/80 text-sm leading-relaxed italic">"{vetRecord.notes}"</p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {vetRecord.vaccines && vetRecord.vaccines.length > 0 && (
                      <div className="space-y-3">
                        <p className="text-xs font-black text-white/50 uppercase tracking-widest mb-4">Registro de Vacunación</p>
                        {vetRecord.vaccines.map((vac: any, idx: number) => (
                          <div key={idx} className="py-2 border-b border-white/10">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-white/90 font-bold text-sm">{vac.name}</span>
                              <span className="text-white/50 text-xs">Lote: {vac.batch_number || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                              <span className="text-white/60">Aplicada: {formatDate(vac.applied_at)}</span>
                              <span className="text-equestrian-gold font-medium">Refuerzo: {formatDate(vac.next_due_at)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {vetRecord.certificates && vetRecord.certificates.length > 0 && (
                      <div className="space-y-3">
                        <p className="text-xs font-black text-white/50 uppercase tracking-widest mb-4">Documentos Adjuntos</p>
                        <div className="space-y-2">
                          {vetRecord.certificates.map((cert: any, idx: number) => (
                            <a 
                              key={idx} 
                              href={cert.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group cursor-pointer"
                            >
                              <div className="bg-white/10 p-1.5 rounded text-white/70 group-hover:text-equestrian-gold transition-colors">
                                <FileText className="w-4 h-4" />
                              </div>
                              <span className="text-sm font-medium text-white/90 group-hover:text-white">{cert.title || 'Documento Veterinario'}</span>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm text-center">
                <ShieldCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="font-serif text-xl font-bold text-slate-900">Sin Pasaporte Sanitario</h3>
                <p className="text-slate-500 text-sm mt-2">Este ejemplar aún no cuenta con un registro veterinario validado en la plataforma.</p>
              </div>
            )}
          </div>

          {/* COLUMNA DERECHA: Sidebar sticky */}
          <div className="lg:col-span-4 relative">
            <div className="sticky top-24 space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <div className="mb-6">
                  <h1 className="font-serif text-4xl font-black text-equestrian-navy mb-2">{horse.name}</h1>
                  <div className="flex items-center gap-1.5 text-slate-500 text-sm font-medium">
                    <MapPin className="w-4 h-4" />
                    <span>{horse.location?.region}, {horse.location?.country}</span>
                  </div>
                </div>
                
                <div className="mb-8 p-4 bg-slate-50 rounded-xl border border-slate-100 text-center">
                  <p className="text-xs font-black uppercase tracking-widest text-slate-500 mb-1">Valor de Publicación</p>
                  <p className="font-serif text-3xl text-equestrian-navy font-black">{formatPrice(horse.price, horse.currency)}</p>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-8">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
                    <p className="text-[10px] uppercase text-slate-400 font-black tracking-wider mb-1">Raza</p>
                    <p className="font-bold text-slate-900 text-sm">{horse.breed}</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
                    <p className="text-[10px] uppercase text-slate-400 font-black tracking-wider mb-1">Edad</p>
                    <p className="font-bold text-slate-900 text-sm">{horse.age} Años</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center col-span-2">
                    <p className="text-[10px] uppercase text-slate-400 font-black tracking-wider mb-1">Disciplina Principal</p>
                    <p className="font-bold text-slate-900 text-sm">{horse.discipline}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <button onClick={handleContact} className="w-full bg-equestrian-navy hover:bg-equestrian-navy/90 text-white font-bold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2 uppercase tracking-wider text-sm">
                    <Mail className="w-5 h-5" /> Contactar Vendedor
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-equestrian-gold/20 flex-shrink-0 flex items-center justify-center text-equestrian-gold font-serif text-xl font-bold">
                  {horse.seller_id?.full_name?.charAt(0) || "U"}
                </div>
                <div className="flex-grow">
                  <p className="text-xs font-black uppercase tracking-widest text-slate-400">Publicado por</p>
                  <p className="font-bold text-slate-900">{horse.seller_id?.full_name || "Vendedor Privado"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}