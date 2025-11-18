"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

// Définition du type de données reçu du backend
export interface DashboardStats {
  total_videos: number;
  mini_emissions: number;
  total_blogs: number;
  total_verses: number;
  videos_by_category: Array<{
    name: string;
    value: number;
  }>;
}

export const useGetDashboardStats = () => {
  return useQuery<DashboardStats, Error>({
    queryKey: ["dashboardStats"],
    queryFn: async () => {
      const { data } = await api.get("/dashboard/stats");
      return data;
    },
    // Les stats ne changent pas à la seconde, on peut garder le cache 5 minutes
    staleTime: 1000 * 60 * 5, 
  });
};