import Link from 'next/link';
import { Shield, Globe, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-equestrian-navy border-t border-slate-200 dark:border-slate-800 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-12 mb-20">
        
        {/* Logo y Descripción */}
        <div className="col-span-2">
          <div className="flex items-center gap-2 mb-8">
            <div className="text-equestrian-gold">
              <Shield className="w-6 h-6" />
            </div>
            <span className="text-xl font-black tracking-tight text-equestrian-navy dark:text-white uppercase font-display">
              HorseTrust
            </span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xs leading-relaxed mb-8 italic">
            El destino digital más confiable del mundo para adquisiciones ecuestres de alto valor.
          </p>
          <div className="flex gap-4">
            <Link href="#" className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-400 hover:text-equestrian-gold transition-colors">
              <Globe className="w-5 h-5" />
            </Link>
            <Link href="#" className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-400 hover:text-equestrian-gold transition-colors">
              <Instagram className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Columnas de Links */}
        <div>
          <h4 className="font-bold text-xs uppercase tracking-[0.2em] text-equestrian-navy dark:text-white mb-8">Descubrir</h4>
          <ul className="space-y-4 text-sm text-slate-500">
            <li><Link href="/marketplace?discipline=salto" className="hover:text-equestrian-gold">Salto Ecuestre</Link></li>
            <li><Link href="/marketplace?discipline=doma" className="hover:text-equestrian-gold">Doma Clásica</Link></li>
            <li><Link href="/marketplace?breed=pura-sangre" className="hover:text-equestrian-gold">Pura Sangre</Link></li>
            <li><Link href="/marketplace" className="hover:text-equestrian-gold">Ver Todo</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-bold text-xs uppercase tracking-[0.2em] text-equestrian-navy dark:text-white mb-8">Verificación</h4>
          <ul className="space-y-4 text-sm text-slate-500">
            <li><Link href="#" className="hover:text-equestrian-gold">El Protocolo</Link></li>
            <li><Link href="#" className="hover:text-equestrian-gold">Estándares Médicos</Link></li>
            <li><Link href="#" className="hover:text-equestrian-gold">Validación de Vendedores</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-bold text-xs uppercase tracking-[0.2em] text-equestrian-navy dark:text-white mb-8">Plataforma</h4>
          <ul className="space-y-4 text-sm text-slate-500">
            <li><Link href="#" className="hover:text-equestrian-gold">Para Compradores</Link></li>
            <li><Link href="#" className="hover:text-equestrian-gold">Para Vendedores</Link></li>
            <li><Link href="#" className="hover:text-equestrian-gold">Veterinarios Asociados</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-bold text-xs uppercase tracking-[0.2em] text-equestrian-navy dark:text-white mb-8">Soporte</h4>
          <ul className="space-y-4 text-sm text-slate-500">
            <li><Link href="#" className="hover:text-equestrian-gold">Contáctanos</Link></li>
            <li><Link href="#" className="hover:text-equestrian-gold">Centro de Ayuda</Link></li>
            <li><Link href="#" className="hover:text-equestrian-gold">Preguntas Frecuentes</Link></li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-100 dark:border-slate-900 pt-12 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] text-slate-400 uppercase tracking-[0.25em] font-bold">
        <p>© {new Date().getFullYear()} HorseTrust International. Todos los derechos reservados.</p>
        <div className="flex gap-8">
          <Link href="#" className="hover:text-equestrian-gold">Privacidad</Link>
          <Link href="#" className="hover:text-equestrian-gold">Términos y Condiciones</Link>
        </div>
      </div>
    </footer>
  );
}