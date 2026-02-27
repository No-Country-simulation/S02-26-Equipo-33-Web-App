"use client"; 
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { User, Menu, X } from 'lucide-react';

export default function Header() {

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 dark:bg-equestrian-navy/95 backdrop-blur border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* LOGO ADAPTATIVO */}
          <Link href="/" className="flex items-center hover:scale-105 transition-transform duration-300">
            {/* Versión Mobile: Logo completo (imagen con texto) */}
            <div className="block md:hidden">
              <Image 
                src="/img/logo.png" 
                alt="HorseTrust Logo" 
                width={80} 
                height={23.3} 
                className="object-contain"
                priority 
              />
            </div>

            {/* Versión Desktop: Icono + Texto separado */}
            <div className="hidden md:flex items-center">
              <Image 
                src="/img/logo-icon.png" 
                alt="HorseTrust Icon" 
                width={40} 
                height={40} 
                className="object-contain"
                priority 
              />
              <span className="ml-3 text-2xl font-semibold tracking-tight text-equestrian-navy dark:text-white font-display">
                HorseTrust
              </span>
            </div>
          </Link>

          {/* Menú Desktop */}
          <nav className="hidden lg:flex items-center gap-8">
            {['Catálogo', 'Cómo Funciona', 'Haras Top'].map((item) => (
              <Link 
                key={item}
                href={`/${item.toLowerCase().replace(' ', '-')}`} 
                className="relative text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-equestrian-gold transition-colors duration-300 group"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-equestrian-gold transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </nav>

          {/* Acciones */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Iniciar Sesión (Ícono en mobile, texto en desktop) */}
            <button className="p-2 sm:px-4 sm:py-2 text-sm font-bold text-equestrian-navy dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer hover:bg-slate-50 transition-all">
              <User className="w-5 h-5 md:hidden" />
              <span className="hidden md:inline">Iniciar Sesión</span>
            </button>
            
            {/* Publicar (Más compacto en mobile) */}
            <button className="bg-equestrian-navy text-white px-4 py-2 sm:px-6 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold cursor-pointer transition-all duration-300 hover:bg-slate-800 hover:shadow-lg hover:-translate-y-0.5 active:scale-95 shadow-md">
              <span>Publicar</span>
              <span className="hidden sm:inline ml-1">Caballo</span>
            </button>

            {/* Hamburguesa / Cruz para cerrar */}
            <button 
              onClick={toggleMenu}
              className="md:hidden p-1 text-equestrian-navy dark:text-white cursor-pointer z-50"
            >
              {isMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* MENÚ MOBILE DESPLEGABLE */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-white dark:bg-equestrian-navy border-b border-slate-200 dark:border-slate-800 animate-in fade-in slide-in-from-top-4 duration-300">
          <nav className="flex flex-col items-center p-6 gap-6">
            {['Catálogo', 'Cómo Funciona', 'Haras Top'].map((item) => (
              <Link 
                key={item}
                href={`/${item.toLowerCase().replace(' ', '-')}`}
                onClick={() => setIsMenuOpen(false)} 
                className="text-md font-bold text-equestrian-navy dark:text-white hover:text-equestrian-gold transition-colors border-b border-slate-100 dark:border-slate-800 pb-2"
              >
                {item}
              </Link>
            ))}
            <div className="pt-2 flex flex-col gap-4">
                <button className="w-full py-4 text-center font-bold text-slate-500">Iniciar Sesión</button>
                <button className="w-full py-4 bg-equestrian-navy text-white rounded-xl font-bold p-8">Publicar Caballo</button>
            </div>
          </nav>
        </div>
      )}   
    </header>
  );
}