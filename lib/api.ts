// lib/api.ts
import axios, { AxiosError } from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_ADDRESS,
  withCredentials: true, 
});

let isRefreshing = false;
let failedQueue: Array<{ resolve: (value: any) => void; reject: (reason: any) => void }> = [];

// Intercepteur de REQUÊTE
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("access_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercepteur de RÉPONSE
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;
    
    // Si 401 et pas déjà en retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Évite plusieurs refresh simultanés
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers['Authorization'] = `Bearer ${token}`;
          return api(originalRequest);
        });
      }

      isRefreshing = true;

      try {
        // Appelle refresh-token avec credentials (le cookie est envoyé automatiquement)
        const { data } = await axios.post(
          `${process.env.NEXT_PUBLIC_API_ADDRESS}/auth/refresh-token`,
          {},
          { withCredentials: true }
        );

        const newAccessToken = data.accessToken;
        localStorage.setItem('access_token', newAccessToken);

        // Mise à jour de la requête originale
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

        // Résout les requêtes en attente
        failedQueue.forEach(prom => prom.resolve(newAccessToken));
        failedQueue = [];

        // Relance la requête originale
        return api(originalRequest);

      } catch (refreshError) {
        // Nettoyage en cas d'erreur
        localStorage.removeItem("access_token");
        localStorage.removeItem("admin_user");
        failedQueue.forEach(prom => prom.reject(refreshError));
        failedQueue = [];

        // Redirection au login (sans useRouter hook)
        if (typeof window !== "undefined") {
          window.location.href = '/login';
        }

        return Promise.reject(refreshError);

      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;