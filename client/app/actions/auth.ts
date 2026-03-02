"use server"; 

export async function loginUser(email: string, password: string) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    
    const res = await fetch(`${apiUrl}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || data.message || 'Error al validar credenciales');
    }

    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message || "Error interno del servidor" };
  }
}