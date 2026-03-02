import MarketplaceClient from '@/component/marketplace/MarketplaceClient';

export const dynamic = 'force-dynamic';

async function getHorses() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    
    const res = await fetch(`${apiUrl}/horses`, {
      next: { revalidate: 60 } 
    });

    if (!res.ok) throw new Error('Error al traer los caballos');

    const jsonResponse = await res.json();
    const horsesArray = Array.isArray(jsonResponse) ? jsonResponse : jsonResponse.data;

    if (!horsesArray || !Array.isArray(horsesArray)) return [];
    
    return horsesArray;
  } catch (error) {
    console.error("Hubo un problema conectando con el backend:", error);
    return []; 
  }
}

export default async function MarketplacePage() {
  const initialHorses = await getHorses();

  return <MarketplaceClient initialHorses={initialHorses} />;
}