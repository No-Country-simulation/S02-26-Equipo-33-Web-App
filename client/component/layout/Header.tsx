"use client"
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { 
  User as UserIcon, Menu, X, Bell, Plus, 
  LogOut, UserCircle, MessageCircleMore
} from 'lucide-react';
import { logout } from '@/app/actions/auth';


export default function Header({ initialIsLoggedIn }: { initialIsLoggedIn: boolean }) {

  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(initialIsLoggedIn);
  const [userName, setUserName] = useState("Usuario"); 
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  useEffect(() => {
    const storedName = localStorage.getItem('user_name'); 
    if (storedName) setUserName(storedName);
  }, [isLoggedIn]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setIsLoggedIn(initialIsLoggedIn);
    setIsMenuOpen(false);
    setIsDropdownOpen(false);
   }, [pathname, initialIsLoggedIn]);


  const navLinks = isLoggedIn 
    ? [
        { name: 'Mi Panel', href: '/dashboard' },
        { name: 'Mis Publicaciones', href: '/mis-publicaciones' },
        { name: 'Catálogo', href: '/marketplace' },
        { name: 'Mensajes', href: '/chat' },
      ]
    : [
        { name: 'Catálogo', href: '/marketplace' },
        { name: 'Cómo Funciona', href: '/como-funciona' },
        { name: 'Haras Top', href: '/haras-top' },
      ];

  const initial = userName.charAt(0).toUpperCase(); 

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
              NAVEGACIÓN DESKTOP 
              ========================================= */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link 
                key={link.href}
                href={link.href} 
                className={`text-sm font-bold transition-all relative group ${
                  pathname === link.href ? 'text-equestrian-navy' : 'text-slate-600 hover:text-equestrian-gold'
                }`}
              >
                {link.name}
                {pathname === link.href && (
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-equestrian-gold" />
                )}
              </Link>
            ))}
          </nav>


          {/* =========================================
                ACCIONES DERECHA (Dinámicas + Hamburguesa)
            ========================================= */}
            <div className="flex items-center gap-3 sm:gap-5">
            {isLoggedIn ? (
                <>
                {/* Campana de Notificaciones (Visible en móvil) */}
                <Link href="/chat" className="relative p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 rounded-full transition-all lg:hidden">
                    <MessageCircleMore className="w-5 h-5" />
                </Link>

                {/* Publicar (Solo Desktop) */}
                <Link href="/registro-caballo" className="hidden lg:flex bg-equestrian-navy text-white px-5 py-2.5 rounded-xl text-sm font-bold gap-2 items-center hover:bg-slate-800 transition-all">
                    <Plus className="w-4 h-4" /> <span>Publicar</span>
                </Link>

                {/* Avatar Dropdown (Solo Desktop) */}
                <div className="hidden lg:block relative" ref={dropdownRef}>
                    <button onClick={toggleDropdown} className="w-10 h-10 rounded-full bg-equestrian-gold text-equestrian-navy flex items-center justify-center font-serif text-lg font-bold border-2 border-transparent focus:border-equestrian-navy transition-all  hover:cursor-pointer hover:border-equestrian-navy">
                        {initial}
                    </button>
                    {isDropdownOpen && (
                    <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-2">
                        <div className="px-4 py-3 border-b border-slate-100 mb-1 text-sm font-bold">{userName}</div>
                        <Link href="/perfil" className="flex items-center gap-3 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"><UserCircle className="w-4 h-4"/> Perfil</Link>
                        <button onClick={() => logout()} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 text-left">
                        <LogOut className="w-4 h-4" /> Cerrar Sesión
                        </button>
                    </div>
                    )}
                </div>
                </>
            ) : (
                <>
                {/* Botones Públicos (Solo Desktop) */}
                <div className="hidden lg:flex items-center gap-4">
                    <Link href="/login" className="px-4 py-2 text-sm font-bold border rounded-xl hover:bg-slate-50">Login</Link>
                    <Link href="/registro" className="bg-equestrian-navy text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-slate-800">Registrarse</Link>
                </div>
                </>
            )}

            {/* BOTÓN HAMBURGUESA: Crucial para móvil (Visible solo en < lg) */}
            <button 
                onClick={toggleMenu} 
                className="lg:hidden p-2 text-equestrian-navy dark:text-white hover:bg-slate-100 rounded-lg transition-all"
                aria-label="Menu"
            >
                {isMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
            </div>
        </div>
      </div>


      {/* =========================================
            MENÚ MOBILE DESPLEGABLE (Unificado)
          ========================================= */}
        {isMenuOpen && (
        <div className="lg:hidden absolute top-20 left-0 w-full bg-white dark:bg-equestrian-navy border-b border-slate-200 dark:border-slate-800 animate-in fade-in slide-in-from-top-4 duration-300 shadow-xl z-40">
            <nav className="flex flex-col p-6 gap-2">
            
            {isLoggedIn ? (
                <>
                <div className="flex items-center gap-4 px-4 py-3 mb-2 bg-slate-50 dark:bg-slate-800 rounded-xl">
                    <div className="w-10 h-10 rounded-full bg-equestrian-gold text-equestrian-navy flex items-center justify-center font-serif font-bold text-lg">
                    {initial}
                    </div>
                    <div>
                    <p className="text-sm font-bold text-equestrian-navy dark:text-white">{userName}</p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Usuario</p>
                    </div>
                </div>

                <Link href="/dashboard" onClick={toggleMenu} className="px-4 py-3 text-md font-bold text-equestrian-navy dark:text-white hover:bg-slate-50 rounded-lg">Mi Panel</Link>
                <Link href="/mis-publicaciones" onClick={toggleMenu} className="px-4 py-3 text-md font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 rounded-lg">Mis Publicaciones</Link>
                <Link href="/chat" onClick={toggleMenu} className="px-4 py-3 text-md font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 rounded-lg">Mensajes</Link>
                <Link href="/perfil" onClick={toggleMenu} className="px-4 py-3 text-md font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 rounded-lg border-t border-slate-100 mt-2">Mi Perfil</Link>
                
                {/* Botón de Logout */}
                <button 
                    onClick={() => { logout(); toggleMenu(); }} 
                    className="px-4 py-3 text-md font-bold text-red-600 hover:bg-red-50 rounded-lg text-left flex items-center gap-3"
                >
                    <LogOut className="w-4 h-4" /> Cerrar Sesión
                </button>

                <Link href="/registro-caballo" onClick={toggleMenu} className="w-full mt-4 py-4 bg-equestrian-navy text-white text-center rounded-xl font-bold shadow-md flex justify-center gap-2 items-center active:scale-95 transition-transform">
                    <Plus className="w-5 h-5" /> Publicar Caballo
                </Link>
                </>
            ) : (
                <>
                {['Catálogo', 'Cómo Funciona', 'Haras Top'].map((item) => (
                    <Link 
                    key={item}
                    href={`/${item.toLowerCase().replace(' ', '-')}`}
                    onClick={toggleMenu}
                    className="text-md font-bold text-equestrian-navy dark:text-white hover:text-equestrian-gold transition-colors border-b border-slate-100 dark:border-slate-800 pb-3 mb-2"
                    >
                    {item}
                    </Link>
                ))}
                <div className="pt-4 flex flex-col gap-4 w-full">
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