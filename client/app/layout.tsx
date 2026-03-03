import type { Metadata } from "next";
import "./globals.css";
import Header from "@/component/layout/Header";
import Footer from "@/component/layout/Footer";
import { cookies } from 'next/headers';

export const metadata: Metadata = {
  title: "HorseTrust | Mercado de Caballos de Élite Verificados",
  description: "La plataforma líder para la compra y venta de caballos de alto valor. Seguridad, transparencia y auditoría veterinaria en cada transacción.",
};

export default async function RootLayout({
  children,
}: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const isLoggedIn = cookieStore.has('horse_trust_token');
  return (
    <html lang="en">
      <body>
        <Header initialIsLoggedIn={isLoggedIn}/>
        {children}
      </body>
    </html>
  );
}
