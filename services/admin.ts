"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

export type AdminProfile = {
  id: string;
  email: string;
  name: string;
  surname: string;
};

// --- READ : Récupérer le profil ---
export const useGetProfile = () => useQuery<AdminProfile, Error>({
  queryKey: ["adminProfile"],
  queryFn: async () => (await api.get("/admin/profile")).data,
});

// --- UPDATE : Mettre à jour le profil ---
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation<AdminProfile, Error, any>({
    mutationFn: async (data) => (await api.patch("/admin/profile", data)).data,
    onSuccess: (newData) => {
      queryClient.setQueryData(["adminProfile"], newData);
      localStorage.setItem("admin_user", JSON.stringify(newData));
    }
  });
};

// --- UPDATE : Changer le mot de passe ---
export const useChangePassword = () => {
  return useMutation<void, Error, any>({
    mutationFn: async (data) => await api.post("/admin/password", data),
  });
};