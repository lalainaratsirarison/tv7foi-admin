"use client";

import { useGetSystemStats } from "@/services/system";
import { Loader2, HardDrive, Cpu, Server, AlertCircle } from "lucide-react";

export default function SystemStatus() {
  const { data: stats, isLoading, isError } = useGetSystemStats();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <Loader2 className="animate-spin text-gray-400" />
      </div>
    );
  }

  if (isError || !stats) {
    return (
      <div className="flex flex-col items-center justify-center h-32 text-red-500 text-sm">
        <AlertCircle size={20} className="mb-2" />
        Info système indisponible
      </div>
    );
  }

  // Helper pour la couleur de la barre de progression
  const getProgressColor = (percentage: number) => {
    if (percentage < 60) return "bg-green-500";
    if (percentage < 85) return "bg-yellow-500";
    return "bg-red-500";
  };

  const memPercent = parseFloat(stats.memory.percentage);
  // Gérer le cas où disk est une erreur ou un objet stats
  const diskPercent = 'error' in stats.disk ? 0 : parseFloat(stats.disk.percentage);
  const diskError = 'error' in stats.disk;

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
        <div className="flex items-center">
            <Server size={14} className="mr-1" />
            <span>{stats.os}</span>
        </div>
        <span>Uptime: {stats.uptime}</span>
      </div>

      {/* RAM */}
      <div>
        <div className="flex justify-between items-end mb-1">
          <div className="flex items-center text-sm font-medium text-gray-700">
            <Cpu size={16} className="mr-2 text-blue-600" />
            Mémoire RAM
          </div>
          <span className="text-xs text-gray-500">
            {stats.memory.used} / {stats.memory.total} GB
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className={`h-2.5 rounded-full transition-all duration-500 ${getProgressColor(memPercent)}`} 
            style={{ width: `${memPercent}%` }}
          ></div>
        </div>
        <div className="text-right text-xs font-bold mt-1 text-gray-600">{memPercent}%</div>
      </div>

      {/* Disque */}
      <div>
        <div className="flex justify-between items-end mb-1">
          <div className="flex items-center text-sm font-medium text-gray-700">
            <HardDrive size={16} className="mr-2 text-purple-600" />
            Espace Disque
          </div>
          {!diskError && (
            // @ts-ignore (disk est vérifié par diskError)
            <span className="text-xs text-gray-500">
              {/* @ts-ignore */}
              {stats.disk.used} / {stats.disk.total} GB
            </span>
          )}
        </div>
        
        {diskError ? (
             <div className="text-xs text-orange-500 italic">Non disponible</div>
        ) : (
            <>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                    className={`h-2.5 rounded-full transition-all duration-500 ${getProgressColor(diskPercent)}`} 
                    style={{ width: `${diskPercent}%` }}
                ></div>
                </div>
                <div className="text-right text-xs font-bold mt-1 text-gray-600">{diskPercent}%</div>
            </>
        )}
      </div>
    </div>
  );
}