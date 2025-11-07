"use client";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { Image } from "@/types";

export const useGetImages = () => useQuery<Image[], Error>({
  queryKey: ["images"],
  queryFn: async () => (await api.get("/images")).data,
});
// @TODO: Implémenter le reste du CRUD (Upload, Delete) pour les images
