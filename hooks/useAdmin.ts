"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Admin } from "@/types";
import { redirect } from "next/navigation";

interface UseAdminReturn {
  admin: Admin | null;
  isAuthenticated: boolean;
  logout: () => void;
  isLoading: boolean;
}

/**
 * Hook pour gérer l'état de l'administrateur et l'authentification.
 * Ce hook est "client-side" car il interagit avec le localStorage.
 */
export const useAdmin = (): UseAdminReturn => {
  const router = useRouter();
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Pour gérer l'état de chargement initial

  useEffect(() => {
    // Cette fonction s'exécute uniquement côté client
    try {
      const token = localStorage.getItem("access_token");
      const adminData = localStorage.getItem("admin_user");

      if (token && adminData) {
        setAdmin(JSON.parse(adminData));
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        setAdmin(null);
      }
    } catch (error) {
      // En cas d'erreur (ex: JSON malformé), on déconnecte
      console.error("Erreur lors de la lecture du localStorage", error);
      setIsAuthenticated(false);
      setAdmin(null);
      localStorage.removeItem("access_token");
      localStorage.removeItem("admin_user");
    }
    setIsLoading(false);
  }, []);

  const logout = () => {
    // Vide le state et le localStorage
    setAdmin(null);
    setIsAuthenticated(false);
    localStorage.removeItem("access_token");
    localStorage.removeItem("admin_user");
    // Redirige vers la page de login
    router.push("/login");
  };

  return { admin, isAuthenticated, logout, isLoading };
};

/**
 * Hook de protection de route.
 * À utiliser dans les layouts ou pages du dashboard.
 */
export const useAuthGuard = () => {
  const { isAuthenticated, isLoading } = useAdmin();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      redirect("/login");
    }
  }, [isAuthenticated, isLoading]);

  return { isLoading, isAuthenticated };
};
