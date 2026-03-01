"use client";

import { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, MapPin, ShieldCheck, Mail, Calendar, 
  CheckCircle, FileText, Activity, PlayCircle
} from 'lucide-react';

export default function HorseDetailPage() {
  //MOCK DE DATOS temporal
  const mockHorse = {
    _id: "12345",
    name: "Sterling",
    age: 5,
    breed: "KWPN",
    discipline: "Adiestramiento",
    pedigree: "Padre: Totilas | Madre: Danciera",
    location: { country: "Países Bajos", region: "Utrecht" },
    price: 45000,
    currency: "EUR",
    photos: [
      { url: "https://images.unsplash.com/photo-1598974357801-cbca100e65d3?q=80&w=1200", is_cover: true },
      { url: "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?q=80&w=1200", is_cover: false },
      { url: "https://images.unsplash.com/photo-1599059021750-82716ae2b661?q=80&w=1200", is_cover: false },
    ],
    videos: [
      { url: "https://youtube.com/watch?v=123", video_type: "training" }
    ],
    seller_id: {
      full_name: "Van der Veen Stables",
      seller_profile: { is_verified_badge: true }
    }
  };

  const mockVetRecord = {
    review_date: "14 de Octubre, 2023",
    health_status: "Excelente",
    validation_status: "validated",
    notes: "Ejemplar en óptimas condiciones físicas. Articulaciones limpias y sin signos de desgaste. Sistema respiratorio y cardiovascular sin alteraciones durante la prueba de esfuerzo.",
    vaccines: [
      { name: "Influenza Equina", applied_at: "2023-09-01", next_due_at: "2024-03-01", batch_number: "L-99281" },
      { name: "Tétanos", applied_at: "2023-09-01", next_due_at: "2024-09-01", batch_number: "T-4412" }
    ],
    certificates: [
      { title: "Placas Radiográficas (RX)", url: "#" },
      { title: "Certificado Clínico General", url: "#" }
    ]
  };

  // Estado para la galería de imágenes interactiva
  const [activeImage, setActiveImage] = useState(mockHorse.photos[0].url);

  // Formateador de moneda
  const formattedPrice = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: mockHorse.currency,
    maximumFractionDigits: 0,
  }).format(mockHorse.price);

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
          <span className="hover:text-equestrian-navy transition-colors">{mockHorse.breed}</span>
          <span className="mx-2">/</span>
          <span className="text-equestrian-navy font-black">{mockHorse.name}</span>
        </nav>

        {/* Grilla Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* COLUMNA IZQUIERDA: Galería y Detalles (8 columnas) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* 1. Galería Multimedia */}
            <div className="space-y-4">
              <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden shadow-sm bg-slate-200 border border-slate-100">
                <img src={activeImage} alt={mockHorse.name} className="w-full h-full object-cover transition-opacity duration-300" />
                
                {/* Badge Premium */}
                {mockHorse.seller_id.seller_profile.is_verified_badge && (
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur px-3 py-1.5 rounded flex items-center gap-1.5 shadow-sm">
                    <ShieldCheck className="text-equestrian-navy w-4 h-4" />
                    <span className="text-xs font-black text-equestrian-navy uppercase tracking-wider">Vendedor Verificado</span>
                  </div>
                )}
              </div>

              {/* Miniaturas */}
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {mockHorse.photos.map((photo, index) => (
                  <button 
                    key={index}
                    onClick={() => setActiveImage(photo.url)}
                    className={`flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border-2 transition-all ${activeImage === photo.url ? 'border-equestrian-navy ring-2 ring-equestrian-navy/20 opacity-100' : 'border-transparent opacity-60 hover:opacity-100'}`}
                  >
                    <img src={photo.url} alt={`Miniatura ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
                
                {/* Botón de Video Falso (Si hay video en la BD) */}
                {mockHorse.videos.length > 0 && (
                  <button className="flex-shrink-0 w-24 h-24 rounded-lg border border-slate-200 bg-white flex items-center justify-center opacity-80 hover:opacity-100 transition-all text-equestrian-navy group">
                    <PlayCircle className="w-8 h-8 group-hover:scale-110 transition-transform" />
                  </button>
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
                {mockHorse.pedigree || "Información de pedigree no especificada por el vendedor."}
              </p>
            </div>

           {/*Pasaporte Sanitario */}
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
                  
                  {mockVetRecord.validation_status === 'validated' && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-equestrian-gold text-equestrian-navy rounded-full shadow-lg font-black text-xs uppercase tracking-wider">
                      <CheckCircle className="w-4 h-4" /> Validado por Plataforma
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <p className="text-xs uppercase tracking-widest text-white/50 mb-1 font-bold">Última Revisión</p>
                    <p className="font-medium text-lg">{mockVetRecord.review_date}</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <p className="text-xs uppercase tracking-widest text-white/50 mb-1 font-bold">Estado de Salud</p>
                    <p className="font-medium text-lg text-equestrian-gold">{mockVetRecord.health_status}</p>
                  </div>
                </div>

                {/* Notas del Veterinario */}
                {mockVetRecord.notes && (
                  <div className="mb-6 bg-white/5 rounded-xl p-4 border border-white/10">
                    <p className="text-xs font-black text-white/50 uppercase tracking-widest mb-2">Observaciones Clínicas</p>
                    <p className="text-white/80 text-sm leading-relaxed italic">"{mockVetRecord.notes}"</p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Vacunas */}
                  <div className="space-y-3">
                    <p className="text-xs font-black text-white/50 uppercase tracking-widest mb-4">Registro de Vacunación</p>
                    {mockVetRecord.vaccines.map((vac, idx) => (
                      <div key={idx} className="py-2 border-b border-white/10">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-white/90 font-bold text-sm">{vac.name}</span>
                          <span className="text-white/50 text-xs">Lote: {vac.batch_number || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-white/60">Aplicada: {vac.applied_at}</span>
                          <span className="text-equestrian-gold font-medium">Refuerzo: {vac.next_due_at || 'N/A'}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Certificados (PDFs) */}
                  {mockVetRecord.certificates.length > 0 && (
                    <div className="space-y-3">
                      <p className="text-xs font-black text-white/50 uppercase tracking-widest mb-4">Documentos Adjuntos</p>
                      <div className="space-y-2">
                        {mockVetRecord.certificates.map((cert, idx) => (
                          <a 
                            key={idx} 
                            href={cert.url}
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

          </div>

          {/* COLUMNA DERECHA: Sidebar sticky*/}
          <div className="lg:col-span-4 relative">
            <div className="sticky top-24 space-y-6">
              
              {/* Tarjeta Principal de Compra */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <div className="mb-6">
                  <h1 className="font-serif text-4xl font-black text-equestrian-navy mb-2">{mockHorse.name}</h1>
                  <div className="flex items-center gap-1.5 text-slate-500 text-sm font-medium">
                    <MapPin className="w-4 h-4" />
                    <span>{mockHorse.location.region}, {mockHorse.location.country}</span>
                  </div>
                </div>
                
                <div className="mb-8 p-4 bg-slate-50 rounded-xl border border-slate-100 text-center">
                  <p className="text-xs font-black uppercase tracking-widest text-slate-500 mb-1">Valor de Publicación</p>
                  <p className="font-serif text-4xl text-equestrian-navy font-black">{formattedPrice}</p>
                </div>

                {/* Especificaciones */}
                <div className="grid grid-cols-2 gap-3 mb-8">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
                    <p className="text-[10px] uppercase text-slate-400 font-black tracking-wider mb-1">Raza</p>
                    <p className="font-bold text-slate-900 text-sm">{mockHorse.breed}</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
                    <p className="text-[10px] uppercase text-slate-400 font-black tracking-wider mb-1">Edad</p>
                    <p className="font-bold text-slate-900 text-sm">{mockHorse.age} Años</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center col-span-2">
                    <p className="text-[10px] uppercase text-slate-400 font-black tracking-wider mb-1">Disciplina Principal</p>
                    <p className="font-bold text-slate-900 text-sm">{mockHorse.discipline}</p>
                  </div>
                </div>

                {/* Botones de Acción */}
                <div className="space-y-3">
                  <button className="w-full bg-equestrian-navy hover:bg-equestrian-navy/90 text-white font-bold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2 uppercase tracking-wider text-sm">
                    <Mail className="w-5 h-5" /> Contactar Vendedor
                  </button>
                </div>
              </div>

              {/* Perfil del Vendedor */}
              <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-equestrian-gold/20 flex-shrink-0 flex items-center justify-center text-equestrian-gold font-serif text-xl font-bold">
                  {mockHorse.seller_id.full_name.charAt(0)}
                </div>
                <div className="flex-grow">
                  <p className="text-xs font-black uppercase tracking-widest text-slate-400">Publicado por</p>
                  <p className="font-bold text-slate-900">{mockHorse.seller_id.full_name}</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </main>
  );
}