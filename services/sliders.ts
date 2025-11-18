"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api"; 


// --- DÉFINITION DES TYPES ---

export type Image = {
  id: string;
  path: string;
  title?: string | null;
  alt?: string | null;
};

export type Slider = {
  id: string;
  title: string;
  isActive: boolean;
  images: Image[];
  createdAt: string;
  updatedAt: string;
};

// 💡 CORRECTION: Le type CreateSliderData doit correspondre au backend
// Il attend un titre ET un tableau d'objets images (pour le createMany de Prisma)
export type CreateSliderData = {
  title: string;
  images: Array<Pick<Image, 'path' | 'alt' | 'title'>>;
};

export type UpdateSliderData = {
  title: string;
};


// --- SERVICES SLIDERS (Requêtes et Mutations) ---

/**
 * 1. READ (Tous)
 * Endpoint: GET /sliders/all
 */
export const useGetSliders = () => useQuery<Slider[], Error>({
  queryKey: ["sliders"],
  // Chemin ajusté : /sliders/all
  queryFn: async () => (await api.get("/sliders/all?includeImages=true")).data,
});

/**
 * Hook pour RÉCUPÉRER un slider par son ID
 */
export const useGetSliderById = (id: string) => {
  return useQuery<Slider, Error>({
    queryKey: ["slider", id],
    queryFn: async () => {
      const { data } = await api.get(`/sliders/${id}?includeImages=true`);
      return data;
    },
    enabled: !!id,
  });
};

/**
 * 2. CREATE (Corrigé)
 * Endpoint: POST /sliders/add
 */
export const useCreateSlider = () => {
  const queryClient = useQueryClient();
  
  // Le type CreateSliderData est maintenant correct
  return useMutation<Slider, Error, CreateSliderData>({
    // Chemin ajusté : /sliders/add
    // newSlider contiendra { title, images: [...] }
    mutationFn: (newSlider) => api.post("/sliders/add", newSlider),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sliders"] });
    },
  });
};

/**
 * 3. UPDATE (Renommer)
 * Endpoint: PATCH /sliders/update/:id
 */
export const useRenameSlider = () => {
  const queryClient = useQueryClient();

  return useMutation<Slider, Error, { id: string, title: string }>({
    mutationFn: async ({ id, title }) => {
      const updateData: UpdateSliderData = { title };
      // Chemin ajusté : /sliders/update/:id
      const { data } = await api.patch(`/sliders/update/${id}`, updateData);
      return data;
    },
    onSuccess: (updatedSlider) => {
      queryClient.invalidateQueries({ queryKey: ["sliders"] });
      queryClient.setQueryData(["sliders", updatedSlider.id], updatedSlider);
    }
  });
};

/**
 * 4. DELETE
 * Endpoint: DELETE /sliders/delete/:id
 */
export const useDeleteSlider = () => {
  const queryClient = useQueryClient();
  
  return useMutation<void, Error, string>({
    // Chemin ajusté : /sliders/delete/:id
    mutationFn: (sliderId) => api.delete(`/sliders/delete/${sliderId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sliders"] });
    },
  });
};

/**
 * 5. ACTION SPÉCIFIQUE : Activer un Slider
 * Endpoint: POST /sliders/activate/:id
 */
export const useActivateSlider = () => {
  const queryClient = useQueryClient();

  return useMutation<Slider, Error, string>({
    // Chemin ajusté : /sliders/activate/:id
    mutationFn: (sliderId) => api.post(`/sliders/activate/${sliderId}`),
    
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sliders"] });
    }
  });
};


// --- SERVICES DE GESTION DES IMAGES ---

/**
 * 6. AJOUTER DES IMAGES À UN SLIDER
 * Endpoint supposé: POST /sliders/images/add/:sliderId
 */
export const useAddImagesToSlider = () => {
  const queryClient = useQueryClient();

  return useMutation<Slider, Error, { sliderId: string, formData: FormData }>({
    mutationFn: async ({ sliderId, formData }) => {
      // Chemin supposé : /sliders/images/add/:sliderId
      const { data } = await api.post(`/sliders/images/add/${sliderId}`, formData);
      return data;
    },
    onSuccess: (updatedSlider) => {
      queryClient.invalidateQueries({ queryKey: ["sliders"] });
      queryClient.setQueryData(["sliders", updatedSlider.id], updatedSlider);
    },
  });
};

/**
 * 7. SUPPRIMER UNE IMAGE SPÉCIFIQUE
 * Endpoint supposé: DELETE /sliders/images/delete/:imageId
 */
export const useDeleteImage = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, { imageId: string, sliderId: string }>({
    mutationFn: async ({ imageId }) => {
      // Chemin supposé : /sliders/images/delete/:imageId
      await api.delete(`/sliders/images/delete/${imageId}`);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["sliders"] });
      queryClient.invalidateQueries({ queryKey: ["sliders", variables.sliderId] });
    },
  });
};