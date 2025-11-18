"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

// --- TYPES ---
// Le backend renvoie un simple tableau de chaînes de caractères (noms de fichiers)
export type FlvFile = string; 

// --- HOOKS ---

/**
 * 1. READ (Liste des fichiers)
 * Endpoint: GET /flv/list
 */
export const useGetFlvList = () => useQuery<FlvFile[], Error>({
  queryKey: ["flv-files"],
  queryFn: async () => (await api.get("/live/list")).data,
});

/**
 * 2. DELETE (Supprimer un fichier)
 * Endpoint: DELETE /flv/delete/:filename
 */
export const useDeleteFlv = () => {
  const queryClient = useQueryClient();
  
  return useMutation<void, Error, string>({
    mutationFn: async (filename) => {
      await api.delete(`/live/delete/${filename}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["flv-files"] });
    },
  });
};

/**
 * 3. DOWNLOAD (Télécharger un fichier)
 * Endpoint: GET /flv/download/:filename
 * * Note: On n'utilise pas useQuery ici car le téléchargement est une action utilisateur ponctuelle.
 * On utilise une fonction asynchrone directe.
 */
export const downloadFlvFile = async (filename: string) => {
  try {
    // On demande le fichier en tant que 'blob' (binaire)
    const response = await api.get(`/live/download/${filename}`, {
      responseType: 'blob', 
    });

    // Création d'un lien temporaire dans le navigateur pour déclencher le téléchargement
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('href');
    const a = document.createElement('a');
    a.href = url;
    a.setAttribute('download', filename); // Force le nom du fichier
    document.body.appendChild(a);
    a.click();
    
    // Nettoyage
    a.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Erreur lors du téléchargement", error);
    throw error;
  }
};