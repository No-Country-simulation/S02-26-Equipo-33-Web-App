import Link from 'next/link';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { 
  Plus, ShieldAlert, ChevronRight, 
  Edit3, Clock, LayoutDashboard, Images
} from 'lucide-react';

export const dynamic = 'force-dynamic';

async function wakeUpDatabase() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  try {
    await fetch(`${apiUrl}/health/reconnect`, { method: 'POST', cache: 'no-store' });
  } catch (error) {}
}

async function fetchDashboardData(token: string) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  let attempt = 0;
  while (attempt < 2) {
    try {
      const meRes = await fetch(`${apiUrl}/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` },
        cache: 'no-store'
      });
      const meJson = await meRes.json();
      if (meJson.error && meJson.error.includes("Pool is not available")) {
        attempt++;
        await wakeUpDatabase();
        await new Promise(r => setTimeout(r, 1500)); 
        continue;
      }
      if (!meRes.ok || !meJson.ID) return null;
      const user = {
        id: meJson.ID,
        full_name: meJson.FULL_NAME,
        seller_profile: { verification_status: meJson.SELLER_STATUS || 'pending' }
      };
      const horsesRes = await fetch(`${apiUrl}/horses`, { cache: 'no-store' });
      const horsesRaw = await horsesRes.json();
      const allHorses = Array.isArray(horsesRaw) ? horsesRaw : (horsesRaw.data || []);
      const myHorses = allHorses.filter((h: any) => {
        if (h.SELLER_ID || h.seller_id) return Number(h.SELLER_ID || h.seller_id) === Number(user.id);
        return (h.SELLER_NAME || h.seller_name) === user.full_name;
      });
      return { user, horses: myHorses };
    } catch (error) { return null; }
  }
  return null;
}

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get('horse_trust_token');

  if (!tokenCookie?.value) redirect('/login');
  const data = await fetchDashboardData(tokenCookie.value);
  if (!data) redirect('/login');

  const { user, horses } = data;

  return (
    <div className="min-h-screen bg-equestrian-sand font-display text-equestrian-navy relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/3 h-full bg-white/40 skew-x-12 translate-x-32 pointer-events-none" />
      
      <main className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Cabecera */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-6xl font-serif italic text-equestrian-navy leading-tight">
              Bienvenida, <span className="text-equestrian-gold not-italic font-bold">{user.full_name}</span>
            </h1>
          </div>
          <div className="flex gap-4">
             <div className="bg-white/50 backdrop-blur-sm p-4 rounded-2xl border border-white shadow-sm">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Total Ejemplares</p>
                <p className="text-2xl font-serif font-bold">{horses.length}</p>
             </div>
          </div>
        </div>

        {/* Alerta de Verificación */}
        {user.seller_profile.verification_status !== "verified" && (
          <div className="mb-12 bg-equestrian-navy rounded-[2rem] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl border border-equestrian-gold/20 group">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 rounded-full border border-equestrian-gold/30 flex items-center justify-center text-equestrian-gold shrink-0 bg-white/5">
                  <ShieldAlert className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-serif italic mb-2">Identidad en <span className="text-equestrian-gold not-italic font-bold">Auditoría</span></h3>
                  <p className="text-slate-400 text-sm leading-relaxed max-w-xl">
                    Completa tu perfil para verificar tu identidad y obtener confianza.
                  </p>
                </div>
              </div>
              <Link href="/registro" className="bg-equestrian-gold text-equestrian-navy px-8 py-4 rounded-xl font-bold text-xs uppercase tracking-widest hover:brightness-110 transition-all shadow-xl shadow-equestrian-gold/20 whitespace-nowrap">
                Verificar Ahora
              </Link>
            </div>
          </div>
        )}

        {/* Sección Mi Establo */}
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-serif italic text-equestrian-navy">Mi <span className="not-italic font-bold">Establo</span></h2>
            <Link href="/mis-publicaciones" className="text-xs font-bold uppercase tracking-widest text-equestrian-gold flex items-center gap-2 hover:translate-x-1 transition-transform">
              Ver Catálogo <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Tarjetas de Caballos */}
            {horses.map((horse: any) => (
              <div key={horse.ID || horse._id} className="bg-white rounded-[2rem] p-6 shadow-xl border border-slate-100 hover:border-equestrian-gold/30 transition-all duration-500 group relative">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-6 bg-slate-100">
                  <img 
                    src={horse.MAIN_PHOTO || horse.photos?.[0]?.url || '/img/horse-placeholder.webp'} 
                    alt={horse.NAME} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 grayscale group-hover:grayscale-0" 
                  />
                  <div className="absolute top-4 right-4 backdrop-blur-md bg-white/20 border border-white/30 px-3 py-1.5 rounded-full">
                    <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-tighter text-white">
                      <Clock className="w-3 h-3 text-equestrian-gold" /> {horse.STATUS || 'En Revisión'}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-serif text-2xl font-bold text-equestrian-navy group-hover:text-equestrian-gold transition-colors leading-none">{horse.NAME || horse.name}</h4>
                      <p className="text-xs font-medium text-slate-400 mt-2 uppercase tracking-widest">{horse.BREED} • {horse.AGE} Años</p>
                    </div>
                    <button className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center text-slate-400 hover:bg-equestrian-navy hover:text-white transition-all shadow-sm">
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                    <p className="text-2xl font-serif font-bold text-equestrian-navy">
                      <span className="text-sm font-sans font-medium text-slate-400 mr-1">USD</span>
                      {new Intl.NumberFormat('en-US').format(horse.PRICE || horse.price)}
                    </p>
                    <div className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                      <LayoutDashboard className="w-3 h-3" /> {horse.LOCATION || 'Sin Ubicación'}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Botón "Publicar Nuevo" */}
            <Link href="/registro-caballo" className="relative h-full flex flex-col items-center justify-center gap-4 p-8 rounded-[2rem] border-2 border-dashed border-slate-200 bg-white/30 hover:bg-white hover:border-equestrian-gold transition-all duration-500 group min-h-[300px]">
              <div className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center group-hover:bg-equestrian-gold group-hover:text-white transition-all duration-500">
                <Plus className="w-8 h-8" />
              </div>
              <div className="text-center">
                <span className="block text-sm font-bold text-equestrian-navy uppercase tracking-widest mb-1">Nuevo Ejemplar</span>
                <span className="text-xs text-slate-400 font-medium italic font-serif">Añadir un nuevo caballo al establo</span>
              </div>
            </Link>
          </div>
          
          {horses.length === 0 && (
            <div className="bg-white/40 rounded-[2rem] p-20 text-center border border-white backdrop-blur-sm">
               <Images className="w-12 h-12 text-slate-300 mx-auto mb-4" />
               <p className="font-serif italic text-xl text-slate-400">Tu establo está esperando sus primeros ejemplares de élite.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}