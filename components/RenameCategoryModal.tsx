"use client";

import { useState, useEffect, useRef } from "react";
import { X, Edit3 } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
  // 🟢 La fonction onConfirm prend maintenant le nouveau nom en paramètre
  onConfirm: (newName: string) => void; 
  currentName: string; // Nom actuel pour pré-remplir l'input
  title?: string;
  confirmLabel?: string;
  cancelLabel?: string;
};

export default function RenameCategoryModal({
  open,
  onClose,
  onConfirm,
  currentName,
  title = "Renommer la Catégorie",
  confirmLabel = "Renommer",
  cancelLabel = "Annuler",
}: Props) {
  // 🟢 État local pour capturer la nouvelle valeur de l'input
  const [newName, setNewName] = useState(currentName); 
  
  const inputRef = useRef<HTMLInputElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);

  // Mettre à jour l'état local du nom lorsque la modal s'ouvre ou si le nom actuel change
  useEffect(() => {
    setNewName(currentName);
  }, [currentName]);

  // Focus management + lock scroll
  useEffect(() => {
    if (!open) return;
    const previousActive = document.activeElement as HTMLElement | null;

    // Lock scroll
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Focus l'input après rendu
    requestAnimationFrame(() => {
        // Sélectionne tout le texte pour faciliter la saisie immédiate
        inputRef.current?.select(); 
    });

    // Restore on close
    return () => {
      document.body.style.overflow = previousOverflow;
      previousActive?.focus();
    };
  }, [open]);

  // Close on ESC
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Enter") {
        // Confirmer uniquement si l'input a une valeur
        if (inputRef.current && inputRef.current.value.trim()) {
            handleConfirm();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  
  // 🟢 Fonction de confirmation qui gère la validation et l'appel parent
  const handleConfirm = () => {
      const trimmedName = newName.trim();
      if (!trimmedName || trimmedName === currentName) {
          // Empêche la confirmation si le nom est vide ou inchangé
          onClose(); 
          return;
      }
      onConfirm(trimmedName);
  };

  if (!open) return null;

  return (
    // Backdrop
    <div
      aria-modal="true"
      role="dialog"
      aria-labelledby="rename-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6"
    >
      {/* overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* dialog */}
      <div
        ref={dialogRef}
        className="relative z-10 max-w-lg w-full bg-white rounded-2xl shadow-2xl ring-1 ring-black/5 p-8 transform transition-all"
        role="document"
      >
        <div className="flex justify-between items-start">
            <h2 id="rename-dialog-title" className="text-xl font-bold text-gray-900 flex items-center space-x-2">
                <Edit3 size={20} className="text-primary-600" />
                <span>{title}</span>
            </h2>
            <button
                type="button"
                onClick={onClose}
                className="p-1 rounded-full text-gray-400 hover:text-gray-600 transition"
                aria-label={cancelLabel}
            >
                <X size={20} />
            </button>
        </div>

        <p className="mt-4 text-sm text-gray-600">
            Entrez le nouveau nom pour la catégorie **{currentName}**.
        </p>
        
        {/* 🟢 Champ de saisie */}
        <div className="mt-4">
            <label htmlFor="category-new-name" className="sr-only">Nouveau nom</label>
            <input
                ref={inputRef}
                id="category-new-name"
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => e.stopPropagation()} // Important pour ne pas déclencher d'autres événements
                className="w-full py-3 px-4 text-base border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary-500 transition"
                placeholder="Nouveau nom de la catégorie"
            />
        </div>


        <div className="mt-6 flex gap-3 justify-end">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-lg px-4 py-2 border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
          >
            {cancelLabel}
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            // Désactiver si le nouveau nom est vide ou identique à l'ancien
            disabled={!newName.trim() || newName.trim() === currentName} 
            className="inline-flex items-center justify-center rounded-lg px-4 py-2 bg-primary-600 text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-300 disabled:opacity-50 transition"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}