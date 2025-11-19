"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

export type NotificationType = "INFO" | "SUCCESS" | "WARNING" | "ERROR";

export type Notification = {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  isRead: boolean;
  createdAt: string;
};

type NotificationResponse = {
  items: Notification[];
  unread: number;
};

// 1. READ (Polling automatique)
export const useGetNotifications = () => useQuery<NotificationResponse, Error>({
  queryKey: ["notifications"],
  queryFn: async () => (await api.get("/notifications")).data,
  // Rafraîchir toutes les 15 secondes pour voir les nouvelles notifs
  refetchInterval: 15000, 
  // Ne pas refetch si on change de fenêtre, pour éviter le spam visuel
  refetchOnWindowFocus: false 
});

// 2. MARK AS READ (Une seule)
export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.patch(`/notifications/read/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    }
  });
};

// 3. MARK ALL AS READ
export const useMarkAllAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => api.patch("/notifications/read-all"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    }
  });
};