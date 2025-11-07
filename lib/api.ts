// lib/api.ts
import axios, { AxiosError } from "axios";

// Crée une instance Axios
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_ADDRESS,
  // Important pour que les cookies (comme le refreshToken) soient envoyés
  withCredentials: true, 
});

// --- Intercepteur de REQUÊTE ---
// Ajoute le 'accessToken' à chaque requête sortante
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
  (error) => {
    return Promise.reject(error);
  }
);

// Variable pour éviter les boucles de refresh
let isRefreshing = false;
// File d'attente pour les requêtes échouées
let failedQueue: Array<{ resolve: (value: any) => void; reject: (reason: any) => void }> = [];

// --- Intercepteur de RÉPONSE ---
// Gère les 'accessToken' expirés (erreur 401)
api.interceptors.response.use(
  (response) => {
    // Si la requête réussit, on la retourne
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config;
    
    // @ts-ignore - Ajoute une propriété pour éviter les boucles infinies
    if (error.response?.status === 401 && !originalRequest._retry) {
      
      // Empêche de rafraîchir si une autre requête le fait déjà
      if (isRefreshing) {
        // Met la requête en attente
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          // @ts-ignore
          originalRequest.headers['Authorization'] = 'Bearer ' + token;
          return api(originalRequest as any);
        });
      }

      // Marque comme 'tentative de retry' et 'en cours de refresh'
      // @ts-ignore
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Appelle l'endpoint de refresh
        const { data } = await api.post('/auth/refresh-token');
        const newAccessToken = data.accessToken;
        
        // Stocke le nouveau token
        localStorage.setItem('access_token', newAccessToken);
        
        // Met à jour le header de la requête originale
        // @ts-ignore
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

        // Relance les requêtes en attente avec le nouveau token
        failedQueue.forEach(prom => prom.resolve(newAccessToken));
        failedQueue = [];
        
        // Relance la requête originale
        return api(originalRequest as any);
        
      } catch (refreshError) {
        // Si le refresh échoue (ex: refreshToken expiré)
        // On déconnecte l'utilisateur
        localStorage.removeItem("access_token");
        localStorage.removeItem("admin_user");
        // @ts-ignore
        window.location = '/login'; // Redirection forcée
        
        // Rejette les requêtes en attente
        failedQueue.forEach(prom => prom.reject(refreshError));
        failedQueue = [];
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    
    // Pour toutes les autres erreurs
    return Promise.reject(error);
  }
);

export default api;