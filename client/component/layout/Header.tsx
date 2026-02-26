import Link from 'next/link';
import { Shield } from 'lucide-react'; 

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 dark:bg-equestrian-navy/95 backdrop-blur border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="text-equestrian-gold">
              <Shield className="w-8 h-8" />
            </div>
            <span className="text-2xl font-extrabold tracking-tight text-equestrian-navy dark:text-white uppercase font-display">
              HorseTrust
            </span>
          </Link>

          {/* Menú de Navegación */}
          <nav className="hidden md:flex items-center gap-10">
            <Link href="/marketplace" className="text-sm font-semibold hover:text-equestrian-gold transition-colors">Catálogo</Link>
            <Link href="/verificacion" className="text-sm font-semibold hover:text-equestrian-gold transition-colors">Verificación</Link>
            <Link href="/vendedores" className="text-sm font-semibold hover:text-equestrian-gold transition-colors">Vendedores</Link>
          </nav>

          {/* Botones */}
          <div className="flex items-center gap-4">
            <button className="hidden sm:block px-5 py-2.5 text-sm font-bold text-equestrian-navy dark:text-slate-300 hover:text-equestrian-gold transition-colors">
              Iniciar Sesión
            </button>
            <button className="bg-equestrian-green hover:bg-equestrian-navy text-white px-6 py-2.5 rounded-lg text-sm font-bold transition-all shadow-md">
              Publicar Caballo
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}