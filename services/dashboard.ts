"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { DashboardStats } from "@/types";

/**
 * Hook pour récupérer les statistiques du tableau de bord.
 */
export const useGetDashboardStats = () => {
  return useQuery<DashboardStats, Error>({
    // 'queryKey' est un identifiant unique pour cette requête.
    // React Query l'utilise pour le caching.
    queryKey: ["dashboardStats"],
    
    // 'queryFn' est la fonction qui effectue la requête.
    queryFn: async () => {
      const { data } = await api.get("/dashboard/stats");
      console.log("Stats: ", data);
      return data;
    },
    
    // Options
    staleTime: 1000 * 60 * 5, // Les stats peuvent être mises en cache 5min
  });
};
