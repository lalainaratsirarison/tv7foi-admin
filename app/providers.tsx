"use client";

// Ce composant est essentiel pour faire fonctionner React Query
// Il enveloppe toute l'application et fournit le "contexte"
// pour que tous les autres composants puissent utiliser les hooks (useQuery, useMutation)

import React, { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function Providers({ children }: { children: React.ReactNode }) {
  // Crée une instance de QueryClient.
  // Le `useState` ici garantit que le client n'est créé qu'une seule fois
  // lors du premier rendu du composant, ce qui est crucial pour Next.js
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Options par défaut pour toutes les requêtes
            // Par exemple, on peut désactiver la récupération auto au focus de la fenêtre
            // refetchOnWindowFocus: false,
            // Temps avant qu'une donnée soit considérée comme "périmée" (stale)
            // staleTime: 1000 * 60 * 5, // 5 minutes
          },
        },
      })
  );

  return (
    // Fournit le client à tous les composants enfants
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
