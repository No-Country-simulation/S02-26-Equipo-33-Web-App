"use server";
import { cookies } from 'next/headers';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getConversations() {
  const token = (await cookies()).get('horse_trust_token')?.value;
  const res = await fetch(`${API_URL}/conversations`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return res.json();
}

export async function getMessages(chatId: string) {
  const token = (await cookies()).get('horse_trust_token')?.value;
  const res = await fetch(`${API_URL}/conversations/${chatId}/messages`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return res.json();
}

export async function sendMessage(chatId: string, text: string) {
  const token = (await cookies()).get('horse_trust_token')?.value;
  const res = await fetch(`${API_URL}/conversations/${chatId}/messages`, {
    method: 'POST',
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ text })
  });
  return res.json();
}

export async function startConversation(recipientId: number, horseId: number) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const cookieStore = await cookies();
    const token = cookieStore.get('horse_trust_token')?.value;

    const res = await fetch(`${apiUrl}/api/chat/conversations`, { // Ruta del curl
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
    if (!res.ok) throw new Error(data.error || "Error en el servidor");

    return data;
  } catch (error: any) {
    return { error: error.message };
  }
}