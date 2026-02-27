import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HorseTrust | Mercado de Caballos de Élite Verificados",
  description: "La plataforma líder para la compra y venta de caballos de alto valor. Seguridad, transparencia y auditoría veterinaria en cada transacción.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
