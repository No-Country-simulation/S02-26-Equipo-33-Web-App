"use client";

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { 
  User as UserIcon, Menu, X, Bell, Plus, 
  LogOut, UserCircle 
} from 'lucide-react';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

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
    console.log("Cerrando sesión...");
    router.push('/');
  };

  const privateRoutes = ['/dashboard', '/mis-publicaciones', '/chat', '/registro-caballo', '/perfil'];
  const isPrivateRoute = privateRoutes.includes(pathname);

  //  MOCK DATA (Solo para el header logueado)
  const mockUser = { full_name: "Valentina" };
  const unreadMessages = 1;

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 dark:bg-equestrian-navy/95 backdrop-blur border-b border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* =========================================
              LOGO (Compartido en ambos)
              ========================================= */}
          <Link href="/" className="flex items-center hover:scale-105 transition-transform duration-300">
            <div className="block md:hidden">
              <Image src="/img/logo.png" alt="HorseTrust Logo" width={80} height={23.3} className="object-contain" priority />
            </div>
            <div className="hidden md:flex items-center">
              <Image src="/img/logo-icon.png" alt="HorseTrust Icon" width={40} height={40} className="object-contain" priority />
              <span className="ml-3 text-2xl font-semibold tracking-tight text-equestrian-navy dark:text-white font-display">
                HorseTrust
              </span>
            </div>
          </Link>

          {/* =========================================
              NAVEGACIÓN DESKTOP (Dinámica)
              ========================================= */}
          <nav className="hidden lg:flex items-center gap-8">
            {isPrivateRoute ? (
              // NAVEGACIÓN PRIVADA
              <>
                <Link href="/dashboard" className={`text-sm font-bold transition-colors duration-300 ${pathname === '/dashboard' ? 'text-equestrian-navy dark:text-white border-b-2 border-equestrian-gold py-1' : 'text-slate-600 dark:text-slate-300 hover:text-equestrian-gold'}`}>
                  Mi Panel
                </Link>
                <Link href="/mis-publicaciones" className={`text-sm font-bold transition-colors duration-300 ${pathname === '/mis-publicaciones' ? 'text-equestrian-navy dark:text-white border-b-2 border-equestrian-gold py-1' : 'text-slate-600 dark:text-slate-300 hover:text-equestrian-gold'}`}>
                  Mis Publicaciones
                </Link>
                <Link href="/marketplace" className={`text-sm font-bold transition-colors duration-300 ${pathname === '/marketplace' ? 'text-equestrian-navy dark:text-white border-b-2 border-equestrian-gold py-1' : 'text-slate-600 dark:text-slate-300 hover:text-equestrian-gold'}`}>
                  Catálogo
                </Link>
                <Link href="/chat" className={`text-sm font-bold transition-colors duration-300 ${pathname === '/chat' ? 'text-equestrian-navy dark:text-white border-b-2 border-equestrian-gold py-1' : 'text-slate-600 dark:text-slate-300 hover:text-equestrian-gold'}`}>
                  Mensajes
                </Link>
              </>
            ) : (
              // NAVEGACIÓN PÚBLICA
              ['Catálogo', 'Cómo Funciona', 'Haras Top'].map((item) => (
                <Link 
                  key={item}
                  href={`/${item.toLowerCase().replace(' ', '-')}`} 
                  className="relative text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-equestrian-gold transition-colors duration-300 group"
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-equestrian-gold transition-all duration-300 group-hover:w-full"></span>
                </Link>
              ))
            )}
          </nav>

          {/* =========================================
              ACCIONES DERECHA (Dinámicas)
              ========================================= */}
          <div className="flex items-center gap-3 sm:gap-5">
            {isPrivateRoute ? (
              // ACCIONES PRIVADAS
              <>
                <Link href="/registro-caballo" className="hidden sm:flex bg-equestrian-navy text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 hover:bg-slate-800 hover:-translate-y-0.5 active:scale-95 shadow-md gap-2 items-center">
                  <Plus className="w-4 h-4" /> <span>Publicar</span>
                </Link>

                <Link href="/chat" className="relative p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all">
                  <Bell className="w-5 h-5" />
                  {unreadMessages > 0 && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-equestrian-gold border-2 border-white dark:border-equestrian-navy rounded-full"></span>
                  )}
                </Link>
                
                {/* Avatar con Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button onClick={toggleDropdown} className="w-10 h-10 rounded-full bg-equestrian-gold text-equestrian-navy flex items-center justify-center font-serif text-lg font-bold shadow-sm cursor-pointer hover:scale-105 transition-all border-2 border-transparent focus:border-equestrian-navy outline-none">
                    {mockUser.full_name.charAt(0)}
                  </button>
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-slate-100 py-2 animate-in fade-in slide-in-from-top-2 z-50">
                      <div className="px-4 py-3 border-b border-slate-100 mb-1">
                        <p className="text-sm font-bold text-equestrian-navy">{mockUser.full_name}</p>
                        <p className="text-xs text-slate-500 truncate">Vendedor Premium</p>
                      </div>
                      <Link href="/perfil" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-equestrian-navy transition-colors">
                        <UserCircle className="w-4 h-4" /> Mi Perfil
                      </Link>
                      <div className="h-px bg-slate-100 my-1"></div>
                      <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 transition-colors text-left">
                        <LogOut className="w-4 h-4" /> Cerrar Sesión
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link href="/login" className="p-2 sm:px-4 sm:py-2 text-sm font-bold text-equestrian-navy dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer hover:bg-slate-50 transition-all flex items-center gap-2">
                  <UserIcon className="w-5 h-5 md:hidden" />
                  <span className="hidden md:inline">Iniciar Sesión</span>
                </Link>
                <Link href="/registro" className="bg-equestrian-navy text-white px-4 py-2 sm:px-6 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold cursor-pointer transition-all duration-300 hover:bg-slate-800 hover:-translate-y-0.5 active:scale-95 shadow-md">
                  Registrarse
                </Link>
              </>
            )}

            {/* Hamburguesa Mobile */}
            <button onClick={toggleMenu} className="lg:hidden p-1 text-equestrian-navy dark:text-white cursor-pointer z-50">
              {isMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* =========================================
          MENÚ MOBILE DESPLEGABLE (Dinámico)
          ========================================= */}
      {isMenuOpen && (
        <div className="lg:hidden absolute top-20 left-0 w-full bg-white dark:bg-equestrian-navy border-b border-slate-200 dark:border-slate-800 animate-in fade-in slide-in-from-top-4 duration-300 shadow-xl z-40">
          <nav className="flex flex-col p-6 gap-2">
            {isPrivateRoute ? (
              // Menú Mobile Privado
              <>
                <Link href="/dashboard" onClick={toggleMenu} className="px-4 py-3 text-md font-bold text-equestrian-navy dark:text-white hover:bg-slate-50 rounded-lg">Mi Panel</Link>
                <Link href="/mis-publicaciones" onClick={toggleMenu} className="px-4 py-3 text-md font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 rounded-lg">Mis Publicaciones</Link>
                <Link href="/marketplace" onClick={toggleMenu} className="px-4 py-3 text-md font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 rounded-lg">Catálogo</Link>
                <Link href="/chat" onClick={toggleMenu} className="px-4 py-3 text-md font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 rounded-lg">Mensajes</Link>
                <Link href="/perfil" onClick={toggleMenu} className="px-4 py-3 text-md font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 rounded-lg border-t border-slate-100 mt-2">Mi Perfil</Link>
                <button onClick={handleLogout} className="px-4 py-3 text-md font-bold text-red-600 hover:bg-red-50 rounded-lg text-left">Cerrar Sesión</button>
                <Link href="/registro-caballo" onClick={toggleMenu} className="w-full mt-4 py-4 bg-equestrian-navy text-white text-center rounded-xl font-bold shadow-md flex justify-center gap-2 items-center">
                  <Plus className="w-5 h-5" /> Publicar Caballo
                </Link>
              </>
            ) : (
              // Menú Mobile Público
              <>
                {['Catálogo', 'Cómo Funciona', 'Haras Top'].map((item) => (
                  <Link 
                    key={item}
                    href={`/${item.toLowerCase().replace(' ', '-')}`}
                    onClick={toggleMenu} 
                    className="text-md font-bold text-equestrian-navy dark:text-white hover:text-equestrian-gold transition-colors border-b border-slate-100 dark:border-slate-800 pb-2 mb-4"
                  >
                    {item}
                  </Link>
                ))}
                <div className="pt-2 flex flex-col gap-4 w-full">
                  <Link href="/login" onClick={toggleMenu} className="w-full py-4 text-center font-bold text-slate-600 bg-slate-50 rounded-xl">Iniciar Sesión</Link>
                  <Link href="/registro" onClick={toggleMenu} className="w-full py-4 bg-equestrian-navy text-white text-center rounded-xl font-bold shadow-md">Registrarse</Link>
                </div>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}