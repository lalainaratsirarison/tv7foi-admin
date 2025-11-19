"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

// Types basés sur la réponse de votre contrôleur backend
export type SystemStats = {
  os: string;
  uptime: string;
  memory: {
    total: string;
    free: string;
    used: string;
    percentage: string;
  };
  disk: {
    total: string;
    free: string;
    used: string;
    percentage: string;
  } | { error: string }; // Gérer le cas où le disque n'est pas dispo
};

export const useGetSystemStats = () => useQuery<SystemStats, Error>({
  queryKey: ["systemStats"],
  queryFn: async () => (await api.get("/system/usage")).data,
  // Rafraîchir toutes les 30 secondes pour avoir un monitoring quasi-temps réel
  refetchInterval: 30000, 
});