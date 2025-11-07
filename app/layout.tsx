import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./providers"; // Importe notre QueryClientProvider

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Back-Office Administration",
  description: "Plateforme de gestion de contenu",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${inter.className} bg-primary-50 text-gray-900`}>
        {/*
          On enveloppe toute l'application avec le Provider
          pour que React Query soit disponible partout.
        */}
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
