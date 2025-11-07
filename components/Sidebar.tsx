"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Video,
  Tags,
  BookText,
  FileImage,
  BookMarked,
  X,
} from "lucide-react";

// Définition d'un type pour les liens de navigation
type NavLink = {
  href: string;
  label: string;
  icon: React.ElementType;
};

// Nos liens de navigation
const navLinks: NavLink[] = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/videos", label: "Vidéos", icon: Video },
  { href: "/blogs", label: "Blogs", icon: BookText },
  { href: "/categories", label: "Catégories", icon: Tags },
  { href: "/verses", label: "Versets", icon: BookMarked },
  { href: "/images", label: "Images", icon: FileImage },
];

// Props pour le composant
interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  // Fonction pour déterminer si un lien est actif
  // (Gère le cas où / est actif seulement s'il correspond exactement)
  const isActive = (href: string) => {
    return href === "/"
      ? pathname === href
      : pathname.startsWith(href);
  };

  return (
    <>
      {/* Sidebar principale
        - 'w-80' (320px) sur desktop
        - 'fixed' pour qu'elle reste en place
        - Gestion de la transformation pour l'affichage mobile
      */}
      <aside
        className={`fixed top-0 left-0 z-40 w-80 h-screen bg-primary-900 text-primary-100 flex flex-col transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      >
        {/* Header de la Sidebar */}
        <div className="flex items-center justify-between h-24 px-8 border-b border-primary-700">
          <Link href="/" className="text-3xl font-bold text-white">
            Back-Office
          </Link>
          {/* Bouton pour fermer sur mobile (visible uniquement sur < lg) */}
          <button onClick={onClose} className="lg:hidden text-primary-300">
            <X size={28} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-8 px-6 space-y-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose} // Ferme la sidebar au clic sur mobile
              className={`flex items-center space-x-4 py-4 px-6 rounded-2xl text-lg font-medium transition-all duration-200
                ${
                  isActive(link.href)
                    ? "bg-primary-500 text-white shadow-lg"
                    : "hover:bg-primary-800 hover:text-white"
                }
              `}
            >
              <link.icon className="w-6 h-6" />
              <span>{link.label}</span>
            </Link>
          ))}
        </nav>

        {/* @TODO: Zone utilisateur en bas de sidebar ? */}
      </aside>

      {/* Overlay pour le mode mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 lg:hidden"
          onClick={onClose}
        ></div>
      )}
    </>
  );
}
