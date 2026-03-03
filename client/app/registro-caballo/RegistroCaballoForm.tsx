"use client";

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Check, ImagePlus, Info, MapPin, Video, ShieldCheck } from 'lucide-react';
import HorseCard from '@/component/marketplace/HorseCard';
import { useRouter } from 'next/navigation';
import { createHorse } from '@/app/actions/horses';

const uploadToCloudinary = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'horse_trust_uploads'); 
  formData.append('cloud_name', 'di2agiylz');

  try {
    const res = await fetch('https://api.cloudinary.com/v1_1/di2agiylz/image/upload', {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    return data.secure_url; 
  } catch (error) {
    console.error('Error subiendo imagen a Cloudinary:', error);
    return null;
  }
};

export default function RegistroCaballoPage() {
  const router = useRouter();
  // ESTADOS DEL FORMULARIO
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    breed: 'Todas las Razas',
    discipline: 'Salto',
    price: '',
    currency: 'USD',
    country: '',
    region: '',
    videoUrl: '',
    videoType: 'training',
    videoTitle: '',
    videoDate: '',
  });

  const [photos, setPhotos] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false); // <-- ESTADO ARREGLADO (ARRIBA DE TODO)

  // INICIAL LIVE PREVIEW
  const previewHorse = {
    ID: 999,
    NAME: formData.name || 'Nombre del Ejemplar',
    AGE: Number(formData.age) || 0,
    BREED: formData.breed,
    DISCIPLINE: formData.discipline,
    LOCATION: formData.region && formData.country ? `${formData.region}, ${formData.country}` : 'Ubicación',
    PRICE: Number(formData.price) || 0,
    SELLER_VERIFIED: 'verified', 
    MAIN_PHOTO: previewUrls.length > 0 ? previewUrls[0] : 'https://images.unsplash.com/photo-1598974357801-cbca100e65d3?q=80&w=800'
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setPhotos((prev) => [...prev, ...selectedFiles]);
      const newPreviews = selectedFiles.map(file => URL.createObjectURL(file));
      setPreviewUrls((prev) => [...prev, ...newPreviews]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (photos.length < 3) {
      alert("Se requieren al menos 3 fotos.");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // 1. Subir imágenes desde el cliente
      const uploadedUrls = [];
      for (const file of photos) {
        const url = await uploadToCloudinary(file);
        if (url) uploadedUrls.push(url);
      }

      const horsePayload = {
        name: formData.name,
        age: Number(formData.age),
        breed: formData.breed,
        discipline: formData.discipline,
        price: Number(formData.price),
        currency: formData.currency,
        location: `${formData.region}, ${formData.country}`,
        photos: uploadedUrls.map((url, i) => ({ url, is_cover: i === 0 }))
      };

      const result = await createHorse(horsePayload);

      if (!result.success) {
        throw new Error(result.error);
      }

      alert("¡Ejemplar publicado con éxito!");
      router.push('/dashboard');

    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-equestrian-sand flex flex-col font-sans">
      
      <header className=" w-full  border-slate-200 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[1440px] items-center px-6 lg:px-12">
          <Link href="/marketplace" className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-equestrian-navy transition-colors">
            <ArrowLeft className="w-4 h-4" /> Volver al Catálogo
          </Link>
        </div>
      </header>

      <div className="flex-1 w-full max-w-[1440px] mx-auto p-6 lg:p-12">
        
        {/* Encabezado */}
        <div className="mb-10">
          <h1 className="text-3xl lg:text-4xl font-black text-equestrian-navy tracking-tight uppercase">
            Publicar <span className="text-equestrian-gold font-serif italic lowercase tracking-normal">Ejemplar</span>
          </h1>
          <p className="text-slate-500 mt-2 font-medium">Completá los datos con precisión para generar confianza en los compradores.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* COLUMNA IZQUIERDA: FORMULARIO */}
          <div className="lg:col-span-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* Sección 1: Información Básica */}
              <section className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
                <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
                  <div className="bg-equestrian-navy/10 p-2 rounded-lg text-equestrian-navy">
                    <Info className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Información Básica</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-500">Nombre del Caballo</label>
                    <input name="name" value={formData.name} onChange={handleChange} required className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-equestrian-navy focus:ring-1 focus:ring-equestrian-navy outline-none transition-all" placeholder="Ej. Tornado Express" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-500">Edad (Años)</label>
                    <input name="age" type="number" min="0" max="40" value={formData.age} onChange={handleChange} required className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-equestrian-navy focus:ring-1 focus:ring-equestrian-navy outline-none transition-all" placeholder="Ej. 4" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-500">Raza</label>
                    <select name="breed" value={formData.breed} onChange={handleChange} className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-equestrian-navy focus:ring-1 focus:ring-equestrian-navy outline-none transition-all cursor-pointer">
                      <option>Pura Sangre</option>
                      <option>Árabe</option>
                      <option>Cuarto de Milla</option>
                      <option>Criollo</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-500">Disciplina</label>
                    <select name="discipline" value={formData.discipline} onChange={handleChange} className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-equestrian-navy focus:ring-1 focus:ring-equestrian-navy outline-none transition-all cursor-pointer">
                      <option>Salto</option>
                      <option>Adiestramiento</option>
                      <option>Polo</option>
                      <option>Carreras</option>
                    </select>
                  </div>
                </div>
              </section>

              {/* Sección 2: Ubicación y Precio */}
              <section className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
                <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
                  <div className="bg-equestrian-navy/10 p-2 rounded-lg text-equestrian-navy">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Ubicación y Valor</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-500">País</label>
                    <input name="country" value={formData.country} onChange={handleChange} required className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-equestrian-navy focus:ring-1 focus:ring-equestrian-navy outline-none transition-all" placeholder="Ej. Argentina" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-500">Provincia / Región</label>
                    <input name="region" value={formData.region} onChange={handleChange} required className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-equestrian-navy focus:ring-1 focus:ring-equestrian-navy outline-none transition-all" placeholder="Ej. Posadas, Misiones" />
                  </div>
                  <div className="md:col-span-2 grid grid-cols-3 gap-4">
                    <div className="col-span-2 space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-500">Precio</label>
                      <input name="price" type="number" value={formData.price} onChange={handleChange} required className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-equestrian-navy focus:ring-1 focus:ring-equestrian-navy outline-none transition-all" placeholder="Ej. 35000" />
                    </div>
                    <div className="col-span-1 space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-500">Moneda</label>
                      <select name="currency" value={formData.currency} onChange={handleChange} className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-equestrian-navy focus:ring-1 focus:ring-equestrian-navy outline-none transition-all cursor-pointer">
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="ARS">ARS</option>
                      </select>
                    </div>
                  </div>
                </div>
              </section>

              {/* Sección 3: Multimedia */}
              <section className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
                <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
                  <div className="bg-equestrian-navy/10 p-2 rounded-lg text-equestrian-navy">
                    <ImagePlus className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Galería Multimedia</h3>
                </div>

                <div className="space-y-6">
                  <div className="space-y-6">
                    {/* Zona de subida real */}
                    <label className="border-2 border-dashed border-slate-300 rounded-xl p-10 flex flex-col items-center justify-center text-center bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors relative">
                        <input 
                        type="file" 
                        multiple 
                        accept="image/jpeg, image/png, image/webp" 
                        onChange={handleImageUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <ImagePlus className="w-10 h-10 text-slate-400 mb-4" />
                        <p className="text-sm font-bold text-slate-900">Arrastrá tus fotos o hacé clic acá</p>
                        <p className="text-xs text-slate-500 mt-2">Mínimo 3 fotos requeridas (JPG, PNG). La primera será la portada.</p>
                    </label>

                    {/* Grilla de Miniaturas */}
                    {previewUrls.length > 0 && (
                        <div className="grid grid-cols-4 md:grid-cols-5 gap-3 mt-4">
                        {previewUrls.map((url, index) => (
                            <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-slate-200">
                            <img src={url} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                            {index === 0 && (
                                <span className="absolute bottom-0 left-0 right-0 bg-equestrian-navy/80 text-white text-[10px] text-center font-bold py-1 backdrop-blur-sm">
                                PORTADA
                                </span>
                            )}
                            </div>
                        ))}
                        </div>
                    )}
                  </div>
                  
                  {/* Enlace de Video (Opcional) */}
                  <div className="space-y-4 border border-slate-200 p-5 rounded-xl bg-slate-50/50">
                    <div className="flex items-center gap-2 mb-2">
                      <Video className="w-5 h-5 text-slate-400" />
                      <h4 className="text-sm font-bold text-slate-700">Video Promocional (Opcional)</h4>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-black uppercase tracking-widest text-slate-500">URL del Video (YouTube/Vimeo)</label>
                        <input name="videoUrl" value={formData.videoUrl} onChange={handleChange} className="w-full mt-1 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm focus:border-equestrian-navy focus:ring-1 focus:ring-equestrian-navy outline-none transition-all" placeholder="Ej. https://youtube.com/watch?v=..." />
                      </div>
                      
                      {/* Se despliega solo si hay una URL */}
                      {formData.videoUrl && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-slate-200">
                          <div>
                            <label className="text-xs font-black uppercase tracking-widest text-slate-500">Tipo de Video</label>
                            <select name="videoType" value={formData.videoType} onChange={handleChange} className="w-full mt-1 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm focus:border-equestrian-navy outline-none transition-all cursor-pointer">
                              <option value="training">Entrenamiento</option>
                              <option value="competition">Competición</option>
                              <option value="other">Otro</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-xs font-black uppercase tracking-widest text-slate-500">Título</label>
                            <input name="videoTitle" value={formData.videoTitle} onChange={handleChange} className="w-full mt-1 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm focus:border-equestrian-navy outline-none transition-all" placeholder="Ej. Salto libre 1.20m" />
                          </div>
                          <div>
                            <label className="text-xs font-black uppercase tracking-widest text-slate-500">Fecha de Grabación</label>
                            {/* obligatorio solo si hay URL */}
                            <input type="date" name="videoDate" value={formData.videoDate} onChange={handleChange} required={!!formData.videoUrl} className="w-full mt-1 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm focus:border-equestrian-navy outline-none transition-all" />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </section>

              {/* Botones de Acción */}
              <div className="flex items-center justify-end gap-4 pt-6">
                <Link href="/marketplace" className="px-6 py-3 rounded-lg text-slate-500 font-bold hover:bg-slate-100 transition-colors text-sm">
                  Cancelar
                </Link>
                <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-8 py-3 rounded-lg bg-equestrian-navy hover:bg-equestrian-navy/90 text-white font-bold transition-all text-sm uppercase tracking-wider disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                    <Check className="w-4 h-4" /> {isSubmitting ? 'Subiendo...' : 'Publicar Caballo'}
                </button>
              </div>

            </form>
          </div>

          {/* COLUMNA DERECHA: LIVE PREVIEW */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black uppercase tracking-widest text-slate-500">Vista Previa en Vivo</h4>
                <span className="text-[10px] bg-equestrian-gold/20 text-equestrian-navy px-2 py-1 rounded font-bold uppercase tracking-wider">Borrador</span>
              </div>
              
              <div className="pointer-events-none">
                <HorseCard horse={previewHorse} />
              </div>

              {/* Info Adicional */}
              <div className="bg-equestrian-navy/5 rounded-xl p-4 border border-equestrian-navy/10 mt-4">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="text-equestrian-navy w-5 h-5 shrink-0" />
                  <div>
                    <h5 className="text-sm font-bold text-equestrian-navy">Calidad del Anuncio</h5>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">Los anuncios con descripciones detalladas y más de 3 fotos reciben el triple de consultas.</p>
                  </div>
                </div>
              </div>
              
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}