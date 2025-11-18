"use client";

import Link from "next/link";
import { Plus, Edit, Trash2, Loader2, BookOpen } from "lucide-react";
import { useGetBlogs, useDeleteBlog, Blog } from "@/services/blogs";
import { useMemo, useState } from "react";
import toast from 'react-hot-toast';
import ConfirmDeleteModal from "@/components/ui/ConfirmDeleteModal";


export default function BlogsPage() {
  const { data: blogs, isLoading, isError } = useGetBlogs(); 
  const { mutate: deleteBlog, isPending: isDeleting } = useDeleteBlog();
  
  const [modalOpen, setModalOpen] = useState(false);
  const [targetId, setTargetId] = useState<string | null>(null);

  const openModal = (id: string) => {
    setTargetId(id);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setTargetId(null);
  };

  const handleConfirmDelete = () => {
    if (!targetId) return;
    deleteBlog(targetId, {
      onSuccess: () => closeModal(),
      onError: () => closeModal(),
    });
  };

  const sortedBlogs = useMemo(() => {
    if (!blogs) return [];
    return [...blogs].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [blogs]);

  const handleDelete = (blogId: string, title: string) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer l'article "${title}" ?`)) {
      deleteBlog(blogId, {
        onSuccess: () => {
          toast.success("Article supprimé avec succès !");
        },
        onError: () => {
          toast.error("Échec de la suppression de l'article.");
        },
      });
    }
  };

  return (
    <div className="space-y-10">
      
      {/* Header et Bouton Créer */}
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold text-gray-900">Gestion des Blogs</h1>
        <Link
          href="/blogs/new"
          className="py-4 px-6 text-lg font-bold text-white bg-primary-800 rounded-2xl hover:bg-primary-700 transition-all duration-300 flex items-center space-x-2"
        >
          <Plus size={24} />
          <span>Écrire un article</span>
        </Link>
      </div>
      
      {/* Conteneur de la Table */}
      <div className="bg-white p-6 md:p-12 rounded-3xl shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">Liste des articles</h2>

        {isLoading && (
          <div className="flex justify-center py-10">
            <Loader2 className="animate-spin text-primary-500" size={32} />
            <span className="ml-3 text-lg text-gray-600">Chargement des articles...</span>
          </div>
        )}

        {isError && (
          <div className="text-center py-10 text-red-600">
            Erreur lors du chargement des articles. Veuillez vérifier le backend.
          </div>
        )}

        {!isLoading && sortedBlogs.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            Aucun article n'a encore été créé.
          </div>
        )}

        {/* Tableau des Articles */}
        {sortedBlogs.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Titre</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Catégorie</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Auteur</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date de création</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedBlogs.map((blog) => (
                  <tr key={blog.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 max-w-xs truncate">
                        <Link href={`/blogs/${blog.id}/edit`} className="hover:text-primary-600">
                            {blog.title}
                        </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {/* Afficher le nom de la catégorie si le backend la renvoie via 'include: { category: true }' */}
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                         {blog.category?.name || 'Non classé'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {blog.author || 'Inconnu'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(blog.createdAt).toLocaleDateString('fr-FR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-3">
                        
                        {/* Bouton Modifier */}
                        <Link 
                          href={`/blogs/${blog.id}/edit`}
                          className="text-primary-600 hover:text-primary-900 p-2 rounded-full hover:bg-gray-100 transition"
                          title="Modifier l'article"
                        >
                          <Edit size={18} />
                        </Link>

                        {/* Bouton Supprimer */}
                        <button
                          onClick={() => openModal(blog.id)}
                          disabled={isDeleting}
                          className="cursor-pointer text-red-600 hover:text-red-900 p-2 rounded-full hover:bg-red-50 transition disabled:opacity-50"
                          title="Supprimer l'article"
                        >
                          {isDeleting ? <Loader2 className="animate-spin" size={18} /> : <Trash2 size={18} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      <ConfirmDeleteModal
        open={modalOpen}
        onClose={closeModal}
        onConfirm={handleConfirmDelete}
        title="Supprimer cet article ?"
        description="L'article sera définitivement supprimée. Cette action est irréversible."
        confirmLabel={isDeleting ? "Suppression..." : "Supprimer"}
        cancelLabel="Annuler"
      />

    </div>
  );
}