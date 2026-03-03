import HorseDetailClient from '@/component/marketplace/HorseDetailClient';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

async function getHorseDetails(id: string) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const res = await fetch(`${apiUrl}/horses/${id}`, {
      cache: 'no-store' 
    });
    
    const json = await res.json();
    
    if (!res.ok) return null;

    // ESCENARIO 1: Formato SQL Legacy
    if (json.ID) {
      // 1. Extraemos y mapeamos los arrays ANTES del return para que Next.js no se maree
      const mappedPhotos = Array.isArray(json.photos) 
        ? json.photos.map((p: any) => ({
            url: p.PHOTO_URL,
            is_cover: p.IS_PRIMARY === 1
          }))
        : [];

      const mappedVideos = Array.isArray(json.videos)
        ? json.videos.map((v: any) => ({
            url: v.VIDEO_URL
          }))
        : [];

      const mappedVetRecord = (json.vet_records && json.vet_records.length > 0)
        ? {
            validation_status: 'validated',
            review_date: json.vet_records[0].REVIEW_DATE,
            health_status: json.vet_records[0].HEALTH_STATUS,
            notes: json.vet_records[0].NOTES,
            vaccines: [],
            certificates: json.vet_records[0].CERTIFICATE_URL ? [
              { url: json.vet_records[0].CERTIFICATE_URL, title: 'Certificado Oficial' }
            ] : []
          }
        : null;

      // 2. Retornamos el objeto limpio
      return {
        data: {
          _id: json.ID,
          name: json.NAME,
          age: json.AGE,
          breed: json.BREED,
          discipline: json.DISCIPLINE,
          pedigree: json.PEDIGREE,
          price: json.PRICE,
          currency: 'USD',
          location: {
            country: json.LOCATION || 'Desconocido',
            region: 'Región no especificada'
          },
          photos: mappedPhotos,
          videos: mappedVideos,
          seller_id: {
            full_name: json.SELLER_NAME || 'Vendedor',
            seller_profile: { is_verified_badge: json.SELLER_VERIFIED === 'verified' }
          }
        },
        vet_record: mappedVetRecord
      };
    }

    // ESCENARIO 2: Formato Nuevo MongoDB
    if (json.success && json.data) {
      return { data: json.data, vet_record: json.vet_record };
    }

    return null;
  } catch (error) {
    console.error("Error fetching horse on server:", error);
    return null;
  }
}

export default async function HorseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const data = await getHorseDetails(resolvedParams.id);

  if (!data || !data.data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-equestrian-sand p-6 text-center">
        <h2 className="text-2xl font-black text-equestrian-navy mb-4">No pudimos cargar la información</h2>
        <p className="text-slate-500 mb-6">El caballo no existe, el ID es inválido o fue removido del catálogo.</p>
        <Link href="/marketplace" className="bg-equestrian-navy text-white px-6 py-3 rounded-lg font-bold uppercase tracking-wider text-sm">
          Volver al Catálogo
        </Link>
      </div>
    );
  }

  return <HorseDetailClient horse={data.data} vetRecord={data.vet_record} />;
}