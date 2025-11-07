"use client";
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

export type Blog = {
  id: string;
  title: string;
  slug: string;
  content: string;
  categoryId: string | null;
  author: string | null;
  createdAt: string;
  updatedAt: string; 
  category?: { id: string, name: string } | null; 
};

export type CreateBlogData = {
  title: string;
  content: string;
  categoryId: string;
  author?: string; 
}; 

export type UpdateBlogData = Partial<CreateBlogData>; 


// --- SERVICES BLOGS (CRUD) ---

// 1. READ (Tous) : Récupérer tous les articles
export const useGetBlogs = () => useQuery<Blog[], Error>({
  queryKey: ["blogs"],
  queryFn: async () => (await api.get("/blogs")).data,
});

// 2. READ (Un) : Récupérer un seul article
export const useGetBlog = (blogId: string) => useQuery<Blog, Error>({
  queryKey: ["blogs", blogId],
  queryFn: async () => (await api.get(`/blogs/id/${blogId}`)).data,
  enabled: !!blogId,
});

// 3. CREATE : Créer un nouvel article
export const useCreateBlog = () => {
  const queryClient = useQueryClient();
  
  return useMutation<Blog, Error, CreateBlogData>({
    mutationFn: (newBlog) => api.post("/blogs", newBlog),
    
    // Invalide la liste des articles après une création réussie
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
    },
  });
};

// 4. UPDATE : Modifier un article existant
export const useUpdateBlog = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  
  return useMutation<Blog, Error, { id: string; data: UpdateBlogData }>({
    mutationFn: async ({ id, data: updateData }) => {
      const { data } = await api.patch(`/blogs/${id}`, updateData);
      return data;
    },
    
    onSuccess: (updatedBlog) => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      queryClient.invalidateQueries({ queryKey: ["blogs", updatedBlog.id] });
      alert('Changements Faites');
      router.push('/blogs');
    },
  });
};

export const useDeleteBlog = () => {
  const queryClient = useQueryClient();
  
  return useMutation<void, Error, string>({
    mutationFn: (blogId) => api.delete(`/blogs/${blogId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
    },
  });
};

export type Category = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

export const useGetBlogCategories = () => useQuery<Category[], Error>({
  queryKey: ["blog_categories"],
  queryFn: async () => (await api.get("/categories")).data,
});