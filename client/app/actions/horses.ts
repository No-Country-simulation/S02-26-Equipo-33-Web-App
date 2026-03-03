"use server";

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

export async function createHorse(horseData: any) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('horse_trust_token')?.value;

    if (!token) {
      return { success: false, error: "No hay una sesión activa para realizar esta acción." };
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    
    const res = await fetch(`${apiUrl}/horses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify(horseData),
    });

    const data = await res.json();

    if (!res.ok) {
      revalidatePath('/marketplace'); // Borra el cache del marketplace
      revalidatePath('/dashboard');   // Borra el cache del dashboard
      return { success: false, error: data.error || data.message || "Error al publicar el caballo" };
    }

    return { success: true, data };
  } catch (error) {
    return { success: false, error: "Error interno en la conexión con el servidor." };
  }
}

export async function addVetRecord(horseId: string | number, payload: any) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const cookieStore = await cookies();
    const token = cookieStore.get('horse_trust_token')?.value;

    if (!token) {
      return { success: false, error: "No hay una sesión activa para realizar esta acción." };
    }

    const res = await fetch(`${apiUrl}/api/vet/${horseId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Error del backend en addVetRecord:", data);
      throw new Error(data.error || data.message || "Error al guardar el registro veterinario");
    }

    revalidatePath('/dashboard');
    revalidatePath(`/marketplace/${horseId}`);
    
    return { success: true, data };
  } catch (error: any) {
    console.error("Error crítico en addVetRecord:", error);
    return { success: false, error: error.message };
  }
}

export async function reconnectDatabase() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const res = await fetch(`${apiUrl}/health/reconnect`, {
      method: 'POST',
    });
    
    const data = await res.json();
    
    if (!res.ok) throw new Error(data.message || "No se pudo despertar la base de datos.");
    return { success: true, message: data.message || "Base de datos conectada." };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}