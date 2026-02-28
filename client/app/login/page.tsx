"use client";
import Image from 'next/image';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, ShieldCheck, ArrowLeft } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null); 
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null); // Limpiamos errores anteriores

    try {
      const baseUrl = 'https://s02-26-e33-horse-trust-api.vercel.app';
      
      const res = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || data.message || 'Error al validar credenciales');
      }

      localStorage.setItem('horse_trust_token', data.token);
      localStorage.setItem('horse_trust_user', JSON.stringify(data.user));

      // por ahora redirigimos al formulario de registro de caballos
      router.push('/registro-caballo');

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex w-full min-h-screen font-sans bg-equestrian-sand">
      
      {/* Lado Izquierdo: Imagen Premium (Oculto en celulares) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-equestrian-navy">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1598974357801-cbca100e65d3?q=80&w=1200")' }}
        ></div>
        
        {/* Overlay oscuro para que el texto sea legible */}
        <div className="absolute inset-0 bg-equestrian-navy/40 bg-gradient-to-t from-equestrian-navy/90 to-transparent flex flex-col justify-end p-16 text-white">
          <blockquote className="font-serif text-3xl font-medium leading-tight max-w-lg mb-4 text-white">
            "La alegría esencial de estar con los caballos es que nos pone en contacto con elementos raros de gracia, belleza, espíritu y fuego."
          </blockquote>
          <p className="text-equestrian-gold font-bold text-sm uppercase tracking-widest">Sharon Ralls Lemon</p>
        </div>
      </div>

      {/* Lado Derecho: Formulario */}
      <div className="w-full lg:w-1/2 flex flex-col bg-white overflow-y-auto">
        
        {/* Header Móvil / Volver */}
        <div className="p-6 lg:p-12 flex justify-between items-center">
          <div className="flex items-center gap-3 text-equestrian-navy">
            <Image 
                            src="/img/logo-icon.png" 
                            alt="HorseTrust Icon" 
                            width={40} 
                            height={40} 
                            className="object-contain"
                            priority 
                          />
            <h2 className=" text-2xl font-semibold tracking-tight text-equestrian-navy dark:text-white font-display">HorseTrust</h2>
          </div>
          <Link href="/" className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-equestrian-navy transition-colors">
            <ArrowLeft className="w-4 h-4" /> Volver
          </Link>
        </div>

        {/* Contenido del Login */}
        <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-24 xl:px-32 py-8">
          <div className="w-full max-w-md mx-auto">
            
            <div className="mb-10 text-center lg:text-left">
              <h1 className="font-black text-3xl lg:text-4xl text-equestrian-navy mb-3 uppercase tracking-tight">
                Iniciar <span className="text-equestrian-gold font-serif italic lowercase tracking-normal">Sesión</span>
              </h1>
            </div>

            {/* Mensaje de Error */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 text-red-600">
                <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5" />
                <p className="text-sm font-medium">
                  {error.includes('Pool') 
                    ? 'Error del servidor: La base de datos está en reposo. Por favor, intentá de nuevo en unos segundos.' 
                    : error}
                </p>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              
              {/* Input Email */}
              <div className="space-y-2">
                <label className="block text-xs font-black uppercase tracking-widest text-slate-500" htmlFor="email">
                  Correo Electrónico
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-equestrian-gold transition-colors">
                    <Mail className="w-5 h-5" />
                  </div>
                  <input 
                    id="email" 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-lg bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-equestrian-navy/20 focus:border-equestrian-navy transition-all font-medium" 
                    placeholder="usuario@ejemplo.com" 
                  />
                </div>
              </div>

              {/* Input Contraseña */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-500" htmlFor="password">
                    Contraseña
                  </label>
                  <Link href="#" className="text-xs font-bold text-equestrian-gold hover:underline">
                    ¿Olvidaste tu clave?
                  </Link>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-equestrian-gold transition-colors">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input 
                    id="password" 
                    type="password" 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-lg bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-equestrian-navy/20 focus:border-equestrian-navy transition-all font-medium" 
                    placeholder="••••••••" 
                  />
                </div>
              </div>

              {/* Botón de Submit */}
              <div className="pt-2">
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-equestrian-navy hover:bg-equestrian-navy/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-equestrian-navy transition-colors disabled:opacity-70 disabled:cursor-not-allowed uppercase tracking-wider"
                >
                  {isLoading ? 'Verificando...' : 'Ingresar al Sistema'}
                </button>
              </div>

            </form>

            <div className="mt-8 text-center">
              <p className="text-sm text-slate-500 font-medium">
                ¿Todavía no tenés una cuenta?{' '}
                <Link href="/registro" className="font-bold text-equestrian-navy hover:text-equestrian-gold transition-colors">
                  Registrate aquí
                </Link>
              </p>
            </div>
            
          </div>
        </div>

        {/* Footer de Confianza */}
        <div className="p-6 border-t border-slate-100 bg-slate-50">
          <div className="flex items-center justify-center gap-2 text-equestrian-navy/60">
            <ShieldCheck className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider">Entorno de Transacción Seguro</span>
          </div>
        </div>

      </div>
    </div>
  );
}