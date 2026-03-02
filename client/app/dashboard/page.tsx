"use client";

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { 
  Plus, ShieldAlert, 
  ChevronRight, Activity, MessageSquare, 
  Eye, Edit3, CheckCircle
} from 'lucide-react';

export default function DashboardPage() {

  const router = useRouter();

  // MOCK DATA DEL USUARIO Y ESTADÍSTICAS
  const mockUser = {
    full_name: "Valentina",
    seller_profile: {
      verification_status: "pending", 
    }
  };

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Ref para cerrar el dropdown si hacés clic afuera
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  // Cerrar dropdown al hacer clic afuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    // Acá sería localStorage.removeItem('token')
    console.log("Cerrando sesión...");
    router.push('/');
  };

  const stats = { activeListings: 2, totalViews: 148, unreadMessages: 1 };

  return (
    <div className="min-h-screen bg-equestrian-sand font-display text-equestrian-navy flex flex-col">
      
     

      {/* =========================================
          CONTENIDO DEL DASHBOARD
          ========================================= */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Cabecera / Saludo */}
        <div className="mb-8">
          <h1 className="font-serif text-3xl md:text-4xl text-equestrian-navy font-bold tracking-tight">
            Bienvenida, {mockUser.full_name}
          </h1>
          <p className="text-slate-500 mt-2 text-sm md:text-base">Gestioná tus caballos, revisá tus consultas y optimizá tus ventas.</p>
        </div>

        {/* ALERTA DE VERIFICACIÓN */}
        {mockUser.seller_profile.verification_status === "pending" && (
          <div className="mb-10 bg-white border border-equestrian-gold/30 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-equestrian-gold/5 rounded-bl-full pointer-events-none"></div>
            
            <div className="flex items-start gap-5 relative z-10">
              <div className="bg-equestrian-gold/20 p-3 rounded-full text-equestrian-gold shrink-0">
                <ShieldAlert className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-lg font-serif font-bold text-equestrian-navy">Verificación de Identidad Pendiente</h3>
                <p className="text-sm text-slate-600 mt-1.5 max-w-2xl leading-relaxed">
                  Para mantener el prestigio y la seguridad de la plataforma, tus caballos se guardarán como <span className="font-bold text-equestrian-navy">borradores</span> hasta que confirmemos tu identidad. Toma menos de 2 minutos.
                </p>
              </div>
            </div>
            <Link href="/registro" className="relative z-10 shrink-0 px-6 py-3 bg-equestrian-navy hover:bg-slate-800 text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 text-sm w-full md:w-auto text-center">
              Completar Verificación
            </Link>
          </div>
        )}

        {/* TARJETAS DE ESTADÍSTICAS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm luxury-card-hover group">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-slate-50 p-3 rounded-xl text-equestrian-navy group-hover:bg-equestrian-navy group-hover:text-white transition-colors">
                <Activity className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-green-600 bg-green-50 px-2.5 py-1 rounded-full">+2 este mes</span>
            </div>
            <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Publicaciones Activas</p>
            <p className="text-3xl font-serif font-bold text-equestrian-navy">{stats.activeListings}</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm luxury-card-hover group">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-slate-50 p-3 rounded-xl text-equestrian-gold group-hover:bg-equestrian-gold group-hover:text-white transition-colors">
                <Eye className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-green-600 bg-green-50 px-2.5 py-1 rounded-full">+12%</span>
            </div>
            <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Vistas Totales</p>
            <p className="text-3xl font-serif font-bold text-equestrian-navy">{stats.totalViews}</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm luxury-card-hover group relative overflow-hidden">
            {stats.unreadMessages > 0 && (
              <div className="absolute top-0 right-0 w-2 h-full bg-equestrian-gold"></div>
            )}
            <div className="flex justify-between items-start mb-4">
              <div className="bg-slate-50 p-3 rounded-xl text-slate-600 group-hover:bg-slate-600 group-hover:text-white transition-colors">
                <MessageSquare className="w-6 h-6" />
              </div>
            </div>
            <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Mensajes Nuevos</p>
            <p className="text-3xl font-serif font-bold text-equestrian-navy">{stats.unreadMessages}</p>
          </div>
        </div>

        {/* SECCIÓN PRINCIPAL: MIS CABALLOS */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mb-10">
          <div className="p-6 md:p-8 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-xl font-serif font-bold text-equestrian-navy">Mi Establo</h2>
              <p className="text-sm text-slate-500 mt-1">Caballos publicados y en borrador.</p>
            </div>
            <Link href="/mis-publicaciones" className="text-sm font-bold text-equestrian-gold hover:text-equestrian-navy transition-colors flex items-center gap-1">
              Ver catálogo completo <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Tarjeta de Caballo 1 */}
              <div className="flex gap-4 p-4 rounded-2xl border border-slate-100 hover:border-equestrian-gold/50 transition-colors group">
                <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0">
                  <img src="https://images.unsplash.com/photo-1598974357801-cbca100e65d3?q=80&w=200" alt="Tornado Express" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                </div>
                <div className="flex flex-col justify-between flex-1 py-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-equestrian-navy text-lg leading-tight">Tornado Express</h4>
                      <p className="text-xs text-slate-400 font-medium mt-1">Pura Sangre • 4 Años</p>
                    </div>
                    <span className="flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 text-[10px] font-black uppercase tracking-wider rounded border border-green-100">
                      <CheckCircle className="w-3 h-3" /> Activo
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <p className="font-serif font-bold text-equestrian-navy">$35,000 USD</p>
                    <button className="text-slate-400 hover:text-equestrian-gold transition-colors">
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Botón para Publicar Nuevo */}
              <Link href="/registro-caballo" className="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border-2 border-dashed border-slate-200 hover:border-equestrian-gold hover:bg-equestrian-sand/50 transition-all text-slate-500 hover:text-equestrian-navy cursor-pointer group min-h-[130px]">
                <div className="bg-white p-2 rounded-full shadow-sm group-hover:bg-equestrian-gold group-hover:text-white transition-colors">
                  <Plus className="w-6 h-6" />
                </div>
                <span className="text-sm font-bold">Publicar nuevo ejemplar</span>
              </Link>

            </div>
          </div>
        </div>

      </main>
    </div>
  );
}