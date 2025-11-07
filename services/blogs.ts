"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { Blog } from "@/types";

export const useGetBlogs = () => useQuery<Blog[], Error>({
  queryKey: ["blogs"],
  queryFn: async () => (await api.get("/blogs")).data,
});
// @TODO: Implémenter le reste du CRUD (Create, Update, Delete) pour les blogs
// (Similaire à services/videos.ts)
