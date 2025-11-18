"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

// --- TYPES ---

export type Verse = {
  id: string;
  text: string;
  reference: string;     // ex: "Jean 3:16"
  scheduledDate: string; // Format ISO provenant de la BDD
  published: boolean;
  createdAt?: string;
  updatedAt?: string;
};

// Type pour la création (on envoie une date string)
export type CreateVerseData = {
  text: string;
  reference: string;
  scheduledDate: string; // On enverra une ISO string ou YYYY-MM-DD
  published: boolean;
};

// Type pour la mise à jour
export type UpdateVerseData = Partial<CreateVerseData>;


// --- HOOKS ---

/**
 * 1. READ (Tous)
 * Récupère la liste des versets.
 * Idéalement, le backend devrait les trier par date de planification.
 */
export const useGetVerses = () => useQuery<Verse[], Error>({
  queryKey: ["verses"],
  queryFn: async () => (await api.get("/verses")).data,
});

/**
 * 2. CREATE
 */
export const useCreateVerse = () => {
  const queryClient = useQueryClient();
  
  return useMutation<Verse, Error, CreateVerseData>({
    mutationFn: (data) => api.post("/verses", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["verses"] });
    },
  });
};

/**
 * 3. UPDATE
 */
export const useUpdateVerse = () => {
  const queryClient = useQueryClient();

  return useMutation<Verse, Error, { id: string, data: UpdateVerseData }>({
    mutationFn: ({ id, data }) => api.patch(`/verses/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["verses"] });
    },
  });
};

/**
 * 4. DELETE
 */
export const useDeleteVerse = () => {
  const queryClient = useQueryClient();
  
  return useMutation<void, Error, string>({
    mutationFn: (id) => api.delete(`/verses/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["verses"] });
    },
  });
};