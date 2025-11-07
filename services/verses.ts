"use client";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { Verse } from "@/types";

export const useGetVerses = () => useQuery<Verse[], Error>({
  queryKey: ["verses"],
  queryFn: async () => (await api.get("/verses")).data,
});
// @TODO: Implémenter le reste du CRUD (Create, Update, Delete) pour les versets
