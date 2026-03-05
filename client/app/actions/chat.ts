"use server";
import { cookies } from 'next/headers';
import { apiFetch } from '../utils/apiFetch';

export async function getConversations() {
  try {
    const token = (await cookies()).get('horse_trust_token')?.value;
    if (!token) return [];

    const res = await apiFetch(`/chat/conversations`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error("Error obteniendo conversaciones:", error);
    return [];
  }
}

export async function getMessages(chatId: string) {
  try {
    const token = (await cookies()).get('horse_trust_token')?.value;
    if (!token) return [];

    const res = await apiFetch(`/chat/conversations/${chatId}/messages`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error("Error obteniendo mensajes:", error);
    return [];
  }
}

export async function sendMessage(chatId: string, text: string) {
  try {
    const token = (await cookies()).get('horse_trust_token')?.value;
    if (!token) throw new Error("No hay sesión activa");

    const res = await apiFetch(`/chat/conversations/${chatId}/messages`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ content: text }) 
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Error al enviar el mensaje");
    
    return data;
  } catch (error) {
    console.error("Error en sendMessage:", error);
    throw error;
  }
}

export async function startConversation(recipientId: number, horseId: number) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('horse_trust_token')?.value;
    
    if (!token) return { error: "No autorizado" };

    const res = await apiFetch(`/chat/conversations`, { 
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        recipient_id: recipientId, 
        horse_id: horseId 
      })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Error en el servidor al iniciar chat");

    return data;
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function findSellerIdByName(sellerName: string) {
  try {
    const token = (await cookies()).get('horse_trust_token')?.value;
    if (!token) return null;
    const res = await apiFetch(`/sellers/list`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (!res.ok) return null;
    
    const sellers = await res.json();
    const seller = sellers.find((s: any) => 
      s.full_name?.toLowerCase() === sellerName.toLowerCase() || 
      s.NAME?.toLowerCase() === sellerName.toLowerCase()
    );
    
    return seller ? (seller.id || seller.ID || seller._id) : null;
  } catch (error) {
    console.error("Error buscando ID de seller:", error);
    return null;
  }
}


export async function getVerifiedSellerIdForHorse(sellerName: string, horseId: number) {
  try {
    const token = (await cookies()).get('horse_trust_token')?.value;
    if (!token) return { error: "No hay sesión activa (Falta token)" };

    const listRes = await apiFetch(`/sellers/list`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!listRes.ok) return { error: `El backend rechazó la lista (/sellers/list): Status ${listRes.status}` };

    const sellers = await listRes.json();

    const matchingSellers = sellers.filter((s: any) => 
      (s.FULL_NAME || s.full_name || s.NAME || s.seller_name)?.toLowerCase() === sellerName.toLowerCase()
    );

    if (matchingSellers.length === 0) {
      return { 
        error: `La API devolvió la lista, pero nadie se llama "${sellerName}".`, 
        backendData: sellers 
      };
    }

    const firstMatch = matchingSellers[0];
    const foundId = firstMatch.ID || firstMatch.id || firstMatch._id;

    return { success: true, id: foundId };

  } catch (error: any) {
    return { error: `Error interno del servidor: ${error.message}` };
  }
}