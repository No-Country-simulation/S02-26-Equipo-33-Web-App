"use client";

import { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, Check, ImagePlus, Info, MapPin, Video, 
  ShieldCheck, HeartPulse, Plus, Trash2, Activity 
} from 'lucide-react';
import HorseCard from '@/component/marketplace/HorseCard';
import { useRouter } from 'next/navigation';
// ATENCIÓN: Asegurate de exportar addVetRecord desde app/actions/horses
import { createHorse, addVetRecord } from '@/app/actions/horses';

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
  
  // 1. ESTADOS DEL FORMULARIO (Agregados Pedigree y Vet)
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    breed: 'Todas las Razas',
    discipline: 'Salto',
    pedigree: '',
    price: '',
    currency: 'USD',
    country: '',
    region: '',
    videoUrl: '',
    videoType: 'training',
    videoTitle: '',
    videoDate: '',
    // Datos Médicos
    reviewDate: '',
    certificateUrl: '',
    vetNotes: '',
  });

  const [photos, setPhotos] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [vaccines, setVaccines] = useState<{vaccine_name: string, applied_date: string, next_dose_date: string}[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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

  // Funciones de Vacunas
  const addVaccineRow = () => {
    setVaccines([...vaccines, { vaccine_name: '', applied_date: '', next_dose_date: '' }]);
  };

  const updateVaccine = (index: number, field: string, value: string) => {
    const updated = [...vaccines];
    updated[index] = { ...updated[index], [field]: value };
    setVaccines(updated);
  };

  const removeVaccine = (index: number) => {
    setVaccines(vaccines.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (photos.length < 3) {
      alert("Se requieren al menos 3 fotos.");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // 1. Subir imágenes a Cloudinary
      const uploadedUrls = [];
      for (const file of photos) {
        const url = await uploadToCloudinary(file);
        if (url) uploadedUrls.push(url);
      }

      // 2. Payload del Caballo (Agregado Pedigree y estructura de Videos)
      const horsePayload = {
        name: formData.name,
        age: Number(formData.age),
        breed: formData.breed,
        discipline: formData.discipline,
        pedigree: formData.pedigree,
        price: Number(formData.price),
        currency: formData.currency,
        location: `${formData.region}, ${formData.country}`,
        photos: uploadedUrls.map((url, i) => ({ url, is_cover: i === 0 })),
        videos: formData.videoUrl ? [{
          video_url: formData.videoUrl,
          video_type: formData.videoType,
          recording_date: formData.videoDate || new Date().toISOString().split('T')[0]
        }] : []
      };

      const result = await createHorse(horsePayload);

      if (!result.success) throw new Error(result.error);

      // 3. Obtener el ID del caballo recién creado (Oracle o Mongo format)
      const horseId = result.data?.ID || result.data?.id || result.data?._id;

      // 4. Mandar la ficha médica si le pusieron fecha de revisión
      if (horseId && formData.reviewDate) {
        const vetPayload = {
          review_date: formData.reviewDate,
          certificate_url: formData.certificateUrl || "",
          notes: formData.vetNotes || "",
          vaccines: vaccines.filter(v => v.vaccine_name.trim() !== "")
        };
        await addVetRecord(horseId, vetPayload);
      }

      alert("¡Ejemplar y ficha médica publicados con éxito!");
      router.push('/dashboard');

    } catch (error: any) {
      alert(error.message || "Hubo un error en el servidor");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-equestrian-sand flex flex-col font-sans">
      
      <header className="w-full border-slate-200 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[1440px] items-center px-6 lg:px-12">
          <Link href="/marketplace" className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-equestrian-navy transition-colors">
            <ArrowLeft className="w-4 h-4" /> Volver al Catálogo
          </Link>
        </div>
      </header>

      <div className="flex-1 w-full max-w-[1440px] mx-auto p-6 lg:p-12">
        
        <div className="mb-10">
          <h1 className="text-3xl lg:text-4xl font-black text-equestrian-navy tracking-tight uppercase">
            Publicar <span className="text-equestrian-gold font-serif italic lowercase tracking-normal">Ejemplar</span>
          </h1>
          <p className="text-slate-500 mt-2 font-medium">Completá los datos con precisión para generar confianza en los compradores.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
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
                    <input name="name" value={formData.name} onChange={handleChange} required className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-equestrian-navy outline-none transition-all" placeholder="Ej. Tornado Express" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-500">Edad (Años)</label>
                    <input name="age" type="number" min="0" max="40" value={formData.age} onChange={handleChange} required className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-equestrian-navy outline-none transition-all" placeholder="Ej. 4" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-500">Raza</label>
                    <select name="breed" value={formData.breed} onChange={handleChange} className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-equestrian-navy outline-none transition-all cursor-pointer">
                      <option>Pura Sangre</option>
                      <option>Árabe</option>
                      <option>Cuarto de Milla</option>
                      <option>Criollo</option>
                      <option>Todas las Razas</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-500">Disciplina</label>
                    <select name="discipline" value={formData.discipline} onChange={handleChange} className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-equestrian-navy outline-none transition-all cursor-pointer">
                      <option>Salto</option>
                      <option>Adiestramiento</option>
                      <option>Polo</option>
                      <option>Carreras</option>
                    </select>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-500">Genealogía (Pedigree)</label>
                    <textarea name="pedigree" value={formData.pedigree} onChange={handleChange} className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm h-20 focus:border-equestrian-navy outline-none transition-all" placeholder="Ej. Padre: Viento Norte | Madre: Luna Roja" />
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
                    <input name="country" value={formData.country} onChange={handleChange} required className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-equestrian-navy outline-none transition-all" placeholder="Ej. Argentina" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-500">Provincia / Región</label>
                    <input name="region" value={formData.region} onChange={handleChange} required className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-equestrian-navy outline-none transition-all" placeholder="Ej. Posadas, Misiones" />
                  </div>
                  <div className="md:col-span-2 grid grid-cols-3 gap-4">
                    <div className="col-span-2 space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-500">Precio</label>
                      <input name="price" type="number" value={formData.price} onChange={handleChange} required className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-equestrian-navy outline-none transition-all" placeholder="Ej. 35000" />
                    </div>
                    <div className="col-span-1 space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-500">Moneda</label>
                      <select name="currency" value={formData.currency} onChange={handleChange} className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-equestrian-navy outline-none transition-all cursor-pointer">
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="ARS">ARS</option>
                      </select>
                    </div>
                  </div>
                </div>
              </section>

              {/* NUEVA: Sección 3: Historial Veterinario */}
              <section className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
                <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
                  <div className="bg-red-50 p-2 rounded-lg text-red-500">
                    <HeartPulse className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Historial Veterinario Inicial</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-500">Fecha de Revisión</label>
                    <input type="date" name="reviewDate" value={formData.reviewDate} onChange={handleChange} className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-equestrian-navy outline-none transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-500">Certificado (URL PDF)</label>
                    <input name="certificateUrl" value={formData.certificateUrl} onChange={handleChange} placeholder="Ej. https://mis-docs.com/vet.pdf" className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-equestrian-navy outline-none transition-all" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-500">Notas Médicas</label>
                    <textarea name="vetNotes" value={formData.vetNotes} onChange={handleChange} className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm h-20 focus:border-equestrian-navy outline-none transition-all" placeholder="Animal en excelente estado general..." />
                  </div>
                </div>

                {/* Log de Vacunas Dinámico */}
                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-500">Registro de Vacunación</label>
                    <button type="button" onClick={addVaccineRow} className="text-xs font-bold text-equestrian-navy flex items-center gap-1 hover:text-equestrian-gold transition-colors">
                      <Plus className="w-4 h-4" /> Añadir Vacuna
                    </button>
                  </div>
                  
                  {vaccines.map((v, index) => (
                    <div key={index} className="flex flex-wrap md:flex-nowrap gap-3 items-start bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <div className="flex-1 min-w-[150px]">
                        <span className="text-[10px] text-slate-400 font-bold uppercase mb-1 block">Nombre</span>
                        <input placeholder="Ej. Tétanos" value={v.vaccine_name} onChange={(e) => updateVaccine(index, 'vaccine_name', e.target.value)} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs focus:border-equestrian-navy outline-none" />
                      </div>
                      <div className="w-[120px]">
                        <span className="text-[10px] text-slate-400 font-bold uppercase mb-1 block">Aplicada</span>
                        <input type="date" value={v.applied_date} onChange={(e) => updateVaccine(index, 'applied_date', e.target.value)} className="w-full rounded-lg border border-slate-200 bg-white px-2 py-2 text-xs focus:border-equestrian-navy outline-none" />
                      </div>
                      <div className="w-[120px]">
                        <span className="text-[10px] text-slate-400 font-bold uppercase mb-1 block">Refuerzo</span>
                        <input type="date" value={v.next_dose_date} onChange={(e) => updateVaccine(index, 'next_dose_date', e.target.value)} className="w-full rounded-lg border border-slate-200 bg-white px-2 py-2 text-xs focus:border-equestrian-navy outline-none" />
                      </div>
                      <button type="button" onClick={() => removeVaccine(index)} className="mt-5 p-2 text-slate-400 hover:text-red-500 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </section>

              {/* Sección 4: Multimedia */}
              <section className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
                <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
                  <div className="bg-equestrian-navy/10 p-2 rounded-lg text-equestrian-navy">
                    <ImagePlus className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Galería Multimedia</h3>
                </div>

                <div className="space-y-6">
                  <div className="space-y-6">
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
                  
                  <div className="space-y-4 border border-slate-200 p-5 rounded-xl bg-slate-50/50">
                    <div className="flex items-center gap-2 mb-2">
                      <Video className="w-5 h-5 text-slate-400" />
                      <h4 className="text-sm font-bold text-slate-700">Video Promocional (Opcional)</h4>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-black uppercase tracking-widest text-slate-500">URL del Video (YouTube/Vimeo)</label>
                        <input name="videoUrl" value={formData.videoUrl} onChange={handleChange} className="w-full mt-1 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm focus:border-equestrian-navy outline-none transition-all" placeholder="Ej. https://youtube.com/watch?v=..." />
                      </div>
                      
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
                            <input type="date" name="videoDate" value={formData.videoDate} onChange={handleChange} required={!!formData.videoUrl} className="w-full mt-1 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm focus:border-equestrian-navy outline-none transition-all" />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </section>

              <div className="flex items-center justify-end gap-4 pt-6">
                <Link href="/marketplace" className="px-6 py-3 rounded-lg text-slate-500 font-bold hover:bg-slate-100 transition-colors text-sm">
                  Cancelar
                </Link>
                <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-8 py-3 rounded-lg bg-equestrian-navy hover:bg-equestrian-navy/90 text-white font-bold transition-all text-sm uppercase tracking-wider disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                    <Check className="w-4 h-4" /> {isSubmitting ? 'Subiendo datos y fotos...' : 'Publicar Caballo'}
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

              <div className="bg-equestrian-navy/5 rounded-xl p-4 border border-equestrian-navy/10 mt-4">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="text-equestrian-navy w-5 h-5 shrink-0" />
                  <div>
                    <h5 className="text-sm font-bold text-equestrian-navy">Calidad del Anuncio</h5>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">Los anuncios con un historial médico inicial, pedigree detallado y video reciben el triple de consultas.</p>
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