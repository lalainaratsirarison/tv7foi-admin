"use client";

import Link from "next/link";
import { Github, Twitter, Linkedin } from "lucide-react";

export default function Footer() {
  // Définition des liens pour le pied de page
  const footerLinks = [
    { 
      title: "Navigation Rapide", 
      links: [
        { href: "/", label: "Accueil" },
        { href: "/live", label: "Replays Live" },
        { href: "/videos", label: "Gestion Vidéos" },
        { href: "/blogs", label: "Gestion Blogs" },
      ]
    },
    { 
      title: "Ressources & Aide", 
      links: [
        { href: "/documentation", label: "Documentation API" },
        { href: "/faq", label: "FAQ" },
        { href: "/support", label: "Contact Support" },
        { href: "/changelog", label: "Journal des modifications" },
      ]
    },
    { 
      title: "Mentions Légales", 
      links: [
        { href: "/privacy", label: "Politique de confidentialité" },
        { href: "/terms", label: "Conditions d'utilisation" },
        { href: "/cookies", label: "Gestion des cookies" },
      ]
    },
  ];

  return (
    // 💡 Changement crucial : Ajout de la marge à gauche pour décaler le footer
    // ml-0 (mobile) | lg:ml-80 (desktop)
    <footer className="bg-primary-900 text-primary-200 py-12 border-t border-primary-800 mt-10 ml-0 lg:ml-80 transition-all duration-300 ease-in-out">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section principale : Logo et Liens */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pb-8 border-b border-primary-700">
          
          {/* Colonne 1 : Nom de l'application et Slogan */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="text-3xl font-extrabold text-white transition-colors duration-200 hover:text-primary-400">
              BACK-OFFICE
            </Link>
            <p className="mt-3 text-sm text-primary-400 max-w-xs">
              Votre tableau de bord centralisé pour la gestion de contenu.
            </p>
            <div className="flex space-x-4 mt-6">
              <Link href="#" aria-label="Github" className="text-primary-400 hover:text-white transition-colors duration-200">
                <Github size={20} />
              </Link>
              <Link href="#" aria-label="Twitter" className="text-primary-400 hover:text-white transition-colors duration-200">
                <Twitter size={20} />
              </Link>
              <Link href="#" aria-label="LinkedIn" className="text-primary-400 hover:text-white transition-colors duration-200">
                <Linkedin size={20} />
              </Link>
            </div>
          </div>

          {/* Colonnes de liens */}
          {footerLinks.map((section) => (
            <div key={section.title} className="col-span-1">
              <h3 className="text-lg font-semibold text-white mb-4">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-primary-400 hover:text-white transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Section Copyright */}
        <div className="pt-8 text-center md:flex md:justify-between md:items-center">
          <p className="text-sm text-primary-400">
            &copy; {new Date().getFullYear()} Back-Office. Tous droits réservés.
          </p>
          <p className="text-xs mt-2 md:mt-0 text-primary-500">
            Développé avec <span className="text-red-500">♥</span> et Next.js.
          </p>
        </div>
      </div>
    </footer>
  );
}