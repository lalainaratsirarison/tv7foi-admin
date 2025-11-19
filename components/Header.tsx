"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from "next/link";
import { useGetProfile } from "@/services/admin"; 
import { useLogout } from "@/services/auth";
// Assurez-vous que ce service existe (nous l'avons créé précédemment)
import { useGetNotifications, useMarkNotificationAsRead, useMarkAllAsRead, Notification } from "@/services/notifications"; 
import { 
  Menu, Bell, User, LogOut, Loader2, ChevronDown, Settings, 
  Info, CheckCircle, AlertTriangle, XCircle, Check 
} from "lucide-react";
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  // --- Hooks Admin & Auth ---
  const { data: admin, isLoading } = useGetProfile();
  const { mutate: logout, isPending: isLoggingOut } = useLogout();
  
  // --- Hooks Notifications ---
  // Récupération automatique toutes les 15s (configuré dans le service)
  const { data: notifData } = useGetNotifications();
  const { mutate: markAsRead } = useMarkNotificationAsRead();
  const { mutate: markAllAsRead } = useMarkAllAsRead();
  
  // --- États pour les menus ---
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Menu Profil
  const [isNotifOpen, setIsNotifOpen] = useState(false);       // Menu Notifications
  
  // Refs pour la détection de clic à l'extérieur
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Fermer les dropdowns au clic extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => logout();

  // Helper pour choisir l'icône selon le type de notification
  const getNotifIcon = (type: string) => {
    switch(type) {
        case 'SUCCESS': return <CheckCircle size={18} className="text-green-500" />;
        case 'WARNING': return <AlertTriangle size={18} className="text-orange-500" />;
        case 'ERROR': return <XCircle size={18} className="text-red-500" />;
        default: return <Info size={18} className="text-blue-500" />;
    }
  };

  return (
    <header className="fixed top-0 left-0 lg:left-80 right-0 z-30 h-24 bg-white shadow-sm border-b border-gray-100 flex items-center justify-between px-6 lg:px-12 transition-all duration-300">
      
      {/* GAUCHE : Titre et Menu Mobile */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="text-gray-500 hover:text-primary-700 lg:hidden transition-colors"
          aria-label="Ouvrir le menu"
        >
          <Menu size={28} />
        </button>

        <div>
          <h1 className="text-xl font-bold text-gray-800 hidden sm:block">
            {/* Affichage conditionnel du nom */}
            {isLoading ? "Chargement..." : <>Bonjour, {admin?.surname || "Admin"} 👋</>}
          </h1>
          <p className="text-xs text-gray-500 hidden sm:block">
            Bienvenue sur votre espace de gestion
          </p>
        </div>
      </div>

      {/* DROITE : Actions et Profil */}
      <div className="flex items-center space-x-4 sm:space-x-6">
        
        {/* --- 🔔 CENTRE DE NOTIFICATIONS --- */}
        <div className="relative" ref={notifRef}>
            <button 
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className={`relative p-2 rounded-full transition-all duration-200 
                  ${isNotifOpen ? 'bg-primary-50 text-primary-600' : 'text-gray-400 hover:text-primary-600 hover:bg-gray-50'}
                `}
                title="Notifications"
            >
                <Bell size={24} />
                
                {/* Badge rouge si non-lu */}
                {notifData && notifData.unread > 0 && (
                    <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white transform translate-x-1 -translate-y-1">
                        {notifData.unread > 9 ? '9+' : notifData.unread}
                    </span>
                )}
            </button>

            {/* Dropdown Notifications */}
            {isNotifOpen && (
                <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-100 origin-top-right z-50">
                    
                    {/* En-tête du dropdown */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                        <h3 className="font-semibold text-gray-800">Notifications</h3>
                        {notifData && notifData.unread > 0 && (
                            <button 
                                onClick={() => markAllAsRead()}
                                className="text-xs text-primary-600 hover:text-primary-800 font-medium flex items-center transition-colors"
                            >
                                <Check size={14} className="mr-1" /> Tout marquer comme lu
                            </button>
                        )}
                    </div>
                    
                    {/* Liste des notifications */}
                    <div className="max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200">
                        {!notifData?.items || notifData.items.length === 0 ? (
                            <div className="p-8 text-center flex flex-col items-center text-gray-400">
                                <Bell size={32} className="mb-2 opacity-20" />
                                <span className="text-sm">Aucune notification récente.</span>
                            </div>
                        ) : (
                            notifData.items.map((notif: Notification) => (
                                <div 
                                    key={notif.id} 
                                    onClick={() => !notif.isRead && markAsRead(notif.id)}
                                    className={`px-4 py-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors flex gap-3 items-start
                                      ${!notif.isRead ? 'bg-blue-50/40' : ''}
                                    `}
                                >
                                    {/* Icône */}
                                    <div className="mt-0.5 flex-shrink-0">
                                        {getNotifIcon(notif.type)}
                                    </div>
                                    
                                    {/* Contenu */}
                                    <div className="flex-1 min-w-0">
                                        <p className={`text-sm ${!notif.isRead ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                                            {notif.title}
                                        </p>
                                        {notif.message && (
                                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                                                {notif.message}
                                            </p>
                                        )}
                                        <p className="text-[10px] text-gray-400 mt-2">
                                            {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true, locale: fr })}
                                        </p>
                                    </div>
                                    
                                    {/* Point bleu si non-lu */}
                                    {!notif.isRead && (
                                        <div className="flex-shrink-0 self-center">
                                            <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>

        <div className="h-8 w-px bg-gray-200 mx-2 hidden sm:block"></div>

        {/* --- 👤 MENU PROFIL --- */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={`flex items-center gap-3 p-1 pr-3 rounded-full transition-all border 
              ${isDropdownOpen ? 'bg-gray-50 border-gray-200' : 'border-transparent hover:bg-gray-50 hover:border-gray-200'}
            `}
          >
            <div className="w-9 h-9 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center shadow-sm">
              <User size={20} />
            </div>
            
            <div className="hidden md:block text-left">
              <p className="text-sm font-semibold text-gray-700 leading-tight">
                {isLoading ? "..." : `${admin?.name} ${admin?.surname}`}
              </p>
              <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wide">Admin</p>
            </div>
            
            <ChevronDown size={16} className={`text-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown Profil */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 overflow-hidden animate-in fade-in zoom-in-95 duration-100 origin-top-right z-50">
              
              {/* Info Mobile */}
              <div className="px-4 py-3 border-b border-gray-100 md:hidden bg-gray-50">
                <p className="text-sm font-semibold text-gray-800">{admin?.name} {admin?.surname}</p>
                <p className="text-xs text-gray-500">{admin?.email}</p>
              </div>

              {/* Liens */}
              <div className="py-1">
                <Link 
                  href="/settings" 
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 transition-colors group"
                >
                  <Settings size={18} className="mr-3 text-gray-400 group-hover:text-primary-600" />
                  Paramètres du compte
                </Link>
              </div>

              <div className="border-t border-gray-100 my-1"></div>

              {/* Déconnexion */}
              <div className="px-1">
                <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="w-full flex items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors text-left group"
                >
                    {isLoggingOut ? (
                        <Loader2 className="mr-3 h-4 w-4 animate-spin" />
                    ) : (
                        <LogOut size={18} className="mr-3 group-hover:scale-110 transition-transform" />
                    )}
                    {isLoggingOut ? "Déconnexion..." : "Se déconnecter"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}