"use client";

import React, { useState, useEffect } from 'react';
import Modal from "./Modal";
import { CreateVerseData, Verse } from "@/services/verses";
import { Loader2, Save, Calendar, BookOpen } from "lucide-react";
import toast from "react-hot-toast";

interface VerseModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateVerseData) => void;
  isSubmitting: boolean;
  verseToEdit?: Verse | null; // Si présent, mode modification
}

export default function VerseModal({ 
  open, 
  onClose, 
  onSubmit, 
  isSubmitting, 
  verseToEdit 
}: VerseModalProps) {
  // États du formulaire
  const [text, setText] = useState("");
  const [reference, setReference] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [published, setPublished] = useState(false);

  // Hydratation du formulaire en cas de modification
  useEffect(() => {
    if (open) {
      if (verseToEdit) {
        setText(verseToEdit.text);
        setReference(verseToEdit.reference);
        setPublished(verseToEdit.published);
        
        // Conversion de la date ISO (2025-11-01T00:00...) en format input date (2025-11-01)
        if (verseToEdit.scheduledDate) {
            const dateObj = new Date(verseToEdit.scheduledDate);
            // Astuce pour avoir YYYY-MM-DD sans problème de fuseau horaire local simple
            const formatted = dateObj.toISOString().split('T')[0];
            setScheduledDate(formatted);
        }
      } else {
        // Réinitialisation pour la création
        setText("");
        setReference("");
        setScheduledDate("");
        setPublished(false);
      }
    }
  }, [open, verseToEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!text.trim() || !reference.trim() || !scheduledDate) {
      toast.error("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    // On envoie la date telle quelle (YYYY-MM-DD), le backend devra probablement la parser en DateTime ISO
    // ou on ajoute l'heure de minuit ici : new Date(scheduledDate).toISOString()
    const data: CreateVerseData = {
        text,
        reference,
        scheduledDate: new Date(scheduledDate).toISOString(), // Conversion en ISO pour Prisma
        published
    };

    onSubmit(data);
  };

  const title = verseToEdit ? "Modifier le verset" : "Planifier un nouveau verset";

  return (
    <Modal open={open} onClose={onClose} title={title}>
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Champ Référence */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Référence Biblique
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <BookOpen size={18} className="text-gray-400" />
            </div>
            <input
                type="text"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                className="pl-10 w-full py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Ex: Jean 3:16"
                disabled={isSubmitting}
            />
          </div>
        </div>

        {/* Champ Texte (Textarea) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Texte du verset
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
            className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Car Dieu a tant aimé le monde..."
            disabled={isSubmitting}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Champ Date */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date de publication
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar size={18} className="text-gray-400" />
                    </div>
                    <input
                        type="date"
                        value={scheduledDate}
                        onChange={(e) => setScheduledDate(e.target.value)}
                        className="pl-10 w-full py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        disabled={isSubmitting}
                    />
                </div>
                <p className="text-xs text-gray-500 mt-1">Cette date doit être unique.</p>
            </div>

            {/* Champ Statut (Switch simple avec checkbox) */}
            <div className="flex items-center h-full pt-6">
                <label className="flex items-center cursor-pointer">
                    <div className="relative">
                        <input 
                            type="checkbox" 
                            className="sr-only" 
                            checked={published}
                            onChange={(e) => setPublished(e.target.checked)}
                            disabled={isSubmitting}
                        />
                        <div className={`block w-14 h-8 rounded-full transition ${published ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition transform ${published ? 'translate-x-6' : ''}`}></div>
                    </div>
                    <div className="ml-3 text-gray-700 font-medium">
                        {published ? 'Publié' : 'Brouillon'}
                    </div>
                </label>
            </div>
        </div>
        
        <div className="flex justify-end pt-4 border-t">
          <button
            type="submit"
            disabled={isSubmitting}
            className="py-2 px-6 text-lg font-bold text-white bg-primary-800 rounded-lg hover:bg-primary-700 transition-all flex items-center space-x-2 disabled:opacity-50"
          >
            {isSubmitting ? <Loader2 className="animate-spin mr-2" size={20} /> : <Save size={20} />}
            <span>{verseToEdit ? "Mettre à jour" : "Planifier"}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
}