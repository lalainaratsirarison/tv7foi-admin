"use client";

import StatsCard from "@/components/dashboard/StatsCard";
import { useGetDashboardStats } from "@/services/dashboard";
import {
  Loader2,
  Video,
  Clapperboard,
  BookText,
  BookMarked,
  AlertTriangle,
} from "lucide-react";

export default function DashboardPage() {
  // Utilisation de notre hook React Query pour récupérer les données
  const { data: stats, isLoading, isError, error } = useGetDashboardStats();

  // --- État de chargement ---
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-12 h-12 text-primary-800 animate-spin" />
      </div>
    );
  }

  // --- État d'erreur ---
  if (isError) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-6 rounded-2xl" role="alert">
        <div className="flex items-center">
          <AlertTriangle className="w-8 h-8 mr-4" />
          <div>
            <p className="font-bold text-xl">Erreur de chargement</p>
            <p className="text-lg">
              Impossible de récupérer les statistiques du tableau de bord.
            </p>
            <p className="text-sm mt-2">{error?.message}</p>
          </div>
        </div>
      </div>
    );
  }

  // --- État de succès (données chargées) ---
  return (
    <div className="space-y-12">
      {/* Section des cartes de statistiques
        Utilise le grid adaptatif demandé : 1 col mobile, 2 tablet, 4 desktop
      */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
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
          title="Verset du jour"
          value={stats?.total_verses ?? 0}
          icon={BookMarked}
          colorClass="bg-purple-100 text-purple-600"
        />
      </div>

      {/* Section des graphiques
        @TODO: Intégrer une vraie bibliothèque de graphiques (ex: Recharts, Chart.js)
      */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Graphique principal (placeholder) */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-lg">
          <h3 className="text-2xl font-semibold mb-6">Vidéos par Catégorie</h3>
          <div className="h-96 flex items-center justify-center text-gray-400">
            [Placeholder pour le graphique des vidéos]
            <br/>
            (Intégrer Recharts ou Chart.js ici)
          </div>
        </div>

        {/* Activité récente (placeholder) */}
        <div className="bg-white p-8 rounded-3xl shadow-lg">
          <h3 className="text-2xl font-semibold mb-6">Activité Récente</h3>
          <div className="space-y-4">
            <p className="text-gray-400">
              [Placeholder pour le flux d'activité]
            </p>
            {/* Exemple d'item */}
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 rounded-full">
                <Video size={18} className="text-green-600" />
              </div>
              <div>
                <p className="font-medium">Nouvelle vidéo ajoutée</p>
                <p className="text-sm text-gray-500">"Témoignage de Marc" - Il y a 2h</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
