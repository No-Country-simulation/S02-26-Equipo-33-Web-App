"use client";

import Image from 'next/image';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  User, Mail, Phone, Lock, ArrowRight, ShieldCheck, 
  CheckCircle, Camera, CreditCard, Loader2
} from 'lucide-react';

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
    console.error('Error subiendo imagen:', error);
    return null;
  }
};

export default function RegistroPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // (Registro)
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    password: '',
  });

  // (Verificación)
  const [identityDocument, setIdentityDocument] = useState('');
  const [selfieFile, setSelfieFile] = useState<File | null>(null);
  const [selfiePreview, setSelfiePreview] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelfieChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelfieFile(file);
      setSelfiePreview(URL.createObjectURL(file));
    }
  };

  // --- SUBMIT PASO 1: CREAR CUENTA ---
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Simulación: Creamos el usuario (Mañana usamos /api/auth/register)
      console.log("Registrando usuario:", { ...formData, role: 'seller' });
      
      //  Simulación: Lo logueamos automáticamente para obtener el token
      // localStorage.setItem('horse_trust_token', 'token_simulado');
      
      //  verificación
      setStep(2);
    } catch (err: any) {
      setError(err.message || "Error al crear la cuenta");
    } finally {
      setIsLoading(false);
    }
  };

  // --- SUBMIT PASO 2: VERIFICAR IDENTIDAD ---
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selfieFile) {
      setError("Por favor, subí tu selfie sosteniendo el DNI.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log("Subiendo selfie a Cloudinary...");
      const selfieUrl = await uploadToCloudinary(selfieFile);
      
      if (!selfieUrl) throw new Error("Error al subir la imagen");

      const verificationData = {
        identity_document: identityDocument,
        selfie_url: selfieUrl
      };

      console.log("Datos listos para PUT /api/auth/seller-profile:", verificationData);
      
      alert("¡Cuenta creada y perfil enviado a verificación con éxito!");
      router.push('/marketplace'); 

    } catch (err: any) {
      setError(err.message || "Error en la verificación");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex bg-equestrian-sand font-sans">
      
      {/* Mitad Izquierda: Imagen */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-equestrian-navy flex-col justify-end p-16">
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?q=80&w=1200")' }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-equestrian-navy via-equestrian-navy/60 to-transparent"></div>
        
        <div className="relative z-10 text-white max-w-lg">
          <ShieldCheck className="w-12 h-12 text-equestrian-gold mb-6" />
          <h1 className="font-serif text-5xl font-black leading-tight mb-4 tracking-tight">
            Confianza.<br/>Calidad.<br/>Seguridad.
          </h1>
          <p className="text-lg text-white/80 font-medium leading-relaxed">
            Unite al mercado premium de equinos. Experimentá transparencia y excelencia en cada transacción que facilitamos.
          </p>
        </div>
      </div>

      {/* Mitad Derecha: Formularios */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-16 py-12 overflow-y-auto">
        <div className="max-w-md mx-auto w-full">
          
          {/* Header Mobile / Volver */}
          <div className="flex justify-between items-center mb-12">
            <Link href="/" className="flex items-center gap-2 text-equestrian-navy font-black text-xl tracking-tighter">
              <Image 
                                          src="/img/logo-icon.png" 
                                          alt="HorseTrust Icon" 
                                          width={40} 
                                          height={40} 
                                          className="object-contain"
                                          priority 
                                        />
                          <h2 className=" text-2xl font-semibold tracking-tight text-equestrian-navy dark:text-white font-display">HorseTrust</h2>
            </Link>
            <div className="text-sm font-bold text-slate-500">
              ¿Ya tenés cuenta? <Link href="/login" className="text-equestrian-gold hover:underline">Ingresá</Link>
            </div>
          </div>

          {/* Mensaje de Error global */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-sm font-bold text-red-600">
              {error}
            </div>
          )}

          {/* =========================================
              PASO 1: REGISTRO BÁSICO
             ========================================= */}
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="mb-8">
                <h2 className="text-3xl font-black text-equestrian-navy mb-2 uppercase tracking-tight">Crear Cuenta</h2>
                <p className="text-slate-500 font-medium">Completá tus datos para acceder al catálogo.</p>
              </div>

              <form onSubmit={handleRegister} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500">Nombre Completo</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input name="full_name" value={formData.full_name} onChange={handleInputChange} required className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 bg-slate-50 text-sm focus:ring-2 focus:ring-equestrian-navy/20 focus:border-equestrian-navy transition-all" placeholder="Juan Pérez" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500">Correo Electrónico</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input name="email" type="email" value={formData.email} onChange={handleInputChange} required className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 bg-slate-50 text-sm focus:ring-2 focus:ring-equestrian-navy/20 focus:border-equestrian-navy transition-all" placeholder="juan@ejemplo.com" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500">Teléfono (Internacional)</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input name="phone" type="tel" value={formData.phone} onChange={handleInputChange} pattern="^\+?[1-9]\d{7,14}$" title="Debe incluir código de país, ej: +549112345678" className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 bg-slate-50 text-sm focus:ring-2 focus:ring-equestrian-navy/20 focus:border-equestrian-navy transition-all" placeholder="+54 9 11 2345 6789" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500">Contraseña</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input name="password" type="password" minLength={8} value={formData.password} onChange={handleInputChange} required className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 bg-slate-50 text-sm focus:ring-2 focus:ring-equestrian-navy/20 focus:border-equestrian-navy transition-all" placeholder="Mínimo 8 caracteres" />
                  </div>
                </div>

                <button type="submit" disabled={isLoading} className="w-full mt-4 bg-equestrian-navy text-white font-bold py-3.5 px-4 rounded-lg hover:bg-equestrian-navy/90 transition-all flex items-center justify-center gap-2 uppercase tracking-wider disabled:opacity-70">
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Siguiente Paso'}
                  {!isLoading && <ArrowRight className="w-4 h-4" />}
                </button>
              </form>
            </div>
          )}

          {/* =========================================
              PASO 2: VERIFICACIÓN DE IDENTIDAD
             ========================================= */}
          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-2 text-equestrian-gold">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-bold text-sm">Cuenta base creada</span>
                </div>
                <h2 className="text-3xl font-black text-equestrian-navy mb-2 uppercase tracking-tight">Verificar Identidad</h2>
                <p className="text-slate-500 font-medium text-sm">Para publicar caballos, necesitamos verificar que sos una persona real. Esto protege a nuestra comunidad.</p>
              </div>

              <form onSubmit={handleVerify} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500">Número de Documento (DNI/Pasaporte)</label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input value={identityDocument} onChange={(e) => setIdentityDocument(e.target.value)} required className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 bg-slate-50 text-sm focus:ring-2 focus:ring-equestrian-navy/20 focus:border-equestrian-navy transition-all" placeholder="Ej. 35.123.456" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500">Selfie con DNI</label>
                  <p className="text-xs text-slate-400 mb-3 leading-relaxed">Sube una foto donde se vea claramente tu rostro y estés sosteniendo tu documento de identidad.</p>
                  
                  <label className="relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-slate-300 rounded-xl hover:border-equestrian-navy hover:bg-slate-50 transition-all cursor-pointer overflow-hidden">
                    {selfiePreview ? (
                      <img src={selfiePreview} alt="Selfie Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Camera className="w-10 h-10 text-slate-400 mb-2" />
                        <p className="text-sm font-bold text-slate-700">Tocar para subir foto</p>
                      </div>
                    )}
                    <input type="file" accept="image/*" onChange={handleSelfieChange} className="hidden" />
                  </label>
                </div>

                <div className="bg-equestrian-navy/5 p-4 rounded-xl border border-equestrian-navy/10 flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-equestrian-navy shrink-0" />
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">
                    Tus documentos son encriptados y almacenados de forma segura. Solo los usamos para la revisión manual de vendedores.
                  </p>
                </div>

                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={() => router.push('/marketplace')} className="w-1/3 bg-slate-100 text-slate-600 font-bold py-3.5 rounded-lg hover:bg-slate-200 transition-all text-sm uppercase tracking-wider">
                    Omitir
                  </button>
                  <button type="submit" disabled={isLoading} className="w-2/3 bg-equestrian-navy text-white font-bold py-3.5 rounded-lg hover:bg-equestrian-navy/90 transition-all flex items-center justify-center gap-2 uppercase tracking-wider disabled:opacity-70 text-sm">
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Enviar Perfil'}
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>
      </div>
    </main>
  );
}