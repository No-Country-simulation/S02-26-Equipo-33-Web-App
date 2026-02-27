import MarketplaceClient from '@/component/marketplace/MarketplaceClient';

async function getHorses() {
  try {
    const res = await fetch('https://s02-26-e33-horse-trust-api.vercel.app/api/horses', {
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