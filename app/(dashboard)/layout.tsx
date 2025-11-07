"use client";

import React, { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { useAuthGuard } from "@/hooks/useAdmin";
import { Loader2 } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // --- Protection de la route ---
  // Ce hook vérifie si l'utilisateur est connecté.
  // S'il ne l'est pas, il le redirige automatiquement vers /login.
  const { isLoading, isAuthenticated } = useAuthGuard();

  // État pour gérer l'ouverture de la sidebar sur mobile
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Pendant que le hook vérifie l'authentification, on affiche un loader
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-primary-50">
        <Loader2 className="w-16 h-16 text-primary-800 animate-spin" />
      </div>
    );
  }

  // Si le hook a fini et que l'utilisateur est authentifié, on affiche le layout
  // (Si non-authentifié, la redirection a déjà eu lieu)
  if (isAuthenticated) {
    return (
      <div className="flex h-screen bg-primary-50">
        {/* Sidebar */}
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Contenu principal */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <Header onMenuClick={() => setIsSidebarOpen(true)} />

          {/* Zone de contenu scrollable
            - 'pt-24' pour passer sous le header (h-24)
            - 'lg:pl-80' pour passer à droite de la sidebar (w-80) sur desktop
          */}
          <main className="flex-1 overflow-x-hidden overflow-y-auto pt-24 lg:pl-80">
            {/* Padding intérieur généreux pour le contenu des pages
              Respecte le design "spacieux" demandé
            */}
            <div className="container mx-auto px-6 py-10 lg:px-12 lg:py-16">
              {children}
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Au cas où le rendu se produit avant la redirection
  return null;
}
