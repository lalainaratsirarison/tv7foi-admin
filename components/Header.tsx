// components/Header.tsx
"use client";

// 1. Importer 'useLogout' au lieu de 'useAdmin' (sauf si 'admin' est encore nécessaire)
import { useAdmin } from "@/hooks/useAdmin";
import { useLogout } from "@/services/auth"; // <-- NOUVEAU
import { Menu, Bell, User, LogOut, Loader2 } from "lucide-react"; // <-- Ajout de Loader2

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  // On garde useAdmin pour afficher le nom de l'utilisateur
  const { admin } = useAdmin();
  
  // 2. Initialiser le hook useLogout
  const { mutate: logout, isPending: isLoggingOut } = useLogout(); // <-- NOUVEAU

  // 3. Fonction de déconnexion
  const handleLogout = () => {
    // Appelle la mutation de déconnexion
    logout(); // <-- NOUVEAU
  };

  return (
    <header
      className="fixed top-0 left-0 lg:left-80 right-0 z-30
      h-24 bg-white shadow-md
      flex items-center justify-between px-6 lg:px-12"
    >
      {/* Bouton Menu (Hamburger) */}
      <button
        onClick={onMenuClick}
        className="text-gray-700 lg:hidden"
        aria-label="Ouvrir le menu"
      >
        <Menu size={28} />
      </button>

      {/* Titre de la page (ou recherche) */}
      <div className="hidden lg:block">
        <h1 className="text-2xl font-semibold text-gray-800">
          Bonjour, {admin?.surname || "Admin"}
        </h1>
      </div>

      {/* Actions de droite (Notifications, Profil) */}
      <div className="flex items-center space-x-6 ml-auto lg:ml-0">
        {/* @TODO: Implémenter le système de notifications */}
        <button className="text-gray-600 hover:text-primary-800 relative">
          <Bell size={24} />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            3
          </span>
        </button>

        {/* Profil */}
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-full bg-primary-200 flex items-center justify-center">
            <User size={24} className="text-primary-800" />
          </div>
          <div className="hidden md:block">
            <div className="font-semibold text-gray-800">
              {admin?.name} {admin?.surname}
            </div>
            <div className="text-sm text-gray-500">{admin?.email}</div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="text-gray-600 hover:text-red-500 disabled:opacity-50"
          title="Se déconnecter"
        >
          {isLoggingOut ? (
            <Loader2 className="w-6 h-6 animate-spin" /> // <-- NOUVEAU : Loader
          ) : (
            <LogOut size={24} />
          )}
        </button>
      </div>
    </header>
  );
}