export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const url = `${apiUrl}${endpoint}`;

  try {
    let res = await fetch(url, options);

    if (!res.ok && res.status >= 500) {
      console.log(`[API] Fallo en ${endpoint} (Status: ${res.status}). Intentando despertar Oracle...`);
      
      const reconRes = await fetch(`${apiUrl}/health/reconnect`, { 
        method: 'POST' 
      });
      
      if (reconRes.ok) {
        console.log(`[API] BD reconectada con éxito. Reintentando la petición a ${endpoint}...`);
        res = await fetch(url, options);
      } else {
        console.error(`[API] No se pudo despertar la base de datos.`);
      }
    }

    return res;
  } catch (error) {
    console.error(`[API] Error de red en ${endpoint}. Intentando reconectar...`, error);
    const reconRes = await fetch(`${apiUrl}/health/reconnect`, { method: 'POST' });
    if (reconRes.ok) {
      return await fetch(url, options);
    }
    
    throw error; 
  }
}