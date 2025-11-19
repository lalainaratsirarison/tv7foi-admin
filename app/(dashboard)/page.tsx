"use client";

import StatsCard from "@/components/dashboard/StatsCard";
import VideoChart from "@/components/dashboard/VideoChart";
import SystemStatus from "@/components/dashboard/SystemStatus"; // 🟢 Intégration du widget système
import { useGetDashboardStats } from "@/services/dashboard";
import {
  Loader2,
  Video,
  Clapperboard,
  BookText,
  BookMarked,
  AlertTriangle,
  Activity
} from "lucide-react";

export default function DashboardPage() {
  const { data: stats, isLoading, isError, error } = useGetDashboardStats();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <Loader2 className="w-12 h-12 text-primary-800 animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-6 rounded-xl shadow-sm" role="alert">
        <div className="flex items-center">
          <AlertTriangle className="w-6 h-6 mr-4" />
          <div>
            <p className="font-bold text-lg">Impossible de charger le tableau de bord</p>
            <p className="text-sm mt-1">Vérifiez votre connexion ou réessayez plus tard.</p>
            <p className="text-xs mt-2 text-red-500 font-mono">{error?.message}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Vue d'ensemble</h2>
        <p className="text-gray-500 mt-1">Bienvenue sur votre tableau de bord d'administration.</p>
      </div>

      {/* --- 1. CARTES STATS (KPIs) --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatsCard
          title="Total Vidéos"
          value={stats?.total_videos ?? 0}
          icon={Video}
          colorClass="bg-blue-100 text-blue-600"
        />
        <StatsCard
          title="Mini-Émissions"
          value={stats?.mini_emissions ?? 0}
          icon={Clapperboard}
          colorClass="bg-green-100 text-green-600"
        />
        <StatsCard
          title="Blogs Publiés"
          value={stats?.total_blogs ?? 0}
          icon={BookText}
          colorClass="bg-yellow-100 text-yellow-600"
        />
        <StatsCard
          title="Versets Planifiés"
          value={stats?.total_verses ?? 0}
          icon={BookMarked}
          colorClass="bg-purple-100 text-purple-600"
        />
      </div>

      {/* --- 2. SECTION ANALYTIQUE --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Graphique (Prend 2/3 de la largeur) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Répartition des Vidéos</h3>
          <div className="flex-1 min-h-[300px]">
            <VideoChart data={stats?.videos_by_category || []} />
          </div>
        </div>

        {/* État du Système (Prend 1/3 de la largeur) */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
            <Activity className="mr-2 text-primary-600" size={20} />
            État du Serveur
          </h3>
          
          {/* Le composant SystemStatus gère son propre chargement de données */}
          <SystemStatus />
        </div>
      </div>
    </div>
  );
}