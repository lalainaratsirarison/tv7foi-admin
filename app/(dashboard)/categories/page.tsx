"use client";
import { useGetCategories, useCreateCategory } from "@/services/categories";
import { Loader2, Plus, AlertTriangle } from "lucide-react";
import { useState } from "react";

export default function CategoriesPage() {
  const { data: categories, isLoading, isError } = useGetCategories();
  const { mutate: createCategory, isPending } = useCreateCategory();
  const [newCategoryName, setNewCategoryName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName) return;
    createCategory({ name: newCategoryName }, {
      onSuccess: () => setNewCategoryName(""), // Vide le champ
    });
  };

  return (
    <div className="space-y-10">
      <h1 className="text-4xl font-bold text-gray-900">Gestion des Catégories de Blog</h1>
      
      {/* Formulaire de création rapide (design spacieux)
        @TODO: Migrer vers une Modale pour une meilleure UX
      */}
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl shadow-lg flex items-end space-x-6">
        <div className="flex-1">
          <label htmlFor="categoryName" className="block text-lg font-medium text-gray-700 mb-2">
            Nom de la nouvelle catégorie
          </label>
          <input
            type="text"
            id="categoryName"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            disabled={isPending}
            className="w-full py-5 px-6 text-lg border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-primary-500 transition"
            placeholder="Ex: Témoignages"
          />
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="py-5 px-8 text-xl font-bold text-white bg-primary-800 rounded-2xl hover:bg-primary-700 transition-all flex items-center space-x-2 disabled:opacity-50"
        >
          {isPending ? <Loader2 className="animate-spin" /> : <Plus />}
          <span>Ajouter</span>
        </button>
      </form>

      {/* Liste des catégories */}
      <div className="bg-white p-8 rounded-3xl shadow-lg">
        {isLoading && <Loader2 className="mx-auto w-8 h-8 text-primary-800 animate-spin" />}
        {isError && <p className="text-red-500">Erreur de chargement des catégories.</p>}
        
        {!isLoading && !isError && (
          <ul className="space-y-4">
            {categories?.map((cat) => (
              <li key={cat.id} className="flex items-center justify-between p-6 bg-primary-50 rounded-2xl">
                <span className="text-xl font-medium text-gray-800">{cat.name}</span>
                <div className="space-x-4">
                  {/* @TODO: Implémenter les fonctions d'édition et suppression */}
                  <button className="text-blue-600 hover:text-blue-800">Modifier</button>
                  <button className="text-red-600 hover:text-red-800">Supprimer</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
