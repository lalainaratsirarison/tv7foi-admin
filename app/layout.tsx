import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import Footer from "@/components/Footer";

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
        <Providers>{children}</Providers>
        <Footer></Footer>
      </body>
    </html>
  );
}
