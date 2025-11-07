"use client";

import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { Video } from "@/types";

// Type pour la création (sans ID, createdAt, etc.)
// @TODO: Ajuster selon les besoins réels du backend (ex: FormData pour l'upload)
type CreateVideoDto = Omit<Video, "id" | "createdAt" | "updatedAt">;
type UpdateVideoDto = Partial<CreateVideoDto>;

/**
 * Hook pour RÉCUPÉRER TOUTES les vidéos
 */
export const useGetVideos = () => {
  return useQuery<Video[], Error>({
    queryKey: ["videos"],
    queryFn: async () => {
      const { data } = await api.get("/videos");
      return data;
    },
  });
};

/**
 * Hook pour RÉCUPÉRER UNE vidéo par son ID
 */
export const useGetVideoById = (id: string) => {
  return useQuery<Video, Error>({
    queryKey: ["video", id],
    queryFn: async () => {
      const { data } = await api.get(`/videos/${id}`);
      return data;
    },
    enabled: !!id,
  });
};

/**
 * Hook pour CRÉER une vidéo
 */
export const useCreateVideo = () => {
  const queryClient = useQueryClient(); // Pour invalider le cache

  return useMutation<Video, Error, CreateVideoDto>({
    mutationFn: async (formData) => {
      const { data } = await api.post("/videos", formData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["videos"] });
    },
    onError: (error) => {
      console.error("Erreur de création vidéo:", error);
    },
  });
};

/**
 * Hook pour METTRE À JOUR une vidéo
 */
export const useUpdateVideo = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation<Video, Error, { id: string; data: UpdateVideoDto }>({
    mutationFn: async ({ id, data: updateData }) => {
      const { data } = await api.patch(`/videos/${id}`, updateData);
      return data;
    },
    onSuccess: (updatedVideo) => {
      queryClient.invalidateQueries({ queryKey: ["videos"] });
      queryClient.invalidateQueries({ queryKey: ["video", updatedVideo.id] });
      alert('Changements Faites');
      router.push('/videos');
    },
  });
};

/**
 * Hook pour SUPPRIMER une vidéo
 */
export const useDeleteVideo = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({ // 'string' est l'ID de la vidéo
    mutationFn: async (id) => {
      await api.delete(`/videos/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["videos"] });
    },
  });
};
