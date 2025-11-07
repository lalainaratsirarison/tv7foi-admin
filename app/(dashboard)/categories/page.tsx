"use client";

// 1. Importer les hooks et composants nécessaires
import { useState } from "react";
import { useGetCategories, useCreateCategory, useDeleteCategory, useRenameCategory, Category } from "@/services/categories";
import { Loader2, Plus, Edit, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";
import RenameCategoryModal from "@/components/RenameCategoryModal";
import toast from "react-hot-toast";

export default function CategoriesPage() {
  // --- Hooks de Données ---
  const { data: categories, isLoading, isError } = useGetCategories();
  const { mutate: createCategory, isPending: isCreating } = useCreateCategory();
  const { mutate: deleteCategory, isPending: isDeleting } = useDeleteCategory();
  const { mutate: renameCategory, isPending: isRenaming } = useRenameCategory();

  // --- États Locaux ---
  const [newCategoryName, setNewCategoryName] = useState("");

  // États pour les modales
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  
  // État pour savoir quelle catégorie est ciblée
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  // --- Gestionnaires (Handlers) ---

  // Création
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName) return;
    createCategory({ name: newCategoryName }, {
      onSuccess: () => {
        setNewCategoryName("");
        toast.success("Catégorie créée avec succès !");
      },
      onError: () => {
        toast.error("Erreur lors de la création.");
      }
    });
  };

  // Suppression
  const openDeleteModal = (category: Category) => {
    setSelectedCategory(category);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!selectedCategory) return;
    deleteCategory(selectedCategory.id, {
      onSuccess: () => {
        toast.success(`Catégorie "${selectedCategory.name}" supprimée.`);
        setIsDeleteModalOpen(false);
        setSelectedCategory(null);
      },
      onError: (err) => {
        toast.error("Erreur lors de la suppression.");
        console.error(err);
        setIsDeleteModalOpen(false);
        setSelectedCategory(null);
      }
    });
  };

  // Renommage
  const openRenameModal = (category: Category) => {
    setSelectedCategory(category);
    setIsRenameModalOpen(true);
  };

  const handleRenameConfirm = (newName: string) => {
    if (!selectedCategory) return;
    renameCategory({ id: selectedCategory.id, name: newName }, {
      onSuccess: () => {
        toast.success(`Catégorie renommée en "${newName}".`);
        setIsRenameModalOpen(false);
        setSelectedCategory(null);
      },
      onError: (err) => {
        toast.error("Erreur lors du renommage.");
        console.error(err);
        setIsRenameModalOpen(false);
        setSelectedCategory(null);
      }
    });
  };

  // Fermeture générique des modales
  const closeModal = () => {
    setIsDeleteModalOpen(false);
    setIsRenameModalOpen(false);
    setSelectedCategory(null);
  };

  return (
    <>
      <div className="space-y-10">
        <h1 className="text-4xl font-bold text-gray-900">Gestion des Catégories de Blog</h1>

        {/* Formulaire de création */}
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
              disabled={isCreating}
              className="w-full py-5 px-6 text-lg border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-primary-500 transition"
              placeholder="Ex: Témoignages"
            />
          </div>
          <button
            type="submit"
            disabled={isCreating}
            className="py-5 px-8 text-xl font-bold text-white bg-primary-800 rounded-2xl hover:bg-primary-700 transition-all flex items-center space-x-2 disabled:opacity-50"
          >
            {isCreating ? <Loader2 className="animate-spin" /> : <Plus />}
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
                  <div className="space-x-4 flex items-center">
                    {/* 2. Boutons d'action mis à jour */}
                    <button
                      onClick={() => openRenameModal(cat)}
                      disabled={isRenaming && selectedCategory?.id === cat.id}
                      className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 transition disabled:opacity-50"
                      title="Renommer"
                    >
                      <Edit size={18} />
                      <span>Modifier</span>
                    </button>
                    <button
                      onClick={() => openDeleteModal(cat)}
                      disabled={isDeleting && selectedCategory?.id === cat.id}
                      className="flex items-center space-x-1 text-red-600 hover:text-red-800 transition disabled:opacity-50"
                      title="Supprimer"
                    >
                      <Trash2 size={18} />
                      <span>Supprimer</span>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <RenameCategoryModal
        open={isRenameModalOpen}
        onClose={closeModal}
        onConfirm={handleRenameConfirm}
        currentName={selectedCategory?.name || ""}
        confirmLabel={isRenaming ? "Renommage..." : "Renommer"}
      />
      <ConfirmDeleteModal
        open={isDeleteModalOpen}
        onClose={closeModal}
        onConfirm={handleDeleteConfirm}
        title="Confirmer la suppression"
        description={`Êtes-vous sûr de vouloir supprimer la catégorie "${selectedCategory?.name}" ? Cette action est irréversible.`}
        confirmLabel={isDeleting ? "Suppression..." : "Supprimer"}
      />
    </>
  );
}