"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { Category } from "@/types";

type CategoryDto = { name: string };

export const useGetCategories = () => useQuery<Category[], Error>({
  queryKey: ["categories"],
  queryFn: async () => (await api.get("/categories")).data,
});

export const useCreateCategory = () => {
  const qc = useQueryClient();
  return useMutation<Category, Error, CategoryDto>({
    mutationFn: async (data) => (await api.post("/categories", data)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["categories"] }),
  });
};
// @TODO: Implémenter useUpdateCategory et useDeleteCategory
