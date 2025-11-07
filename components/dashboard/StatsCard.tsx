import { LucideIcon } from "lucide-react";
import React from "react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  colorClass: string; // ex: "bg-blue-500 text-blue-100"
}

/**
 * Composant réutilisable pour afficher une carte de statistique
 * avec le design moderne (rounded-3xl, shadow-lg, padding généreux)
 */
export default function StatsCard({
  title,
  value,
  icon: Icon,
  colorClass,
}: StatsCardProps) {
  return (
    <div className="bg-white rounded-3xl shadow-lg hover:shadow-2xl p-8 transition-all duration-300 ease-in-out">
      <div className="flex items-center justify-between">
        {/* Valeur et Titre */}
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-gray-500">{title}</h3>
          <p className="text-5xl font-bold text-gray-900">{value}</p>
        </div>
        {/* Icône */}
        <div className={`p-5 rounded-2xl ${colorClass}`}>
          <Icon className="w-10 h-10" />
        </div>
      </div>
    </div>
  );
}
