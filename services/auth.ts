// services/auth.ts
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { Admin } from "@/types";

// Types pour les formulaires
type LoginCredentials = {
  email: string;
  password: string;
};

type RegisterData = {
  email: string;
  name: string;
  surname: string;
  password: string;
};

// Type de réponse attendue pour le login (basé sur votre contrôleur)
type AuthResponse = {
  accessToken: string;
  user: Admin;
};

// Type de réponse pour l'inscription (basé sur votre contrôleur)
type RegisterResponse = {
  message: string;
};

// --- Hook pour le Login ---
export const useLogin = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation<AuthResponse, Error, LoginCredentials>({
    mutationFn: async (credentials) => {
      // Appelle le backend
      const { data } = await api.post("/auth/login", credentials);
      return data;
    },
    onSuccess: (data) => {
      // 1. Stocke le 'accessToken' (au lieu de l'ancien 'token')
      localStorage.setItem("access_token", data.accessToken);
      // 2. Stocke les infos de l'utilisateur (qui vient de 'data.user')
      localStorage.setItem("admin_user", JSON.stringify(data.user));
      
      // 3. Réinitialise le cache de React Query (bonne pratique après auth)
      queryClient.clear();
      
      // 4. Redirige vers le tableau de bord
      router.push("/");
    },
    onError: (error) => {
      console.error("Erreur de connexion:", error.message);
      // @TODO: Afficher une notification d'erreur à l'utilisateur
      // (ex: "Email ou mot de passe incorrect")
    },
  });
};

// --- Hook pour le Register ---
export const useRegister = () => {
  const router = useRouter();

  return useMutation<RegisterResponse, Error, RegisterData>({
    mutationFn: async (registerData) => {
      const { data } = await api.post("/auth/register", registerData);
      return data;
    },
    onSuccess: () => {
      router.push("/login");
      // @TODO: Afficher une notification de succès
      // (ex: "Compte créé avec succès ! Veuillez vous connecter.")
    },
    onError: (error: any) => {
      console.error("Erreur d'inscription:", error.message);
      // @TODO: Gérer les erreurs spécifiques, ex: 400 "User already exists"
    },
  });
};

// --- Hook pour le Logout ---
export const useLogout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation<void, Error, void>({
    mutationFn: async () => {
      // Appelle le backend pour détruire la session/cookie
      await api.post("/auth/logout");
    },
    onSettled: () => {
      // onSettled s'exécute que la mutation réussisse ou échoue,
      // ce qui est parfait pour garantir le nettoyage côté client.
      
      // 1. Vide le localStorage
      localStorage.removeItem("access_token");
      localStorage.removeItem("admin_user");
      
      // 2. Vide le cache de React Query
      queryClient.clear();
      
      // 3. Redirige vers la page de login
      router.push("/login");
    },
  });
};