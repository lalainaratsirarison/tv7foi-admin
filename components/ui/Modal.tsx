"use client";

import React, { FC, ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

/**
 * Composant Modale générique et réutilisable.
 * * Utilise une transition simple pour une meilleure expérience utilisateur.
 * Le `z-50` assure que la modale est au-dessus de tout le contenu de la page.
 */
const Modal: FC<ModalProps> = ({ open, onClose, title, children }) => {
  if (!open) return null;

  return (
    // Conteneur de fond (Overlay)
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300"
      // Fermeture si on clique sur l'overlay
      onClick={onClose}
    >
      {/* Conteneur principal de la modale */}
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl transform transition-all duration-300 scale-100 opacity-100 max-h-[90vh] overflow-y-auto"
        // Empêche la fermeture quand on clique à l'intérieur de la modale
        onClick={(e) => e.stopPropagation()}
      >
        {/* En-tête de la Modale */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
            title="Fermer"
          >
            <X size={24} />
          </button>
        </div>

        {/* Corps de la Modale (Contenu dynamique) */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;