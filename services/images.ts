"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

// --- DÉFINITION DES TYPES ---

export type Image = {
  id: string;
  path: string;
  title?: string | null;
  alt?: string | null;
  blogId?: string | null;
  sliderId?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

// --- SERVICES IMAGES (Requêtes et Mutations) ---

/**
 * 1. READ (Tous)
 * Endpoint: GET /images/all
 */
export const useGetImages = () => useQuery<Image[], Error>({
  queryKey: ["images"],
  queryFn: async () => (await api.get("/images/all")).data,
});

/**
 * 2. CREATE (Upload d'une seule image)
 * Endpoint: POST /images/add
 */
export const useUploadImage = () => {
  const queryClient = useQueryClient();
  
  return useMutation<Image, Error, FormData>({
    mutationFn: (formData) => api.post("/images/add", formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["images"] });
      queryClient.invalidateQueries({ queryKey: ["images", "notInSlider"] }); 
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
    }
  });
};

/**
 * 3. DELETE
 * Endpoint: DELETE /images/delete/:id
 */
export const useDeleteImage = () => {
  const queryClient = useQueryClient();
  
  return useMutation<void, Error, string>({
    mutationFn: (imageId) => api.delete(`/images/delete/${imageId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["images"] });
      queryClient.invalidateQueries({ queryKey: ["sliders"] }); 
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
    }
  });
};


// --- Hooks spécifiques pour la gestion des Sliders ---

/**
 * 4. READ (Images non liées à un slider)
 * Endpoint: GET /images/not-in-slider
 */
export const useGetImagesNotInSlider = () => useQuery<Image[], Error>({
  queryKey: ["images", "notInSlider"],
  queryFn: async () => (await api.get("/images/not-in-slider")).data,
});

/**
 * 5. ACTION (Ajouter des images à un slider existant)
 * Endpoint: POST /images/add-to-slider
 */
export const useAddImagesToSlider = () => {
    const queryClient = useQueryClient();
    
    return useMutation<void, Error, { sliderId: string, imagesIds: string[] }>({
        mutationFn: (data) => api.post("/images/add-to-slider", data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["images"] });
            queryClient.invalidateQueries({ queryKey: ["sliders"] }); 
        }
    });
}

/**
 * 6. ACTION (Retirer des images d'un slider existant)
 * Endpoint: POST /images/remove-from-slider
 */
export const useRemoveImagesFromSlider = () => {
    const queryClient = useQueryClient();
    
    return useMutation<void, Error, { imagesIds: string[] }>({
        mutationFn: (data) => api.post("/images/remove-from-slider", data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["images"] });
            queryClient.invalidateQueries({ queryKey: ["sliders"] }); 
        }
    });
}

// --- Hooks spécifiques pour la gestion des Blogs ---

/**
 * 7. ACTION (Ajouter des images à un blog existant)
 * Endpoint: POST /images/add-to-blog
 */
export const useAddImagesToBlog = () => {
    const queryClient = useQueryClient();
    
    return useMutation<void, Error, { blogId: string, imagesIds: string[] }>({
        mutationFn: (data) => api.post("/images/add-to-blog", data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["images"] });
            queryClient.invalidateQueries({ queryKey: ["blogs"] }); 
        }
    });
}

/**
 * 8. ACTION (Retirer des images d'un blog existant)
 * Endpoint: POST /images/remove-from-blog
 */
export const useRemoveImagesFromBlog = () => {
    const queryClient = useQueryClient();
    
    return useMutation<void, Error, { imagesIds: string[] }>({
        mutationFn: (data) => api.post("/images/remove-from-blog", data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["images"] });
            queryClient.invalidateQueries({ queryKey: ["blogs"] }); 
        }
    });
}
