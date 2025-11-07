"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

export type Category = {
  id: string,
  name: string,
  createdAt: string,
  updatedAt: string
}

export type CategoryDto = { name: string };
export type UpdateCategoryData = Partial<CategoryDto>; 


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

export const useRenameCategory = () => {
  const queryClient = useQueryClient();

  return useMutation<Category, Error, { id: string, name: string }>({
    
    mutationFn: async ({ id, name }) => {
      const updateData: UpdateCategoryData = { name };
      const { data } = await api.patch(`/categories/${id}`, updateData);
      return data;
    },
    
    onSuccess: (updatedCategory) => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["categories", updatedCategory.id] });
    }
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string> ({
    mutationFn: (id) => api.delete(`/categories/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog_categories"] });
    }
  })
}
